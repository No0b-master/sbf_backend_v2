import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.mjs";

import { uploadDocuments } from "../controllers/volunteers/uploadController.mjs";
import { updateDocument } from "../controllers/volunteers/updateControllers.mjs";
import { getId } from "../controllers/getIdCard.mjs";

router.post("/upload", authenticateToken, uploadDocuments);
router.post("/update", authenticateToken, updateDocument);
router.post("/getIdCard", authenticateToken, getId);

export default router;
