import axios from "axios";
import Album from "../models/album.model.js";

export const createAlbum = async(req, res) => {
  console.log(req.body)
  const { _id } = req.user
  const {name,description} = req.body
  try {
    const newAlbum = new Album({
      name,
      description,
ownerId:_id
    })
    const savedAlbum = await newAlbum.save()
    res.status(201).json({newAlbum:savedAlbum,message:"new album created successfully."})
  } catch (error) {
    res.status(500).json({ error: error.message || "internal server error" });
  }
};

