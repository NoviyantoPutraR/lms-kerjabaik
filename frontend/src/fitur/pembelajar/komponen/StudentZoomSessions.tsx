import { 
  Card, 
  CardContent 
} from "@/komponen/ui/card";
import { Button } from "@/komponen/ui/button";
import { Badge } from "@/komponen/ui/badge";
import { Skeleton } from "@/komponen/ui/skeleton";
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { useZoomSessions } from "@/fitur/instruktur/hooks/useZoom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface StudentZoomSessionsProps {
  kursusId: string;
}

export function StudentZoomSessions({ kursusId }: StudentZoomSessionsProps) {
  const { data: sessions, isLoading } = useZoomSessions(kursusId);

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

  const isJoinable = (startTime: string, duration: number) => {
    const now = new Date();
    const start = new Date(startTime);
    const fifteenMinutesBefore = new Date(start.getTime() - 15 * 60000);
    const end = new Date(start.getTime() + duration * 60000);
    
    return now >= fifteenMinutesBefore && now <= end;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
        <Video className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-500">Belum ada jadwal sesi live Zoom untuk kursus ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const joinable = isJoinable(session.waktu_mulai, session.durasi_menit);
        
        return (
          <Card key={session.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{session.judul}</h4>
                      {getStatusBadge(session.waktu_mulai, session.durasi_menit)}
                    </div>
                    {session.deskripsi && (
                      <p className="text-xs text-zinc-500 line-clamp-1">{session.deskripsi}</p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-medium text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(session.waktu_mulai), "eeee, d MMMM yyyy", { locale: idLocale })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(session.waktu_mulai), "HH:mm")} WIB ({session.durasi_menit} menit)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    variant={joinable ? "default" : "outline"}
                    size="sm" 
                    className={`h-9 text-xs font-bold rounded-xl ${joinable ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    disabled={!joinable && !session.recording_url}
                    onClick={() => {
                      if (joinable) {
                        window.open(session.tautan_zoom, "_blank");
                      } else if (session.recording_url) {
                        window.open(session.recording_url, "_blank");
                      }
                    }}
                  >
                    {joinable ? (
                      <>
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Gabung Sekarang
                      </>
                    ) : session.recording_url ? (
                      <>
                        <Video className="mr-2 h-3.5 w-3.5" />
                        Lihat Rekaman
                      </>
                    ) : (
                      "Belum Dimulai"
                    )}
                  </Button>
                  {!joinable && !session.recording_url && (
                    <p className="text-[10px] text-center text-zinc-400">
                      Link akan aktif 15 menit sebelum mulai
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
