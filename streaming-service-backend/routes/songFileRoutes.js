import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fields: 1, fileSize: 15 * 1024 * 1024, files: 1, parts: 10 },
});

router.get('/song/stream/:songID', async (req, res) => {
  try {
    try {
      var objectId = new Types.ObjectId(req.params.songID);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Invalid songID. Must be a valid MongoDB ObjectID.' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db);

    const options = {};
    let start;
    let end;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : undefined;
      options.start = start;
      options.end = end;
      res.status(206);
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    const downloadStream = bucket.openDownloadStream(objectId, options);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', () => {
      res.sendStatus(404);
    });

    downloadStream.on('end', () => {
      res.end();
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({ message: 'No file provided in request' });
    } else if (req.file.size > 15 * 1024 * 1024) {
      return res.status(400).json({
        message: 'File size exceeds the maximum allowed limit (15MB)',
      });
    }

    const fileName = req.file.originalname;

    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

    const uploadStream = bucket.openUploadStream(fileName);
    const id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading track:', error);
      return res.status(500).json({ message: 'Error uploading track' });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({
        message:
          'File uploaded successfully, stored under MongoDB ObjectID: ' + id,
        fileId: id,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/download/:fileID', async (req, res) => {
  try {
    try {
      var objectId = new Types.ObjectId(req.params.fileID);
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Invalid fileID. Must be a valid MongoDB ObjectID.' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db);

    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', () => {
      res.sendStatus(404);
    });

    downloadStream.pipe(res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
