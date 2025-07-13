import express from "express";
const router = express.Router();

import authRoutes from "./authRoutes.mjs";
import volunteerRoutes from "./volunteerRoutes.mjs";
import documentRoutes from "./documentsRoutes.mjs";
import approvalRoutes from "./approvalRoutes.mjs";
import listRoutes from "./listRoutes.mjs";
import otpRoutes from "./otpRoutes.mjs";
import documentAccessRoutes from './documentAccessRoutes.mjs'
// Health Check
router.get("/connection", (req, res) => {
  res.json({ status: true, message: "Server online" });
});

// Route Mounting
router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);

router.use("/volunteer", volunteerRoutes);
router.use("/document", documentRoutes);
router.use("/approval", approvalRoutes);
router.use("/list", listRoutes);
router.use("/document-access", documentAccessRoutes);

export default router;
