
import PhotoModel from "../models/photo.model.js";
import AlbumModel from "../models/album.model.js"
import cloudinary from 'cloudinary'
import photoModel from "../models/photo.model.js";

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
    const photos = await PhotoModel.find({ albumId })
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

    console.log(cloudinaryId)

    await cloudinary.uploader.destroy(cloudinaryId);

   const deletedPhoto = await PhotoModel.findByIdAndDelete(photoId);

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

    console.log(sharedAlbums)

    if (sharedAlbums.length === 0) {
      return res.status(200).json({ photos: [] });
    }

    const albumIds = sharedAlbums.map(a => a._id);

    // 2. Find all photos whose albumId is inside these albums
    const photos = await PhotoModel.find({
      albumId: { $in: albumIds }
    });

    // 3. Return photos
    return res.status(200).json({ photos });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to get shared photos",
      error: error.message,
    });
  }
};


