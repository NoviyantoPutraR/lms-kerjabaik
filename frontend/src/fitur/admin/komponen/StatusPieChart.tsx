import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/komponen/ui/card";
import type { ProgressReportData } from "../api/reportsApi";

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
    {
      name: "Selesai",
      value: statusCount.completed || 0,
      color: "#10b981",
    },
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
