/**
 * Type definitions untuk fitur instruktur
 */

// ============================================================================
// Course Types
// ============================================================================

export interface InstructorCourse {
  id: string;
  judul: string;
  deskripsi: string | null;
  kategori: string | null;
  url_gambar_mini: string | null;
  status: "draft" | "published" | "archived";
  id_instruktur: string;
  id_lembaga: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  // Computed fields
  total_peserta?: number;
  completion_rate?: number;
  avg_score?: number;
  pending_submissions?: number;
}

export interface InstructorCourseDetail extends InstructorCourse {
  enrollment_stats: {
    total_enrolled: number;
    active_students: number;
    completed_students: number;
    completion_rate: number;
  };
  module_count: number;
  total_assignments: number;
}

export interface CourseFilters {
  search?: string;
  kategori?: string;
  status?: "draft" | "published" | "archived";
  page?: number;
  limit?: number;
}

export interface PaginatedCourses {
  data: InstructorCourse[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Assessment & Submission Types
// ============================================================================

export interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  id_kursus: string;
  kursus_judul: string;
  assignment_id: string;
  assignment_title: string;
  assignment_max_score?: number;
  submitted_at: string;
  status: "pending" | "graded" | "rejected" | "revision_requested";
  grade: number | null;
  feedback: string | null;
  url_berkas: string | null;
  text_content: string | null;
  id_lembaga: string;
}

export interface SubmissionDetail extends Submission {
  assignment_description: string;
  assignment_max_score: number;
  rubric?: AssessmentRubric[];
}

export interface AssessmentRubric {
  id: string;
  criteria: string;
  max_points: number;
  description: string;
}

export interface GradeSubmissionData {
  grade: number;
  feedback?: string;
  status: "graded" | "rejected" | "revision_requested";
}

export interface SubmissionFilters {
  id_kursus?: string;
  id_asesmen?: string;
  status?: "pending" | "graded" | "rejected" | "revision_requested";
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  student_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedSubmissions {
  data: Submission[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Grade Book Types
// ============================================================================

export interface GradeBookEntry {
  student_id: string;
  student_name: string;
  student_email: string;
  assignments: AssignmentGrade[];
  avg_score: number;
  total_submitted: number;
  total_assignments: number;
}

export interface AssignmentGrade {
  assignment_id: string;
  assignment_title: string;
  grade: number | null;
  max_score: number;
  submitted_at: string | null;
  status: "pending" | "graded" | "not_submitted";
}

export interface GradeBookData {
  id_kursus: string;
  kursus_judul: string;
  entries: GradeBookEntry[];
  summary: {
    total_students: number;
    avg_class_score: number;
    total_assignments: number;
    completion_rate: number;
  };
}

// ============================================================================
// Student Progress Types
// ============================================================================

export interface EnrolledStudent {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  enrollment_date: string;
  progress_percentage: number;
  completed_modules: number;
  total_modules: number;
  avg_score: number | null;
  last_activity: string | null;
  status: "active" | "inactive" | "completed";
}

export interface StudentProgressDetail {
  student_id: string;
  student_name: string;
  student_email: string;
  id_kursus: string;
  kursus_judul: string;
  enrollment_date: string;
  progress_percentage: number;
  module_progress: ModuleProgress[];
  grades: AssignmentGrade[];
  engagement: StudentEngagement;
}

export interface ModuleProgress {
  module_id: string;
  module_title: string;
  module_order: number;
  completed: boolean;
  completed_at: string | null;
  time_spent_minutes: number;
}

export interface StudentEngagement {
  total_login_count: number;
  last_login: string | null;
  total_time_spent_minutes: number;
  avg_session_duration_minutes: number;
  activity_log: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  activity_type: "login" | "module_view" | "assignment_submit" | "quiz_attempt";
  activity_description: string;
  timestamp: string;
}

export interface StudentFilters {
  search?: string;
  status?: "active" | "inactive" | "completed";
  progress_min?: number;
  progress_max?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedStudents {
  data: EnrolledStudent[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Course Analytics Types
// ============================================================================

export interface CourseAnalytics {
  id_kursus: string;
  kursus_judul: string;
  total_students: number;
  active_students: number;
  completed_students: number;
  completion_rate: number;
  avg_score: number;
  pending_submissions: number;
  module_completion: ModuleCompletion[];
  grade_distribution: GradeDistribution[];
  engagement_trend: EngagementTrend[];
}

export interface ModuleCompletion {
  module_id: string;
  module_title: string;
  total_students: number;
  completed_count: number;
  completion_rate: number;
  avg_time_spent_minutes: number;
}

export interface GradeDistribution {
  range: string; // e.g., "0-20", "21-40", etc.
  count: number;
  percentage: number;
  [key: string]: any; // Allow additional properties for chart compatibility
}

export interface EngagementTrend {
  date: string;
  active_users: number;
  total_logins: number;
  avg_session_duration_minutes: number;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface InstructorDashboardStats {
  total_courses: number;
  total_students: number;
  pending_submissions: number;
  avg_class_score: number;
}

export interface RecentActivity {
  id: string;
  type: "submission" | "completion" | "pendaftaran_kursus" | "comment";
  student_name: string;
  kursus_judul: string;
  description: string;
  timestamp: string;
}

export interface DashboardCourse {
  id: string;
  judul: string;
  url_gambar_mini: string | null;
  total_students: number;
  pending_submissions: number;
  completion_rate: number;
}

export interface PendingSubmission {
  id: string;
  student_name: string;
  kursus_judul: string;
  assignment_title: string;
  submitted_at: string;
  days_pending: number;
}
// ============================================================================
// Assessment Builder Types (Phase 4)
// ============================================================================

export type AssessmentType = "kuis" | "ujian" | "tugas";

export interface Assessment {
  id: string;
  id_kursus: string;
  id_modul: string | null;
  judul: string;
  deskripsi: string | null;
  tipe: AssessmentType;
  durasi_menit: number | null;
  nilai_kelulusan: number;
  jumlah_percobaan: number;
  acak_soal: boolean;
  tampilkan_jawaban: boolean;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export type QuestionType =
  | "pilihan_ganda"
  | "pilihan_ganda_multiple"
  | "benar_salah"
  | "isian_singkat"
  | "esai";

export interface Question {
  id: string;
  id_asesmen: string;
  pertanyaan: string;
  tipe: QuestionType;
  opsi: any | null; // JSON for options
  jawaban_benar: string | null;
  poin: number;
  penjelasan: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAssessmentData {
  id_modul?: string | null;
  judul: string;
  deskripsi?: string | null;
  tipe: AssessmentType;
  durasi_menit?: number | null;
  nilai_kelulusan?: number;
  jumlah_percobaan?: number;
  acak_soal?: boolean;
  tampilkan_jawaban?: boolean;
}

export interface UpdateAssessmentData {
  judul?: string;
  deskripsi?: string | null;
  durasi_menit?: number | null;
  nilai_kelulusan?: number;
  jumlah_percobaan?: number;
  acak_soal?: boolean;
  tampilkan_jawaban?: boolean;
  status?: "draft" | "published" | "archived";
}

export interface SaveQuestionData {
  id?: string; // Optional for creation, required for update
  pertanyaan: string;
  tipe: QuestionType;
  opsi?: any;
  jawaban_benar?: string;
  poin: number;
  penjelasan?: string;
  urutan: number;
}

// ============================================================================
// Zoom Session Types
// ============================================================================

export type ZoomSessionStatus = "draft" | "published" | "archived";

export interface ZoomSession {
  id: string;
  id_lembaga: string;
  id_kursus: string;
  judul: string;
  deskripsi: string | null;
  tautan_zoom: string;
  waktu_mulai: string;
  durasi_menit: number;
  recording_url: string | null;
  status: ZoomSessionStatus;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface CreateZoomSessionData {
  judul: string;
  deskripsi?: string | null;
  tautan_zoom: string;
  waktu_mulai: string;
  durasi_menit?: number;
}

export interface UpdateZoomSessionData {
  judul?: string;
  deskripsi?: string | null;
  tautan_zoom?: string;
  waktu_mulai?: string;
  durasi_menit?: number;
  status?: ZoomSessionStatus;
  recording_url?: string | null;
}
