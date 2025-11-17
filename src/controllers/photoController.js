
import PhotoModel from "../models/photo.model.js";
import AlbumModel from "../models/album.model.js"
import cloudinary from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLODINARY_NAME,
  api_key:process.env.CLODINARY_API_KEY,
  api_secret:process.env.CLODINARY_API_SECRET
})

export const uploadPhoto = async(req,res) => {
   try {
     const file = req.file
    if (!file) return res.status(400).send("No file uploaded")
    
    //upload to coudinary
    const result = await cloudinary.uploader.upload(file.path, { folder: "uploads" })
    
    //save to mongodb

    const newImageData = new PhotoModel({ imageUrl: result.secure_url,public_id:result.public_id,...req.body})
    await newImageData.save()
    
    res.status(200).json({
      message: "Image Uplaoded Successfully",
      newImageData
    })
  }
  catch (error)
  {
    res.status(500).json({message:"Image Upload Failed",error:error})
  }
}

export const getPhotos = async (req,res) => {
  const albumId = req.params.albumId
  try {
    const photos = await PhotoModel.find({ albumId }).sort({ createdAt: -1 }).populate({path:"comments.user",select:"name picture"})
    res.status(200).json({
      message: "Image Fetched Successfully",
      photos
    })
  }
  catch (error)
  {
res.status(500).json({message:"Failed get Image",error:error})
  }
}

export const deletePhoto = async (req,res) => {
  const photoId = req.params.photoId
  try {
    const photo =await PhotoModel.findById(photoId)
    if (!photo)
    {
     return res.status(404).json({error:"image not found"})
    }``

    const cloudinaryId = photo.public_id

    await cloudinary.uploader.destroy(cloudinaryId);

   const deletedPhoto = await PhotoModel.findByIdAndDelete(photoId).populate({path:"comments.user",select:"name picture"});

    if (!deletedPhoto) {
  return res.status(404).json({ error: "Photo not found" });
}

    
    res.json({deletedPhoto, message: "Image deleted successfully" });

  }
  catch (error)
  {
    res.status(500).json({message:"Failed to Delete Image",error:error})
  }
}


export const getSharedPhoto = async (req, res) => {
  const { email } = req.user; // logged-in user email

  try {
    // 1. Find all albums shared with the user
    const sharedAlbums = await AlbumModel.find({
      sharedWith: email   // check inside array
    }).select("_id");     // we only need album ids


    if (sharedAlbums.length === 0) {
      return res.status(200).json({ photos: [] });
    }

    const albumIds = sharedAlbums.map(a => a._id);

    // 2. Find all photos whose albumId is inside these albums
    const photos = await PhotoModel.find({
      albumId: { $in: albumIds }
    }).sort({ createdAt: -1 }).populate({path:"comments.user",select:"name picture"});

    // 3. Return photos
    return res.status(200).json({ photos });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to get shared photos",
      error: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  const { comment } = req.body;
  const { photoId } = req.params;
  const { _id } = req.user;

  try {
    const photo = await PhotoModel.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    const updatedPhoto = await PhotoModel.findByIdAndUpdate(
      photoId,
      {
        $push: {
          comments: {
            user: _id,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate({path:"comments.user",select:"name picture"});

    return res.status(201).json({
      updatedPhoto,
      message: "Comment added successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to add Comment",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  const { photoId } = req.params;
  const { commentId } = req.body;
  const { _id: userId } = req.user;

  try {
    const photo = await PhotoModel.findById(photoId);

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

   
    const comment = photo.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

   
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this comment" });
    }

   
    const updatedPhoto = await PhotoModel.findByIdAndUpdate(
      photoId,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    ).populate({ path: "comments.user", select: "name picture" });

    return res.status(200).json({
      message: "Comment deleted successfully",
      updatedPhoto,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete Comment",
      error: error.message,
    });
  }
};





