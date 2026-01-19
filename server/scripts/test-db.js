import mongoose from "mongoose";
import "dotenv/config";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import imageHistoryModel from "../models/imageHistoryModel.js";
import connectDB from "../config/mongodb.js";

const testDatabase = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected!");

    // 1. Test User Schema & Validation
    console.log("\n🧪 Testing User Schema...");
    try {
      const invalidUser = new userModel({});
      await invalidUser.validate();
    } catch (err) {
      console.log("✅ User validation working: Caught missing required fields");
    }

    const testUser = new userModel({
      name: "DB Test User",
      email: `dbtest${Date.now()}@example.com`,
      password: "hashedpassword123"
    });
    const savedUser = await testUser.save();
    console.log(`✅ User created: ${savedUser._id}`);

    // 2. Test Transaction Schema
    console.log("\n🧪 Testing Transaction Schema...");
    const testTransaction = new transactionModel({
      userId: savedUser._id,
      razorpayOrderId: "order_test_123",
      amount: 100,
      credits: 10,
      status: "pending"
    });
    const savedTransaction = await testTransaction.save();
    console.log(`✅ Transaction created: ${savedTransaction._id}`);

    // Update user with transaction reference
    savedUser.transactions.push(savedTransaction._id);
    await savedUser.save();
    console.log("✅ User updated with transaction reference");

    // 3. Test Image History Schema
    console.log("\n🧪 Testing Image History Schema...");
    const testImage = new imageHistoryModel({
      userId: savedUser._id,
      prompt: "A futuristic city",
      imageUrl: "data:image/png;base64,testimage",
      creditsUsed: 1
    });
    const savedImage = await testImage.save();
    console.log(`✅ Image History created: ${savedImage._id}`);

    // Cleanup
    console.log("\n🧹 Cleaning up test data...");
    await userModel.findByIdAndDelete(savedUser._id);
    await transactionModel.findByIdAndDelete(savedTransaction._id);
    await imageHistoryModel.findByIdAndDelete(savedImage._id);
    console.log("✅ Cleanup complete");

    console.log("\n🎉 All database tests passed!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Database Test Failed:", error);
    process.exit(1);
  }
};

testDatabase();
