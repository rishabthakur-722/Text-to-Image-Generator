import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    const token = authHeader ? (authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.body) req.body = {};
    req.body.userId = decoded.id;
    req.userId = decoded.id;
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default userAuth;
