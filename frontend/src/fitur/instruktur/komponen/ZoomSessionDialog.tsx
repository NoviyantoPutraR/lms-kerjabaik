import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/komponen/ui/dialog";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import { Label } from "@/komponen/ui/label";
import { Textarea } from "@/komponen/ui/textarea";
import { Video, ExternalLink } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/komponen/ui/select";
import type { 
  ZoomSession, 
  ZoomSessionStatus
} from "../tipe/instructor.types";

interface ZoomSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: ZoomSession | null;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export function ZoomSessionDialog({
  open,
  onOpenChange,
  session,
  onSave,
  isLoading = false,
}: ZoomSessionDialogProps) {
  const [formData, setFormData] = useState<any>({
    judul: "",
    deskripsi: "",
    tautan_zoom: "",
    waktu_mulai: "",
    durasi_menit: 60,
    status: "published" as ZoomSessionStatus,
  });

  // Initialize form when session changes
  useEffect(() => {
    if (session) {
      // Format ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
      const date = new Date(session.waktu_mulai);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        judul: session.judul,
        deskripsi: session.deskripsi || "",
        tautan_zoom: session.tautan_zoom,
        waktu_mulai: localDateTime,
        durasi_menit: session.durasi_menit,
        status: session.status,
        recording_url: session.recording_url || "",
      });
    } else {
      // Set default start time to 1 hour from now, rounded to next 30 mins
      const now = new Date();
      now.setHours(now.getHours() + 1);
      now.setMinutes(now.getMinutes() > 30 ? 60 : 30);
      const defaultStartTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setFormData({
        judul: "",
        deskripsi: "",
        tautan_zoom: "",
        waktu_mulai: defaultStartTime,
        durasi_menit: 60,
        status: "published",
      });
    }
  }, [session, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.tautan_zoom.trim() || !formData.waktu_mulai) {
      return;
    }

    // Convert local time back to ISO for API
    const isoWaktuMulai = new Date(formData.waktu_mulai).toISOString();
    
    onSave({
      ...formData,
      waktu_mulai: isoWaktuMulai,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-4 text-white">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-white text-lg font-bold flex items-center gap-2">
                <Video className="h-5 w-5" />
                {session ? "Edit Sesi Live" : "Jadwal Sesi Baru"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-xs">
                {session
                  ? "Perbarui rincian pertemuan tatap muka daring"
                  : "Buat jadwal pertemuan baru untuk kursus ini"}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-4 space-y-4 bg-white dark:bg-zinc-900">
            <div className="space-y-1.5">
              <Label htmlFor="judul" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Judul Sesi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                className="h-9 text-sm focus-visible:ring-blue-500"
                placeholder="Contoh: Q&A Live Session - Modul 1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="waktu_mulai" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </Label>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">WIB</span>
                </div>
                <Input
                  id="waktu_mulai"
                  type="datetime-local"
                  value={formData.waktu_mulai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktu_mulai: e.target.value })
                  }
                  className="h-9 text-sm focus-visible:ring-blue-500 w-full"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="durasi" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Durasi (Menit)
                </Label>
                <Input
                  id="durasi"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.durasi_menit}
                  onChange={(e) =>
                    setFormData({ ...formData, durasi_menit: parseInt(e.target.value) || 60 })
                  }
                  className="h-9 text-sm focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tautan_zoom" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Tautan Zoom / Link Meeting <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
                <Input
                  id="tautan_zoom"
                  value={formData.tautan_zoom}
                  onChange={(e) =>
                    setFormData({ ...formData, tautan_zoom: e.target.value })
                  }
                  className="h-9 pl-9 text-sm focus-visible:ring-blue-500"
                  placeholder="https://zoom.us/j/..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: ZoomSessionStatus) => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published" className="text-xs">Publish</SelectItem>
                    <SelectItem value="draft" className="text-xs">Draf</SelectItem>
                    <SelectItem value="archived" className="text-xs">Arsip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {session && (
                 <div className="space-y-1.5">
                    <Label htmlFor="recording_url" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Link Rekaman
                    </Label>
                    <Input
                      id="recording_url"
                      value={formData.recording_url || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, recording_url: e.target.value })
                      }
                      className="h-9 text-sm focus-visible:ring-blue-500"
                      placeholder="https://..."
                    />
                  </div>
              )}
            </div>

            {!session && (
              <div className="space-y-1.5">
                <Label htmlFor="deskripsi" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Deskripsi Singkat
                </Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className="text-xs resize-none"
                  placeholder="Opsional - keterangan untuk siswa"
                  rows={2}
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !formData.judul.trim() || !formData.tautan_zoom.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 rounded-lg"
            >
              {isLoading ? "Menyimpan..." : session ? "Update Sesi" : "Buat Sesi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
