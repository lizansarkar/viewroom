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
          
          {/* Mobile Menu Trigger & Admin Preview Reset Bar */}
          <div className="flex items-center justify-between lg:hidden mb-2">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2.5 rounded-2xl bg-base-100 border border-base-content/10 text-base-content hover:bg-base-200 transition-colors cursor-pointer shadow-xs flex items-center gap-2 text-xs font-semibold"
            >
              <FontAwesomeIcon icon={faBars} />
              <span>Menu</span>
            </button>

            {adminPreviewRole && (
              <Button
                variant="secondary"
                onClick={() => setAdminPreviewRole(null)}
                className="!text-xs !px-3.5 !py-1.5 !rounded-xl"
              >
                <FontAwesomeIcon icon={faCrown} className="mr-1.5" />
                Reset Admin View
              </Button>
            )}
          </div>

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
