// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { authAPI, setAuthToken } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isSignedIn }         = useAuth();

  const [dbUser, setDbUser]   = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError]     = useState(null);

  // Sync Clerk user to MongoDB on sign-in
  useEffect(() => {
    const syncUser = async () => {
      if (!isUserLoaded || !isSignedIn || !user) return;

      try {
        setSyncing(true);
        setError(null);

        // Get fresh Clerk JWT
        const token = await getToken();
        setAuthToken(token);

        // Sync to MongoDB
        const response = await authAPI.sync({
          clerkId: user.id,
          name:    user.fullName || user.firstName || "User",
          email:   user.primaryEmailAddress?.emailAddress,
        });

        setDbUser(response.data);
      } catch (err) {
        console.error("User sync failed:", err.message);
        setError(err.message);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [isUserLoaded, isSignedIn, user]);

  // Clear token and dbUser on sign-out
  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      setAuthToken(null);
      setDbUser(null);
    }
  }, [isUserLoaded, isSignedIn]);

  // Refresh token before it expires (every 50 seconds)
  useEffect(() => {
    if (!isSignedIn) return;

    const interval = setInterval(async () => {
      const token = await getToken();
      setAuthToken(token);
    }, 50 * 1000);

    return () => clearInterval(interval);
  }, [isSignedIn, getToken]);

  return (
    <AuthContext.Provider
      value={{
        dbUser,
        syncing,
        error,
        isReady: isUserLoaded && !syncing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};