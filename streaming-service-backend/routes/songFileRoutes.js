import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import Image from '../models/imageModel.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fields: 1, fileSize: 15 * 1024 * 1024, files: 1, parts: 10 },
});

router.get('/song/stream/:songID', async (req, res) => {
  try {
    const objectId = new Types.ObjectId(req.params.songID);
    const bucket = new GridFSBucket(mongoose.connection.db);
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (error) => {
      console.error('Error streaming song:', error);
      return res.status(404).json({ message: 'Song not found' });
    });

    let songData = Buffer.alloc(0);

    downloadStream.on('data', (chunk) => {
      songData = Buffer.concat([songData, chunk]);
    });

    downloadStream.on('end', () => {
      res.set('content-type', 'audio/mp3');
      res.set('accept-ranges', 'bytes');
      res.send(songData);
    });
  } catch (error) {
    console.error('Error streaming song:', error);
    return res.status(500).json({ message: 'Error streaming song' });
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

    const bucket = new GridFSBucket(mongoose.connection.db);
    const uploadStream = bucket.openUploadStream(fileName);
    const fileId = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading track:', error);
      return res.status(500).json({ message: 'Error uploading track' });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({
        message: 'File uploaded successfully',
        fileId: fileId,
      });
    });
  } catch (error) {
    console.error('Error uploading track:', error);
    return res.status(500).json({ message: 'Error uploading track' });
  }
});

router.get('/download/:fileID', async (req, res) => {
  try {
    const objectId = new Types.ObjectId(req.params.fileID);
    const bucket = new GridFSBucket(mongoose.connection.db);
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (error) => {
      console.error('Error downloading file:', error);
      return res.status(404).json({ message: 'File not found' });
    });

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline');

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ message: 'Error downloading file' });
  }
});

router.post('/uploadImage', upload.single('file'), async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({ message: 'No file provided in request' });
    } else if (req.file.size > 15 * 1024 * 1024) {
      return res.status(400).json({
        message: 'File size exceeds the maximum allowed limit (15MB)',
      });
    }

    const fileName = req.file.originalname;
    const readableImageStream = new Readable();
    readableImageStream.push(req.file.buffer);
    readableImageStream.push(null);

    const bucket = new GridFSBucket(mongoose.connection.db);
    const uploadStream = bucket.openUploadStream(fileName);
    const fileId = uploadStream.id;

    readableImageStream.pipe(uploadStream);

    uploadStream.on('error', (error) => {
      console.error('Error uploading image:', error);
      return res.status(500).json({ message: 'Error uploading image' });
    });

    uploadStream.on('finish', async () => {
      const image = new Image({
        filename: fileName,
        fileId: fileId,
        contentType: req.file.mimetype,
      });

      await image.save();

      return res.status(201).json({
        message: 'Image uploaded successfully',
        imageId: image._id,
      });
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Error uploading image' });
  }
});

router.get('/image/:imageId', async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db);
    const downloadStream = bucket.openDownloadStream(image.fileId);

    res.set('Content-Disposition', 'inline');

    res.set('Content-Type', image.contentType);

    downloadStream.pipe(res);


    downloadStream.on('error', (error) => {
      console.error('Error downloading image:', error);
      res.status(500).json({ message: 'Error downloading image' });
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return res.status(500).json({ message: 'Error downloading image' });
  }
});




export default router;