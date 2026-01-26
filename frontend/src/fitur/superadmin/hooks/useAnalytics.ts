import { useQuery } from "@tanstack/react-query";
import {
  getPlatformOverview,
  getTenantAnalytics,
  getGrowthMetrics,
} from "../api/analyticsApi";
import type { AnalyticsFilters } from "../tipe/analytics.types";

/**
 * Hook untuk get platform overview
 */
export function usePlatformOverview() {
  return useQuery({
    queryKey: ["platform-overview"],
    queryFn: getPlatformOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
}

/**
 * Hook untuk get tenant analytics
 */
export function useTenantAnalytics(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: ["tenant-analytics", filters],
    queryFn: () => getTenantAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk get growth metrics
 */
export function useGrowthMetrics(period: "day" | "week" | "month" = "month") {
  return useQuery({
    queryKey: ["growth-metrics", period],
    queryFn: () => getGrowthMetrics(period),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
