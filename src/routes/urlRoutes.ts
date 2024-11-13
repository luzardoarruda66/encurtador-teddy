import express from "express";
import {
  deleteUrl,
  listUserUrls,
  shortenUrl,
  updateUrl,
} from "../controllers/urlController";
import { authenticate } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import { body, param } from "express-validator";

const router = express.Router();

router.get("/list", validate, authenticate, listUserUrls);
router.post(
  "/shorten",
  [body("originalUrl").isURL().withMessage("URL is invalid!")],
  validate,
  authenticate,
  shortenUrl
);
router.put("/update/:shortUrl",[param("shortUrl").isLength({min: 6, max : 6}).withMessage("the short url must contains only 6 characters")], validate, authenticate, updateUrl);
router.delete("/delete/:shortUrl",[param("shortUrl").isLength({min: 6, max : 6}).withMessage("the short url must contains only 6 characters")], validate, authenticate, deleteUrl);

export default router;