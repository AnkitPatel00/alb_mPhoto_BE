import express from 'express'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'
import { deletePhoto, getPhotos, getSharedPhoto, uploadPhoto } from '../controllers/photoController.js'
import multer from 'multer'
import dotenv from "dotenv"
dotenv.config()

//multer
const storage = multer.diskStorage({})
const upload = multer({ storage })

const router = express.Router()

router.get("/album/shared", verifyJwtToken,getSharedPhoto)
router.get("/:albumId", verifyJwtToken,getPhotos)
router.post("/", verifyJwtToken,upload.single("image"),uploadPhoto)
router.delete("/:photoId", verifyJwtToken,deletePhoto)

export default router