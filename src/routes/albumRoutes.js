import express from 'express'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'
import { createAlbum,getAlbum, removeAlbumEmail, shareAlbum ,removeAlbum } from '../controllers/albumController.js'

const router = express.Router()

router.get("/", verifyJwtToken,getAlbum)
router.post("/", verifyJwtToken,createAlbum)
router.put("/share", verifyJwtToken,shareAlbum)
router.put("/remove-email", verifyJwtToken,removeAlbumEmail)
router.delete("/remove/:albumId", verifyJwtToken,removeAlbum)

export default router