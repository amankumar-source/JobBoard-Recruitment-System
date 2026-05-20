import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/read-all", isAuthenticated, markAllAsRead);
router.put("/:id/read", isAuthenticated, markAsRead);

export default router;
