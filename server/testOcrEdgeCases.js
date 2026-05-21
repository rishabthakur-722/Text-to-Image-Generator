import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import "dotenv/config";

const testCases = async () => {
  const ocrApiUrl = "https://api.ocr.space/parse/image";
  const apiKey = process.env.OCR_API_KEY;

  if (!apiKey) {
    throw new Error("OCR_API_KEY is required for OCR tests.");
  }

  const runTest = async (name, base64Image) => {
    console.log(`\n--- Test: ${name} ---`);
    const formData = new FormData();
    formData.append("base64Image", base64Image);
    formData.append("language", "eng");
    formData.append("OCREngine", "2");

    try {
      const { data } = await axios.post(ocrApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          "apikey": apiKey
        }
      });
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("Axios error:", e.message);
      if (e.response) {
        console.log("Response data:", JSON.stringify(e.response.data, null, 2));
      }
    }
  };

  // Test 1: Invalid Base64
  await runTest("Invalid Base64", "data:image/png;base64,invalidbase64data==");

  // Test 2: Blank 1x1 image
  await runTest("Blank 1x1", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");

  // Test 3: Large image (just a repeated string to make it large, will probably be invalid format but large)
  // Skip large image to save memory, test invalid format instead
  await runTest("Missing data:image prefix", "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
};

testCases();
