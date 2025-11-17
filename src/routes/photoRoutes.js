import express from 'express'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'
import { deletePhoto, getPhotos, getSharedPhoto, uploadPhoto,addComment, deleteComment } from '../controllers/photoController.js'
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
router.post("/comment/:photoId", verifyJwtToken,addComment)
router.post("/comment/delete/:photoId", verifyJwtToken,deleteComment)

export default router