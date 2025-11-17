import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const verifyJwtToken = (req, res, next) => {
  const { jwt_token } = req.cookies;
  try {
    if (!jwt_token) {
      return res.status(403).json({ error: "Token Required" });
    }
    const decodedToken = jwt.verify(jwt_token, JWT_SECRET);

    if (!decodedToken) {
      return res.status(403).json({ error: "Token Invalid" });
    }

    req.user = decodedToken.user;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message || "Invalid Token" });
  }
};


