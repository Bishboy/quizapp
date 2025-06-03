"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null until theme is determined client-side
    return (
      <div className="flex items-center space-x-2 h-10">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <div className="w-11 h-6 bg-muted rounded-full" /> {/* Placeholder for switch */}
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </div>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-colors ${isDark ? 'text-muted-foreground' : 'text-primary'}`} />
      <Switch
        id="theme-switcher"
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className={`h-[1.2rem] w-[1.2rem] transition-colors ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
}
