import Album from "../models/album.model.js";

export const createAlbum = async(req, res) => {
  const { _id,email } = req.user
  const {name,description} = req.body
  try {
    const newAlbum = new Album({
      name,
      description,
      ownerId: _id,
sharedWith:[email]
    })
    const savedAlbum = await newAlbum.save()
    res.status(201).json({newAlbum:savedAlbum,message:"new album created successfully."})
  } catch (error) {
    res.status(500).json({ error: error.message || "internal server error" });
  }
};


export const getAlbum = async(req, res) => {
  const { _id } = req.user
  try {
const albums =await Album.find({ownerId:_id})
    res.status(200).json({albums,message:"albums fetched successfully."})
  } catch (error) {
    res.status(500).json({ error: error.message || "internal server error" });
  }
};


export const shareAlbum = async (req, res) => {
  const { email, albumId } = req.body;

  try {
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ error: "Album not found." });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $addToSet: { sharedWith: email } },  // adds only if not exists
      { new: true }
    );

    res.status(200).json({
      updatedAlbum,
      message: "Album updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};


export const removeAlbumEmail = async (req, res) => {
  const { email, albumId } = req.body;

  try {
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ error: "Album not found." });
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $pull: { sharedWith: email } }, 
      { new: true }
    );

    res.status(200).json({
      updatedAlbum,
      message: "Email removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};



