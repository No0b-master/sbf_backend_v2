import express from "express";
const router = express.Router();

import { changePassword, loginUser, registerUser, googleAuth, forgotPassword } from "../controllers/userController.mjs";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/changePassword", changePassword);
router.post("/forgotPassword", forgotPassword);

export default router;
