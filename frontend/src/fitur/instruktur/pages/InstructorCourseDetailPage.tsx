import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/komponen/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/komponen/ui/table";
import {
  ArrowLeft,
  Users,
  BookOpen,
  TrendingUp,
  ClipboardList,
  Edit,
} from "lucide-react";
import { useInstructorCourseDetail } from "../hooks/useInstructorCourses";
import { useEnrolledStudents } from "../hooks/useStudentProgress";
import { useSubmissions } from "../hooks/useAssessments";
import { useCourseAnalytics } from "../hooks/useStudentProgress";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function InstructorCourseDetailPage() {
  const { id: kursusId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: course, isLoading: courseLoading } = useInstructorCourseDetail(
    kursusId!,
  );
  const { data: students, isLoading: studentsLoading } = useEnrolledStudents(
    kursusId!,
    { limit: 100 },
  );
  const { data: submissions, isLoading: submissionsLoading } = useSubmissions({
    id_kursus: kursusId,
    limit: 100,
  });
  const { data: analytics, isLoading: analyticsLoading } = useCourseAnalytics(
    kursusId!,
  );

  if (courseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold">Kursus tidak ditemukan</h2>
        <Link to="/instruktur/courses">
          <Button className="mt-4">Kembali ke Kursus</Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    draft: "secondary",
    published: "default",
    archived: "outline",
  } as const;

  const statusLabels = {
    draft: "Draft",
    published: "Published",
    archived: "Archived",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            to="/instruktur/courses"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {course.judul}
          </h1>
          <p className="mt-2 text-muted-foreground">{course.deskripsi}</p>
          <div className="mt-3 flex items-center gap-3">
            <Badge variant={statusColors[course.status]}>
              {statusLabels[course.status]}
            </Badge>
            {course.kategori && (
              <Badge variant="outline">{course.kategori}</Badge>
            )}
          </div>
        </div>
        <Link to={`/instruktur/kursus/${kursusId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Content
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {course.enrollment_stats.total_enrolled}
            </div>
            <p className="text-xs text-muted-foreground">
              {course.enrollment_stats.active_students} aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {course.enrollment_stats.completion_rate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {course.enrollment_stats.completed_students} selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modul</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.module_count}</div>
            <p className="text-xs text-muted-foreground">Total modul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{course.total_assignments}</div>
            <p className="text-xs text-muted-foreground">Total tugas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">
            Peserta ({course.enrollment_stats.total_enrolled})
          </TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions (
            {submissions?.data.filter((s) => s.status === "pending").length ||
              0}{" "}
            pending)
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kursus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm">{statusLabels[course.status]}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </p>
                  <p className="text-sm">{course.kategori || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Modul
                  </p>
                  <p className="text-sm">{course.module_count}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Assignments
                  </p>
                  <p className="text-sm">{course.total_assignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enrollment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Enrolled</span>
                  <span className="font-medium">
                    {course.enrollment_stats.total_enrolled}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Students</span>
                  <span className="font-medium">
                    {course.enrollment_stats.active_students}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Students</span>
                  <span className="font-medium">
                    {course.enrollment_stats.completed_students}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completion Rate</span>
                  <span className="font-medium">
                    {course.enrollment_stats.completion_rate}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : students && students.data.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Avg Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.data.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.student_name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.student_email}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{
                                    width: `${student.progress_percentage}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm">
                                {student.progress_percentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.avg_score !== null
                              ? student.avg_score
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.status === "completed"
                                  ? "default"
                                  : student.status === "active"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {student.last_activity
                              ? formatDistanceToNow(
                                new Date(student.last_activity),
                                {
                                  addSuffix: true,
                                  locale: idLocale,
                                },
                              )
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Belum ada peserta terdaftar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissionsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : submissions && submissions.data.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.data.slice(0, 10).map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            {submission.student_name}
                          </TableCell>
                          <TableCell>{submission.assignment_title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(submission.submitted_at),
                              {
                                addSuffix: true,
                                locale: idLocale,
                              },
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                submission.status === "graded"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {submission.grade !== null ? submission.grade : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Belum ada submission
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analyticsLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : analytics ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Module Completion Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Module Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.module_completion}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="module_title"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completion_rate" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Grade Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.grade_distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) =>
                            `${entry.range}: ${entry.count}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analytics.grade_distribution.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Average Score
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.avg_score}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending Submissions
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.pending_submissions}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Students
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.active_students}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Data analytics tidak tersedia
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div >
  );
}
