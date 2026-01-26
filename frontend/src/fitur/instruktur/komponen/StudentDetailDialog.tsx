import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/komponen/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import { Avatar, AvatarFallback } from "@/komponen/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/komponen/ui/tabs";
import { CheckCircle2, Circle, Clock, Activity } from "lucide-react";
import { useStudentProgress } from "../hooks/useStudentProgress";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface StudentDetailDialogProps {
  kursusId: string;
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailDialog({
  kursusId,
  studentId,
  open,
  onOpenChange,
}: StudentDetailDialogProps) {
  const { data: progress, isLoading } = useStudentProgress(kursusId, studentId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Progress Peserta</DialogTitle>
          <DialogDescription>
            Tracking detail progress dan engagement peserta
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : progress ? (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex items-start gap-4 rounded-lg border p-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getInitials(progress.student_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {progress.student_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {progress.student_email}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Enrolled{" "}
                    {format(new Date(progress.enrollment_date), "dd MMM yyyy", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {progress.progress_percentage}%
                </div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="modules">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="modules">Modul Progress</TabsTrigger>
                <TabsTrigger value="grades">Nilai</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>

              {/* Modules Tab */}
              <TabsContent value="modules" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Modul</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {progress.module_progress.map((module) => (
                        <div
                          key={module.module_id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          {module.completed ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{module.module_title}</p>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <span>
                                <Clock className="mr-1 inline h-3 w-3" />
                                {module.time_spent_minutes} menit
                              </span>
                              {module.completed_at && (
                                <span>
                                  Selesai{" "}
                                  {formatDistanceToNow(
                                    new Date(module.completed_at),
                                    {
                                      addSuffix: true,
                                      locale: idLocale,
                                    },
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          {module.completed && (
                            <Badge variant="default">Completed</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Grades Tab */}
              <TabsContent value="grades" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Nilai Assignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {progress.grades.map((grade) => (
                        <div
                          key={grade.assignment_id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {grade.assignment_title}
                            </p>
                            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                              <Badge
                                variant={
                                  grade.status === "graded"
                                    ? "default"
                                    : grade.status === "pending"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {grade.status}
                              </Badge>
                              {grade.submitted_at && (
                                <span>
                                  Submitted{" "}
                                  {formatDistanceToNow(
                                    new Date(grade.submitted_at),
                                    {
                                      addSuffix: true,
                                      locale: idLocale,
                                    },
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {grade.grade !== null ? (
                              <div>
                                <span
                                  className={`text-2xl font-bold ${
                                    grade.grade >= 75
                                      ? "text-green-600"
                                      : grade.grade >= 60
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {grade.grade}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  /{grade.max_score}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Engagement Tab */}
              <TabsContent value="engagement" className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Login
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {progress.engagement.total_login_count}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {progress.engagement.last_login
                          ? `Last login ${formatDistanceToNow(new Date(progress.engagement.last_login), { addSuffix: true, locale: idLocale })}`
                          : "Belum pernah login"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Time Spent
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.floor(
                          progress.engagement.total_time_spent_minutes / 60,
                        )}
                        h {progress.engagement.total_time_spent_minutes % 60}m
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avg session:{" "}
                        {progress.engagement.avg_session_duration_minutes} min
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {progress.engagement.activity_log.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {activity.activity_description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(activity.timestamp),
                                {
                                  addSuffix: true,
                                  locale: idLocale,
                                },
                              )}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {activity.activity_type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Data tidak ditemukan
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
