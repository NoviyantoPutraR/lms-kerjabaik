import { create } from 'zustand';
import type { Course, Material } from '../tipe';

/**
 * State untuk fitur pembelajar
 */
interface LearnerState {
    // Current course being studied
    currentCourse: Course | null;
    currentEnrollmentId: string | null;
    currentMaterial: Material | null;

    // Assessment state
    currentAssessmentId: string | null;
    currentAttemptId: string | null;

    // Filters untuk katalog kursus
    courseFilters: {
        search: string;
        kategori: string | null;
        tingkat: string | null;
        status: string | null;
    };

    // UI state
    isSidebarOpen: boolean;

    // Actions
    setCurrentCourse: (course: Course | null, enrollmentId: string | null) => void;
    setCurrentMaterial: (material: Material | null) => void;
    setCurrentAssessment: (assessmentId: string | null, attemptId: string | null) => void;
    setCourseFilters: (filters: Partial<LearnerState['courseFilters']>) => void;
    toggleSidebar: () => void;
    resetFilters: () => void;
}

/**
 * Zustand store untuk pembelajar
 */
export const useLearnerStore = create<LearnerState>((set) => ({
    // Initial state
    currentCourse: null,
    currentEnrollmentId: null,
    currentMaterial: null,
    currentAssessmentId: null,
    currentAttemptId: null,
    courseFilters: {
        search: '',
        kategori: null,
        tingkat: null,
        status: null,
    },
    isSidebarOpen: true,

    // Actions
    setCurrentCourse: (course, enrollmentId) =>
        set({ currentCourse: course, currentEnrollmentId: enrollmentId }),

    setCurrentMaterial: (material) =>
        set({ currentMaterial: material }),

    setCurrentAssessment: (assessmentId, attemptId) =>
        set({ currentAssessmentId: assessmentId, currentAttemptId: attemptId }),

    setCourseFilters: (filters) =>
        set((state) => ({
            courseFilters: { ...state.courseFilters, ...filters },
        })),

    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    resetFilters: () =>
        set({
            courseFilters: {
                search: '',
                kategori: null,
                tingkat: null,
                status: null,
            },
        }),
}));
