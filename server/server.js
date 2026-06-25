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


// Required Environment Variables
const requiredEnv = [
  "MONGO_URI",
  "CLERK_SECRET_KEY",
  "CLERK_PUBLISHABLE_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "OCR_API_KEY"
]


const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
)


if (missingEnv.length > 0) {
  console.error(
    "Missing Environment Variables:",
    missingEnv.join(", ")
  )

  process.exit(1)
}


// CORS Setup
const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_URL ||
  ""
)
.split(",")
.map(origin => origin.trim())
.filter(Boolean)



const corsOptions = {

  origin(origin, callback){

    // Allow Postman / server requests
    if(!origin){
      return callback(null,true)
    }


    if(allowedOrigins.includes(origin)){
      return callback(null,true)
    }


    return callback(
      new Error(`CORS blocked: ${origin}`)
    )

  },

  credentials:true

}



// Middleware

app.set("trust proxy",1)


app.use(
  express.json({
    limit:"50mb"
  })
)


app.use(
  express.urlencoded({
    limit:"50mb",
    extended:true
  })
)


app.use(cors(corsOptions))



// Clerk Middleware

app.use(
  clerkMiddleware({

    publishableKey:
      process.env.CLERK_PUBLISHABLE_KEY,

    secretKey:
      process.env.CLERK_SECRET_KEY

  })
)



// Start Server

const startServer = async()=>{

  try{


    await connectDB()


    // Routes

    app.use(
      "/api/user",
      userRouter
    )


    app.use(
      "/api/image",
      imageRouter
    )


    app.use(
      "/api/payment",
      paymentRouter
    )


    app.use(
      "/api/ocr",
      ocrRouter
    )



    // Health Check

    app.get("/",(req,res)=>{

      res.json({
        success:true,
        message:"API Working"
      })

    })


    app.get("/health",(req,res)=>{

      res.json({
        success:true,
        status:"ok"
      })

    })



    app.listen(PORT,()=>{

      console.log(
        `Server running on port ${PORT}`
      )

    })


  }

  catch(error){

    console.error(
      "Server failed:",
      error.message
    )

    process.exit(1)

  }

}



startServer()