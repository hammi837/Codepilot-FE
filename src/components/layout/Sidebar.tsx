import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderGit2, Search, MessageSquare, Settings, ChevronLeft, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/repositories", icon: FolderGit2, label: "Repositories" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { pathname } = useLocation();

  return (
    // base-ui TooltipProvider uses `delay` not `delayDuration`
    <TooltipProvider delay={200}>
      <motion.aside
        animate={{ width: sidebarOpen ? 220 : 60 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col border-r border-border bg-background overflow-hidden shrink-0"
      >
        {/* Logo area */}
        <div className="flex h-16 items-center border-b border-border px-3 gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                className="font-bold text-sm text-foreground whitespace-nowrap overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                CodePilot AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 p-2 pt-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = pathname === to || pathname.startsWith(to + "/");
            const linkEl = (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      className="whitespace-nowrap overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );

            if (!sidebarOpen) {
              return (
                <Tooltip key={to}>
                  {/* base-ui TooltipTrigger renders its own button — wrap the link inside it */}
                  <TooltipTrigger render={linkEl} />
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            }

            return linkEl;
          })}
        </nav>

        {/* Collapse button */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-full"
            onClick={toggleSidebar}
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
