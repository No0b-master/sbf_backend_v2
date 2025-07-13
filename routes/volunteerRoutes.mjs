import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.mjs";
import { isBasicDetailsFilled, saveVolunteerBasicDetails } from "../controllers/volunteers/basicDetailsController.mjs";
import {
  getVolunteerPrefs,
  saveVolunteerPreferences
} from "../controllers/volunteers/volunteersPreferences.mjs";

import { getVolunteerData } from "../controllers/volunteerController.mjs";

router.post("/saveBasicDetails", authenticateToken, saveVolunteerBasicDetails);
router.post("/basicDetailsStatus", authenticateToken, isBasicDetailsFilled);
router.post("/getVolunteerPreferences", authenticateToken, getVolunteerPrefs);
router.post("/savePreferences", authenticateToken, saveVolunteerPreferences);
router.get("/getVolunteerDetails", authenticateToken, getVolunteerData);

export default router;
