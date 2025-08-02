"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Theme,
  getInitialTheme,
  applyTheme,
  saveTheme,
} from "@/lib/theme-utils";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log(`Switching theme from ${theme} to ${newTheme}`); // Debug log

    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);

    // Force a small delay and reapply to ensure it takes effect
    setTimeout(() => {
      applyTheme(newTheme);
    }, 10);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
