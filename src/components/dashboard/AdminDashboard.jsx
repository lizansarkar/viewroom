import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUsers,
  faBuilding,
  faSliders,
  faTrash,
  faUserCheck,
  faCrown,
  faServer,
  faRobot,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import AnalyticsDashboard from "./AnalyticsDashboard";
import {
  apiGetAdminStats,
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiGetAdminContent,
  apiAdminDeleteTour,
} from "../../services/api";

export default function AdminDashboard({ _user, activeTab, setActiveTab: parentSetActiveTab, onPreviewModeChange }) {
  const [stats, setStats] = useState({
    totalUsers: 3,
    totalTours: 2,
    totalViews: 2310,
    serverStatus: "Online (Healthy)",
    databaseEngine: "Neon PostgreSQL",
    geminiAiStatus: "Connected (Gemini 1.5 Flash)",
  });
  const [usersList, setUsersList] = useState([]);
  const [toursList, setToursList] = useState([]);
  const [currentTab, setCurrentTab] = useState(activeTab || "admin_overview");
  const [loading, setLoading] = useState(true);

  // Search states for tables
  const [userSearch, setUserSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [fetchedStats, fetchedUsers, fetchedContent] = await Promise.all([
        apiGetAdminStats(),
        apiGetAdminUsers(),
        apiGetAdminContent(),
      ]);

      if (fetchedStats) setStats(fetchedStats);
      if (fetchedUsers) setUsersList(fetchedUsers);
      if (fetchedContent) setToursList(fetchedContent);
    } catch (err) {
      console.warn("Error loading admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const res = await apiUpdateUserRole(userId, newRole);
    if (res.success) {
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour platform-wide?")) return;
    const res = await apiAdminDeleteTour(tourId);
    if (res.success) {
      setToursList((prev) => prev.filter((t) => t.id !== tourId));
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredTours = toursList.filter(
    (t) =>
      t.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(contentSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-base-content/60">
        <div className="w-10 h-10 rounded-full border-4 border-base-content/20 border-t-base-content animate-spin mb-3" />
        <span className="text-xs font-semibold tracking-wider uppercase">Loading Admin Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      {/* 1. ADMIN OVERVIEW ROUTE VIEW (admin_overview) */}
      {(currentTab === "admin_overview" || currentTab === "overview") && (
        <div className="space-y-6">
          {/* Top Banner & Admin Preview Mode Bar */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 block mb-1">
                  System Manager Control Panel
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                  Administrator Dashboard
                </h2>
                <p className="text-xs text-base-content/70 mt-1 max-w-xl">
                  Manage user roles, promote accounts, moderate platform 360° content, and inspect server infrastructure.
                </p>
              </div>
            </div>

            {/* Role Preview Switcher */}
            <div className="flex items-center gap-2 bg-base-200/60 p-2 rounded-2xl border border-base-content/10 shadow-xs self-stretch md:self-auto justify-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/60 px-2">
                Preview as:
              </span>
              <Button
                variant="secondary"
                onClick={() => onPreviewModeChange && onPreviewModeChange("CREATOR")}
                className="!text-xs !px-3 !py-1 !rounded-xl"
              >
                Creator View
              </Button>
              <Button
                variant="secondary"
                onClick={() => onPreviewModeChange && onPreviewModeChange("CLIENT")}
                className="!text-xs !px-3 !py-1 !rounded-xl"
              >
                Client View
              </Button>
            </div>
          </div>

          {/* Admin Infrastructure Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-base-content/60">
                  Registered Users
                </span>
                <FontAwesomeIcon icon={faUsers} className="text-base-content/60 text-xs" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalUsers}</p>
              <span className="text-[10px] text-base-content/50 font-medium mt-1 block">Active Database Users</span>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-base-content/60">
                  Platform 360 Tours
                </span>
                <FontAwesomeIcon icon={faBuilding} className="text-base-content/60 text-xs" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalTours}</p>
              <span className="text-[10px] text-base-content/50 font-medium mt-1 block">Global Published Tours</span>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-base-content/60">
                  Server & DB Engine
                </span>
                <FontAwesomeIcon icon={faServer} className="text-base-content/60 text-xs" />
              </div>
              <p className="text-sm font-bold text-base-content uppercase mt-1">{stats.databaseEngine}</p>
              <span className="text-[10px] text-base-content/50 font-medium mt-1 block">{stats.serverStatus}</span>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-base-content/60">
                  Gemini AI Engine
                </span>
                <FontAwesomeIcon icon={faRobot} className="text-base-content/60 text-xs" />
              </div>
              <p className="text-sm font-bold text-base-content uppercase mt-1">Google Gemini 1.5</p>
              <span className="text-[10px] text-base-content/50 font-medium mt-1 block">AI Concierge Operational</span>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserCheck} className="text-base-content/60" />
                  Recent Registered Users ({usersList.length})
                </h3>
                <button
                  onClick={() => parentSetActiveTab && parentSetActiveTab("users")}
                  className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  Manage Users →
                </button>
              </div>

              <div className="space-y-2.5">
                {usersList.slice(0, 3).map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-2xl bg-base-200/50 border border-base-content/10 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-base-200 text-base-content flex items-center justify-center font-bold text-[10px]">
                        {u.name ? u.name[0] : u.email[0]}
                      </div>
                      <div>
                        <p className="font-bold text-base-content">{u.email}</p>
                        <p className="text-[10px] text-base-content/60">{u.name || "User"}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-base-200 text-base-content border border-base-content/10">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                  Platform Tours Moderation ({toursList.length})
                </h3>
                <button
                  onClick={() => parentSetActiveTab && parentSetActiveTab("content_moderation")}
                  className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  Moderate Content →
                </button>
              </div>

              <div className="space-y-2.5">
                {toursList.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-base-200/50 border border-base-content/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-base-content">{t.title}</p>
                      <p className="text-[10px] text-base-content/60">{t.category} • {t.viewsCount || 0} views</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-success/15 text-success">
                      Published
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER MANAGEMENT ROUTE VIEW (users) */}
      {currentTab === "users" && (
        <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCheck} className="text-base-content/60" />
                User Management & Role Assignment ({usersList.length})
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Promote users, update roles, and manage permissions (Syncs to Neon DB)
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-base-200 uppercase text-[10px] font-semibold text-base-content/60 border-b border-base-content/10">
                <tr>
                  <th className="p-3.5">User Email & Name</th>
                  <th className="p-3.5">Current Role</th>
                  <th className="p-3.5">Role Action / Promotion</th>
                  <th className="p-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/10">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200/40 transition-colors">
                    <td className="p-3.5 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-base-200 text-base-content border border-base-content/10 flex items-center justify-center font-bold text-[11px]">
                          {u.name ? u.name[0] : u.email[0]}
                        </div>
                        <div>
                          <p className="font-bold text-base-content">{u.email}</p>
                          <p className="text-[10px] text-base-content/60">{u.name || "User"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "ADMIN"
                            ? "bg-base-content text-base-100"
                            : u.role === "CREATOR"
                            ? "bg-base-200 text-base-content border border-base-content/10"
                            : "bg-base-200/60 text-base-content/80 border border-base-content/10"
                        }`}
                      >
                        {u.role === "ADMIN" && <FontAwesomeIcon icon={faCrown} className="mr-1" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-base-100 border border-base-content/20 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                      >
                        <option value="CLIENT">CLIENT (Standard)</option>
                        <option value="CREATOR">CREATOR (Owner)</option>
                        <option value="ADMIN">ADMIN (System Manager)</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-base-content/60">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CONTENT MODERATION ROUTE VIEW (content_moderation) */}
      {(currentTab === "content_moderation" || currentTab === "content") && (
        <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                Global Platform Content Moderation
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Inspect, review, and moderate 360° virtual tours published on the platform
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search tours..."
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTours.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-base-content">{t.title}</h4>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Author: {t.authorEmail || "admin@viewroom.com"} • Category: {t.category} • {t.viewsCount || 0} Views
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTour(t.id)}
                    className="px-3.5 py-1.5 rounded-full bg-base-200 hover:bg-error hover:text-white text-base-content border border-base-content/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SYSTEM ANALYTICS ROUTE VIEW (analytics) */}
      {currentTab === "analytics" && <AnalyticsDashboard />}

      {/* 5. ADMIN SYSTEM SETTINGS ROUTE VIEW (settings) */}
      {currentTab === "settings" && (
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-base-content/60" />
              Platform System Settings & Infrastructure Config
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Manage global ViewRoom settings, Gemini AI model options, and Neon PostgreSQL database parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Platform Config */}
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-3">
                General Platform Configuration
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-base-content/70 mb-1">
                    Platform Title
                  </label>
                  <input
                    type="text"
                    defaultValue="ViewRoom 360° Virtual Property Platform"
                    className="w-full px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-base-content/70 mb-1">
                    Default User Role on Sign Up
                  </label>
                  <select
                    defaultValue="CLIENT"
                    className="w-full px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  >
                    <option value="CLIENT">CLIENT (Standard Explorer)</option>
                    <option value="CREATOR">CREATOR (Property Owner)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-bold text-base-content">System Maintenance Mode</p>
                    <p className="text-[10px] text-base-content/60">Restrict non-admin access during maintenance</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-sm" />
                </div>
              </div>
            </div>

            {/* AI & Database Engine Config */}
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-3">
                Spatial AI & Database Connectivity
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base-content">Google Gemini AI Engine</p>
                    <p className="text-[10px] text-base-content/60">Connected (Gemini 1.5 Flash)</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-success/15 text-success">
                    Active
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base-content">Neon PostgreSQL Database</p>
                    <p className="text-[10px] text-base-content/60">Status: Healthy (Serverless Pool)</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-success/15 text-success">
                    Online
                  </span>
                </div>
                <Button variant="primary" className="w-full !rounded-xl !text-xs !py-2.5">
                  Save Infrastructure Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADMIN HELP & DOCUMENTATION ROUTE VIEW (help) */}
      {currentTab === "help" && (
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldHalved} className="text-base-content/60" />
              Administrator Technical Guide & Documentation
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Reference guide for platform administration, user role privileges, and content moderation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                User Role Hierarchy & Rights
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>
                  <strong className="text-base-content">ADMIN:</strong> Full control over user accounts, role promotions, content deletion, and system telemetry.
                </p>
                <p>
                  <strong className="text-base-content">CREATOR:</strong> Can publish 360° virtual tours, add hotspots, upload 3D models, and track tour analytics.
                </p>
                <p>
                  <strong className="text-base-content">CLIENT:</strong> Can browse 360° spaces, bookmark favorite tours, use AI concierge, and request Creator status.
                </p>
                <p>
                  <strong className="text-base-content">VISITOR:</strong> Unauthenticated preview mode to explore public 360° spaces and featured content.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                Quick Administrative Actions
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• To promote a user to Creator or Admin, navigate to <strong>User Management</strong> tab and use the dropdown.</p>
                <p>• To inspect or remove questionable 360° tours, use the <strong>Content Moderation</strong> tab.</p>
                <p>• To preview how the platform looks for other roles, click <strong>"Creator View"</strong> or <strong>"Client View"</strong> in Admin Overview.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
