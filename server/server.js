import express from "express"
import cors from "cors"
import { clerkMiddleware } from "@clerk/express"
import "dotenv/config"

import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import paymentRouter from "./routes/paymentRoutes.js"
import ocrRouter from "./routes/ocrRoutes.js"

const app = express()
const PORT = process.env.PORT || 4000

const requiredEnv = ["MONGO_URI", "CLERK_SECRET_KEY", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "OCR_API_KEY"]
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`)
  process.exit(1)
}

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true
}

// Middleware - increased limit for image uploads
app.set("trust proxy", 1)
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cors(corsOptions))
app.use(clerkMiddleware())

const startServer = async () => {
  try {
    await connectDB()

    // Routes
    app.use("/api/user", userRouter)
    app.use("/api/image", imageRouter)
    app.use("/api/payment", paymentRouter)
    app.use("/api/ocr", ocrRouter)

    app.get("/", (req, res) => res.json({ success: true, message: "API Working" }))
    app.get("/health", (req, res) => res.json({ success: true, status: "ok" }))

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT)
    })
  } catch (error) {
    console.error("Server failed to start:", error)
    process.exit(1)
  }
}

startServer()
