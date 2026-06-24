# MERN Stack - AI Text-to-Image Generator 🎨

A full-stack web application that generates images from text prompts using AI, with Clerk authentication, a credit system, and Razorpay payment integration.

## ✨ Features

- **User Authentication**: Clerk-powered sign in, sign up, and profile controls
- **AI Image Generation**: Convert text prompts to images using free AI APIs
- **Credit System**: Users get 5 free credits on signup
- **Payment Integration**: Razorpay test mode for purchasing credits
- **Image History**: Track all generated images
- **OCR Support**: Extract text from images
- **Responsive UI**: Beautiful, modern interface built with React and Tailwind CSS
- **Secure Backend**: Express.js with MongoDB Atlas

## 🛠️ Tech Stack

### Frontend
- React.js 19
- Vite
- Tailwind CSS 4
- React Router DOM
- Axios
- React Toastify
- Motion (Framer Motion)

### Backend
- Node.js
- Express.js 5
- MongoDB Atlas (Mongoose)
- Clerk Authentication
- Razorpay SDK

### APIs
- **Pollinations.ai** - Free text-to-image generation (primary)
- **Hugging Face** - Fallback image generation
- **OCR.space** - Free OCR/text extraction

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Razorpay test account (for payments)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd "MERN STACK 1"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server` directory:

```env
MONGO_URI=your_mongodb_atlas_connection_string_without_real_credentials
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
OCR_API_KEY=your_ocr_space_api_key
HUGGINGFACE_API_KEY=
FRONTEND_URL=https://your-netlify-site.netlify.app
CORS_ORIGIN=https://your-netlify-site.netlify.app
PORT=4000
```

**Get your API keys:**
- MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Razorpay Test Keys: [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
- OCR.space (optional): [OCR.space API](https://ocr.space/ocrapi)

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create `.env` file in `Frontend` directory:

```env
VITE_BACKEND_URL=https://your-backend-service-url.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Run the Application

**Start Backend Server:**
```bash
cd server
npm run dev
```
Server uses the `PORT` value from `server/.env`.

**Start Frontend (in new terminal):**
```bash
cd Frontend
npm run dev
```
Frontend uses `VITE_BACKEND_URL` from `Frontend/.env`.

## 📱 Usage

1. **Sign Up**: Create a new Clerk account (get 5 free credits)
2. **Generate Images**: Enter a text prompt and generate AI images
3. **Buy Credits**: Purchase more credits via Razorpay (test mode)
4. **View History**: Check your generated images
5. **OCR**: Extract text from images

## 🧪 Testing with Postman

Import the `MERN_Stack_APIs.postman_collection.json` file into Postman.

### Test Flow:
1. **Sign in with Clerk** → Use a Clerk session token
2. **Get Credits** → Check balance
3. **Generate Image** → Create image from prompt
4. **Create Order** → Initiate payment
5. **Verify Payment** → Complete payment
6. **Get Transactions** → View payment history

### Razorpay Test Cards:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 📁 Project Structure

```
MERN STACK 1/
├── server/
│   ├── config/
│   │   └── mongodb.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── imageController.js
│   │   ├── paymentController.js
│   │   └── ocrController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── transactionModel.js
│   │   └── imageHistoryModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── imageRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── ocrRoutes.js
│   ├── middlewares/
│   │   └── userAuth.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│       │   ├── components/
│       │   ├── Pages/
│       │   ├── context/
│       │   ├── assets/
│       │   ├── App.jsx
│       │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── MERN_Stack_APIs.postman_collection.json
```

## 🔑 API Endpoints

### Authentication
- Clerk manages sign in, sign up, sign out, and user profile UI
- `GET /api/user/credits` - Get user credits (protected)

### Image Generation
- `POST /api/image/generate-image` - Generate image (protected)
- `GET /api/image/history` - Get image history (protected)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order (protected)
- `POST /api/payment/verify-payment` - Verify payment (protected)
- `GET /api/payment/transactions` - Get transactions (protected)

### OCR
- `POST /api/ocr/extract-text` - Extract text from image (protected)

## Production Deployment

### Backend
Deploy the `server` folder to a Node.js hosting service such as Render, Railway, or another service that supports long-running Express apps.

Use these settings:

```txt
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Set these backend environment variables on the hosting dashboard:

```env
MONGO_URI=your_mongodb_atlas_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_live_or_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_live_or_test_key_secret
OCR_API_KEY=your_ocr_space_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
FRONTEND_URL=https://your-netlify-site.netlify.app
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

After deployment, copy the backend HTTPS URL.

### Frontend on Netlify
This repo includes `netlify.toml`, so Netlify can auto-detect the production build settings.

Use these settings if Netlify asks manually:

```txt
Base directory: Frontend
Build command: npm run build
Publish directory: dist
```

Set these frontend environment variables in Netlify:

```env
VITE_BACKEND_URL=https://your-backend-service-url.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Redeploy after changing environment variables.

## 🐛 Troubleshooting

**MongoDB Connection Failed:**
- Check MongoDB URI in `.env`
- Whitelist your IP in MongoDB Atlas

**Payment Not Working:**
- Verify Razorpay keys are in test mode
- Check if Razorpay script is loaded in `index.html`

**Image Generation Failed:**
- Pollinations.ai is free and may have rate limits
- Fallback to Hugging Face will activate automatically

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using MERN Stack

## 🙏 Acknowledgments

- Pollinations.ai for free image generation
- OCR.space for free OCR API
- Razorpay for payment gateway
- MongoDB Atlas for database hosting
