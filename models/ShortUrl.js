import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.models.ShortUrl ||
  mongoose.model("ShortUrl", shortUrlSchema);
