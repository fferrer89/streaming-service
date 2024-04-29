import mongoose from 'mongoose';

const songFileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  uploadDate: { type: Date, default: Date.now },
  fileId: mongoose.Schema.Types.ObjectId,
});

const SongFile = mongoose.model('SongFile', songFileSchema);
export default SongFile;
