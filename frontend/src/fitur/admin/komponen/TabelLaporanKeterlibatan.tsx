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
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { EngagementReportData } from "../api/reportsApi";
import { Activity, Clock, MessageSquare } from "lucide-react";

interface TabelLaporanKeterlibatanProps {
  data: EngagementReportData[];
  isLoading?: boolean;
}

export function TabelLaporanKeterlibatan({
  data,
  isLoading,
}: TabelLaporanKeterlibatanProps) {
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
          <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            Tidak ada data keterlibatan
          </p>
        </div>
      </div>
    );
  }

  const getEngagementBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-600">Sangat Aktif</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-blue-600">Aktif</Badge>;
    } else if (score >= 40) {
      return <Badge variant="secondary">Cukup Aktif</Badge>;
    } else {
      return <Badge variant="outline">Kurang Aktif</Badge>;
    }
  };

  const formatWaktu = (menit: number) => {
    const jam = Math.floor(menit / 60);
    const sisaMenit = menit % 60;
    return `${jam}j ${sisaMenit}m`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Peserta</TableHead>
            <TableHead>Kursus</TableHead>
            <TableHead>Waktu Belajar</TableHead>
            <TableHead>Login</TableHead>
            <TableHead>Interaksi</TableHead>
            <TableHead>Engagement Score</TableHead>
            <TableHead>Aktivitas Terakhir</TableHead>
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
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {formatWaktu(item.total_waktu_belajar_menit)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-center font-medium">
                  {item.jumlah_login}x
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <MessageSquare className="h-3 w-3 text-blue-600" />
                    <span>{item.interaksi_forum}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <MessageSquare className="h-3 w-3 text-green-600" />
                    <span>{item.interaksi_diskusi}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="w-32 space-y-1">
                  <div className="flex items-center justify-between">
                    <Progress
                      value={item.engagement_score}
                      className="h-2 flex-1"
                    />
                    <span className="ml-2 text-xs font-medium">
                      {item.engagement_score}
                    </span>
                  </div>
                  {getEngagementBadge(item.engagement_score)}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.aktivitas_terakhir), {
                    addSuffix: true,
                    locale: localeId,
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
