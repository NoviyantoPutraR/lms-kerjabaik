import { supabase } from "@/pustaka/supabase";
import type {
  Submission,
  SubmissionDetail,
  SubmissionFilters,
  PaginatedSubmissions,
  GradeSubmissionData,
  GradeBookData,
  GradeBookEntry,
  AssignmentGrade,
  Assessment,
  Question,
  CreateAssessmentData,
  UpdateAssessmentData,
  SaveQuestionData,
} from "../tipe/instructor.types";

/**
 * Get submissions for instructor's courses
 */
export async function getSubmissions(
  filters?: SubmissionFilters,
): Promise<PaginatedSubmissions> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
      data: { id: string; id_lembaga: string; role: string } | null;
    };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") {
    throw new Error("Unauthorized: Only instructors can access this");
  }

  // Get courses taught by this instructor
  const { data: instructorCourses } = (await supabase
    .from("kursus")
    .select("id")
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga)) as {
      data: { id: string }[] | null;
    };

  if (!instructorCourses || instructorCourses.length === 0) {
    return {
      data: [],
      count: 0,
      page: 1,
      limit: filters?.limit || 20,
      totalPages: 0,
    };
  }

  const courseIds = instructorCourses.map((c) => c.id);

  // Get assessment IDs for these courses
  const { data: assessments } = (await supabase
    .from("asesmen")
    .select("id")
    .in("id_kursus", courseIds)) as { data: { id: string }[] | null };

  const assessmentIds = assessments?.map((a) => a.id) || [];

  if (assessmentIds.length === 0) {
    return {
      data: [],
      count: 0,
      page: 1,
      limit: filters?.limit || 20,
      totalPages: 0,
    };
  }

  // Build query for quiz submissions (percobaan_asesmen)
  let quizQuery = supabase
    .from("percobaan_asesmen")
    .select(
      `
      *,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      ),
      asesmen:id_asesmen (
        id,
        judul,
        kursus:id_kursus (
          id,
          judul
        )
      )
    `,
      { count: "exact" },
    )
    .in("id_asesmen", assessmentIds)
    .order("waktu_selesai", { ascending: false, nullsFirst: false });

  // Build query for assignment submissions (pengumpulan_tugas)
  const { data: tIds } = await supabase
    .from("tugas")
    .select("id")
    .in("id_asesmen", assessmentIds);
  const taskIds = (tIds as { id: string }[] | null)?.map((t) => t.id) || [];

  let assignmentQuery = supabase
    .from("pengumpulan_tugas")
    .select(
      `
      *,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      ),
      tugas:id_tugas (
        id,
        judul,
        asesmen:id_asesmen (
          id,
          judul,
          kursus:id_kursus (
            id,
            judul
          )
        )
      )
    `,
      { count: "exact" },
    )
    .in("id_tugas", taskIds)
    .order("created_at", { ascending: false });

  // Apply filters to both
  if (filters?.id_kursus) {
    // Already handled by assessmentIds filter? No, assessmentIds were all instructor courses.
    // If specific id_kursus is provided, we filter assessmentIds further.
    const { data: filteredAssessments } = (await supabase
      .from("asesmen")
      .select("id")
      .eq("id_kursus", filters.id_kursus)) as { data: { id: string }[] | null };
    const filteredIds = filteredAssessments?.map((a) => a.id) || [];
    quizQuery = quizQuery.in("id_asesmen", filteredIds);

    const { data: filteredTasks } = (await supabase
      .from("tugas")
      .select("id")
      .in("id_asesmen", filteredIds)) as { data: { id: string }[] | null };
    const filteredTaskIds = filteredTasks?.map((t) => t.id) || [];
    assignmentQuery = assignmentQuery.in("id_tugas", filteredTaskIds);
  }

  const [{ data: quizData, count: quizCount }, { data: assignmentData, count: assignmentCount }] = await Promise.all([
    quizQuery,
    assignmentQuery
  ]);

  // Transform and combine
  const quizSubmissions: Submission[] = (quizData as any[] || []).map((item) => ({
    id: item.id,
    student_id: item.id_pengguna,
    student_name: item.pengguna?.nama_lengkap || "Unknown",
    student_email: item.pengguna?.email || "",
    id_kursus: item.asesmen?.kursus?.id || "",
    kursus_judul: item.asesmen?.kursus?.judul || "Unknown",
    assignment_id: item.id_asesmen,
    assignment_title: item.asesmen?.judul || "Unknown",
    submitted_at: item.waktu_selesai || item.waktu_mulai,
    status: item.nilai !== null ? "graded" : "pending",
    grade: item.nilai,
    feedback: null,
    url_berkas: null,
    text_content: null,
    id_lembaga: currentUser.id_lembaga,
  }));

  const taskSubmissions: Submission[] = (assignmentData as any[] || []).map((item) => ({
    id: item.id,
    student_id: item.id_pengguna,
    student_name: item.pengguna?.nama_lengkap || "Unknown",
    student_email: item.pengguna?.email || "",
    id_kursus: item.tugas?.asesmen?.kursus?.id || "",
    kursus_judul: item.tugas?.asesmen?.kursus?.judul || "Unknown",
    assignment_id: item.id_tugas,
    assignment_title: item.tugas?.judul || "Unknown",
    submitted_at: item.created_at,
    status: item.status === 'dinilai' ? "graded" :
      item.status === 'perlu_revisi' ? "revision_requested" :
        item.status === 'ditolak' ? "rejected" : "pending",
    grade: item.nilai,
    feedback: item.feedback,
    url_berkas: item.url_berkas,
    text_content: item.catatan,
    id_lembaga: currentUser.id_lembaga,
  }));

  let allSubmissions = [...quizSubmissions, ...taskSubmissions];

  // Apply status filter on unified list
  if (filters?.status) {
    allSubmissions = allSubmissions.filter(s => s.status === filters.status);
  }

  allSubmissions.sort((a, b) =>
    new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
  );

  // Pagination on combined results
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit;
  const paginatedData = allSubmissions.slice(from, to);

  const totalCount = (quizCount || 0) + (assignmentCount || 0);

  return {
    data: paginatedData,
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

/**
 * Get submission detail for grading
 */
export async function getSubmissionDetail(
  submissionId: string,
): Promise<SubmissionDetail> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
      data: { id: string; id_lembaga: string; role: string } | null;
    };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") {
    throw new Error("Unauthorized: Only instructors can access this");
  }

  // Check if it's a quiz attempt
  const { data: quizData } = await supabase
    .from("percobaan_asesmen")
    .select(
      `
      *,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      ),
      asesmen:id_asesmen (
        id,
        judul,
        deskripsi,
        nilai_kelulusan,
        kursus:id_kursus (
          id,
          judul,
          id_instruktur
        )
      )
    `,
    )
    .eq("id", submissionId)
    .maybeSingle();

  const quizSubmission = quizData as any;

  if (quizSubmission) {
    const detail: SubmissionDetail = {
      id: quizSubmission.id,
      student_id: quizSubmission.id_pengguna,
      student_name: quizSubmission.pengguna?.nama_lengkap || "Unknown",
      student_email: quizSubmission.pengguna?.email || "",
      id_kursus: quizSubmission.asesmen?.kursus?.id || "",
      kursus_judul: quizSubmission.asesmen?.kursus?.judul || "Unknown",
      assignment_id: quizSubmission.id_asesmen,
      assignment_title: quizSubmission.asesmen?.judul || "Unknown",
      assignment_description: quizSubmission.asesmen?.deskripsi || "",
      assignment_max_score: quizSubmission.asesmen?.nilai_kelulusan || 100,
      submitted_at: quizSubmission.waktu_selesai || quizSubmission.waktu_mulai,
      status: quizSubmission.nilai !== null ? "graded" : "pending",
      grade: quizSubmission.nilai,
      feedback: null,
      url_berkas: null,
      text_content: null,
      id_lembaga: currentUser.id_lembaga,
    };
    return detail;
  }

  // Check if it's an assignment submission
  const { data: assignmentData } = await supabase
    .from("pengumpulan_tugas")
    .select(
      `
      *,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      ),
      tugas:id_tugas (
        id,
        judul,
        deskripsi,
        asesmen:id_asesmen (
          nilai_kelulusan,
          kursus:id_kursus (
            id,
            judul,
            id_instruktur
          )
        )
      )
    `,
    )
    .eq("id", submissionId)
    .maybeSingle();

  const assignmentSubmission = assignmentData as any;

  if (assignmentSubmission) {
    const detail: SubmissionDetail = {
      id: assignmentSubmission.id,
      student_id: assignmentSubmission.id_pengguna,
      student_name: assignmentSubmission.pengguna?.nama_lengkap || "Unknown",
      student_email: assignmentSubmission.pengguna?.email || "",
      id_kursus: assignmentSubmission.tugas?.asesmen?.kursus?.id || "",
      kursus_judul: assignmentSubmission.tugas?.asesmen?.kursus?.judul || "Unknown",
      assignment_id: assignmentSubmission.id_tugas,
      assignment_title: assignmentSubmission.tugas?.judul || "Unknown",
      assignment_description: assignmentSubmission.tugas?.deskripsi || "",
      assignment_max_score: assignmentSubmission.tugas?.asesmen?.nilai_kelulusan || 100,
      submitted_at: assignmentSubmission.created_at,
      status: assignmentSubmission.status === 'dinilai' ? "graded" :
        assignmentSubmission.status === 'perlu_revisi' ? "revision_requested" :
          assignmentSubmission.status === 'ditolak' ? "rejected" : "pending",
      grade: assignmentSubmission.nilai,
      feedback: assignmentSubmission.feedback,
      url_berkas: assignmentSubmission.url_berkas,
      text_content: assignmentSubmission.catatan,
      id_lembaga: currentUser.id_lembaga,
    };
    return detail;
  }

  throw new Error("Submission not found");
}

/**
 * Grade a submission
 */
export async function gradeSubmission(
  submissionId: string,
  gradeData: GradeSubmissionData,
) {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
      data: { id: string; id_lembaga: string; role: string } | null;
    };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") {
    throw new Error("Unauthorized: Only instructors can grade submissions");
  }

  // Check if it's a quiz attempt
  const { data: quizSubmission } = await supabase
    .from("percobaan_asesmen")
    .select(`
      id,
      asesmen:id_asesmen (
        kursus:id_kursus (
          id_instruktur
        )
      )
    `)
    .eq("id", submissionId)
    .maybeSingle();

  if (quizSubmission) {
    const instrukturId = (quizSubmission as any).asesmen?.kursus?.id_instruktur;
    if (instrukturId !== currentUser.id) {
      throw new Error("Access denied: This quiz attempt is not from your course");
    }

    const { data, error } = await (supabase
      .from("percobaan_asesmen") as any)
      .update({
        nilai: gradeData.grade,
        status: "selesai",
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if it's an assignment submission
  const { data: assignmentSubmission } = await supabase
    .from("pengumpulan_tugas")
    .select(`
      id,
      tugas:id_tugas (
        asesmen:id_asesmen (
          kursus:id_kursus (
            id_instruktur
          )
        )
      )
    `)
    .eq("id", submissionId)
    .maybeSingle();

  if (assignmentSubmission) {
    const instrukturId = (assignmentSubmission as any).tugas?.asesmen?.kursus?.id_instruktur;
    if (instrukturId !== currentUser.id) {
      throw new Error("Access denied: This assignment is not from your course");
    }

    const { data, error } = await (supabase
      .from("pengumpulan_tugas") as any)
      .update({
        nilai: gradeData.grade,
        feedback: gradeData.feedback || null,
        status: gradeData.status === "graded" ? "dinilai" :
          gradeData.status === "revision_requested" ? "perlu_revisi" : "ditolak",
        updated_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  throw new Error("Submission not found");
}

/**
 * Get grade book for a course
 */
export async function getGradeBook(kursusId: string): Promise<GradeBookData> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
      data: { id: string; id_lembaga: string; role: string } | null;
    };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") {
    throw new Error("Unauthorized: Only instructors can access grade book");
  }

  // Verify course belongs to this instructor
  const { data: course } = (await supabase
    .from("kursus")
    .select("id, judul")
    .eq("id", kursusId)
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga)
    .single()) as { data: { id: string; judul: string } | null };

  if (!course) throw new Error("Course not found or access denied");

  // Get all assignments for this course
  const { data: assignments } = (await supabase
    .from("asesmen")
    .select("id, title:judul, max_score:nilai_kelulusan")
    .eq("id_kursus", kursusId)
    .order("created_at", { ascending: true })) as {
      data: { id: string; title: string; max_score: number }[] | null;
    };

  const assignmentIds = assignments?.map((a) => a.id) || [];

  // Get all enrolled students
  const { data: enrollments } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      id_pengguna,
      pengguna:id_pengguna (
        id,
        nama_lengkap,
        email
      )
    `,
    )
    .eq("id_kursus", kursusId);

  if (!enrollments || !assignments) {
    return {
      id_kursus: kursusId,
      kursus_judul: course.judul,
      entries: [],
      summary: {
        total_students: 0,
        avg_class_score: 0,
        total_assignments: 0,
        completion_rate: 0,
      },
    };
  }

  // Get all submissions (percobaan_asesmen) for this course's assignments
  // Note: We use in() filter on id_asesmen
  let submissions: any[] = [];
  if (assignmentIds.length > 0) {
    const { data } = await supabase
      .from("percobaan_asesmen")
      .select("id_pengguna, id_asesmen, nilai, waktu_selesai, status")
      .in("id_asesmen", assignmentIds);
    submissions = data || [];
  }

  // Build grade book entries
  const entries: GradeBookEntry[] = await Promise.all(
    enrollments.map(async (enrollment: any) => {
      const studentId = enrollment.id_pengguna;
      const studentName = enrollment.pengguna?.nama_lengkap || "Unknown";
      const studentEmail = enrollment.pengguna?.email || "";

      // Build assignment grades for this student
      const assignmentGrades: AssignmentGrade[] = assignments.map((assign) => {
        const submission = submissions?.find(
          (s) => s.id_pengguna === studentId && s.id_asesmen === assign.id,
        );

        return {
          assignment_id: assign.id,
          assignment_title: assign.title,
          grade: submission?.nilai || null,
          max_score: assign.max_score,
          submitted_at: submission?.waktu_selesai || null,
          status: submission
            ? submission.nilai !== null
              ? "graded"
              : "pending"
            : "not_submitted",
        };
      });

      // Calculate average score
      const gradedAssignments = assignmentGrades.filter(
        (ag) => ag.grade !== null,
      );
      const avg_score =
        gradedAssignments.length > 0
          ? gradedAssignments.reduce((sum, ag) => sum + (ag.grade || 0), 0) /
          gradedAssignments.length
          : 0;

      return {
        student_id: studentId,
        student_name: studentName,
        student_email: studentEmail,
        assignments: assignmentGrades,
        avg_score: Math.round(avg_score * 10) / 10,
        total_submitted: assignmentGrades.filter(
          (ag) => ag.status !== "not_submitted",
        ).length,
        total_assignments: assignments.length,
      };
    }),
  );

  // Calculate summary
  const totalStudents = entries.length;
  const avgClassScore =
    totalStudents > 0
      ? entries.reduce((sum, e) => sum + e.avg_score, 0) / totalStudents
      : 0;

  const totalPossibleSubmissions = totalStudents * assignments.length;
  const totalActualSubmissions = entries.reduce((sum, e) => sum + e.total_submitted,
    0,
  );
  const completionRate =
    totalPossibleSubmissions > 0
      ? (totalActualSubmissions / totalPossibleSubmissions) * 100
      : 0;

  return {
    id_kursus: kursusId,
    kursus_judul: course.judul,
    entries,
    summary: {
      total_students: totalStudents,
      avg_class_score: Math.round(avgClassScore * 10) / 10,
      total_assignments: assignments.length,
      completion_rate: Math.round(completionRate * 10) / 10,
    },
  };
}

/**
 * Export grades to CSV format
 */
export async function exportGrades(
  kursusId: string,
  format: "csv" | "excel" = "csv",
): Promise<string> {
  const gradeBook = await getGradeBook(kursusId);

  if (format === "csv") {
    // Build CSV header
    const assignmentHeaders = gradeBook.entries[0]?.assignments
      .map((a) => a.assignment_title)
      .join(",");
    const header = `Student Name,Email,${assignmentHeaders},Average Score,Submitted,Total\n`;

    // Build CSV rows
    const rows = gradeBook.entries
      .map((entry) => {
        const grades = entry.assignments.map((a) => a.grade ?? "").join(",");
        return `${entry.student_name},${entry.student_email},${grades},${entry.avg_score},${entry.total_submitted},${entry.total_assignments}`;
      })
      .join("\n");

    return header + rows;
  }

  // For Excel, return CSV for now (can be enhanced with proper Excel library)
  return exportGrades(kursusId, "csv");
}

/**
 * Get all assessments for a module
 */
export async function getModuleAssessments(
  moduleId: string,
): Promise<Assessment[]> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  const { data: currentUser } = await supabase
    .from("pengguna")
    .select("id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUser) throw new Error("User not found");

  const { data, error } = await supabase
    .from("asesmen")
    .select(
      `
      *,
      kursus:id_kursus (
        id_lembaga
      )
    `,
    )
    .eq("id_modul", moduleId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  // Filter by id_lembaga manually if relation doesn't filtering automatically
  return (data || []).filter(
    (a: any) => (a as any).kursus?.id_lembaga === (currentUser as any).id_lembaga,
  );
}

/**
 * Create a new assessment
 */
export async function createAssessment(
  kursusId: string,
  data: CreateAssessmentData,
): Promise<Assessment> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user data
  const { data: currentUser } = await supabase
    .from("pengguna")
    .select("id")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUser) throw new Error("User not found");

  // Verify ownership
  const { data: course } = await supabase
    .from("kursus")
    .select("id")
    .eq("id", kursusId)
    .eq("id_instruktur", (currentUser as any).id)
    .single();

  if (!course) throw new Error("Unauthorized");

  const { data: newAssessment, error } = await (supabase.from("asesmen") as any)
    .insert({
      id_kursus: kursusId,
      id_modul: data.id_modul || null,
      judul: data.judul,
      deskripsi: data.deskripsi || null,
      tipe: data.tipe,
      durasi_menit: data.durasi_menit || null,
      nilai_kelulusan: data.nilai_kelulusan || 0,
      jumlah_percobaan: data.jumlah_percobaan || 1,
      acak_soal: data.acak_soal || false,
      tampilkan_jawaban: data.tampilkan_jawaban || false,
      status: "draft",
    })
    .select()
    .single();

  if (error) throw error;
  return newAssessment;
}

/**
 * Update an assessment
 */
export async function updateAssessment(
  assessmentId: string,
  data: UpdateAssessmentData,
): Promise<Assessment> {
  const { data: updatedAssessment, error } = await (
    supabase.from("asesmen") as any
  )
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .select()
    .single();

  if (error) throw error;
  return updatedAssessment;
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: string): Promise<void> {
  const { error } = await supabase
    .from("asesmen")
    .delete()
    .eq("id", assessmentId);

  if (error) throw error;
}

/**
 * Get all questions for an assessment
 */
export async function getAssessmentQuestions(
  assessmentId: string,
): Promise<Question[]> {
  const { data, error } = await supabase
    .from("soal")
    .select("*")
    .eq("id_asesmen", assessmentId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Save (upsert) questions for an assessment
 */
export async function saveAssessmentQuestions(
  assessmentId: string,
  questions: SaveQuestionData[],
): Promise<void> {
  // Simple implementation: delete all and re-insert to ensure order and cleanliness
  const { error: deleteError } = await supabase
    .from("soal")
    .delete()
    .eq("id_asesmen", assessmentId);

  if (deleteError) throw deleteError;

  if (questions.length === 0) return;

  const { error: insertError } = await (supabase.from("soal") as any).insert(
    questions.map((q) => ({
      id_asesmen: assessmentId,
      pertanyaan: q.pertanyaan,
      tipe: q.tipe,
      opsi: q.opsi || null,
      jawaban_benar: q.jawaban_benar || null,
      poin: q.poin,
      penjelasan: q.penjelasan || null,
      urutan: q.urutan,
    })),
  );

  if (insertError) throw insertError;
}
