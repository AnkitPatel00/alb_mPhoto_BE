import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export const verifyJwtToken = (req, res, next) => {
  const { jwt_token } = req.cookies;
  
  try {

    if (!jwt_token)
    {
      res.status(403).json({ error: error.message || "Token Require" })
      
    }
    const decodedToken = jwt.verify(jwt_token, JWT_SECRET)
    if (decodedToken)
    {
      req.user = decodedToken.user
      next()
    }
    else {
      
      res.status(403).json({ error: error.message || "Token Invalid" })
    }
    
  }
  catch (error)
  {
    res.status(403).json({error: error.message ||"Invalid Token"})
}

}

