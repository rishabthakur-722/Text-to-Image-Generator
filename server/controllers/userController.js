import userModel from "../models/userModel.js";

const userCredits = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: user.creditBalance, user: { name: user.name, photo: user.photo } });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { userCredits };
