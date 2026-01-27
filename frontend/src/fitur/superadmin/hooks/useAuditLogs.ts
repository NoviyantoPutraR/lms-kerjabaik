import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAuditLogs,
  createAuditLog,
  getRecentActivity,
  getActivitySummary,
} from "../api/auditLogsApi";
import type { AuditLogFilters, AuditLogInsert } from "../tipe/auditLog.types";

/**
 * Hook untuk get audit logs
 */
export function useAuditLogs(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
  });
}

/**
 * Hook untuk get recent activity
 */
export function useRecentActivity(limit: number = 100) {
  return useQuery({
    queryKey: ["recent-activity", limit],
    queryFn: () => getRecentActivity(limit),
    refetchInterval: 1000 * 30, // Auto-refetch every 30 seconds
  });
}

/**
 * Hook untuk get activity summary
 */
export function useActivitySummary(days: number = 30) {
  return useQuery({
    queryKey: ["activity-summary", days],
    queryFn: () => getActivitySummary(days),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook untuk create audit log
 */
export function useCreateAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuditLogInsert) => createAuditLog(data),
    onSuccess: () => {
      // Invalidate audit logs queries
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["activity-summary"] });
    },
  });
}
