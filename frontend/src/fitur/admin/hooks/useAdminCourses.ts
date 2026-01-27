import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCourses,
  assignInstructor,
  updateCourseVisibility,
  getInstructors,
  getCourseDetail,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  type CreateCourseData,
} from "../api/coursesApi";
import type {
  AdminCourseFilters,
  CourseAssignment,
} from "../tipe/courses.types";
import { useAuthStore } from "@/fitur/autentikasi/stores/authStore";

/**
 * Hook untuk query courses dalam tenant admin
 */
export function useAdminCourses(filters?: AdminCourseFilters) {
  const { user: currentUser } = useAuthStore();

  return useQuery({
    queryKey: ["admin-courses", currentUser?.id_lembaga, filters],
    queryFn: () => getAdminCourses(filters),
    staleTime: 1000 * 10, // 10 seconds
    enabled: !!currentUser?.id_lembaga,
  });
}

/**
 * Hook untuk get course detail
 */
export function useCourseDetail(kursusId: string) {
  const { user: currentUser } = useAuthStore();

  return useQuery({
    queryKey: ["course-detail", kursusId, currentUser?.id_lembaga],
    queryFn: () => getCourseDetail(kursusId),
    staleTime: 1000 * 10, // 10 seconds
    enabled: !!kursusId && !!currentUser?.id_lembaga,
  });
}

/**
 * Hook untuk create course
 */
export function useCreateAdminCourse() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: CreateCourseData) => createAdminCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses", currentUser?.id_lembaga],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-stats"],
      });
    },
  });
}

/**
 * Hook untuk update course
 */
export function useUpdateAdminCourse() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      kursusId,
      data,
    }: {
      kursusId: string;
      data: Partial<CreateCourseData>;
    }) => updateAdminCourse(kursusId, data),
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses", currentUser?.id_lembaga],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-detail", _variables.kursusId, currentUser?.id_lembaga],
      });
    },
  });
}

/**
 * Hook untuk delete course
 */
export function useDeleteAdminCourse() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (kursusId: string) => deleteAdminCourse(kursusId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses", currentUser?.id_lembaga],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-stats"],
      });
    },
  });
}

/**
 * Hook untuk assign instructor
 */
export function useAssignInstructor() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: (assignment: CourseAssignment) => assignInstructor(assignment),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses", currentUser?.id_lembaga],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "course-detail",
          variables.id_kursus,
          currentUser?.id_lembaga,
        ],
      });
    },
  });
}

/**
 * Hook untuk update course visibility
 */
export function useUpdateCourseVisibility() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      kursusId,
      status,
    }: {
      kursusId: string;
      status: "draft" | "published" | "archived";
    }) => updateCourseVisibility(kursusId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-courses", currentUser?.id_lembaga],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-detail", variables.kursusId, currentUser?.id_lembaga],
      });
    },
  });
}

/**
 * Hook untuk get instructors
 */
export function useInstructors() {
  const { user: currentUser } = useAuthStore();

  return useQuery({
    queryKey: ["instructors", currentUser?.id_lembaga],
    queryFn: () => getInstructors(),
    staleTime: 1000 * 10, // 10 seconds
    enabled: !!currentUser?.id_lembaga,
  });
}
