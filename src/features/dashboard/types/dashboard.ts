export interface ActivityItem {
  id: string;
  type: "index" | "auth" | "chat" | "search";
  title: string;
  description: string;
  timestamp: string;
}

export interface RecentRepository {
  id: string;
  name: string;
  language: string;
  is_private: boolean;
  last_indexed: string | null;
}

export interface DashboardStats {
  repositories_count: number;
  files_indexed: number;
  total_embeddings: number;
  questions_asked: number;
}

export interface DashboardOverviewResponse {
  stats: DashboardStats;
  recent_repositories: RecentRepository[];
  recent_activity: ActivityItem[];
}
