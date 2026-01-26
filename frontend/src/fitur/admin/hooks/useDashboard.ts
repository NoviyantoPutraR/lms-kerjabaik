import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, DashboardStats } from "../api/dashboardApi";

/**
 * Hook to fetch admin dashboard statistics
 */
export function useDashboardStats() {
  return useQuery<DashboardStats, Error>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
