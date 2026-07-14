import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FolderGit2, Lock, Globe, Star, CloudDownload, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { GitHubRepository } from "../types/github";
import { Button } from "@/components/ui/button";
import { useCloneRepository } from "../hooks/useGithub";

interface RepositoryCardProps {
  repository: GitHubRepository;
  index?: number;
}

export function RepositoryCard({ repository, index = 0 }: RepositoryCardProps) {
  const { mutate: cloneRepo, isPending } = useCloneRepository();
  const storageKey = `cloned_${repository.full_name}`;
  const [cloned, setCloned] = useState(() => !!localStorage.getItem(storageKey));

  const handleClone = () => {
    cloneRepo(repository.full_name, {
      onSuccess: () => {
        localStorage.setItem(storageKey, "1");
        setCloned(true);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <FolderGit2 className="h-4 w-4 text-primary" />
            <span className="truncate" title={repository.full_name}>{repository.name}</span>
          </div>
          {repository.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground" title={repository.description}>
              {repository.description}
            </p>
          )}
        </div>
        <div className="shrink-0 text-muted-foreground">
          {repository.is_private ? (
            <Lock className="h-4 w-4" aria-label="Private" />
          ) : (
            <Globe className="h-4 w-4" aria-label="Public" />
          )}
        </div>
      </div>

      <div className="mb-4 mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {repository.language && (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            {repository.language}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Star className="h-3 w-3" />
          {repository.stars}
        </div>
        {repository.updated_at && !isNaN(new Date(repository.updated_at).getTime()) && (
          <div>Updated {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}</div>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        {cloned ? (
          <Link
            to={`/repositories/${encodeURIComponent(repository.full_name)}`}
            className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View Repository
          </Link>
        ) : (
          <Button
            onClick={handleClone}
            disabled={isPending}
            className="w-full h-9"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cloning...
              </>
            ) : (
              <>
                <CloudDownload className="mr-2 h-4 w-4" />
                Clone
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
