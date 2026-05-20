import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, Calendar, Briefcase } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import { setNotifications, markAllNotificationsAsRead } from "@/redux/notificationSlice";
import { useNavigate } from "react-router-dom";

const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
};

const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
        case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />;
        case 'rejected': return <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />;
        case 'interview': return <Calendar className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />;
        default: return <Briefcase className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />;
    }
};

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications } = useSelector(store => store.notification);
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const res = await axios.get(NOTIFICATION_API_END_POINT, {
                    withCredentials: true
                });
                if (res.data.success) {
                    dispatch(setNotifications(res.data.notifications));
                }
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
    }, [user, dispatch]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleOpenChange = async (isOpen) => {
        setOpen(isOpen);
        if (isOpen && unreadCount > 0) {
            // Optimistically update UI
            dispatch(markAllNotificationsAsRead());
            try {
                // Update backend silently
                await axios.put(`${NOTIFICATION_API_END_POINT}/read-all`, {}, {
                    withCredentials: true
                });
            } catch (error) {
                console.error("Error marking all notifications as read", error);
            }
        }
    };

    const handleNotificationClick = (notification) => {
        setOpen(false);
        // Assuming most notifications are about job applications
        navigate("/profile");
    };

    if (!user) return null;

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="w-6 h-6 text-gray-700" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0 rounded-xl shadow-xl border border-gray-100 mt-2 z-50 overflow-hidden text-left" align="end">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
                            <Bell className="w-8 h-8 text-gray-300" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div 
                                key={notification._id} 
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                                    !notification.isRead ? "bg-blue-50/30" : ""
                                }`}
                            >
                                {getIconForType(notification.type)}
                                <div className="flex flex-col gap-1 w-full">
                                    <p className={`text-sm ${!notification.isRead ? "text-gray-900 font-medium" : "text-gray-700"}`}>
                                        {notification.message}
                                    </p>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {timeAgo(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
