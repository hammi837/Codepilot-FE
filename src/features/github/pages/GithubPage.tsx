import { motion } from "framer-motion";
import { useGithubProfile, useGithubRepositories } from "../hooks/useGithub";
import { ConnectGithubCard } from "../components/ConnectGithubCard";
import { GithubProfileCard } from "../components/GithubProfileCard";
import { RepositoryGrid } from "../components/RepositoryGrid";
import { RepositorySkeleton } from "../components/RepositorySkeleton";
import { AlertCircle, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function GithubPage() {
  const { 
    data: profile, 
    isLoading: isProfileLoading, 
    isError: isProfileError, 
    error: profileError,
    refetch: refetchProfile
  } = useGithubProfile();

  const {
    data: repositories,
    isLoading: isReposLoading,
    isError: isReposError,
    refetch: refetchRepos
  } = useGithubRepositories();

  // Handle "NOT_CONNECTED" explicitly
  if (profileError?.message === "NOT_CONNECTED") {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center p-4">
        <ConnectGithubCard />
      </div>
    );
  }

  // Handle generic error for profile
  if (isProfileError && profileError?.message !== "NOT_CONNECTED") {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Connection Error</h2>
        <p className="mb-6 max-w-md text-muted-foreground">
          Failed to load your GitHub profile. Please try again.
        </p>
        <Button onClick={() => refetchProfile()} variant="outline">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-8">
      {/* Profile Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">GitHub Integration</h2>
        {isProfileLoading ? (
          <Skeleton className="h-[114px] w-full rounded-xl" />
        ) : profile ? (
          <GithubProfileCard profile={profile} />
        ) : null}
      </section>

      {/* Repositories Section */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <FolderGit2 className="h-6 w-6 text-muted-foreground" />
          <h2 className="text-2xl font-bold tracking-tight">Your Repositories</h2>
        </div>
        
        {isReposLoading ? (
          <RepositorySkeleton />
        ) : isReposError ? (
          <div className="rounded-xl border border-border border-dashed p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
            <p className="mb-4 text-muted-foreground">Failed to load repositories.</p>
            <Button onClick={() => refetchRepos()} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        ) : repositories ? (
          <RepositoryGrid repositories={repositories} />
        ) : null}
      </section>
    </div>
  );
}
