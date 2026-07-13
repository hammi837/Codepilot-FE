import { api } from "@/services/api";
import type { DashboardOverviewResponse } from "../types/dashboard";

export const dashboardApi = {
  /**
   * GET /api/v1/dashboard/overview
   * Fetches aggregate user statistics, recent repositories, and recent activity.
   */
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    const response = await api.get<DashboardOverviewResponse>("/dashboard/overview");
    return response.data;
  },
};
