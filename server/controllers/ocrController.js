import axios from "axios";
import FormData from "form-data";

// Extract text from image using OCR.space API
export const extractText = async (req, res) => {
  try {
    const { userId, imageBase64 } = req.body;

    if (!userId || !imageBase64) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // OCR.space API endpoint
    const ocrApiUrl = "https://api.ocr.space/parse/image";

    // Prepare form data
    const formData = new FormData();
    formData.append("base64Image", imageBase64);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    formData.append("detectOrientation", "true");
    formData.append("scale", "true");
    formData.append("OCREngine", "2"); // Use OCR Engine 2 for better accuracy

    try {
      // Call OCR.space API
      const { data } = await axios.post(ocrApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          "apikey": process.env.OCR_API_KEY || "K87899142388957" // Free API key
        }
      });

      if (data.IsErroredOnProcessing) {
        return res.json({
          success: false,
          message: "OCR processing failed",
          error: data.ErrorMessage
        });
      }

      const extractedText = data.ParsedResults?.[0]?.ParsedText || "";

      if (!extractedText.trim()) {
        return res.json({
          success: false,
          message: "No text found in image"
        });
      }

      res.json({
        success: true,
        text: extractedText,
        message: "Text extracted successfully"
      });

    } catch (apiError) {
      // Fallback: Try alternative free OCR API or return graceful error
      console.error("OCR API error:", apiError.message);

      // Return a user-friendly error
      res.json({
        success: false,
        message: "OCR service temporarily unavailable. Please try again later.",
        fallback: true
      });
    }

  } catch (error) {
    console.error("Extract text error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get image history
export const getImageHistory = async (req, res) => {
  try {
    const { userId } = req.body;

    const imageHistoryModel = (await import("../models/imageHistoryModel.js")).default;

    const history = await imageHistoryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error("Get image history error:", error);
    res.json({ success: false, message: error.message });
  }
};
