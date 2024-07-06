import express from "express"
import { Login, logOut, refreshToken } from "../controller/Auth.js";
import { requestOtp, verifyOtpAndResetPassword } from "../controller/OTPController.js";

const router = express.Router();

router.get('/token', refreshToken)
router.post('/masuk', Login)
router.delete('/keluar', logOut)
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndResetPassword);

export default router;