import React, { createContext, useContext, useState, useEffect } from "react";

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
  const register = ({ name, email }) => {
    const userData = { name: name || "User", email };
    setUser(userData);
    setIsRegistered(true);
    setIsLoggedIn(true);
  };

  // Login user action
  const login = ({ email }) => {
    const userData = user || { name: email.split("@")[0], email };
    setUser(userData);
    setIsRegistered(true);
    setIsLoggedIn(true);
  };

  // Logout action
  const logout = () => {
    setIsLoggedIn(false);
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
