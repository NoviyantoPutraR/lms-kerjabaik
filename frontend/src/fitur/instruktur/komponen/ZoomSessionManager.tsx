import { useState } from "react";
import { 
  Card 
} from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  ExternalLink, 
  MoreVertical,
  Trash2,
  Edit2
} from "lucide-react";
import { 
  useZoomSessions, 
  useZoomMutations 
} from "../hooks/useZoom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/komponen/ui/dropdown-menu";
import { ZoomSessionDialog } from "./ZoomSessionDialog";
import { pemberitahuan } from "@/pustaka/pemberitahuan";
import type { ZoomSession } from "../tipe/instructor.types";

interface ZoomSessionManagerProps {
  kursusId: string;
}

export function ZoomSessionManager({ kursusId }: ZoomSessionManagerProps) {
  const { data: sessions, isLoading } = useZoomSessions(kursusId);
  const { createMutation, updateMutation, deleteMutation } = useZoomMutations(kursusId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ZoomSession | null>(null);

  const handleCreate = () => {
    setEditingSession(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (session: ZoomSession) => {
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      pemberitahuan.tampilkanPemuatan("Sedang menyimpan sesi Zoom...");
      if (editingSession) {
        await updateMutation.mutateAsync({ sessionId: editingSession.id, data });
        pemberitahuan.sukses("Sesi Zoom berhasil diperbarui.");
      } else {
        await createMutation.mutateAsync(data);
        pemberitahuan.sukses("Sesi Zoom baru berhasil dijadwalkan.");
      }
      setIsDialogOpen(false);
    } catch (error) {
      pemberitahuan.gagal("Gagal menyimpan sesi Zoom.");
    } finally {
      pemberitahuan.hilangkanPemuatan();
    }
  };

  const getStatusBadge = (startTime: string, duration: number) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);

    if (now < start) {
      return <Badge variant="secondary">Mendatang</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Sedang Berlangsung</Badge>;
    } else {
      return <Badge variant="outline">Selesai</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Sesi Live Zoom</h3>
          <p className="text-sm text-muted-foreground">Kelola jadwal pertemuan tatap muka daring untuk kursus ini.</p>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Sesi
        </Button>
      </div>

      <div className="grid gap-4">
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <Card key={session.id} className="group overflow-hidden border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white leading-tight">{session.judul}</h4>
                      {getStatusBadge(session.waktu_mulai, session.durasi_menit)}
                      {session.status === 'draft' && (
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-500">
                          Draf
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        {format(new Date(session.waktu_mulai), "eeee, d MMM yyyy", { locale: idLocale })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        {format(new Date(session.waktu_mulai), "HH:mm")} WIB ({session.durasi_menit}m)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 text-xs font-bold rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" 
                    onClick={() => window.open(session.tautan_zoom, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-3.5 w-3.5" />
                    Buka Zoom
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 dark:border-zinc-800 p-1">
                      <DropdownMenuItem 
                        className="text-xs font-medium rounded-lg cursor-pointer" 
                        onClick={() => handleEdit(session)}
                      >
                        <Edit2 className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Edit Sesi
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/20 rounded-lg cursor-pointer"
                        onClick={() => {
                          pemberitahuan.konfirmasi(
                            "Hapus Sesi",
                            "Apakah Anda yakin ingin menghapus sesi ini? Tindakan ini tidak dapat dibatalkan.",
                            async () => {
                              try {
                                pemberitahuan.tampilkanPemuatan("Menghapus sesi...");
                                await deleteMutation.mutateAsync(session.id);
                                pemberitahuan.sukses("Sesi Zoom berhasil dihapus.");
                              } catch (error) {
                                pemberitahuan.gagal("Gagal menghapus sesi.");
                              } finally {
                                pemberitahuan.hilangkanPemuatan();
                              }
                            }
                          );
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus Sesi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800">
            <Video className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
            <p className="text-sm font-medium text-muted-foreground">Belum ada jadwal sesi Zoom</p>
            <Button variant="link" size="sm" className="mt-1" onClick={handleCreate}>Buat sesi pertama</Button>
          </div>
        )}
      </div>

      <ZoomSessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        session={editingSession}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
