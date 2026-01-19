import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    const { userId, amount, credits } = req.body;

    if (!userId || !amount || !credits) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    // Create order
    const order = await razorpayInstance.orders.create(options);

    // Save transaction in database
    const transaction = new transactionModel({
      userId,
      razorpayOrderId: order.id,
      amount,
      credits,
      status: "pending"
    });

    await transaction.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      message: "Order created successfully"
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify payment and add credits
export const verifyPayment = async (req, res) => {
  try {
    const { userId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!userId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.json({ success: false, message: "Missing payment details" });
    }

    // Verify signature
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpaySignature !== expectedSign) {
      // Update transaction status to failed
      await transactionModel.findOneAndUpdate(
        { razorpayOrderId },
        { status: "failed" }
      );
      return res.json({ success: false, message: "Invalid payment signature" });
    }

    // Payment verified successfully
    const transaction = await transactionModel.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: "success"
      },
      { new: true }
    );

    if (!transaction) {
      return res.json({ success: false, message: "Transaction not found" });
    }

    // Add credits to user
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { creditBalance: transaction.credits },
        $push: { transactions: transaction._id }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment verified and credits added",
      creditBalance: user.creditBalance
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get user transactions
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.body;

    const transactions = await transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      transactions
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.json({ success: false, message: error.message });
  }
};
