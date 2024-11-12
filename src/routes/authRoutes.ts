import express from "express";
import { body } from "express-validator";
import { signup, login } from "../controllers/authController";
import { validate } from "../middleware/validationMiddleware";

const router = express.Router();
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("The password min length is 6")
      .matches(/\d/)
      .withMessage("The password must contains a number"),
  ],
  validate,
  signup
);
router.post(
  "/login",
  [body("email").isEmail().withMessage("Invalid email")],
  validate,
  login
);

export default router;
