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
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { ProgressReportData } from "../api/reportsApi";
import { Clock, BookOpen } from "lucide-react";

interface TabelLaporanKemajuanProps {
  data: ProgressReportData[];
  isLoading?: boolean;
}

export function TabelLaporanKemajuan({
  data,
  isLoading,
}: TabelLaporanKemajuanProps) {
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
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Tidak ada data laporan
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      not_started: "outline",
      in_progress: "secondary",
      completed: "default",
    };

    const labels: Record<string, string> = {
      not_started: "Belum Mulai",
      in_progress: "Sedang Berjalan",
      completed: "Selesai",
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
            <TableHead>Kategori</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Modul</TableHead>
            <TableHead>Waktu Belajar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
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
                <div className="max-w-[200px] truncate">
                  {item.kursus_judul}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.kursus_kategori}</Badge>
              </TableCell>
              <TableCell>
                <div className="w-24 space-y-1">
                  <Progress value={item.persentase_kemajuan} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {item.persentase_kemajuan}%
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {item.modul_selesai} / {item.total_modul}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {Math.floor(item.waktu_belajar_menit / 60)}j{" "}
                  {item.waktu_belajar_menit % 60}m
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                {item.tanggal_mulai
                  ? format(new Date(item.tanggal_mulai), "dd MMM yyyy", {
                    locale: localeId,
                  })
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
