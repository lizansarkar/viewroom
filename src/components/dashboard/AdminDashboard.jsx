import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faUsers,
  faBuilding,
  faSliders,
  faTrash,
  faCheckCircle,
  faUserCheck,
  faCrown,
  faServer,
  faRobot,
  faEye,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import AnalyticsDashboard from "./AnalyticsDashboard";
import {
  apiGetAdminStats,
  apiGetAdminUsers,
  apiUpdateUserRole,
  apiGetAdminContent,
  apiAdminDeleteTour,
} from "../../services/api";

export default function AdminDashboard({ user, onPreviewModeChange }) {
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
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 text-[var(--app-text-primary)]">
      
      {/* Top Banner & Admin Preview Mode Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-base-200 via-base-300 to-base-200 border border-[var(--app-border)]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 block mb-1">
              SYSTEM MANAGER CONTROL PANEL
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight">
              ADMINISTRATOR DASHBOARD
            </h2>
            <p className="text-xs text-[var(--app-text-secondary)] mt-1">
              Manage user roles, promote accounts, moderate platform 360° content, and inspect server infrastructure.
            </p>
          </div>
        </div>

        {/* Role Preview Switcher for Admin */}
        <div className="flex items-center gap-2 bg-base-100 p-2 rounded-2xl border border-[var(--app-border)]/30 shadow-sm self-stretch md:self-auto justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] px-2">
            PREVIEW DASHBOARD AS:
          </span>
          <button
            onClick={() => onPreviewModeChange("CREATOR")}
            className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Creator View
          </button>
          <button
            onClick={() => onPreviewModeChange("CLIENT")}
            className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Client View
          </button>
        </div>
      </div>

      {/* Admin Infrastructure Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
              Registered Users
            </span>
            <FontAwesomeIcon icon={faUsers} className="text-cyan-500 text-xs" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-black">{stats.totalUsers}</p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Active Database Users</span>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
              Platform 360 Tours
            </span>
            <FontAwesomeIcon icon={faBuilding} className="text-blue-500 text-xs" />
          </div>
          <p className="font-heading text-2xl sm:text-3xl font-black">{stats.totalTours}</p>
          <span className="text-[10px] text-[var(--app-text-secondary)] font-semibold mt-1 block">Global Published Tours</span>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
              Server & DB Engine
            </span>
            <FontAwesomeIcon icon={faServer} className="text-purple-500 text-xs" />
          </div>
          <p className="font-heading text-sm font-extrabold uppercase mt-1">{stats.databaseEngine}</p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">{stats.serverStatus}</span>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
              Gemini AI Engine
            </span>
            <FontAwesomeIcon icon={faRobot} className="text-amber-500 text-xs" />
          </div>
          <p className="font-heading text-sm font-extrabold uppercase mt-1">Google Gemini 1.5</p>
          <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">AI Concierge Operational</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--app-border)]/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "users"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          User Management & Roles
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "content"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Global Content Moderation
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "analytics"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          <FontAwesomeIcon icon={faSliders} className="mr-2" />
          Analytics & Telemetry
        </button>
      </div>

      {/* TAB 3: SPATIAL ANALYTICS DASHBOARD */}
      {activeTab === "analytics" && <AnalyticsDashboard />}

      {/* TAB 1: USER MANAGEMENT & ROLE PROMOTION TABLE */}
      {activeTab === "users" && (
        <div className="p-6 rounded-3xl bg-base-200/40 border border-[var(--app-border)]/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faUserCheck} className="text-cyan-500" />
              REGISTERED USERS & ROLE ASSIGNMENT ({usersList.length})
            </h3>
            <span className="text-xs text-[var(--app-text-secondary)] font-medium">
              Changes sync live to Neon PostgreSQL Database
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-base-300/50 uppercase text-[10px] font-extrabold text-[var(--app-text-secondary)] border-b border-[var(--app-border)]/30">
                <tr>
                  <th className="p-3">User Email & Name</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Role Action / Promotion</th>
                  <th className="p-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]/20">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="p-3 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center font-bold text-[11px]">
                          {u.name ? u.name[0] : u.email[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--app-text-primary)]">{u.email}</p>
                          <p className="text-[10px] text-[var(--app-text-secondary)]">{u.name || "User"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          u.role === "ADMIN"
                            ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                            : u.role === "CREATOR"
                            ? "bg-cyan-500/20 text-cyan-500 border border-cyan-500/30"
                            : "bg-base-300 text-[var(--app-text-secondary)]"
                        }`}
                      >
                        {u.role === "ADMIN" && <FontAwesomeIcon icon={faCrown} className="mr-1" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
                      >
                        <option value="CLIENT">CLIENT (Standard)</option>
                        <option value="CREATOR">CREATOR (Owner)</option>
                        <option value="ADMIN">ADMIN (System Manager)</option>
                      </select>
                    </td>
                    <td className="p-3 text-[var(--app-text-secondary)]">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL CONTENT MODERATION TABLE */}
      {activeTab === "content" && (
        <div className="p-6 rounded-3xl bg-base-200/40 border border-[var(--app-border)]/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
              GLOBAL PLATFORM CONTENT MODERATION
            </h3>
          </div>

          <div className="space-y-3">
            {toursList.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-base-100 border border-[var(--app-border)]/30 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-heading font-bold text-sm uppercase">{t.title}</h4>
                  <p className="text-xs text-[var(--app-text-secondary)]">
                    Author: {t.authorEmail || "admin@viewroom.com"} • Category: {t.category} • {t.viewsCount} Views
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTour(t.id)}
                    className="px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold uppercase transition-all flex items-center gap-1.5"
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
    </div>
  );
}
