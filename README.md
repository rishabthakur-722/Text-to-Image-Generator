# MERN Stack - AI Text-to-Image Generator 🎨

A full-stack web application that generates images from text prompts using AI, with user authentication, credit system, and Razorpay payment integration.

## ✨ Features

- **User Authentication**: JWT-based secure authentication (Register/Login)
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
- JWT Authentication
- Bcrypt for password hashing
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
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
OCR_API_KEY=K87899142388957
HUGGINGFACE_API_KEY=
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

Create `.env` file in `Frontend/.Frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
```

### 4. Run the Application

**Start Backend Server:**
```bash
cd server
npm run server
```
Server will run on `http://localhost:4000`

**Start Frontend (in new terminal):**
```bash
cd Frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Sign Up**: Create a new account (get 5 free credits)
2. **Generate Images**: Enter a text prompt and generate AI images
3. **Buy Credits**: Purchase more credits via Razorpay (test mode)
4. **View History**: Check your generated images
5. **OCR**: Extract text from images

## 🧪 Testing with Postman

Import the `MERN_Stack_APIs.postman_collection.json` file into Postman.

### Test Flow:
1. **Register** → Get token
2. **Login** → Get token
3. **Get Credits** → Check balance
4. **Generate Image** → Create image from prompt
5. **Create Order** → Initiate payment
6. **Verify Payment** → Complete payment
7. **Get Transactions** → View payment history

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
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
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

## 🌐 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory to `Frontend/.Frontend`
4. Add environment variables
5. Deploy

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
