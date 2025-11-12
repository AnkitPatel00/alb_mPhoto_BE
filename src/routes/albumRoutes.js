import express from 'express'
import { verifyJwtToken } from '../middlewares/verifyJwtToken.js'
import { createAlbum } from '../controllers/albumController.js'

const router = express.Router()

router.post("/album", verifyJwtToken,createAlbum)



export default router