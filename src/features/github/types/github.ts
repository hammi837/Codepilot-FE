export interface GitHubProfile {
  id: string;
  github_id: string;
  username: string;
  avatar_url: string;
  profile_url: string;
}

export interface GitHubRepository {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  is_private: boolean;
  stars: number;
  updated_at: string;
}
