import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import {
  BookOpen,
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useInstructorDashboardStats,
  useRecentActivities,
  useDashboardCourses,
  usePendingSubmissions,
} from "../hooks/useInstructorDashboard";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function InstructorDashboard() {
  const { data: stats, isLoading: statsLoading } =
    useInstructorDashboardStats();
  const { data: activities, isLoading: activitiesLoading } =
    useRecentActivities(10);
  const { data: courses, isLoading: coursesLoading } = useDashboardCourses(6);
  const { data: pendingSubmissions, isLoading: pendingLoading } =
    usePendingSubmissions(10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Instruktur
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview kursus dan aktivitas pembelajaran
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kursus</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.total_courses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Kursus yang Anda ajarkan
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.total_students || 0}
                </div>
                <p className="text-xs text-muted-foreground">Peserta aktif</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tugas Tertunda
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.pending_submissions || 0}
                </div>
                <p className="text-xs text-muted-foreground">Perlu dinilai</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Nilai
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.avg_class_score || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Dari semua kursus
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tugas Tertunda</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/instruktur/assessments">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : pendingSubmissions && pendingSubmissions.length > 0 ? (
              <div className="space-y-3">
                {pendingSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-start justify-between rounded-lg border p-3 hover:bg-accent"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {submission.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {submission.kursus_judul} •{" "}
                        {submission.assignment_title}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(submission.submitted_at),
                            {
                              addSuffix: true,
                              locale: idLocale,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    {submission.days_pending > 3 && (
                      <Badge variant="destructive" className="shrink-0">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        {submission.days_pending} hari
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Tidak ada tugas tertunda
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {activity.student_name}
                        </span>{" "}
                        {activity.description.toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.kursus_judul}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.type === "submission"
                          ? "default"
                          : activity.type === "pendaftaran_kursus"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {activity.type === "submission"
                        ? "Submission"
                        : activity.type === "pendaftaran_kursus"
                          ? "Enrollment"
                          : activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Belum ada aktivitas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kursus Saya</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/instruktur/courses">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/instruktur/kursus/${course.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-md">
                    {course.url_gambar_mini && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={course.url_gambar_mini}
                          alt={course.judul}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
                        {course.judul}
                      </h3>
                      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.total_students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClipboardList className="h-4 w-4" />
                          <span>{course.pending_submissions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{course.completion_rate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Anda belum mengajar kursus apapun
              </p>
              <p className="text-xs text-muted-foreground">
                Hubungi admin untuk ditugaskan ke kursus
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
