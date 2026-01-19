import express from "express";
import { extractText, getImageHistory } from "../controllers/ocrController.js";
import userAuth from "../middlewares/userAuth.js";

const ocrRouter = express.Router();

ocrRouter.post("/extract-text", userAuth, extractText);
ocrRouter.get("/history", userAuth, getImageHistory);

export default ocrRouter;
