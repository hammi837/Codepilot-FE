import { motion } from "framer-motion";
import { Server, Database, Code2, Search, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "../types/dashboard";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "index":
      return <Database className="h-4 w-4 text-blue-500" />;
    case "auth":
      return <User className="h-4 w-4 text-green-500" />;
    case "chat":
      return <Code2 className="h-4 w-4 text-purple-500" />;
    case "search":
      return <Search className="h-4 w-4 text-orange-500" />;
    default:
      return <Server className="h-4 w-4 text-muted-foreground" />;
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
        No recent activity to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
      </div>
      <div className="p-5">
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-border">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
              className="relative flex gap-4"
            >
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background ring-4 ring-card">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex flex-col pt-0.5">
                <span className="text-sm font-medium text-foreground">
                  {activity.title}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {activity.description}
                </span>
                <span className="mt-2 text-xs font-medium text-muted-foreground/60">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
