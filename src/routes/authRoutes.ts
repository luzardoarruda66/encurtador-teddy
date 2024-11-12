import express from "express";
import { ExpressValidator } from "express-validator";
import { signup, login } from "../controllers/authController";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

export default router;
