import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../reuseable/Button";
import Logo from "../reuseable/Logo";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  {
    label: "360° Services",
    dropdown: [
      { label: "360 Virtual Tour", to: "/360-virtual-tour" },
      { label: "360 Product", to: "/360-product" },
      { label: "360 Video", to: "/360-video" },
    ],
  },
  { label: "Matterport", to: "/matterport" },
  { label: "Photography", to: "/photography" },
  { label: "Contact", to: "/contact" },
];

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5" {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LayoutDashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" {...props}>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function TourIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ProductIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function VideoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <path d="m15 10 4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function MatterportIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function CameraIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function ExploreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ContactIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isRegistered, isLoggedIn, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  const getNavItemClass = (isActive) =>
    `text-[15px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-base-content hover:opacity-75 select-none ${
      isActive ? "opacity-100" : "opacity-90"
    }`;

  const visibleNavLinks = NAV_LINKS.filter(
    (link) => !link.authRequired || isLoggedIn
  );
  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-base-100/95 backdrop-blur-md border-b border-[var(--app-border)]/15">
        <nav className="w-full max-w-7xl mx-auto h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7 ml-12 mr-auto text-[15px] h-full">
            {visibleNavLinks.map((link) => {
              if (link.dropdown) {
                const isAnyChildActive = link.dropdown.some(
                  (sub) => location.pathname === sub.to
                );

                return (
                  <div key={link.label} className="relative group h-[72px] flex items-center">
                    <span
                      tabIndex={0}
                      role="button"
                      className={`relative h-full flex items-center gap-1.5 cursor-pointer text-[15px] transition-colors select-none ${
                        isAnyChildActive
                          ? "text-base-content font-extrabold"
                          : "text-base-content/75 hover:text-base-content font-bold"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDownIcon className={`transition-transform duration-200 ${isAnyChildActive ? "opacity-100" : "opacity-75"}`} />

                      {/* Active Underline Indicator for Dropdown Category */}
                      {isAnyChildActive && (
                        <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-base-content rounded-t-full shadow-xs animate-in fade-in zoom-in-95 duration-200" />
                      )}
                    </span>

                    <div className="absolute top-full left-0 pt-1 hidden group-hover:block transition-all duration-200 animate-fadeIn">
                      <div className="bg-base-100/95 backdrop-blur-md border border-[var(--app-border)]/20 shadow-2xl rounded-2xl p-2 w-56 flex flex-col gap-1 z-50">
                        {link.dropdown.map((sub) => {
                          const isSubActive = location.pathname === sub.to;
                          return (
                            <NavLink
                              key={sub.to}
                              to={sub.to}
                              className={`px-3.5 py-2.5 rounded-xl text-[14px] transition-all flex items-center justify-between ${
                                isSubActive
                                  ? "bg-base-content text-base-100 font-bold shadow-xs"
                                  : "text-base-content/80 hover:text-base-content hover:bg-base-200/80 font-medium"
                              }`}
                            >
                              <span>{sub.label}</span>
                              {isSubActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-base-100" />
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative h-[72px] flex items-center text-[15px] transition-colors cursor-pointer select-none ${
                      isActive
                        ? "text-base-content font-extrabold"
                        : "text-base-content/75 hover:text-base-content font-bold"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      {/* Active Underline Indicator */}
                      {isActive && (
                        <span className="absolute bottom-0 inset-x-0 h-[2.5px] bg-base-content rounded-t-full shadow-xs animate-in fade-in zoom-in-95 duration-200" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right side (desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              className="p-2.5 rounded-full text-base-content/80 hover:text-base-content hover:bg-base-200/80 active:bg-base-300 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
            >
              {theme === "light" ? <SunIcon /> : <MoonIcon />}
            </button>

            {isLoggedIn ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-expanded={profileOpen}
                  aria-label="Toggle user profile menu"
                  className="btn btn-ghost btn-circle avatar cursor-pointer hover:ring-2 hover:ring-base-content/40 transition-all focus:outline-none flex items-center justify-center p-0 border-0 bg-transparent"
                >
                  <div className="w-8 h-8 rounded-full ring-2 ring-base-content/30 ring-offset-base-100 ring-offset-2 overflow-hidden flex items-center justify-center bg-base-200 text-base-content font-black shadow-sm">
                    {user?.avatar || user?.image ? (
                      <img
                        src={user.avatar || user.image}
                        alt={user?.name || "User Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base uppercase font-black">
                        {(user?.name || "U").charAt(0)}
                      </span>
                    )}
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full shadow-2xl bg-base-100 border border-base-content/15 rounded-2xl w-64 p-3 mt-3 z-[100] flex flex-col gap-1 font-sans animate-fadeIn">
                    {/* User Profile Info Card Header */}
                    <div className="p-3 rounded-xl bg-base-200/80 border border-base-content/10 flex items-center gap-3 mb-1">
                      <div className="w-9 h-9 rounded-full bg-base-content text-base-100 font-bold flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                        {user?.avatar || user?.image ? (
                          <img
                            src={user.avatar || user.image}
                            alt={user?.name || "User Avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-black uppercase">
                            {(user?.name || "U").charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <span className="font-bold text-xs text-base-content truncate">
                          {user?.name || "User"}
                        </span>
                        <span className="text-[11px] text-base-content/60 truncate font-medium">
                          {user?.email || "user@viewroom.com"}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-base-content/10 my-1" />

                    {/* 1. Dashboard (Speedometer Gauge Icon matching reference image) */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="px-3.5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-base-content/90 hover:text-base-content hover:bg-base-200 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-base-content/80">
                        <path d="M12 14l3-3" />
                        <path d="M3.34 16A9 9 0 1 1 20.66 16" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>

                    {/* 2. Notifications (Exclamation Circle Icon matching reference image) */}
                    <Link
                      to="/dashboard?tab=notifications"
                      onClick={() => setProfileOpen(false)}
                      className="px-3.5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-base-content/90 hover:text-base-content hover:bg-base-200 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-base-content/80">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>Notifications</span>
                    </Link>

                    {/* 3. User Settings (User Gear Badge Icon matching reference image) */}
                    <Link
                      to="/dashboard?tab=settings"
                      onClick={() => setProfileOpen(false)}
                      className="px-3.5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-base-content/90 hover:text-base-content hover:bg-base-200 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-base-content/80">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                        <circle cx="18" cy="18" r="2" />
                        <path d="M18 15v1m0 4v1m-3-3h1m4 0h1" />
                      </svg>
                      <span>User Settings</span>
                    </Link>

                    <div className="h-px bg-base-content/10 my-1" />

                    {/* 4. Log Out (Power Button Circle Icon matching reference image) */}
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="px-3.5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-3 text-base-content/90 hover:text-error hover:bg-error/10 w-full text-left transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0 text-base-content/80">
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                        <line x1="12" y1="2" x2="12" y2="12" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isRegistered ? (
              <Link to="/sign-in">
                <Button variant="primary">Log in</Button>
              </Link>
            ) : (
              <Link to="/sign-up">
                <Button variant="primary">Register</Button>
              </Link>
            )}

            <Link to="/explore">
              <Button variant="secondary">Explore</Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              className="p-2 rounded-full text-base-content/80 hover:text-base-content hover:bg-base-200/80 focus:outline-none flex items-center justify-center cursor-pointer"
            >
              {theme === "light" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-xl text-base-content hover:bg-base-200/80 active:bg-base-300 transition-colors cursor-pointer"
            >
              <MenuIcon />
            </button>
          </div>
        </nav>
      </header>

      {/* Modern Top Slide-In Mobile Navigation Drawer with Apple-style Fluid Spring Transition */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Apple Style Top Slide-In Drawer Panel */}
        <div
          className={`fixed top-0 left-0 right-0 max-h-[88vh] w-full bg-base-100 border-b border-[var(--app-border)]/20 shadow-2xl flex flex-col justify-between overflow-y-auto z-[10000] rounded-b-3xl transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-full opacity-0 scale-[0.98]"
          }`}
        >
            
            {/* Top Section: Header & User Profile Card */}
            <div className="p-5 flex flex-col gap-6">
              {/* Drawer Top Header with Logo & Close Button */}
              <div className="flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-full bg-base-200 text-base-content/80 hover:text-base-content flex items-center justify-center transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* User Profile Card Header matching Reference Image */}
              <div className="p-3.5 rounded-2xl bg-base-200/60 border border-[var(--app-border)]/20 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content font-bold text-base flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {user?.avatar || user?.image ? (
                    <img
                      src={user.avatar || user.image}
                      alt={user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(user?.name || "V").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-base-content truncate">
                    {user?.name || "ViewRoom Guest"}
                  </span>
                  <Link
                    to={isLoggedIn ? "/dashboard" : "/sign-in"}
                    onClick={() => setMobileOpen(false)}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {isLoggedIn ? "View my Profile" : "Sign in to account"}
                  </Link>
                </div>
              </div>

              {/* Navigation List with Icons & Clean Alignment */}
              <nav className="flex flex-col gap-1.5 mt-1">
                <NavLink
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <HomeIcon />
                  <span>Home</span>
                </NavLink>

                {isLoggedIn && (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                        isActive
                          ? "bg-base-content text-base-100 font-bold shadow-xs"
                          : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                      }`
                    }
                  >
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </NavLink>
                )}

                <NavLink
                  to="/360-virtual-tour"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <TourIcon />
                  <span>360° Virtual Tour</span>
                </NavLink>

                <NavLink
                  to="/360-product"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <ProductIcon />
                  <span>360° Product</span>
                </NavLink>

                <NavLink
                  to="/360-video"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <VideoIcon />
                  <span>360° Video</span>
                </NavLink>

                <NavLink
                  to="/matterport"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <MatterportIcon />
                  <span>Matterport</span>
                </NavLink>

                <NavLink
                  to="/photography"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <CameraIcon />
                  <span>Photography</span>
                </NavLink>

                <NavLink
                  to="/explore"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <ExploreIcon />
                  <span>Explore Spaces</span>
                </NavLink>

                <NavLink
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3.5 transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold shadow-xs"
                        : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                    }`
                  }
                >
                  <ContactIcon />
                  <span>Contact Us</span>
                </NavLink>
              </nav>
            </div>

            {/* Bottom Section: Theme Toggle & Auth Buttons */}
            <div className="p-5 border-t border-[var(--app-border)]/15 flex flex-col gap-3.5 bg-base-200/30">
              {/* Theme Selector Button */}
              <button
                onClick={toggleTheme}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[var(--app-border)]/20 bg-base-100 text-xs font-semibold text-base-content/80 flex items-center justify-between hover:text-base-content transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === "light" ? <SunIcon /> : <MoonIcon />}
                  <span>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-base-200">
                  Switch
                </span>
              </button>

              {/* Login / Register / Logout Button */}
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-error/10 text-error font-bold text-xs flex items-center justify-center gap-2 hover:bg-error/20 transition-colors"
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              ) : isRegistered ? (
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-base-content text-base-100 font-bold text-xs text-center shadow-sm hover:opacity-90 transition-opacity"
                >
                  Log in
                </Link>
              ) : (
                <Link
                  to="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-base-content text-base-100 font-bold text-xs text-center shadow-sm hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              )}

              {/* Version Footer */}
              <p className="text-[10px] text-center text-base-content/40 font-medium">
                ViewRoom 360 Platform v1.0.0
              </p>
            </div>
          </div>
        </div>
    </>
  );
}

export default Navbar;
