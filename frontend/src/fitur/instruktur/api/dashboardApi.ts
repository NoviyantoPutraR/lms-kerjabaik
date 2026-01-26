import { supabase } from "@/pustaka/supabase";
import type {
  InstructorDashboardStats,
  RecentActivity,
  DashboardCourse,
  PendingSubmission,
} from "../tipe/instructor.types";

// Type definitions for Supabase query results

interface CourseBasic {
  id: string;
  judul?: string;
  url_gambar_mini?: string;
  id_instruktur?: string;
  id_lembaga?: string;
}



/**
 * Get dashboard statistics for instructor
 */
export async function getInstructorDashboardStats(): Promise<InstructorDashboardStats> {
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

  // Get total courses taught
  const { count: totalCourses } = await supabase
    .from("kursus")
    .select("*", { count: "exact", head: true })
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga);

  // Get course IDs for further queries
  const { data: courses } = await supabase
    .from("kursus")
    .select("id")
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga);

  const courseIds = (courses as CourseBasic[] | null)?.map((c) => c.id) || [];

  if (courseIds.length === 0) {
    return {
      total_courses: 0,
      total_students: 0,
      pending_submissions: 0,
      avg_class_score: 0,
    };
  }

  // Get total unique students across all courses
  const { data: enrollments } = await supabase
    .from("pendaftaran_kursus")
    .select("id_pengguna")
    .in("id_kursus", courseIds);

  const uniqueStudents = new Set(
    (enrollments as { id_pengguna: string }[] | null)?.map(
      (e) => e.id_pengguna,
    ) || [],
  );
  const totalStudents = uniqueStudents.size;

  // Get assessment IDs for instructor courses
  const { data: assessments } = await supabase
    .from("asesmen")
    .select("id")
    .in("id_kursus", courseIds);
  const assessmentIds = (assessments as { id: string }[] | null)?.map(a => a.id) || [];

  // Get tasks linked to those assessments
  const { data: tasks } = assessmentIds.length > 0 ? await supabase
    .from("tugas")
    .select("id")
    .in("id_asesmen", assessmentIds) : { data: [] };
  const taskIds = (tasks as { id: string }[] | null)?.map(t => t.id) || [];

  // Get pending submissions count from both quizzes and assignments
  const { count: pendingQuizzes } = assessmentIds.length > 0 ? await supabase
    .from("percobaan_asesmen")
    .select("*", { count: "exact", head: true })
    .in("id_asesmen", assessmentIds)
    .eq("status", "selesai")
    .is("nilai", null) : { count: 0 };

  const { count: pendingAssignments } = taskIds.length > 0 ? await supabase
    .from("pengumpulan_tugas")
    .select("*", { count: "exact", head: true })
    .in("id_tugas", taskIds)
    .eq("status", "dikumpulkan") : { count: 0 };

  const pendingCount = (pendingQuizzes || 0) + (pendingAssignments || 0);

  // Get average score
  const { data: quizScores } = assessmentIds.length > 0 ? await supabase
    .from("percobaan_asesmen")
    .select("nilai")
    .in("id_asesmen", assessmentIds)
    .eq("status", "selesai")
    .not("nilai", "is", null) : { data: [] };

  const { data: assignmentScores } = taskIds.length > 0 ? await supabase
    .from("pengumpulan_tugas")
    .select("nilai")
    .in("id_tugas", taskIds)
    .not("nilai", "is", null) : { data: [] };

  const allScores = [
    ...(quizScores as { nilai: number }[] || []),
    ...(assignmentScores as { nilai: number }[] || [])
  ].map(s => s.nilai || 0);

  const avgClassScore = allScores.length > 0
    ? allScores.reduce((sum, val) => sum + val, 0) / allScores.length
    : 0;

  return {
    total_courses: totalCourses || 0,
    total_students: totalStudents,
    pending_submissions: pendingCount,
    avg_class_score: Math.round(avgClassScore * 10) / 10,
  };
}

/**
 * Get recent activities across all courses
 */
export async function getRecentActivities(
  limit: number = 10,
): Promise<RecentActivity[]> {
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

  // Get course IDs
  const { data: courses } = await supabase
    .from("kursus")
    .select("id, judul")
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga);

  const courseIds = (courses as CourseBasic[] | null)?.map((c) => c.id) || [];

  if (courseIds.length === 0) {
    return [];
  }

  // Get assessments for IDs
  const { data: assessments } = await supabase
    .from("asesmen")
    .select("id")
    .in("id_kursus", courseIds);
  const assessmentIds = (assessments as { id: string }[] | null)?.map(a => a.id) || [];

  // Get recent quiz submissions
  const { data: quizSubmissions } = assessmentIds.length > 0 ? await supabase
    .from("percobaan_asesmen")
    .select(
      `
      id,
      waktu_selesai,
      pengguna:id_pengguna (
        nama_lengkap
      ),
      asesmen:id_asesmen (
        judul,
        kursus:id_kursus (
          judul
        )
      )
    `,
    )
    .in("id_asesmen", assessmentIds)
    .order("waktu_selesai", { ascending: false })
    .limit(limit) : { data: [] };

  // Get tasks from assessments
  const { data: tasks } = assessmentIds.length > 0 ? await supabase
    .from("tugas")
    .select("id")
    .in("id_asesmen", assessmentIds) : { data: [] };
  const taskIds = (tasks as { id: string }[] | null)?.map(t => t.id) || [];

  // Get recent assignment submissions
  const { data: assignmentSubmissions } = taskIds.length > 0 ? await supabase
    .from("pengumpulan_tugas")
    .select(
      `
      id,
      created_at,
      pengguna:id_pengguna (
        nama_lengkap
      ),
      tugas:id_tugas (
        judul,
        asesmen:id_asesmen (
          kursus:id_kursus (
            judul
          )
        )
      )
    `,
    )
    .in("id_tugas", taskIds)
    .order("created_at", { ascending: false })
    .limit(limit) : { data: [] };

  // Get recent enrollments
  const { data: enrollments } = await supabase
    .from("pendaftaran_kursus")
    .select(
      `
      id,
      created_at,
      pengguna:id_pengguna (
        nama_lengkap
      ),
      kursus:id_kursus (
        judul
      )
    `,
    )
    .in("id_kursus", courseIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  // Combine and sort activities
  const activities: RecentActivity[] = [];

  (quizSubmissions as any[] || []).forEach((item) => {
    activities.push({
      id: `quiz-${item.id}`,
      type: "submission",
      student_name: item.pengguna?.nama_lengkap || "Unknown student",
      kursus_judul: item.asesmen?.kursus?.judul || "Unknown Course",
      description: `Selesaikan kuis: ${item.asesmen?.judul}`,
      timestamp: item.waktu_selesai,
    });
  });

  (assignmentSubmissions as any[] || []).forEach((item) => {
    activities.push({
      id: `task-${item.id}`,
      type: "submission",
      student_name: item.pengguna?.nama_lengkap || "Unknown student",
      kursus_judul: item.tugas?.asesmen?.kursus?.judul || "Unknown Course",
      description: `Kumpulkan tugas: ${item.tugas?.judul}`,
      timestamp: item.created_at,
    });
  });

  (enrollments as any[] || []).forEach((enr) => {
    activities.push({
      id: `enr-${enr.id}`,
      type: "pendaftaran_kursus",
      student_name: enr.pengguna?.nama_lengkap || "Unknown student",
      kursus_judul: enr.kursus?.judul || "Unknown Course",
      description: "Mendaftar di kursus",
      timestamp: enr.created_at,
    });
  });

  // Sort by timestamp descending
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return activities.slice(0, limit);
}

/**
 * Get dashboard courses (quick overview)
 */
export async function getDashboardCourses(
  limit: number = 6,
): Promise<DashboardCourse[]> {
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

  // Get courses
  const { data: courses } = await supabase
    .from("kursus")
    .select("id, judul, url_gambar_mini")
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  const typedCourses = courses as CourseBasic[] | null;
  if (!typedCourses || typedCourses.length === 0) {
    return [];
  }

  // Enrich with stats
  const dashboardCourses: DashboardCourse[] = await Promise.all(
    typedCourses.map(async (course) => {
      // Get total students
      const { count: totalStudents } = await supabase
        .from("pendaftaran_kursus")
        .select("*", { count: "exact", head: true })
        .eq("id_kursus", course.id);

      // Get assessments for this course
      const { data: courseAssessments } = await supabase
        .from("asesmen")
        .select("id")
        .eq("id_kursus", course.id);
      const courseAssessmentIds = (courseAssessments as { id: string }[] | null)?.map(a => a.id) || [];

      // Get pending quiz submissions
      const { count: pendingQuizzes } = courseAssessmentIds.length > 0 ? await supabase
        .from("percobaan_asesmen")
        .select("*", { count: "exact", head: true })
        .in("id_asesmen", courseAssessmentIds)
        .eq("status", "selesai")
        .is("nilai", null) : { count: 0 };

      // Get tasks for those assessments
      const { data: courseTasks } = courseAssessmentIds.length > 0 ? await supabase
        .from("tugas")
        .select("id")
        .in("id_asesmen", courseAssessmentIds) : { data: [] };
      const courseTaskIds = (courseTasks as { id: string }[] | null)?.map(t => t.id) || [];

      // Get pending assignment submissions
      const { count: pendingTasks } = courseTaskIds.length > 0 ? await supabase
        .from("pengumpulan_tugas")
        .select("*", { count: "exact", head: true })
        .in("id_tugas", courseTaskIds)
        .eq("status", "dikumpulkan") : { count: 0 };

      const totalPending = (pendingQuizzes || 0) + (pendingTasks || 0);

      // Get completion rate
      const { count: completedStudents } = await supabase
        .from("pendaftaran_kursus")
        .select("*", { count: "exact", head: true })
        .eq("id_kursus", course.id)
        .eq("status", "completed");

      const completionRate =
        totalStudents && totalStudents > 0
          ? ((completedStudents || 0) / totalStudents) * 100
          : 0;

      return {
        id: course.id,
        judul: course.judul || "Untitled Course",
        url_gambar_mini: course.url_gambar_mini || null,
        total_students: totalStudents || 0,
        pending_submissions: totalPending,
        completion_rate: Math.round(completionRate * 10) / 10,
      };
    }),
  );

  return dashboardCourses;
}

/**
 * Get pending submissions that need grading
 */
export async function getPendingSubmissions(
  limit: number = 10,
): Promise<PendingSubmission[]> {
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

  // Get course IDs
  const { data: courses } = await supabase
    .from("kursus")
    .select("id")
    .eq("id_instruktur", currentUser.id)
    .eq("id_lembaga", currentUser.id_lembaga);

  const courseIds = (courses as CourseBasic[] | null)?.map((c) => c.id) || [];

  if (courseIds.length === 0) {
    return [];
  }

  // Get assessments for IDs
  const { data: allAssessments } = await supabase
    .from("asesmen")
    .select("id")
    .in("id_kursus", courseIds);
  const allAssessmentIds = (allAssessments as { id: string }[] | null)?.map(a => a.id) || [];

  // Get pending quiz submissions
  const { data: qSubmissions } = allAssessmentIds.length > 0 ? await supabase
    .from("percobaan_asesmen")
    .select(
      `
      id,
      waktu_selesai,
      pengguna:id_pengguna (nama_lengkap),
      asesmen:id_asesmen (
        judul,
        kursus:id_kursus (judul)
      )
    `
    )
    .in("id_asesmen", allAssessmentIds)
    .eq("status", "selesai")
    .is("nilai", null)
    .limit(limit) : { data: [] };

  // Get tasks
  const { data: allTasks } = allAssessmentIds.length > 0 ? await supabase
    .from("tugas")
    .select("id")
    .in("id_asesmen", allAssessmentIds) : { data: [] };
  const allTaskIds = (allTasks as { id: string }[] | null)?.map(t => t.id) || [];

  // Get pending assignment submissions
  const { data: tSubmissions } = allTaskIds.length > 0 ? await supabase
    .from("pengumpulan_tugas")
    .select(
      `
      id,
      created_at,
      pengguna:id_pengguna (nama_lengkap),
      tugas:id_tugas (
        judul,
        asesmen:id_asesmen (
          kursus:id_kursus (judul)
        )
      )
    `
    )
    .in("id_tugas", allTaskIds)
    .eq("status", "dikumpulkan")
    .limit(limit) : { data: [] };

  const combined: PendingSubmission[] = [];

  (qSubmissions as any[] || []).forEach(sub => {
    combined.push({
      id: sub.id,
      student_name: sub.pengguna?.nama_lengkap || "Unknown",
      kursus_judul: sub.asesmen?.kursus?.judul || "Unknown",
      assignment_title: sub.asesmen?.judul || "Quiz",
      submitted_at: sub.waktu_selesai,
      days_pending: Math.floor((Date.now() - new Date(sub.waktu_selesai).getTime()) / (1000 * 60 * 60 * 24))
    });
  });

  (tSubmissions as any[] || []).forEach(sub => {
    combined.push({
      id: sub.id,
      student_name: sub.pengguna?.nama_lengkap || "Unknown",
      kursus_judul: sub.tugas?.asesmen?.kursus?.judul || "Unknown",
      assignment_title: sub.tugas?.judul || "Assignment",
      submitted_at: sub.created_at,
      days_pending: Math.floor((Date.now() - new Date(sub.created_at).getTime()) / (1000 * 60 * 60 * 24))
    });
  });

  return combined.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()).slice(0, limit);
}
