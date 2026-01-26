import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import type {
  ProgressReportData,
  AssessmentReportData,
  EngagementReportData,
} from "../api/reportsApi";

// ============================================================================
// PROGRESS CHART
// ============================================================================

interface ProgressChartProps {
  data: ProgressReportData[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  // Group by course and calculate average progress
  const chartData = data.reduce((acc, item) => {
    const existing = acc.find((x) => x.kursus === item.kursus_judul);
    if (existing) {
      existing.total_progress += item.persentase_kemajuan;
      existing.count += 1;
    } else {
      acc.push({
        kursus: item.kursus_judul,
        total_progress: item.persentase_kemajuan,
        count: 1,
      });
    }
    return acc;
  },
    [] as { kursus: string; total_progress: number; count: number }[],
  );

  const finalData = chartData.map((item) => ({
    kursus:
      item.kursus.length > 20
        ? item.kursus.substring(0, 20) + "..."
        : item.kursus,
    progress: Math.round(item.total_progress / item.count),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Progress Rata-rata per Kursus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={finalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kursus" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="kemajuan_belajar" fill="#3b82f6" name="Progress (%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ASSESSMENT DISTRIBUTION CHART
// ============================================================================

interface AssessmentDistributionChartProps {
  data: AssessmentReportData[];
}

export function AssessmentDistributionChart({
  data,
}: AssessmentDistributionChartProps) {
  // Create distribution buckets
  const buckets = [
    { range: "0-20", count: 0 },
    { range: "21-40", count: 0 },
    { range: "41-60", count: 0 },
    { range: "61-80", count: 0 },
    { range: "81-100", count: 0 },
  ];

  data.forEach((item) => {
    const nilai = item.persentase;
    if (nilai <= 20) buckets[0].count++;
    else if (nilai <= 40) buckets[1].count++;
    else if (nilai <= 60) buckets[2].count++;
    else if (nilai <= 80) buckets[3].count++;
    else buckets[4].count++;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Distribusi Nilai</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buckets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name="Jumlah Peserta" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ENGAGEMENT TREND CHART
// ============================================================================

interface EngagementTrendChartProps {
  data: EngagementReportData[];
}

export function EngagementTrendChart({ data }: EngagementTrendChartProps) {
  // Sort by engagement score and take top 10
  const sortedData = [...data]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10)
    .map((item) => ({
      nama:
        item.peserta_nama.length > 15
          ? item.peserta_nama.substring(0, 15) + "..."
          : item.peserta_nama,
      score: item.engagement_score,
      waktu: Math.round(item.total_waktu_belajar_menit / 60), // Convert to hours
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 10 Peserta Paling Aktif</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nama" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              name="Engagement Score"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="waktu"
              stroke="#f59e0b"
              name="Waktu Belajar (jam)"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// STATUS PIE CHART
// ============================================================================

interface StatusPieChartProps {
  data: ProgressReportData[];
}

export function StatusPieChart({ data }: StatusPieChartProps) {
  const statusCount = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  },
    {} as Record<string, number>,
  );

  const chartData = [
    {
      name: "Belum Mulai",
      value: statusCount.not_started || 0,
      color: "#94a3b8",
    },
    {
      name: "Sedang Berjalan",
      value: statusCount.in_progress || 0,
      color: "#3b82f6",
    },
    { name: "Selesai", value: statusCount.completed || 0, color: "#10b981" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status Pembelajaran</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
