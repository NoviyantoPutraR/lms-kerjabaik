import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubmissions,
  getSubmissionDetail,
  gradeSubmission,
  getGradeBook,
  exportGrades,
  getModuleAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentQuestions,
  saveAssessmentQuestions,
} from "../api/assessmentsApi";
import type {
  SubmissionFilters,
  GradeSubmissionData,
  CreateAssessmentData,
  UpdateAssessmentData,
  SaveQuestionData,
} from "../tipe/instructor.types";
import { toast } from "sonner";

/**
 * Hook untuk get assessments per modul
 */
export function useModuleAssessments(moduleId: string) {
  return useQuery({
    queryKey: ["module-assessments", moduleId],
    queryFn: () => getModuleAssessments(moduleId),
    enabled: !!moduleId,
  });
}

/**
 * Hook untuk create assessment
 */
export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kursusId, data, }: {
        kursusId: string;
        data: CreateAssessmentData;
      }) => createAssessment(kursusId, data),
    onSuccess: (_, variables) => {
      toast.success("Asesmen berhasil dibuat");
      queryClient.invalidateQueries({
        queryKey: ["module-assessments", variables.data.id_modul],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-content", variables.kursusId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat asesmen: ${error.message}`);
    },
  });
}

/**
 * Hook untuk update assessment
 */
export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId, data, }: {
        assessmentId: string;
        data: UpdateAssessmentData;
      }) => updateAssessment(assessmentId, data),
    onSuccess: (data) => {
      toast.success("Asesmen berhasil diupdate");
      queryClient.invalidateQueries({
        queryKey: ["module-assessments", data.id_modul],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-content", data.id_kursus],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengupdate asesmen: ${error.message}`);
    },
  });
}

/**
 * Hook untuk delete assessment
 */
export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
    }: {
      assessmentId: string;
      moduleId?: string;
      kursusId?: string;
    }) => deleteAssessment(assessmentId),
    onSuccess: (_, variables) => {
      toast.success("Asesmen berhasil dihapus");
      if (variables.moduleId) {
        queryClient.invalidateQueries({
          queryKey: ["module-assessments", variables.moduleId],
        });
      }
      if (variables.kursusId) {
        queryClient.invalidateQueries({
          queryKey: ["course-content", variables.kursusId],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus asesmen: ${error.message}`);
    },
  });
}

/**
 * Hook untuk get questions
 */
export function useAssessmentQuestions(assessmentId: string) {
  return useQuery({
    queryKey: ["assessment-questions", assessmentId],
    queryFn: () => getAssessmentQuestions(assessmentId),
    enabled: !!assessmentId,
  });
}

/**
 * Hook untuk save questions
 */
export function useSaveQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      questions,
    }: {
      assessmentId: string;
      questions: SaveQuestionData[];
    }) => saveAssessmentQuestions(assessmentId, questions),
    onSuccess: (_, variables) => {
      toast.success("Soal berhasil disimpan");
      queryClient.invalidateQueries({
        queryKey: ["assessment-questions", variables.assessmentId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menyimpan soal: ${error.message}`);
    },
  });
}

/**
 * Hook untuk get submissions
 */
export function useSubmissions(filters?: SubmissionFilters) {
  return useQuery({
    queryKey: ["instructor-submissions", filters],
    queryFn: () => getSubmissions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent for grading)
  });
}

/**
 * Hook untuk get submission detail
 */
export function useSubmissionDetail(submissionId: string) {
  return useQuery({
    queryKey: ["submission-detail", submissionId],
    queryFn: () => getSubmissionDetail(submissionId),
    enabled: !!submissionId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk grade submission
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      gradeData,
    }: {
      submissionId: string;
      gradeData: GradeSubmissionData;
    }) => gradeSubmission(submissionId, gradeData),
    onSuccess: (_, variables) => {
      toast.success("Submission berhasil dinilai");

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["instructor-submissions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["submission-detail", variables.submissionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["grade-book"],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-submissions"],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menilai submission: ${error.message}`);
    },
  });
}

/**
 * Hook untuk get grade book
 */
export function useGradeBook(kursusId: string) {
  return useQuery({
    queryKey: ["grade-book", kursusId],
    queryFn: () => getGradeBook(kursusId),
    enabled: !!kursusId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk export grades
 */
export function useExportGrades() {
  return useMutation({
    mutationFn: ({
      kursusId,
      format,
    }: {
      kursusId: string;
      format?: "csv" | "excel";
    }) => exportGrades(kursusId, format),
    onSuccess: (csvData, variables) => {
      // Create download link
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grades-${variables.kursusId}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Grades berhasil diexport");
    },
    onError: (error: Error) => {
      toast.error(`Gagal export grades: ${error.message}`);
    },
  });
}
