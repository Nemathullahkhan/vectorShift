import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "../lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? systemTheme || "light" : theme;

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
      className={cn(
        "inline-flex items-center justify-center rounded-full border p-2 text-sm font-medium transition-colors",
        "border-border bg-card text-foreground shadow-card hover:bg-surface",
      )}
      aria-label={
        activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {activeTheme === "dark" ? (
        <SunMedium className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
