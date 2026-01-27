import { useQuery } from "@tanstack/react-query";
import {
  getInstructorDashboardStats,
  getRecentActivities,
  getDashboardCourses,
  getPendingSubmissions,
} from "../api/dashboardApi";

/**
 * Hook untuk get dashboard statistics
 */
export function useInstructorDashboardStats() {
  return useQuery({
    queryKey: ["instructor-dashboard-stats"],
    queryFn: () => getInstructorDashboardStats(),
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get recent activities
 */
export function useRecentActivities(limit?: number) {
  return useQuery({
    queryKey: ["recent-activities", limit],
    queryFn: () => getRecentActivities(limit),
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get dashboard courses
 */
export function useDashboardCourses(limit?: number) {
  return useQuery({
    queryKey: ["dashboard-courses", limit],
    queryFn: () => getDashboardCourses(limit),
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get pending submissions
 */
export function usePendingSubmissions(limit?: number) {
  return useQuery({
    queryKey: ["pending-submissions", limit],
    queryFn: () => getPendingSubmissions(limit),
    staleTime: 1000 * 10, // 10 seconds
  });
}
