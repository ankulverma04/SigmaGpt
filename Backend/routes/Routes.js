import express from "express";
import {
  createThread,
  readThreads,
  readSpecificThreads,
  deleteThreads,
} from "../controller/threadController.js";
import { createMessage } from "../controller/messageController.js";
import { signup, login, getMe } from "../controller/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/me", protect, getMe);

router.post("/create", protect, createThread);
router.get("/threads", protect, readThreads);
router.get("/threads/:threadId", protect, readSpecificThreads);
router.delete("/threads/:threadId", protect, deleteThreads);
router.post("/chat", protect, createMessage);

export default router;
