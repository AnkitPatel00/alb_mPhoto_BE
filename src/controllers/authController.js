import axios from "axios";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const checkToken = (req, res) => {
  try {
res.cookie("myName", "Ankit", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
    return res.status(200).json({ message: "cookie send done." });
  } catch (error) {
    return res.status(500).json({ error });
  }
};




export const getUserProfile = async (req, res) => {
  const { googleId } = req.user
 
  try {
    const user = await User.findOne({ googleId }).select("-googleId");
    if (!user)
    {
    return  res.status(403).json({message:"user not found"})
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};



export const userLogout = (req, res) => {
  try {
    res.clearCookie("jwt_token")
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
};



//create user

export const googleAuth = (req, res) => {
  const PORT = process.env.PORT || 5000;
  const googleAccountsURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BACKEND_DOMAIN}/auth/google/callback&response_type=code&scope=profile%20email`;
  res.redirect(googleAccountsURL);
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(404).json({ error: "No Code provided" });
  }

  try {
    const responseToken = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_DOMAIN}/auth/google/callback`,
        grant_type: "authorization_code",
        code,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const access_token = responseToken.data.access_token;

    if (!access_token) {
      return res.status(401).json({ error: "No access token found" });
    }

    // Fetch user
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { id, email, name, picture } = data;

    let user = await User.findOne({ googleId: id });

    if (!user) {
      user = await User.create({
        googleId: id,
        email,
        name,
        picture,
      });
    }

    const jwtToken = jwt.sign({ user }, JWT_SECRET, { expiresIn: "24h" });

res.cookie("jwt_token", jwtToken, {
  httpOnly: true,
  secure: true,          // required for SameSite=None
  sameSite: "none",      // required for cross-domain cookie
  maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
});

    return res.redirect(`${process.env.FRONTEND_URL}`);
  } catch (error) {
    res.status(500).json({ error: "Google Auth Failed" });
  }
};

