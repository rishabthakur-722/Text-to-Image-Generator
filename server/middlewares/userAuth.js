import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
  const token = req.headers.token

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.body = req.body || {}

    if (!decoded.id) {
      return res.json({ success: false, message: "Not Authorized. Login Again" })
    }

    req.body.userId = decoded.id
    next()
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

export default userAuth
