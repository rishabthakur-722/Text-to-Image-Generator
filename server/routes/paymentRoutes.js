import express from "express";
import { createOrder, verifyPayment, getTransactions } from "../controllers/paymentController.js";
import userAuth from "../middlewares/userAuth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", userAuth, createOrder);
paymentRouter.post("/verify-payment", userAuth, verifyPayment);
paymentRouter.get("/transactions", userAuth, getTransactions);

export default paymentRouter;
