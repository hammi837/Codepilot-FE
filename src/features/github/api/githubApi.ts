import { api } from "@/services/api";
import type { GitHubProfile, GitHubRepository } from "../types/github";

export const githubApi = {
  /**
   * Fetches the OAuth authorization URL for GitHub.
   */
  getLoginUrl: async (): Promise<string> => {
    const response = await api.get<{ authorization_url: string }>("/github/login", {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.authorization_url;
  },

  /**
   * Fetches the connected GitHub profile.
   */
  getProfile: async (): Promise<GitHubProfile> => {
    const response = await api.get<GitHubProfile>("/github/profile");
    return response.data;
  },

  /**
   * Fetches all repositories for the connected GitHub account.
   */
  getRepositories: async (): Promise<GitHubRepository[]> => {
    const response = await api.get<GitHubRepository[]>("/github/repositories");
    return response.data;
  },

  /**
   * Initiates cloning for a repository.
   */
  cloneRepository: async (repositoryName: string): Promise<{ status: string; path: string }> => {
    const response = await api.post<{ status: string; path: string }>("/repositories/clone", {
      repository: repositoryName,
    });
    return response.data;
  },
};
