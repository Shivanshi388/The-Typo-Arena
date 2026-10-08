import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    wpm: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: {
      type: [playerSchema],
      default: [],
    },
    state: {
      type: String,
      enum: ["WAITING", "COUNTDOWN", "RACING", "FINISHED"],
      default: "WAITING",
    },
    text: {
      type: String,
      default: "",
    },
    maxPlayers: {
      type: Number,
      default: 8,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
