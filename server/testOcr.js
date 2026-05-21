import axios from "axios";
import fs from "fs";
import "dotenv/config";

const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API_BASE_URL is required for OCR tests.");
}

const testOcr = async () => {
  try {
    console.log("Registering test user...");
    const email = `test_${Date.now()}@test.com`;
    const regRes = await axios.post(`${apiBaseUrl}/api/user/register`, {
      name: "Test OCR User",
      email,
      password: "password123"
    });

    if (!regRes.data.success) {
      console.log("Registration failed:", regRes.data);
      return;
    }

    const token = regRes.data.token;
    console.log("Registered successfully. Token:", token);

    console.log("Reading test image...");
    const imagePath = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\7b803d28-2da9-4db1-9940-1f8bbaa926ce\\test_ocr_image_1779160265242.png";
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

    console.log("Sending OCR request...");
    const ocrRes = await axios.post(`${apiBaseUrl}/api/ocr/extract-text`, {
      imageBase64: base64Image
    }, {
      headers: {
        token,
        Authorization: `Bearer ${token}`
      }
    });

    console.log("OCR Response:", JSON.stringify(ocrRes.data, null, 2));

  } catch (error) {
    if (error.response) {
      console.log("API Error:", error.response.status, error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
};

testOcr();
