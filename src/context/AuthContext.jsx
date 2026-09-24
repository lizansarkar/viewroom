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
    }
    return res;
  };

  // Logout action
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("viewroom-logged-in");
    localStorage.removeItem("viewroom-jwt");
    localStorage.removeItem("viewroom-user");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
