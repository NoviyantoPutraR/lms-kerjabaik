import { useQuery } from "@tanstack/react-query";
import {
  getEnrolledStudents,
  getStudentProgress,
  getStudentEngagement,
  getCourseAnalytics,
} from "../api/studentProgressApi";
import type { StudentFilters } from "../tipe/instructor.types";

/**
 * Hook untuk get enrolled students
 */
export function useEnrolledStudents(
  kursusId: string,
  filters?: StudentFilters,
) {
  return useQuery({
    queryKey: ["enrolled-students", kursusId, filters],
    queryFn: () => getEnrolledStudents(kursusId, filters),
    enabled: !!kursusId,
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get student progress detail
 */
export function useStudentProgress(kursusId: string, studentId: string) {
  return useQuery({
    queryKey: ["student-progress", kursusId, studentId],
    queryFn: () => getStudentProgress(kursusId, studentId),
    enabled: !!kursusId && !!studentId,
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get student engagement
 */
export function useStudentEngagement(kursusId: string, studentId: string) {
  return useQuery({
    queryKey: ["student-engagement", kursusId, studentId],
    queryFn: () => getStudentEngagement(kursusId, studentId),
    enabled: !!kursusId && !!studentId,
    staleTime: 1000 * 10, // 10 seconds
  });
}

/**
 * Hook untuk get course analytics
 */
export function useCourseAnalytics(kursusId: string) {
  return useQuery({
    queryKey: ["course-analytics", kursusId],
    queryFn: () => getCourseAnalytics(kursusId),
    enabled: !!kursusId,
    staleTime: 1000 * 60, // 1 minute
  });
}
