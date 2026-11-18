import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faLock,
  faCheck,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export default function UserSettingsPage() {
  const { user, updateProfileData } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "ViewRoom Explorer",
    email: user?.email || "user@viewroom.com",
    avatar: user?.avatar || "",
    bio: user?.bio || "360° Virtual Tour enthusiast and spatial real estate explorer.",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateProfileData) {
        await updateProfileData({
          name: formData.name,
          avatar: formData.avatar,
          bio: formData.bio,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isGoogleUser = user?.authProvider === "google" || !!user?.firebaseUid;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* HEADER */}
      <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight flex items-center gap-2.5">
            <FontAwesomeIcon icon={faGear} className="text-base-content/70" />
            <span>User Settings & Account Profile</span>
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Manage your personal profile details, avatar, and security credentials.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-sm bg-success/15 border border-success/30 text-success text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <FontAwesomeIcon icon={faCheck} />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PERSONAL PROFILE & AVATAR */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 space-y-5 shadow-xs">
          <h3 className="font-extrabold text-base text-base-content flex items-center gap-2 border-b border-base-content/10 pb-3">
            <FontAwesomeIcon icon={faUser} className="text-base-content/60" />
            <span>Personal Profile & Avatar</span>
          </h3>

          {/* Profile Picture Showcase */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-sm bg-base-200/50 border border-base-content/10">
            <div className="relative group shrink-0">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-base-content/20 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-base-content/10 border-2 border-base-content/20 flex items-center justify-center text-2xl font-black text-base-content shadow-md">
                  {(formData.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-base-content">{formData.name}</h4>
                <span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                  {user?.role || "CLIENT"}
                </span>
                {isGoogleUser && (
                  <span className="px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                    Google Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-base-content/60">{formData.email}</p>
              <p className="text-[11px] text-base-content/50">
                {isGoogleUser
                  ? "Profile image is automatically synced with your Google Account."
                  : "Standard email account avatar."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-base-content/70">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-sm bg-base-200/70 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-base-content"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-base-content/70">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2.5 rounded-sm bg-base-300/60 border border-base-content/15 text-xs font-semibold text-base-content/70 cursor-not-allowed"
                title="Email is managed via authentication provider"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-base-content/70">
              Spatial Bio / Creator Introduction
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-sm bg-base-200/70 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-base-content resize-none"
            />
          </div>
        </div>

        {/* 2. SECURITY & AUTHENTICATION */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-base text-base-content flex items-center gap-2 border-b border-base-content/10 pb-3">
            <FontAwesomeIcon icon={faLock} className="text-base-content/60" />
            <span>Security & Authentication</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-sm bg-base-200/60 border border-base-content/10 text-xs">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xl text-success" />
              <div>
                <p className="font-bold text-base-content">
                  {isGoogleUser ? "Google OAuth 2.0 Active" : "JWT Token Security Active"}
                </p>
                <p className="text-[11px] text-base-content/60">
                  {isGoogleUser
                    ? "Your session is secured via Firebase Google OAuth with Neon PostgreSQL sync."
                    : "Your account is secured with 7-day signed JWT session token."}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-sm bg-success/20 text-success text-[10px] font-extrabold uppercase">
              Protected
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isSaving} className="!px-8 !py-3 !rounded-sm">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <span>{isSaving ? "Saving..." : "Save Profile Settings"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
