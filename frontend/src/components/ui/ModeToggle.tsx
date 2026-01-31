import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import styles from "./ModeToggle.module.css";

export function ModeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id="mode-toggle"
        className={styles.checkbox}
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle Dark Mode"
      />
      <label htmlFor="mode-toggle" className={styles.label}>
        Night
      </label>
    </div>
  );
}
