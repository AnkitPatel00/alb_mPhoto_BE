export const verifyAccessToken = (req, res, next) => {
  const { access_token } = req.cookies;

  if (!access_token) {
    return res.status(401).json({ error: "Unauthorized - No Token" });
  }

  next();
};
