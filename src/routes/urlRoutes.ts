import express from "express";
import {
  deleteUrl,
  listUserUrls,
  shortenUrl,
  updateUrl,
} from "../controllers/urlController";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";

const router = express.Router();

router.get("/list", validate, authenticate, listUserUrls);
router.post("/shorten", validate, authenticate, shortenUrl);
router.put("/update/:shortUrl", validate, authenticate, updateUrl);
router.delete("/delete/:shortUrl", validate, authenticate, deleteUrl);

export default router;
