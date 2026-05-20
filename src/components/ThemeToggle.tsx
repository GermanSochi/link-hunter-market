"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-gray-100/50" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-800/80 transition-colors"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
