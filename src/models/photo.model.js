import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
            ref: "KaviopixAlbum",
            required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    person: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      default:false
    },
    comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "kaviospixUsers",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
    size:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model("KaviopixPhotos", photoSchema);
