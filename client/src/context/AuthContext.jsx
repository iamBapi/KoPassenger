import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, parseJson } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const res = await api("/api/users/me");
    if (!res.ok) {
      setUser(null);
      return null;
    }
    const data = await parseJson(res);
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api("/api/users/me");
      if (cancelled) return;
      if (res.ok) {
        const data = await parseJson(res);
        setUser(data.user);
      } else {
        const r2 = await api("/api/auth/refresh", { method: "POST" });
        if (r2.ok) {
          const res3 = await api("/api/users/me");
          if (res3.ok) {
            const data = await parseJson(res3);
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((u) => setUser(u), []);
  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      setUser,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
