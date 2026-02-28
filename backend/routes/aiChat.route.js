import express from "express";
import isOptionalAuthenticated from "../middlewares/isOptionalAuthenticated.js";
import {
    sendMessage,
    getChatHistory,
    getSessionMessages,
} from "../controllers/aiChat.controller.js";

const router = express.Router();

// Option authentication allows guests to use AI Copilot, but won't load custom DB context
router.post("/message", isOptionalAuthenticated, sendMessage);
router.get("/history", isOptionalAuthenticated, getChatHistory);
router.get("/session/:id", isOptionalAuthenticated, getSessionMessages);

export default router;
