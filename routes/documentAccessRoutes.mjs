import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.mjs";
import {
  viewDocument,
  downloadDocument,
} from "../controllers/documentAccessController.mjs";

router.get("/viewDocument/:SBF_id/:type", authenticateToken, viewDocument);
router.get(
  "/downloadDocument/:SBF_id/:type",
  authenticateToken,
  downloadDocument
);

export default router;
