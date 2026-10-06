import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRegister, apiLogin } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Registered status (persisted in localStorage)
  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("viewroom-registered") === "true";
  });

  // Logged in status (persisted in localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("viewroom-logged-in") === "true";
  });

  // User details
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("viewroom-user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("viewroom-registered", isRegistered ? "true" : "false");
  }, [isRegistered]);

  useEffect(() => {
    localStorage.setItem("viewroom-logged-in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("viewroom-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("viewroom-user");
    }
  }, [user]);

  // Register user action
  const register = async ({ name, email, password, role }) => {
    const res = await apiRegister({ name, email, password, role });
    const userData = res.user || { name: name || "User", email, role: role || "CLIENT" };
    setUser(userData);
    setIsRegistered(true);
    setIsLoggedIn(true);
    if (res.token) {
      localStorage.setItem("viewroom-jwt", res.token);
      localStorage.setItem("viewroom_auth_token", res.token);
    }
    return res;
  };

  // Login user action
  const login = async ({ email, password }) => {
    const res = await apiLogin({ email, password });
    const userData = res.user || { name: email.split("@")[0], email, role: "CLIENT" };
    setUser(userData);
    setIsRegistered(true);
    setIsLoggedIn(true);
    if (res.token) {
      localStorage.setItem("viewroom-jwt", res.token);
      localStorage.setItem("viewroom_auth_token", res.token);
    }
    return res;
  };

  // Logout action
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("viewroom-logged-in");
    localStorage.removeItem("viewroom-jwt");
    localStorage.removeItem("viewroom_auth_token");
    localStorage.removeItem("viewroom-user");
  };

  // Switch role directly (for Recruiter Sandbox / Role switching)
  const switchRole = (newRole) => {
    const updatedUser = {
      id: user?.id || `usr-${newRole.toLowerCase()}-101`,
      name: user?.name || `Demo ${newRole.charAt(0) + newRole.slice(1).toLowerCase()}`,
      email: user?.email || `${newRole.toLowerCase()}@viewroom-demo.com`,
      role: newRole,
    };
    setUser(updatedUser);
    setIsLoggedIn(true);
    setIsRegistered(true);
    localStorage.setItem("viewroom-logged-in", "true");
    localStorage.setItem("viewroom-registered", "true");
    localStorage.setItem("viewroom-user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistered,
        isLoggedIn,
        user,
        register,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
