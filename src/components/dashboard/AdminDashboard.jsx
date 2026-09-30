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

export default function AdminDashboard({ user, activeTab, setActiveTab: parentSetActiveTab, onPreviewModeChange }) {
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

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      
      {/* Top Banner & Admin Preview Mode Bar matching sidebar style */}
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
            onClick={() => onPreviewModeChange("CREATOR")}
            className="!text-xs !px-3 !py-1 !rounded-xl"
          >
            Creator View
          </Button>
          <Button
            variant="secondary"
            onClick={() => onPreviewModeChange("CLIENT")}
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

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-base-content/10 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            setCurrentTab("admin_overview");
            if (parentSetActiveTab) parentSetActiveTab("admin_overview");
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            currentTab === "admin_overview"
              ? "bg-base-200 text-base-content font-bold shadow-xs"
              : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
          }`}
        >
          <FontAwesomeIcon icon={faShieldHalved} className="mr-2" />
          Admin Overview
        </button>
        <button
          onClick={() => {
            setCurrentTab("users");
            if (parentSetActiveTab) parentSetActiveTab("users");
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            currentTab === "users"
              ? "bg-base-200 text-base-content font-bold shadow-xs"
              : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
          }`}
        >
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          User Management & Roles
        </button>
        <button
          onClick={() => {
            setCurrentTab("content_moderation");
            if (parentSetActiveTab) parentSetActiveTab("content_moderation");
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            currentTab === "content_moderation" || currentTab === "content"
              ? "bg-base-200 text-base-content font-bold shadow-xs"
              : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
          }`}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Global Content Moderation
        </button>
        <button
          onClick={() => {
            setCurrentTab("analytics");
            if (parentSetActiveTab) parentSetActiveTab("analytics");
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            currentTab === "analytics"
              ? "bg-base-200 text-base-content font-bold shadow-xs"
              : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
          }`}
        >
          <FontAwesomeIcon icon={faSliders} className="mr-2" />
          Analytics & Telemetry
        </button>
      </div>

      {/* TAB 3: SPATIAL ANALYTICS DASHBOARD */}
      {currentTab === "analytics" && <AnalyticsDashboard />}

      {/* TAB 1: USER MANAGEMENT & ROLE PROMOTION TABLE */}
      {(currentTab === "users" || currentTab === "admin_overview") && (
        <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faUserCheck} className="text-base-content/60" />
              Registered Users & Role Assignment ({usersList.length})
            </h3>
            <span className="text-xs text-base-content/50 font-medium">
              Syncs live to Neon PostgreSQL Database
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-base-200 uppercase text-[10px] font-semibold text-base-content/60 border-b border-base-content/10">
                <tr>
                  <th className="p-3">User Email & Name</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Role Action / Promotion</th>
                  <th className="p-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/10">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="p-3 font-semibold">
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
                    <td className="p-3">
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
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-base-100 border border-base-content/20 text-xs font-semibold text-base-content focus:outline-none"
                      >
                        <option value="CLIENT">CLIENT (Standard)</option>
                        <option value="CREATOR">CREATOR (Owner)</option>
                        <option value="ADMIN">ADMIN (System Manager)</option>
                      </select>
                    </td>
                    <td className="p-3 text-base-content/60">
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
      {(currentTab === "content_moderation" || currentTab === "content" || currentTab === "admin_overview") && (
        <div className="p-6 rounded-3xl bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
              Global Platform Content Moderation
            </h3>
          </div>

          <div className="space-y-3">
            {toursList.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-base-200/50 border border-base-content/10 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-base-content">{t.title}</h4>
                  <p className="text-xs text-base-content/60">
                    Author: {t.authorEmail || "admin@viewroom.com"} • Category: {t.category} • {t.viewsCount} Views
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
    </div>
  );
}
