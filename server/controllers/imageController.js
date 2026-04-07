import userModel from "../models/userModel.js";
import imageHistoryModel from "../models/imageHistoryModel.js";
import axios from "axios";

// Generate image using free Pollinations.ai API with fallback
export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    console.log("DEBUG: generateImage - body:", req.body);

    if (!userId || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No Credit balance",
        creditBalance: user.creditBalance
      });
    }

    let resultImage = null;
    let imageGenerated = false;

    // Try Pollinations.ai API (Free, no API key required)
    try {
      console.log("Attempting image generation for prompt:", prompt);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

      const { data } = await axios.get(pollinationsUrl, {
        responseType: "arraybuffer",
        timeout: 60000 // Increased to 60 seconds
      });

      const base64Image = Buffer.from(data, "binary").toString("base64");
      resultImage = `data:image/png;base64,${base64Image}`;
      imageGenerated = true;
      console.log("Image generated successfully via Pollinations");

    } catch (pollinationsError) {
      console.error("Pollinations API failed. Error:", pollinationsError.message);
      
      // Fallback to Hugging Face Inference API if key is present
      if (process.env.HUGGINGFACE_API_KEY) {
        try {
          console.log("Attempting Hugging Face fallback...");
          const hfApiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";

          const { data } = await axios.post(
            hfApiUrl,
            { inputs: prompt },
            {
              headers: {
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
              },
              responseType: "arraybuffer",
              timeout: 60000
            }
          );

          const base64Image = Buffer.from(data, "binary").toString("base64");
          resultImage = `data:image/png;base64,${base64Image}`;
          imageGenerated = true;
          console.log("Hugging Face fallback successful!");

        } catch (hfError) {
          console.error("Hugging Face API failed. Error:", hfError.message);
          return res.json({ success: false, message: "Both generation services failed: " + hfError.message });
        }
      } else {
        return res.json({ success: false, message: "Generation failed: " + pollinationsError.message });
      }
    }

    if (imageGenerated && resultImage) {
      // Deduct credit
      await userModel.findByIdAndUpdate(user._id, {
        creditBalance: user.creditBalance - 1
      });

      // Save to image history
      const imageHistory = new imageHistoryModel({
        userId: user._id,
        prompt,
        imageUrl: resultImage,
        creditsUsed: 1
      });
      await imageHistory.save();

      res.json({
        success: true,
        message: "Image Generated",
        creditBalance: user.creditBalance - 1,
        resultImage
      });
    }

  } catch (error) {
    console.error("Generate image error:", error);
    res.json({ success: false, message: "System Error: " + error.message });
  }
};

// Get user's image generation history
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.body;
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
    console.error("Get history error:", error);
    res.json({ success: false, message: error.message });
  }
};
