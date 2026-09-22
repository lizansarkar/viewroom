import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "../reuseable/Button";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Dashboard", to: "/dashboard", authRequired: true },
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5.5 w-5.5"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-5.5 w-5.5"
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      {...props}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function LayoutDashboardIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isRegistered, isLoggedIn, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    `text-[15px] font-medium transition-colors ${
      isActive
        ? "text-base-content font-semibold"
        : "text-base-content/80 hover:text-base-content"
    }`;

  // Filter links: Dashboard only visible when logged in
  const visibleNavLinks = NAV_LINKS.filter(
    (link) => !link.authRequired || isLoggedIn
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-base-100/95 backdrop-blur-md border-b border-[var(--app-border)]/15">
      <nav className="w-full max-w-7xl mx-auto px-4 lg:px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-[28px] font-bold italic tracking-tight shrink-0"
          style={{ fontFamily: "'Brush Script MT', cursive" }}
        >
          Logo
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8 ml-12 mr-auto text-[15px]">
          {visibleNavLinks.map((link) => {
            if (link.dropdown) {
              const isAnyChildActive = link.dropdown.some(
                (sub) => location.pathname === sub.to
              );

              return (
                <div key={link.label} className="relative group py-4">
                  <button
                    className={`text-[15px] font-medium transition-colors flex items-center gap-1.5 ${
                      isAnyChildActive
                        ? "text-base-content font-semibold"
                        : "text-base-content/80 hover:text-base-content"
                    }`}
                  >
                    {link.label}
                    <ChevronDownIcon />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 pt-1 hidden group-hover:block transition-all duration-200 animate-fadeIn">
                    <div className="bg-base-100/95 backdrop-blur-md border border-[var(--app-border)]/20 shadow-2xl rounded-2xl p-2 w-52 flex flex-col gap-1 z-50">
                      {link.dropdown.map((sub) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          className={({ isActive }) =>
                            `px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                              isActive
                                ? "bg-primary/15 text-primary font-semibold"
                                : "text-base-content/80 hover:text-base-content hover:bg-base-200/70"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
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

          {/* Conditional User Profile Dropdown or Auth Button rendering */}
          {isLoggedIn ? (
            <div className="dropdown dropdown-end relative">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2 overflow-hidden flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-content font-bold shadow-md">
                  {user?.avatar || user?.image ? (
                    <img
                      src={user.avatar || user.image}
                      alt={user?.name || "User Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base uppercase">
                      {(user?.name || "U").charAt(0)}
                    </span>
                  )}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-2xl bg-base-100/95 backdrop-blur-md border border-[var(--app-border)]/20 rounded-2xl w-64 mt-3 z-50 gap-1.5"
              >
                {/* User info section */}
                <li className="px-2 py-2 border-b border-[var(--app-border)]/15 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content font-bold flex items-center justify-center shrink-0 overflow-hidden shadow">
                      {user?.avatar || user?.image ? (
                        <img
                          src={user.avatar || user.image}
                          alt={user?.name || "User Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm uppercase">
                          {(user?.name || "U").charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-base-content truncate">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-base-content/60 truncate">
                        {user?.email || "user@viewroom.com"}
                      </span>
                      {user?.role && (
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full w-max">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                </li>

                {/* Menu Options */}
                <li>
                  <Link
                    to="/dashboard"
                    className="py-2.5 font-medium flex items-center gap-2.5 rounded-xl text-base-content/90 hover:text-base-content hover:bg-base-200/70"
                  >
                    <LayoutDashboardIcon />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="py-2.5 font-medium flex items-center gap-2.5 rounded-xl text-error hover:bg-error/10 w-full text-left"
                  >
                    <LogoutIcon />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          ) : isRegistered ? (
            /* User is already registered -> prompt to Log in */
            <Link to="/sign-in">
              <Button variant="primary">Log in</Button>
            </Link>
          ) : (
            /* User is NOT registered -> prompt to Register */
            <Link to="/sign-up">
              <Button variant="primary">Register</Button>
            </Link>
          )}

          <Link to="/explore">
            <Button variant="secondary">Explore</Button>
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            className="p-2.5 rounded-full text-base-content/80 hover:text-base-content hover:bg-base-200/80 active:bg-base-300 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          >
            {theme === "light" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="btn btn-outline btn-circle btn-sm"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-base-100 shadow-xl flex flex-col px-6 pt-6 pb-8 overflow-y-auto justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span
                  className="text-2xl font-bold italic"
                  style={{ fontFamily: "'Brush Script MT', cursive" }}
                >
                  Logo
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="btn btn-outline btn-circle btn-sm"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {visibleNavLinks.map((link) => {
                  if (link.dropdown) {
                    return (
                      <div
                        key={link.label}
                        className="py-2 border-b border-[var(--app-border)]/10"
                      >
                        <button
                          onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                          className="w-full flex items-center justify-between py-1 text-base font-medium text-base-content/80"
                        >
                          <span>{link.label}</span>
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileDropdownOpen && (
                          <div className="pl-3 flex flex-col gap-1 mt-2 border-l-2 border-primary/30">
                            {link.dropdown.map((sub) => (
                              <NavLink
                                key={sub.to}
                                to={sub.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                  `py-2 px-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                      ? "text-primary font-semibold bg-primary/10"
                                      : "text-base-content/80 hover:text-base-content"
                                  }`
                                }
                              >
                                {sub.label}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `py-3 text-base font-medium border-b border-[var(--app-border)]/10 ${
                          isActive ? "text-base-content" : "text-base-content/80"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content font-bold text-base flex items-center justify-center shrink-0 overflow-hidden shadow">
                      {user?.avatar || user?.image ? (
                        <img
                          src={user.avatar || user.image}
                          alt={user?.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(user?.name || "U").charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-base-content truncate">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-base-content/60 truncate">
                        {user?.email || "user@viewroom.com"}
                      </span>
                      {user?.role && (
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full w-max">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="btn btn-error btn-sm w-full mt-1 flex items-center gap-2 justify-center"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              ) : isRegistered ? (
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline w-full"
                >
                  Log in
                </Link>
              ) : (
                <Link
                  to="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline w-full"
                >
                  Register
                </Link>
              )}

              <Link
                to="/explore"
                onClick={() => setMobileOpen(false)}
                className="btn btn-outline w-full bg-base-200 border-base-300"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
