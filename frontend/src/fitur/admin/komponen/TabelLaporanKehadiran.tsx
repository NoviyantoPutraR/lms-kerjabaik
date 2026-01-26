import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/komponen/ui/table";
import { Badge } from "@/komponen/ui/badge";
import { Progress } from "@/komponen/ui/progress";
import type { AttendanceReportData } from "../api/reportsApi";
import { UserCheck } from "lucide-react";

interface TabelLaporanKehadiranProps {
  data: AttendanceReportData[];
  isLoading?: boolean;
}

export function TabelLaporanKehadiran({
  data,
  isLoading,
}: TabelLaporanKehadiranProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">Memuat data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <UserCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Tidak ada data kehadiran
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      hadir: "default",
      izin: "secondary",
      tidak_hadir: "destructive",
    };

    const labels: Record<string, string> = {
      hadir: "Hadir",
      izin: "Izin",
      tidak_hadir: "Tidak Hadir",
    };

    return (
      <Badge variant={variants[status] || "outline"}>{labels[status]}</Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Peserta</TableHead>
            <TableHead>Kursus</TableHead>
            <TableHead>Total Sesi</TableHead>
            <TableHead>Sesi Hadir</TableHead>
            <TableHead>Persentase Kehadiran</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{item.peserta_nama}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.peserta_email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[250px] truncate">
                  {item.kursus_judul}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-center font-medium">{item.total_sesi}</div>
              </TableCell>
              <TableCell>
                <div className="text-center font-medium">{item.sesi_hadir}</div>
              </TableCell>
              <TableCell>
                <div className="w-32 space-y-1">
                  <Progress value={item.persentase_kehadiran} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {item.persentase_kehadiran}%
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(item.status_kehadiran)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
