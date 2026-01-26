import { useState } from "react";
import { Card, CardContent } from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import { Skeleton } from "@/komponen/ui/skeleton";
import { Badge } from "@/komponen/ui/badge";
import {
  BookOpen,
  Users,
  TrendingUp,
  ClipboardList,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useInstructorCourses } from "../hooks/useInstructorCourses";
import type { CourseFilters } from "../tipe/instructor.types";

export default function InstructorCoursesPage() {
  const [filters, setFilters] = useState<CourseFilters>({
    page: 1,
    limit: 12,
  });

  const { data, isLoading } = useInstructorCourses(filters);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleKategoriChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      kategori: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? undefined : (value as any),
      page: 1,
    }));
  };

  const statusColors = {
    draft: "secondary",
    published: "default",
    archived: "outline",
  } as const;

  const statusLabels = {
    draft: "Draf",
    published: "Terbit",
    archived: "Diarsipkan",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kursus Saya
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola kursus yang Anda ajarkan
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari kursus..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.kategori || "all"}
              onValueChange={handleKategoriChange}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((course) => (
              <Link
                key={course.id}
                to={`/instruktur/kursus/${course.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  {course.url_gambar_mini ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={course.url_gambar_mini}
                        alt={course.judul}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-muted">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="flex-1 font-semibold line-clamp-2 group-hover:text-primary">
                        {course.judul}
                      </h3>
                      <Badge variant={statusColors[course.status]}>
                        {statusLabels[course.status]}
                      </Badge>
                    </div>

                    {course.deskripsi && (
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {course.deskripsi}
                      </p>
                    )}

                    {course.kategori && (
                      <Badge variant="outline" className="mb-3">
                        {course.kategori}
                      </Badge>
                    )}

                    <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {course.total_peserta || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Peserta
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {course.pending_submissions || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tertunda
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {course.completion_rate || 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Penyelesaian
                          </p>
                        </div>
                      </div>

                      {course.avg_score !== null && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{course.avg_score}</p>
                            <p className="text-xs text-muted-foreground">
                              Rata-rata Nilai
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page! - 1),
                  }))
                }
                disabled={filters.page === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm text-muted-foreground">
                Halaman {filters.page} dari {data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: Math.min(data.totalPages, prev.page! + 1),
                  }))
                }
                disabled={filters.page === data.totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Tidak ada kursus ditemukan
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {filters.search || filters.kategori || filters.status
                ? "Coba ubah filter pencarian Anda"
                : "Anda belum ditugaskan ke kursus apapun"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
