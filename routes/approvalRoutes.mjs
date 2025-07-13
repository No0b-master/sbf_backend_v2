import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.mjs";

import {
  approveLocal,
  approveNational,
  approveState,
  getApprovals
} from "../controllers/approval/levelController.mjs";

router.post("/approveLocal", authenticateToken, approveLocal);
router.post("/approveState", authenticateToken, approveState);
router.post("/approveNational", authenticateToken, approveNational);
router.post("/getApprovals", authenticateToken, getApprovals);

export default router;
