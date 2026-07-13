import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FolderGit2, Lock, Globe, Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { RecentRepository } from "../types/dashboard";
import { Button } from "@/components/ui/button";

interface RecentRepositoriesProps {
  repositories: RecentRepository[];
}

export function RecentRepositories({ repositories }: RecentRepositoriesProps) {
  if (!repositories || repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border border-dashed bg-card/50 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FolderGit2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">No repositories yet</h3>
        <p className="mb-4 mt-2 max-w-sm text-sm text-muted-foreground">
          Connect your GitHub account or clone a repository manually to start indexing your code.
        </p>
        <Link
          to="/repositories/new"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Clone Repository
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Recent Repositories</h3>
        <Link 
          to="/repositories"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
        >
          View all <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repo, i) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <FolderGit2 className="h-4 w-4 text-primary" />
                <span className="truncate">{repo.name}</span>
              </div>
              <div className="shrink-0 text-muted-foreground">
                {repo.is_private ? (
                  <Lock className="h-4 w-4" aria-label="Private" />
                ) : (
                  <Globe className="h-4 w-4" aria-label="Public" />
                )}
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                {repo.language}
              </div>
              {repo.last_indexed && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(repo.last_indexed), { addSuffix: true })}
                </div>
              )}
            </div>

            <Link to={`/repositories/${repo.id}`} className="absolute inset-0 z-10" aria-label={`View ${repo.name}`}>
              <span className="sr-only">View repository</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
