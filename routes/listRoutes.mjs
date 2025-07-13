import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/authentication.mjs";

import {
  handleVolunteerSearch
} from "../controllers/volunteerList/volunteerListController.mjs";

router.get("/volunteer", authenticateToken, handleVolunteerSearch);

export default router;
