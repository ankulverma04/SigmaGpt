import Thread from "../models/Thread.js";
import { getGeminiResponse } from "../utils/genai.js";

export const createMessage = async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
      return res.status(400).json({
        error: "threadId and message are required",
      });
    }

    const thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    thread.message.push({
      role: "user",
      content: message,
    });

    const geminiResponse = await getGeminiResponse(message);

    thread.message.push({
      role: "assistant",
      content: geminiResponse,
    });

    if (!thread.title || thread.title === "New Chat" || thread.title === "Testing") {
      thread.title = message.slice(0, 40);
    }

    thread.updatedAt = Date.now();
    await thread.save();

    const savedMessages = thread.message.slice(-2);
    res.status(201).json(savedMessages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
