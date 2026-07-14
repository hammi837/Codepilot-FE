import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { githubApi } from "../api/githubApi";
import type { GitHubProfile, GitHubRepository } from "../types/github";
import { isAxiosError } from "axios";

export function useGithubProfile() {
  return useQuery<GitHubProfile, Error>({
    queryKey: ["github", "profile"],
    queryFn: async () => {
      try {
        return await githubApi.getProfile();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          // 404 means not connected, we don't want to show an error boundary for this
          throw new Error("NOT_CONNECTED");
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error.message === "NOT_CONNECTED") return false;
      return failureCount < 2;
    },
  });
}

export function useGithubRepositories() {
  return useQuery<GitHubRepository[], Error>({
    queryKey: ["github", "repositories"],
    queryFn: githubApi.getRepositories,
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useCloneRepository() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: githubApi.cloneRepository,
    onSuccess: () => {
      // Invalidate dashboard or repo list if needed
      queryClient.invalidateQueries({ queryKey: ["github", "repositories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
    },
  });
}
