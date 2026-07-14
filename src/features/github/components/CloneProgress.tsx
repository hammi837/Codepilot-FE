import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloneProgressProps {
  status: "queued" | "cloning" | "chunking" | "indexing" | "completed" | "failed";
  progress?: number;
  message?: string;
}

const statusConfig = {
  queued: { label: "Queued for processing", color: "text-muted-foreground", bg: "bg-muted", icon: Loader2, spin: false },
  cloning: { label: "Cloning repository...", color: "text-blue-500", bg: "bg-blue-500", icon: Loader2, spin: true },
  chunking: { label: "Chunking files...", color: "text-indigo-500", bg: "bg-indigo-500", icon: Loader2, spin: true },
  indexing: { label: "Generating embeddings...", color: "text-purple-500", bg: "bg-purple-500", icon: Loader2, spin: true },
  completed: { label: "Analysis complete", color: "text-green-500", bg: "bg-green-500", icon: CheckCircle2, spin: false },
  failed: { label: "Processing failed", color: "text-destructive", bg: "bg-destructive", icon: XCircle, spin: false },
};

export function CloneProgress({ status, progress = 0, message }: CloneProgressProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-5 w-5", config.color, config.spin && "animate-spin")} />
          <h3 className="font-semibold">{config.label}</h3>
        </div>
        {progress > 0 && progress < 100 && (
          <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
        )}
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className={cn("h-full transition-all", config.bg)}
        />
      </div>

      {message && (
        <p className="text-xs text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}
