import axios from 'axios';
import Razorpay from 'razorpay';
import 'dotenv/config';

async function testTokens() {
  console.log("Starting API Key Verifications...\n");
  
  // 1. Test HuggingFace API
  try {
    console.log("1. Testing Hugging Face API...");
    const hfApiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";
    const hfResponse = await axios.post(
      hfApiUrl,
      { inputs: "a cat" },
      {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer",
        timeout: 10000
      }
    );
    console.log("✅ Hugging Face API is working properly! Status:", hfResponse.status);
  } catch (error) {
    if (error.response && error.response.status === 503) {
      console.log("⚠️ Hugging Face API Key is VALID, but model is currently loading (503).");
    } else {
      console.error("❌ Hugging Face API Failed:", error.response ? error.response.data.toString() : error.message);
    }
  }

  // 2. Test OCR API
  try {
    console.log("\n2. Testing OCR Space API...");
    // We'll use a sample image URL to test OCR
    const ocrUrl = `https://api.ocr.space/parse/imageurl?apikey=${process.env.OCR_API_KEY}&url=https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/eng.png`;
    const ocrResponse = await axios.get(ocrUrl);
    if (ocrResponse.data && !ocrResponse.data.IsErroredOnProcessing) {
      console.log("✅ OCR Space API is working properly!");
    } else {
      console.error("❌ OCR Space API Error:", ocrResponse.data ? ocrResponse.data.ErrorMessage : "Unknown Error");
    }
  } catch (error) {
    console.error("❌ OCR Space API Failed:", error.message);
  }

  // 3. Test Razorpay API
  try {
    console.log("\n3. Testing Razorpay API...");
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    // Just fetch orders to see if auth works
    await razorpayInstance.orders.all({ count: 1 });
    console.log("✅ Razorpay API is working properly! Keys are authenticated.");
  } catch (error) {
    console.error("❌ Razorpay API Failed:", error.description || error.message);
  }
}

testTokens();
