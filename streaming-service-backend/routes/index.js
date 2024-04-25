import express from 'express';

import { GridFSBucket } from 'mongodb';

import { Types } from 'mongoose';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/song/:songID', async (req, res) => {
  try {
    try {
      var objectId = new Types.ObjectId(req.params.songID);
    } catch (err) {
      throw new Error('Invalid songID. Must be a valid MongoDB ObjectID.');
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    const bucket = new GridFSBucket(mongoose.connection.db);

    const downloadStream = bucket.openDownloadStream(objectId);

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
    console.error('Error serving track:', error);
    res.sendStatus(500);
  }
});

export default router;
