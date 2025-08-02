"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const { theme, mounted } = useTheme();
  const [domClass, setDomClass] = useState("");
  const [localStorageTheme, setLocalStorageTheme] = useState("");

  useEffect(() => {
    if (mounted) {
      setDomClass(document.documentElement.className);
      setLocalStorageTheme(localStorage.getItem("theme") || "none");
    }
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0.4 right-0.44 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border text-sm">
      <div>Context Theme: {theme}</div>
      <div>DOM Classes: {domClass}</div>
      <div>LocalStorage: {localStorageTheme}</div>
      <div>Mounted: {mounted.toString()}</div>
    </div>
  );
}
