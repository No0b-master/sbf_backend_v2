import express from "express";
const router = express.Router();

import {changePassword, loginUser, registerUser} from "../controllers/userController.mjs";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changePassword", changePassword);


export default router;
