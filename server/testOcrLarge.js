import axios from "axios";
import FormData from "form-data";
import "dotenv/config";

const testLarge = async () => {
  const ocrApiUrl = "https://api.ocr.space/parse/image";
  const apiKey = process.env.OCR_API_KEY;

  if (!apiKey) {
    throw new Error("OCR_API_KEY is required for OCR tests.");
  }

  console.log("Generating 2MB dummy base64 string...");
  const dummyBuffer = Buffer.alloc(2 * 1024 * 1024, "A"); // 2MB of 'A's
  const base64Image = `data:image/png;base64,${dummyBuffer.toString("base64")}`;

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
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Axios error:", e.message);
    if (e.response) {
      console.log("Response data:", JSON.stringify(e.response.data, null, 2));
    }
  }
};

testLarge();
