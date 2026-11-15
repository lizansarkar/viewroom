import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRegister, apiLogin, apiGoogleAuth, apiUpdateProfile, apiGetProfile } from "../services/api";
import { signInWithGoogle, signOutFirebase, auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

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

  // User details with full profile (avatar, role, name, email, bio)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("viewroom-user");
    return saved ? JSON.parse(saved) : null;
  });

  // Loading state for initial session hydration
  const [authLoading, setAuthLoading] = useState(false);

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

  // Optional background verification of active token with backend
  useEffect(() => {
    const token = localStorage.getItem("viewroom-jwt");
    if (token && !user) {
      apiGetProfile().then((res) => {
        if (res && res.success && res.user) {
          setUser(res.user);
          setIsLoggedIn(true);
          setIsRegistered(true);
        }
      }).catch(() => {});
    }
  }, []);

  /**
   * Google OAuth Login / Register via Firebase + Backend PostgreSQL Sync
   */
  const loginWithGoogle = async ({ role = "CREATOR" } = {}) => {
    setAuthLoading(true);
    try {
      // 1. Trigger Firebase Google Popup
      const { email, displayName, photoURL, uid, idToken } = await signInWithGoogle();

      // 2. Synchronize with our Neon PostgreSQL database via Express API
      const res = await apiGoogleAuth({
        email,
        name: displayName,
        avatar: photoURL,
        firebaseUid: uid,
        role: role || "CREATOR",
        idToken,
      });

      const userData = res.user || {
        name: displayName || email.split("@")[0],
        email,
        avatar: photoURL,
        role: res.user?.role || role || "CREATOR",
        firebaseUid: uid,
        authProvider: "google",
      };

      setUser(userData);
      setIsRegistered(true);
      setIsLoggedIn(true);

      if (res.token) {
        localStorage.setItem("viewroom-jwt", res.token);
        localStorage.setItem("viewroom_auth_token", res.token);
      }

      return { success: true, user: userData, token: res.token };
    } catch (err) {
      console.error("Firebase Google Auth Error:", err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Traditional Email/Password Register
   */
  const register = async ({ name, email, password, role, avatar }) => {
    setAuthLoading(true);
    try {
      const res = await apiRegister({ name, email, password, role, avatar });
      const userData = res.user || {
        name: name || "User",
        email,
        role: role || "CLIENT",
        avatar: avatar || null,
        authProvider: "email",
      };

      setUser(userData);
      setIsRegistered(true);
      setIsLoggedIn(true);

      if (res.token) {
        localStorage.setItem("viewroom-jwt", res.token);
        localStorage.setItem("viewroom_auth_token", res.token);
      }
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Traditional Email/Password Login
   */
  const login = async ({ email, password }) => {
    setAuthLoading(true);
    try {
      const res = await apiLogin({ email, password });
      const userData = res.user || {
        name: email.split("@")[0],
        email,
        role: "CLIENT",
        authProvider: "email",
      };

      setUser(userData);
      setIsRegistered(true);
      setIsLoggedIn(true);

      if (res.token) {
        localStorage.setItem("viewroom-jwt", res.token);
        localStorage.setItem("viewroom_auth_token", res.token);
      }
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Update Profile Details (Name, Avatar, Bio)
   */
  const updateProfileData = async ({ name, avatar, bio }) => {
    try {
      const res = await apiUpdateProfile({ name, avatar, bio });
      if (res && res.success && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
        return res;
      }
      // Fallback local update
      setUser((prev) => ({
        ...prev,
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
      }));
      return { success: true };
    } catch (err) {
      console.error("Profile update error:", err);
      throw err;
    }
  };

  /**
   * Complete Logout (Clears Firebase Session, ViewRoom JWT, and User State)
   */
  const logout = async () => {
    try {
      await signOutFirebase();
    } catch (e) {
      // Ignore if not logged in to Firebase
    }
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("viewroom-logged-in");
    localStorage.removeItem("viewroom-jwt");
    localStorage.removeItem("viewroom_auth_token");
    localStorage.removeItem("viewroom-user");
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistered,
        isLoggedIn,
        user,
        authLoading,
        loginWithGoogle,
        register,
        login,
        logout,
        updateProfileData,
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
