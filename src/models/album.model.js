import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kaviospixUsers",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("KaviopixAlbum", albumSchema);
