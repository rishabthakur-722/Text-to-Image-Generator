import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.body) req.body = {};
    req.body.userId = decoded.id;
    req.userId = decoded.id;
    next();

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Invalid Token" });
  }
};

export default userAuth;
