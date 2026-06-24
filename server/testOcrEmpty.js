import axios from "axios";
import fs from "fs";
import "dotenv/config";

const apiBaseUrl = process.env.API_BASE_URL;
const token = process.env.CLERK_TEST_TOKEN;

if (!apiBaseUrl) {
  throw new Error("API_BASE_URL is required for OCR tests.");
}

if (!token) {
  throw new Error("CLERK_TEST_TOKEN is required for protected OCR endpoint tests.");
}

const testOcr = async () => {
  try {
    console.log("Sending OCR request with a 1x1 black pixel (no text)...");
    const base64Image = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=`;

    const ocrRes = await axios.post(`${apiBaseUrl}/api/ocr/extract-text`, {
      imageBase64: base64Image
    }, {
      headers: {
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
