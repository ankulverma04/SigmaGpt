import Thread from "../models/Thread.js";
import { v1 as uuidv1 } from "uuid";

export const createThread = async (req, res) => {
  try {
    const title = req.body?.title?.trim() || "New Chat";
    const thread = new Thread({
      threadId: uuidv1(),
      userId: req.user._id,
      title,
    });

    const response = await thread.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const readThreads = async (req, res) => {
  try {
    const threads = await Thread.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(threads);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const readSpecificThreads = async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, userId: req.user._id });
    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.status(200).json(thread.message);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const deleteThreads = async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThreads = await Thread.findOneAndDelete({
      threadId,
      userId: req.user._id,
    });
    if (!deletedThreads) {
      return res.status(404).json({
        error: "Thread not found ",
      });
    }
    res.status(200).json({ Success: "Thread is deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
