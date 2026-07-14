import { motion } from "framer-motion";
import { FolderGit2, ChevronRight, Zap, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Repo {
  name: string;
  language?: string | null;
}

interface RepositoryPickerProps {
  repositories: Repo[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (repoName: string) => void;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "bg-blue-500/20 text-blue-400",
  TypeScript: "bg-cyan-500/20 text-cyan-400",
  JavaScript: "bg-yellow-500/20 text-yellow-400",
  Go: "bg-teal-500/20 text-teal-400",
  Rust: "bg-orange-500/20 text-orange-400",
};

export function RepositoryPicker({
  repositories,
  isLoading,
  isError,
  onSelect,
}: RepositoryPickerProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">AI Code Chat</h2>
          <p className="text-sm text-muted-foreground">
            Select a repository to start chatting with your code using AI.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertCircle className="h-6 w-6 text-destructive/60" />
              <p className="text-sm text-muted-foreground">Could not load repositories.</p>
            </div>
          ) : repositories.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <FolderGit2 className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No indexed repositories found.</p>
              <p className="text-xs text-muted-foreground">
                Clone and index a repository first from the Repositories page.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {repositories.map((repo, i) => {
                const langColor = LANGUAGE_COLORS[repo.language ?? ""] ?? "bg-muted text-muted-foreground";
                return (
                  <motion.button
                    key={repo.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    onClick={() => onSelect(repo.name)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FolderGit2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{repo.name}</p>
                      {repo.language && (
                        <span className={cn("mt-0.5 inline-block rounded px-1.5 py-0.5 text-xs", langColor)}>
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
