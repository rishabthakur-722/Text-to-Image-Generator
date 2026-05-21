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

    console.log("Sending OCR request with a 1x1 black pixel (no text)...");
    const base64Image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=`;

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
      console.log("API Error Status:", error.response.status);
      console.log("API Error Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }
};

testOcr();
