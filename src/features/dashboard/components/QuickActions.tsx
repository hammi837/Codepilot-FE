import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GitBranch, FolderGit2, Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "Connect GitHub",
    description: "Link your account to import repositories",
    icon: GitBranch,
    to: "/settings?tab=integrations",
    variant: "default" as const,
  },
  {
    title: "Clone Repository",
    description: "Start indexing a new codebase",
    icon: FolderGit2,
    to: "/repositories/new",
    variant: "outline" as const,
  },
  {
    title: "Search Code",
    description: "Find snippets across all indexed repos",
    icon: Search,
    to: "/search",
    variant: "outline" as const,
  },
  {
    title: "Chat with AI",
    description: "Ask questions about your code",
    icon: MessageSquare,
    to: "/chat",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          >
            <Link
              to={action.to}
              className={cn(
                "inline-flex h-auto w-full flex-col items-start gap-2 rounded-lg border p-4 text-left shadow-sm transition-colors",
                action.variant === "default"
                  ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-border bg-background hover:bg-muted"
              )}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <span className="font-semibold">{action.title}</span>
              <span className="text-xs font-normal opacity-70">
                {action.description}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
