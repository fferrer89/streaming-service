import mongoose from "mongoose";

const listeningHistorySchema = new mongoose.Schema({
  history: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const ListeningHistory = mongoose.model("ListeningHistory", songSchema);
export default ListeningHistory;