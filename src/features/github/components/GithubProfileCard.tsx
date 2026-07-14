import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, GitBranch } from "lucide-react";
import type { GitHubProfile } from "../types/github";
import { githubApi } from "../api/githubApi";

interface GithubProfileCardProps {
  profile: GitHubProfile;
}

export function GithubProfileCard({ profile }: GithubProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col rounded-xl border border-border bg-card shadow-sm sm:flex-row sm:items-center sm:justify-between p-6"
    >
      <div className="flex items-center gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-muted">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {profile.username}
            </h3>
            <div className="flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Connected
            </div>
          </div>
          <p className="text-sm text-muted-foreground">GitHub ID: {profile.github_id}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
        <a
          href={profile.profile_url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Profile
        </a>
        <button
          onClick={async () => {
            try {
              const url = await githubApi.getLoginUrl();
              window.location.href = url;
            } catch (err) {
              console.error(err);
            }
          }}
          className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80 hover:text-foreground"
        >
          <GitBranch className="mr-2 h-4 w-4" />
          Switch Account
        </button>
      </div>
    </motion.div>
  );
}
