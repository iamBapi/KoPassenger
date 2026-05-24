import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { api, parseJson } from "../api/client.js";
import { toast } from "sonner";

const ThemeContext = createContext(null);

function readStoredTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    if (user?.theme === "dark" || user?.theme === "light") {
      setTheme(user.theme);
      localStorage.setItem("theme", user.theme);
    }
  }, [user?.theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setMode = async (mode) => {
    setTheme(mode);
    if (user) {
      const res = await api("/api/users/me/settings", {
        method: "PATCH",
        body: JSON.stringify({ theme: mode }),
      });
      if (res.ok) {
        await refreshUser();
        toast.success("Theme saved");
      } else {
        const body = await parseJson(res);
        toast.error(body?.error || "Could not save theme");
      }
    }
  };

  const value = useMemo(
    () => ({
      theme,
      setMode,
      isDark: theme === "dark",
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
