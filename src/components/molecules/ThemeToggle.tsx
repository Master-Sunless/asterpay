import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleToggle = () => {
    toggleTheme();
    toast({
      title: `Theme changed to ${theme === "dark" ? "light" : "dark"} mode`,
      duration: 2000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="w-9 px-0"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};