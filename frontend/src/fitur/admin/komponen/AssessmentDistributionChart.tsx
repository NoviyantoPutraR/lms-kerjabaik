import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import type { AssessmentReportData } from "../api/reportsApi";

interface AssessmentDistributionChartProps {
  data: AssessmentReportData[];
}

export function AssessmentDistributionChart({
  data,
}: AssessmentDistributionChartProps) {
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
