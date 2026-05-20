import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.id;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Error in getNotifications:", error);
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found.", success: false });
        }

        return res.status(200).json({
            message: "Notification marked as read.",
            success: true,
            notification
        });
    } catch (error) {
        console.error("Error in markAsRead:", error);
        console.error(error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.id;
        
        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            message: "All notifications marked as read.",
            success: true
        });
    } catch (error) {
        console.error("Error in markAllAsRead:", error);
        console.error("Mark all as read error:", error);
        return res.status(500).json({ message: "Server error.", success: false });
    }
};
