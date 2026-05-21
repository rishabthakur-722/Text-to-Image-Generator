import axios from "axios";
import FormData from "form-data";
import userModel from "../models/userModel.js";
import imageHistoryModel from "../models/imageHistoryModel.js";

const normalizeBase64Image = (base64Image) => {
  if (!base64Image) return null;
  if (base64Image.startsWith("data:image/")) {
    return base64Image;
  }
  return `data:image/png;base64,${base64Image}`;
};

// Extract text from image using OCR.space API
export const extractText = async (req, res) => {
  try {
    const { userId, imageBase64 } = req.body;
    const normalizedImage = normalizeBase64Image(imageBase64);

    if (!userId || !normalizedImage) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // OCR.space API endpoint
    const ocrApiUrl = "https://api.ocr.space/parse/image";

    // Prepare form data
    const formData = new FormData();
    formData.append("base64Image", normalizedImage);
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
          "apikey": process.env.OCR_API_KEY || "K87899142388957"
        },
        timeout: 120000
      });

      if (data.IsErroredOnProcessing) {
        let apiMessage = Array.isArray(data.ErrorMessage)
          ? data.ErrorMessage.join(" ")
          : data.ErrorMessage || "OCR processing failed";
          
        if (data.ParsedResults?.[0]?.ErrorMessage) {
          apiMessage += " " + data.ParsedResults[0].ErrorMessage;
        }

        return res.json({
          success: false,
          message: apiMessage || "OCR processing failed. Please try again with a clearer or smaller image.",
          error: data
        });
      }

      const parsedResults = data.ParsedResults;
      if (!parsedResults || parsedResults.length === 0) {
        return res.json({ success: false, message: "No text found in image" });
      }

      const extractedText = parsedResults[0].ParsedText ? parsedResults[0].ParsedText.trim() : "";

      if (!extractedText) {
        return res.json({ success: false, message: "No text found in image" });
      }

      const historyData = new imageHistoryModel({
        userId: user._id,
        prompt: `OCR: ${extractedText.substring(0, 50)}...`,
        imageUrl: normalizedImage,
        creditsUsed: 0
      });
      await historyData.save();

      return res.json({
        success: true,
        text: extractedText,
        message: "Text extracted successfully"
      });
    } catch (apiError) {
      console.error("OCR API error:", apiError.response?.data || apiError.message || apiError);

      let fallbackMessage = "OCR service temporarily unavailable. Please try again later.";
      
      if (apiError.response?.data?.ErrorMessage) {
         fallbackMessage = Array.isArray(apiError.response.data.ErrorMessage) 
            ? apiError.response.data.ErrorMessage.join(" ") 
            : apiError.response.data.ErrorMessage;
      } else if (apiError.response?.data?.error) {
         fallbackMessage = apiError.response.data.error;
      } else if (apiError.code === "ECONNABORTED") {
         fallbackMessage = "OCR request timed out. Please try again with a smaller image.";
      }

      return res.json({
        success: false,
        message: fallbackMessage,
        fallback: true
      });
    }
  } catch (error) {
    console.error("OCR controller error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get image history
export const getImageHistory = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: true, history: [] });
    }

    const history = await imageHistoryModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      history
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
