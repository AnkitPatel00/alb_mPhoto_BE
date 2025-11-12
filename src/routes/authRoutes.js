import express from "express";
import {
  checkToken,
  getUserProfile,
  googleAuth,
  googleCallback,
  userLogout
} from "../controllers/authController.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { verifyJwtToken } from "../middlewares/verifyJwtToken.js";

const router = express.Router();

router.get("/checkToken",verifyJwtToken,checkToken);
router.get("/logout",userLogout);
router.get("/user/profile/google", verifyJwtToken, getUserProfile);
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
