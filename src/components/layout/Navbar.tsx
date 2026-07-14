import { Link } from "react-router-dom";
import { Moon, Sun, Monitor, LogOut, User, Settings, Code2, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };
  const next: Record<string, "light" | "dark" | "system"> = {
    light: "dark",
    dark: "system",
    system: "light",
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(next[theme])}
      title={`Theme: ${theme}`}
    >
      {icons[theme]}
    </Button>
  );
}

// Button-styled link using cn + buttonVariants manually
function NavLink({
  to,
  children,
  variant = "ghost",
  size = "sm",
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: "ghost" | "default" | "outline";
  size?: "sm" | "default";
  className?: string;
}) {
  const sizeClasses = size === "sm" ? "h-7 px-2.5 text-[0.8rem]" : "h-8 px-2.5";
  const variantClasses =
    variant === "ghost"
      ? "hover:bg-muted hover:text-foreground"
      : variant === "default"
      ? "bg-primary text-primary-foreground hover:bg-primary/80"
      : "border border-border bg-background hover:bg-muted";

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all",
        sizeClasses,
        variantClasses,
        className
      )}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <span className="hidden font-bold text-foreground sm:block">CodePilot AI</span>
        </Link>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <User className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" className="h-6" />
            <NavLink to="/login" variant="ghost">Sign in</NavLink>
            <NavLink to="/register" variant="default">Get started</NavLink>
          </div>
        )}
      </div>

    </header>
  );
}
