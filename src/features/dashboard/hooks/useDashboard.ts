import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";
import type { DashboardOverviewResponse } from "../types/dashboard";

export function useDashboardOverview() {
  return useQuery<DashboardOverviewResponse, Error>({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardApi.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
