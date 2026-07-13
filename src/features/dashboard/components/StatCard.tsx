import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "primary" | "blue" | "green" | "purple";
  index?: number;
}

const colorVariants = {
  primary: "bg-primary/10 text-primary",
  blue: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
  green: "bg-green-500/10 text-green-500 dark:text-green-400",
  purple: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", colorVariants[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {trend && (
          <div
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-destructive"
            )}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}
          </div>
        )}
      </div>
    </motion.div>
  );
}
