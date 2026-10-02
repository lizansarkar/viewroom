import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCheckDouble,
  faCommentDots,
  faHeart,
  faBookmark,
  faUserPlus,
  faShareNodes,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: "Mark Webber",
      avatar: "https://i.pravatar.cc/100?img=12",
      action: "reacted to your recent 360° tour",
      target: "Skyline Innovation Campus 360°",
      timestamp: "1m ago",
      isUnread: true,
      type: "reaction",
      icon: faHeart,
      iconColor: "text-rose-500",
    },
    {
      id: 2,
      user: "Angela Gray",
      avatar: "https://i.pravatar.cc/100?img=32",
      action: "followed your creator profile",
      target: "",
      timestamp: "5m ago",
      isUnread: true,
      type: "follow",
      icon: faUserPlus,
      iconColor: "text-sky-500",
    },
    {
      id: 3,
      user: "Jacob Thompson",
      avatar: "https://i.pravatar.cc/100?img=13",
      action: "joined your spatial group room",
      target: "Penthouse Suite Tour",
      timestamp: "1 day ago",
      isUnread: true,
      type: "group",
      icon: faShareNodes,
      iconColor: "text-emerald-500",
    },
    {
      id: 4,
      user: "Rizky Hasanuda",
      avatar: "https://i.pravatar.cc/100?img=60",
      action: "sent you a private message",
      target: "",
      timestamp: "5 days ago",
      isUnread: false,
      type: "message",
      icon: faCommentDots,
      iconColor: "text-amber-500",
      message:
        "Hello, thanks for setting up the 360° Virtual Tour. I've been exploring for a few weeks now and I'm already having lots of fun and improving my spatial walkthroughs!",
    },
    {
      id: 5,
      user: "Kimberly Smita",
      avatar: "https://i.pravatar.cc/100?img=47",
      action: "commented on your product spin",
      target: "Ergonomic Spatial Chair X1",
      timestamp: "1 week ago",
      isUnread: false,
      type: "comment",
      icon: faCommentDots,
      iconColor: "text-purple-500",
      thumbnail: "/panoramas/panorama_aerial.jpg",
    },
    {
      id: 6,
      user: "Nathan Petersa",
      avatar: "https://i.pravatar.cc/100?img=53",
      action: "reacted to your spatial guide post",
      target: "5 end-game strategies to increase tour engagement",
      timestamp: "2 weeks ago",
      isUnread: false,
      type: "reaction",
      icon: faHeart,
      iconColor: "text-rose-500",
    },
    {
      id: 7,
      user: "Anna Kim",
      avatar: "https://i.pravatar.cc/100?img=25",
      action: "bookmarked your space",
      target: "Modern Furniture Showroom",
      timestamp: "2 weeks ago",
      isUnread: false,
      type: "bookmark",
      icon: faBookmark,
      iconColor: "text-amber-500",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.isUnread;
    if (filter === "messages") return n.type === "message";
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* HEADER MATCHING USER IMAGE */}
      <div className="flex items-center justify-between gap-4 p-5 rounded-[24px] bg-base-100 border border-base-content/10 shadow-xs">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-lg bg-base-content text-base-100 text-xs font-black shadow-xs">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold text-base-content/70 hover:text-base-content flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="text-xs" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-base-content text-base-100 shadow-xs"
              : "bg-base-200 text-base-content/70 hover:bg-base-300"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "unread"
              ? "bg-base-content text-base-100 shadow-xs"
              : "bg-base-200 text-base-content/70 hover:bg-base-300"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("messages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === "messages"
              ? "bg-base-content text-base-100 shadow-xs"
              : "bg-base-200 text-base-content/70 hover:bg-base-300"
          }`}
        >
          Messages
        </button>
      </div>

      {/* NOTIFICATIONS LIST MATCHING EXACT REFERENCE IMAGE */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-10 rounded-[24px] bg-base-100 border border-base-content/10 text-center space-y-2">
            <FontAwesomeIcon icon={faBell} className="text-3xl text-base-content/30" />
            <p className="text-sm font-bold text-base-content">No notifications found</p>
            <p className="text-xs text-base-content/60">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markSingleAsRead(n.id)}
              className={`p-4 sm:p-5 rounded-[22px] border transition-all duration-200 flex flex-col sm:flex-row items-start justify-between gap-4 cursor-pointer relative group ${
                n.isUnread
                  ? "bg-base-200/50 border-base-content/20 shadow-xs"
                  : "bg-base-100 border-base-content/10 hover:border-base-content/20"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* User Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={n.avatar}
                    alt={n.user}
                    className="w-10 h-10 rounded-full object-cover border border-base-content/10"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-base-100 border border-base-content/10 flex items-center justify-center text-[10px]">
                    <FontAwesomeIcon icon={n.icon} className={n.iconColor} />
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-base-content leading-snug">
                    <strong className="font-extrabold text-base-content">{n.user}</strong>{" "}
                    <span className="text-base-content/80">{n.action}</span>{" "}
                    {n.target && (
                      <strong className="font-extrabold text-base-content">{n.target}</strong>
                    )}
                    {n.isUnread && (
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500 ml-2" />
                    )}
                  </p>

                  <span className="text-[11px] font-semibold text-base-content/50 block">
                    {n.timestamp}
                  </span>

                  {/* Private Message Card Preview matching image */}
                  {n.message && (
                    <div className="mt-3 p-4 rounded-2xl bg-base-100 border border-base-content/15 text-xs text-base-content/80 leading-relaxed font-medium shadow-xs">
                      {n.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Right Thumbnail for Comment/Reaction */}
              {n.thumbnail && (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-base-content/10 self-center">
                  <img src={n.thumbnail} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Delete hover icon */}
              <button
                onClick={(e) => deleteNotification(n.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-error/10 hover:text-error text-base-content/40 transition-all text-xs cursor-pointer"
                title="Remove notification"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
