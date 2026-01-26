import { useQuery } from "@tanstack/react-query";
import {
  getInstructorCourses,
  getInstructorCourseDetail,
  getCourseEnrollments,
} from "../api/instructorCoursesApi";
import type { CourseFilters } from "../tipe/instructor.types";

/**
 * Hook untuk get courses yang diajarkan instruktur
 */
export function useInstructorCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ["instructor-courses", filters],
    queryFn: () => getInstructorCourses(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk get course detail dengan enrollment stats
 */
export function useInstructorCourseDetail(kursusId: string) {
  return useQuery({
    queryKey: ["instructor-course-detail", kursusId],
    queryFn: () => getInstructorCourseDetail(kursusId),
    enabled: !!kursusId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk get enrollments untuk course
 */
export function useCourseEnrollments(kursusId: string) {
  return useQuery({
    queryKey: ["course-enrollments", kursusId],
    queryFn: () => getCourseEnrollments(kursusId),
    enabled: !!kursusId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
