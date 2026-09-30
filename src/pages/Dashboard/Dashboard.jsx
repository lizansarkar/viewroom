import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import CreatorDashboard from "../../components/dashboard/CreatorDashboard";
import ClientDashboard from "../../components/dashboard/ClientDashboard";
import VisitorDashboard from "../../components/dashboard/VisitorDashboard";
import Button from "../../components/reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEye, faCrown } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin Preview Override State
  const [adminPreviewRole, setAdminPreviewRole] = useState(null);

  // Determine effective role for rendering
  const effectiveRole = adminPreviewRole || (isLoggedIn ? user?.role || "CLIENT" : "VISITOR");

  const getDefaultTab = (role) => {
    switch (role) {
      case "ADMIN": return "admin_overview";
      case "CREATOR": return "creator_overview";
      case "CLIENT": return "client_overview";
      case "VISITOR": return "visitor_overview";
      default: return "creator_overview";
    }
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab(effectiveRole));

  // Sync default tab when effective role changes
  useEffect(() => {
    setActiveTab(getDefaultTab(effectiveRole));
  }, [effectiveRole]);

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 font-sans">
      
      {/* Main Bounded Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row items-start gap-6">
        
        {/* Left Sidebar Navigation with Dynamic Role Routes */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          user={user}
          role={effectiveRole}
          logout={logout}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col space-y-6">
          
          {/* Header Bar matching sidebar aesthetic */}
          <header className="p-4 sm:p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden p-2.5 rounded-2xl bg-base-200 text-base-content hover:bg-base-300 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-base-content">
                  {effectiveRole === "ADMIN" && "Administrator Dashboard"}
                  {effectiveRole === "CREATOR" && "Creator & Owner Dashboard"}
                  {effectiveRole === "CLIENT" && "Client Spatial Dashboard"}
                  {effectiveRole === "VISITOR" && "Visitor Discovery Hub"}
                </h1>

                {adminPreviewRole && (
                  <span className="px-3 py-1 rounded-full bg-base-200 text-base-content text-[11px] font-semibold border border-base-content/10 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faEye} />
                    Previewing: {adminPreviewRole}
                  </span>
                )}
              </div>
            </div>

            {/* Reset Preview Mode for Admin */}
            {adminPreviewRole && (
              <Button
                variant="secondary"
                onClick={() => setAdminPreviewRole(null)}
                className="!text-xs !px-3.5 !py-1.5 !rounded-xl"
              >
                <FontAwesomeIcon icon={faCrown} className="mr-1.5" />
                Reset to Admin View
              </Button>
            )}
          </header>

          {/* Dynamic Role-Based Content View & Sub-Routing */}
          <main className="w-full">
            {/* 1. ADMIN ROLE DASHBOARD */}
            {effectiveRole === "ADMIN" && (
              <AdminDashboard
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onPreviewModeChange={(roleToPreview) => setAdminPreviewRole(roleToPreview)}
              />
            )}

            {/* 2. CREATOR ROLE DASHBOARD */}
            {effectiveRole === "CREATOR" && (
              <CreatorDashboard
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* 3. CLIENT ROLE DASHBOARD */}
            {effectiveRole === "CLIENT" && (
              <ClientDashboard
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onUpgradeSuccess={() => login({ ...user, role: "CREATOR" })}
              />
            )}

            {/* 4. VISITOR GUEST VIEW */}
            {effectiveRole === "VISITOR" && (
              <VisitorDashboard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </main>

        </div>

      </div>
    </div>
  );
}
}
