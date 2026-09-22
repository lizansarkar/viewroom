import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import CreatorDashboard from "../../components/dashboard/CreatorDashboard";
import ClientDashboard from "../../components/dashboard/ClientDashboard";
import VisitorDashboard from "../../components/dashboard/VisitorDashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Admin Preview Override State (Allows Admins to test Creator or Client dashboard views)
  const [adminPreviewRole, setAdminPreviewRole] = useState(null);

  // Determine effective role for rendering
  const effectiveRole = adminPreviewRole || (isLoggedIn ? user?.role || "CLIENT" : "VISITOR");

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex transition-colors duration-250">
      
      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        logout={logout}
      />

      {/* Main Content Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Top Navbar */}
        <header className="px-6 py-4 bg-base-200/40 border-b border-[var(--app-border)]/20 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-base-200 text-[var(--app-text-primary)]"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-lg uppercase tracking-tight">
                {effectiveRole === "ADMIN" && "ADMINISTRATOR DASHBOARD"}
                {effectiveRole === "CREATOR" && "CREATOR & OWNER DASHBOARD"}
                {effectiveRole === "CLIENT" && "CLIENT SPATIAL DASHBOARD"}
                {effectiveRole === "VISITOR" && "VISITOR DISCOVERY HUB"}
              </h1>

              {adminPreviewRole && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase border border-amber-500/30 flex items-center gap-1">
                  <FontAwesomeIcon icon={faEye} />
                  Previewing as {adminPreviewRole}
                </span>
              )}
            </div>
          </div>

          {/* Reset Preview Mode for Admin */}
          {adminPreviewRole && (
            <button
              onClick={() => setAdminPreviewRole(null)}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:opacity-90"
            >
              <FontAwesomeIcon icon={faCrown} />
              Reset to Admin View
            </button>
          )}
        </header>

        {/* Dynamic Role-Based Body Content */}
        <main className="p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          
          {/* 1. ADMIN ROLE DASHBOARD */}
          {effectiveRole === "ADMIN" && (
            <AdminDashboard
              user={user}
              onPreviewModeChange={(roleToPreview) => setAdminPreviewRole(roleToPreview)}
            />
          )}

          {/* 2. CREATOR ROLE DASHBOARD */}
          {effectiveRole === "CREATOR" && <CreatorDashboard user={user} />}

          {/* 3. CLIENT ROLE DASHBOARD */}
          {effectiveRole === "CLIENT" && (
            <ClientDashboard
              user={user}
              onUpgradeSuccess={() => login({ ...user, role: "CREATOR" })}
            />
          )}

          {/* 4. VISITOR GUEST VIEW */}
          {effectiveRole === "VISITOR" && <VisitorDashboard />}
        </main>
      </div>
    </div>
  );
}
