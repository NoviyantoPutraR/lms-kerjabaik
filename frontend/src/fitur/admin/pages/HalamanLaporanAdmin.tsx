import { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/komponen/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import { FilterLaporan } from "@/fitur/admin/komponen/FilterLaporan";
import { TabelLaporanKemajuan } from "../komponen/TabelLaporanKemajuan";
import { TabelLaporanAsesmen } from "../komponen/TabelLaporanAsesmen";
import { TabelLaporanKeterlibatan } from "../komponen/TabelLaporanKeterlibatan";
import { TombolEksporLaporan } from "../komponen/TombolEksporLaporan";
import {
  useProgressReport,
  useAssessmentReport,
  useEngagementReport,
} from "../hooks/useReports";
import type { ReportFilters } from "../api/reportsApi";
import {
  BarChart3,
  FileText,
  TrendingUp,
  UserCheck,
  Activity,
} from "lucide-react";

// Lazy load chart components
const ProgressChart = lazy(() => import("../komponen/ProgressChart").then(m => ({ default: m.ProgressChart })));
const AssessmentDistributionChart = lazy(() => import("../komponen/AssessmentDistributionChart").then(m => ({ default: m.AssessmentDistributionChart })));
const EngagementTrendChart = lazy(() => import("../komponen/EngagementTrendChart").then(m => ({ default: m.EngagementTrendChart })));
const StatusPieChart = lazy(() => import("../komponen/StatusPieChart").then(m => ({ default: m.StatusPieChart })));

// Loading component
function ChartLoader() {
  return (
    <div className="flex items-center justify-center h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function HalamanLaporanAdmin() {
  const [activeTab, setActiveTab] = useState("kemajuan_belajar");
  const [filters, setFilters] = useState<ReportFilters>({});

  // Fetch data for all reports
  const progressQuery = useProgressReport(filters);
  const assessmentQuery = useAssessmentReport(filters);
  const engagementQuery = useEngagementReport(filters);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "kemajuan_belajar":
        return progressQuery.data || [];
      case "assessment":
        return assessmentQuery.data?.data || [];
      case "engagement":
        return engagementQuery.data || [];
      default:
        return [];
    }
  };

  const getFilename = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    switch (activeTab) {
      case "kemajuan_belajar":
        return `laporan-progress-${timestamp}`;
      case "assessment":
        return `laporan-penilaian-${timestamp}`;
      case "engagement":
        return `laporan-keterlibatan-${timestamp}`;
      default:
        return `laporan-${timestamp}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Laporan & Analitik
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Wawasan berbasis data untuk evaluasi performa pembelajaran
          </p>
        </div>
        <TombolEksporLaporan data={getCurrentData()} filename={getFilename()} />
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="kemajuan_belajar" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress Belajar</span>
            <span className="sm:hidden">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4" />
            <span>Penilaian</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Keterlibatan</span>
            <span className="sm:hidden">Engagement</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8 space-y-8">
          <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4">
            <FilterLaporan
              filters={filters}
              onFiltersChange={setFilters}
              showCourseFilter={false}
              showStatusFilter={activeTab === "kemajuan_belajar"}
              showKategoriFilter={activeTab === "kemajuan_belajar"}
            />
          </div>

          {/* Progress Tab */}
          <TabsContent value="kemajuan_belajar" className="space-y-6 mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<ChartLoader />}>
                <ProgressChart data={progressQuery.data || []} />
              </Suspense>
              <Suspense fallback={<ChartLoader />}>
                <StatusPieChart data={progressQuery.data || []} />
              </Suspense>
            </div>

            <Card className="rounded-xl border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Data Progress Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TabelLaporanKemajuan
                  data={progressQuery.data || []}
                  isLoading={progressQuery.isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>


          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6 mt-0">
            <Suspense fallback={<ChartLoader />}>
              <AssessmentDistributionChart
                data={assessmentQuery.data?.data || []}
              />
            </Suspense>

            <Card className="rounded-xl border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Data Penilaian
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TabelLaporanAsesmen
                  data={assessmentQuery.data?.data || []}
                  statistics={
                    assessmentQuery.data?.statistics || {
                      rata_rata: 0,
                      nilai_tertinggi: 0,
                      nilai_terendah: 0,
                      total_peserta: 0,
                      lulus: 0,
                      tidak_lulus: 0,
                    }
                  }
                  isLoading={assessmentQuery.isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6 mt-0">
            <Suspense fallback={<ChartLoader />}>
              <EngagementTrendChart data={engagementQuery.data || []} />
            </Suspense>

            <Card className="rounded-xl border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-primary" />
                  Data Keterlibatan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TabelLaporanKeterlibatan
                  data={engagementQuery.data || []}
                  isLoading={engagementQuery.isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
