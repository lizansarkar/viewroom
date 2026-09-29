import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("overview");

  // Admin Preview Override State (Allows Admins to test Creator or Client dashboard views)
  const [adminPreviewRole, setAdminPreviewRole] = useState(null);

  // Determine effective role for rendering
  const effectiveRole = adminPreviewRole || (isLoggedIn ? user?.role || "CLIENT" : "VISITOR");

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 font-body">
      
      {/* Main Bounded Container - Bounded to max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 to align 100% with Navbar & Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Sidebar Navigation - Sticks below Navbar without overlapping */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          user={user}
          logout={logout}
        />

        {/* Main Content Area - Sits inside max-w-7xl right bounds */}
        <div className="flex-1 min-w-0 w-full flex flex-col space-y-6">
          
          {/* Header Bar */}
          <header className="p-4 sm:p-6 rounded-3xl bg-base-200/80 border border-base-content/15 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-base-200 text-base-content border border-base-content/15 cursor-pointer"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-base-content">
                  {effectiveRole === "ADMIN" && "ADMINISTRATOR DASHBOARD"}
                  {effectiveRole === "CREATOR" && "CREATOR & OWNER DASHBOARD"}
                  {effectiveRole === "CLIENT" && "CLIENT SPATIAL DASHBOARD"}
                  {effectiveRole === "VISITOR" && "VISITOR DISCOVERY HUB"}
                </h1>

                {adminPreviewRole && (
                  <span className="px-3 py-1 rounded-full bg-base-300 text-base-content text-[10px] font-extrabold uppercase border border-base-content/20 flex items-center gap-1">
                    <FontAwesomeIcon icon={faEye} />
                    Previewing as {adminPreviewRole}
                  </span>
                )}
              </div>
            </div>

            {/* Reset Preview Mode for Admin */}
            {adminPreviewRole && (
              <Button
                variant="secondary"
                onClick={() => setAdminPreviewRole(null)}
                className="!text-xs !px-3.5 !py-1.5"
              >
                <FontAwesomeIcon icon={faCrown} className="mr-1" />
                Reset to Admin View
              </Button>
            )}
          </header>

          {/* Dynamic Role-Based Content View */}
          <main className="w-full">
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
    </div>
  );
}
