import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    // Add the current theme class
    root.classList.add(theme);
    
    // Store the preference
    localStorage.setItem("theme", theme);
    
    // Apply background color based on theme
    if (theme === "dark") {
      root.style.backgroundColor = "hsl(222.2 84% 4.9%)";
    } else {
      root.style.backgroundColor = "hsl(0 0% 100%)";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      toast({
        title: `Theme changed to ${newTheme} mode`,
        duration: 2000,
      });
      return newTheme;
    });
  };

  return { theme, toggleTheme };
};