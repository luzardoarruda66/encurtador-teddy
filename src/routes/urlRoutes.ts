import express from "express";
import {
  deleteUrl,
  listUserUrls,
  shortenUrl,
  updateUrl,
} from "../controllers/urlController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/list", authenticate, listUserUrls);
router.post("/shorten", authenticate, shortenUrl);
router.put("/update/:shortUrl", authenticate, updateUrl);
router.delete("/delete/:shortUrl", authenticate, deleteUrl);

export default router;
