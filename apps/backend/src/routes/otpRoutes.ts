import { Router } from "express";
import { sendOtp,verifyOtp } from "../controllers/otpController";

const router = Router();

router.post("/send", sendOtp);

export default router;
