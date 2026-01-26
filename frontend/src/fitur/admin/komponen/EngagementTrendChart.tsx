import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import type { EngagementReportData } from "../api/reportsApi";

interface EngagementTrendChartProps {
  data: EngagementReportData[];
}

export function EngagementTrendChart({ data }: EngagementTrendChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, 10)
    .map((item) => ({
      nama:
        item.peserta_nama.length > 15
          ? item.peserta_nama.substring(0, 15) + "..."
          : item.peserta_nama,
      score: item.engagement_score,
      waktu: Math.round(item.total_waktu_belajar_menit / 60),
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
