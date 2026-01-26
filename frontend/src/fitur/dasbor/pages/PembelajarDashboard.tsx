import { BookOpen, GraduationCap, Trophy, Clock } from 'lucide-react';
import { StatsCard } from '@/fitur/pembelajar/komponen/StatsCard';
import { CourseCard } from '@/fitur/pembelajar/komponen/CourseCard';
import { Card, CardContent } from '@/komponen/ui/card';
import { Badge } from '@/komponen/ui/badge';
import {
  useLearnerStats,
  useEnrollments,
  useUpcomingDeadlines
} from '@/fitur/pembelajar/api/learnerApi';
import { Skeleton } from '@/komponen/ui/skeleton';

export function PembelajarDashboard() {
  const { data: stats, isLoading: statsLoading } = useLearnerStats();
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollments();
  const { data: deadlines, isLoading: deadlinesLoading } = useUpcomingDeadlines();

  // Filter hanya kursus aktif untuk ditampilkan
  const activeEnrollments = enrollments?.filter(e => e.status === 'aktif') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Pembelajar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Lanjutkan perjalanan belajar Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsCard
              title="Kursus Aktif"
              value={stats?.total_kursus_aktif || 0}
              icon={BookOpen}
              description="Kursus yang sedang diikuti"
            />
            <StatsCard
              title="Kursus Selesai"
              value={stats?.total_kursus_selesai || 0}
              icon={GraduationCap}
              description="Kursus yang telah diselesaikan"
            />
            <StatsCard
              title="Tugas Pending"
              value={stats?.total_tugas_pending || 0}
              icon={Clock}
              description="Tugas yang belum dikerjakan"
            />
            <StatsCard
              title="Rata-rata Progress"
              value={`${stats?.rata_rata_progress || 0}%`}
              icon={Trophy}
              description="Progress keseluruhan"
            />
          </>
        )}
      </div>

      {/* Active Courses */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Kursus Aktif</h2>
        {enrollmentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        ) : activeEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEnrollments.map((enrollment) => (
              <CourseCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum ada kursus aktif</h3>
              <p className="text-muted-foreground">
                Mulai perjalanan belajar Anda dengan mendaftar kursus
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tenggat Waktu Mendatang</h2>
        {deadlinesLoading ? (
          <Skeleton className="h-48" />
        ) : deadlines && deadlines.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {deadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={deadline.tipe === 'tugas' ? 'default' : 'secondary'}>
                          {deadline.tipe.charAt(0).toUpperCase() + deadline.tipe.slice(1)}
                        </Badge>
                        <h4 className="font-semibold">{deadline.judul}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {deadline.kursus_judul}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(deadline.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(deadline.deadline).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada tenggat waktu</h3>
              <p className="text-muted-foreground">
                Anda tidak memiliki tugas atau ujian yang akan datang
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
