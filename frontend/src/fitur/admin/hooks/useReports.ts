import { useQuery } from "@tanstack/react-query";
import {
  getProgressReport,
  getAttendanceReport,
  getAssessmentReport,
  getEngagementReport,
  type ReportFilters,
} from "../api/reportsApi";

/**
 * Hook untuk laporan progress pembelajaran
 */
export function useProgressReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ["admin", "reports", "kemajuan_belajar", filters],
    queryFn: () => getProgressReport(filters),
  });
}

/**
 * Hook untuk laporan kehadiran
 */
export function useAttendanceReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ["admin", "reports", "attendance", filters],
    queryFn: () => getAttendanceReport(filters),
  });
}

/**
 * Hook untuk laporan penilaian
 */
export function useAssessmentReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ["admin", "reports", "assessment", filters],
    queryFn: () => getAssessmentReport(filters),
  });
}

/**
 * Hook untuk laporan keterlibatan
 */
export function useEngagementReport(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ["admin", "reports", "engagement", filters],
    queryFn: () => getEngagementReport(filters),
  });
}
