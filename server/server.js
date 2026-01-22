import express from "express"
import cors from "cors"
import "dotenv/config"

import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import paymentRouter from "./routes/paymentRoutes.js"
import ocrRouter from "./routes/ocrRoutes.js"

const app = express()
const PORT = process.env.PORT || 4000

// Middleware - increased limit for image uploads
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4000'] }))

const startServer = async () => {
  try {
    await connectDB()

    // Routes
    app.use("/api/user", userRouter)
    app.use("/api/image", imageRouter)
    app.use("/api/payment", paymentRouter)
    app.use("/api/ocr", ocrRouter)

    app.get("/", (req, res) => res.send("API Working"))

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT)
    })
  } catch (error) {
    console.error("Server failed to start:", error)
    process.exit(1)
  }
}

startServer()
