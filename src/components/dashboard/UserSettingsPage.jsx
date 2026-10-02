import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faLock,
  faCheck,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

export default function UserSettingsPage() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "ViewRoom Explorer",
    email: user?.email || "user@viewroom.com",
    bio: "360° Virtual Tour enthusiast and spatial real estate explorer.",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login) {
      login({ ...user, name: formData.name, email: formData.email });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* HEADER */}
      <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight flex items-center gap-2.5">
            <FontAwesomeIcon icon={faGear} className="text-base-content/70" />
            <span>User Settings & Account Profile</span>
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Manage your personal profile details and security credentials.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-extrabold flex items-center gap-2 animate-in fade-in">
            <FontAwesomeIcon icon={faCheck} />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PERSONAL PROFILE */}
        <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-base text-base-content flex items-center gap-2 border-b border-base-content/10 pb-3">
            <FontAwesomeIcon icon={faUser} className="text-base-content/60" />
            <span>Personal Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-base-content/70">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/70 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-base-content"
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/70 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-base-content"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-base-content/70">
              Spatial Bio / Introduction
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-base-200/70 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-base-content resize-none"
            />
          </div>
        </div>

        {/* 2. SECURITY & AUTHENTICATION */}
        <div className="p-6 rounded-[24px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
          <h3 className="font-extrabold text-base text-base-content flex items-center gap-2 border-b border-base-content/10 pb-3">
            <FontAwesomeIcon icon={faLock} className="text-base-content/60" />
            <span>Security & Authentication</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/60 border border-base-content/10 text-xs">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xl text-success" />
              <div>
                <p className="font-bold text-base-content">Two-Factor Security Active</p>
                <p className="text-[11px] text-base-content/60">Your account is secured with session token authentication.</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-success/20 text-success text-[10px] font-extrabold uppercase">
              Protected
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="!px-8 !py-3 !rounded-2xl">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
