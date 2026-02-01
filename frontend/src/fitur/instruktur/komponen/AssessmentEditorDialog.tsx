import { useState, useEffect } from "react";
import { pemberitahuan } from "@/pustaka/pemberitahuan";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/komponen/ui/dialog";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import { Label } from "@/komponen/ui/label";
import { Textarea } from "@/komponen/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import { Switch } from "@/komponen/ui/switch";
import {
  useCreateAssessment,
  useUpdateAssessment,
} from "../hooks/useAssessments";
import type { Assessment, AssessmentType } from "../tipe/instructor.types";

interface AssessmentEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kursusId: string;
  moduleId?: string;
  assessment?: Assessment | null;
  defaultType?: AssessmentType;
}

export function AssessmentEditorDialog({
  isOpen,
  onClose,
  kursusId,
  moduleId,
  assessment,
  defaultType = "kuis",
}: AssessmentEditorDialogProps) {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tipe, setTipe] = useState<AssessmentType>(defaultType);
  const [passingScore, setPassingScore] = useState(70);
  const [durasiMenit, setDurasiMenit] = useState(0);
  const [jumlahPercobaan, setJumlahPercobaan] = useState(1);
  const [acakSoal, setAcakSoal] = useState(false);
  const [tampilkanJawaban, setTampilkanJawaban] = useState(true);
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    "draft",
  );

  const createMutation = useCreateAssessment();
  const updateMutation = useUpdateAssessment();

  useEffect(() => {
    if (assessment) {
      setJudul(assessment.judul);
      setDeskripsi(assessment.deskripsi || "");
      setTipe(assessment.tipe);
      setPassingScore(assessment.nilai_kelulusan);
      setDurasiMenit(assessment.durasi_menit || 0);
      setJumlahPercobaan(assessment.jumlah_percobaan);
      setAcakSoal(assessment.acak_soal);
      setTampilkanJawaban(assessment.tampilkan_jawaban);
      setStatus(assessment.status);
    } else {
      setJudul("");
      setDeskripsi("");
      setTipe(defaultType);
      setPassingScore(70);
      setDurasiMenit(0);
      setJumlahPercobaan(1);
      setAcakSoal(false);
      setTampilkanJawaban(true);
      setStatus("draft");
    }
  }, [assessment, isOpen, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      id_modul: moduleId || null,
      judul,
      deskripsi,
      tipe,
      nilai_kelulusan: passingScore,
      durasi_menit: durasiMenit > 0 ? durasiMenit : null,
      jumlah_percobaan: jumlahPercobaan,
      acak_soal: acakSoal,
      tampilkan_jawaban: tampilkanJawaban,
      status,
    };

    pemberitahuan.tampilkanPemuatan(assessment ? "Menyimpan perubahan..." : "Membuat asesmen...");

    const onSuccess = () => {
      pemberitahuan.hilangkanPemuatan();
      pemberitahuan.sukses(assessment ? "Asesmen berhasil diperbarui" : "Asesmen berhasil dibuat");
      onClose();
    };

    const onError = (error: any) => {
      pemberitahuan.hilangkanPemuatan();
      pemberitahuan.gagal(error.message || "Gagal menyimpan asesmen");
    };

    if (assessment) {
      updateMutation.mutate(
        { assessmentId: assessment.id, data },
        { onSuccess, onError },
      );
    } else {
      createMutation.mutate({ kursusId, data }, { onSuccess, onError });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 py-4 border-b bg-muted/40">
            <DialogTitle className="text-lg">
              {assessment ? "Edit Asesmen" : `Tambah ${defaultType === "kuis" ? "Kuis" : "Tugas"} Baru`}
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 grid gap-4">
            {/* Row 1: Judul */}
            <div className="grid gap-1.5">
              <Label htmlFor="judul" className="text-xs font-semibold text-muted-foreground">Judul Asesmen</Label>
              <Input
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder={defaultType === "kuis" ? "Contoh: Kuis Akhir Modul 1" : "Contoh: Tugas Praktik Coding"}
                required
                className="h-9"
              />
            </div>

            {/* Row 2: Deskripsi */}
            <div className="grid gap-1.5">
              <Label htmlFor="deskripsi" className="text-xs font-semibold text-muted-foreground">Deskripsi (Opsional)</Label>
              <Textarea
                id="deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Berikan instruksi singkat..."
                className="min-h-[60px] resize-none text-sm"
              />
            </div>

            {/* Row 3: Settings Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="tipe" className="text-xs font-semibold text-muted-foreground">Tipe</Label>
                <Select
                  value={tipe}
                  onValueChange={(value) => setTipe(value as AssessmentType)}
                  disabled={!!assessment || !!defaultType}
                >
                  <SelectTrigger id="tipe" className="h-8 text-xs">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kuis">Kuis (Auto)</SelectItem>
                    <SelectItem value="tugas">Tugas (Manual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="status" className="text-xs font-semibold text-muted-foreground">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as "draft" | "published" | "archived")
                  }
                >
                  <SelectTrigger id="status" className="h-8 text-xs">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="passingScore" className="text-xs font-semibold text-muted-foreground">Kelulusan (0-100)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Row 4: Additional Settings (Only for Quiz/Exam) */}
            {tipe !== "tugas" && (
              <div className="bg-muted/30 p-3 rounded-md space-y-3 border border-border/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="durasi" className="text-xs font-semibold text-muted-foreground">Durasi (Menit)</Label>
                    <Input
                      id="durasi"
                      type="number"
                      min="0"
                      value={durasiMenit}
                      onChange={(e) => setDurasiMenit(parseInt(e.target.value) || 0)}
                      className="h-8 text-xs bg-background"
                      placeholder="0 = Tanpa Batas"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="percobaan" className="text-xs font-semibold text-muted-foreground">Max Percobaan</Label>
                    <Input
                      id="percobaan"
                      type="number"
                      min="1"
                      value={jumlahPercobaan}
                      onChange={(e) =>
                        setJumlahPercobaan(parseInt(e.target.value) || 1)
                      }
                      className="h-8 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="acak-soal"
                      checked={acakSoal} 
                      onCheckedChange={setAcakSoal} 
                      className="scale-90 origin-left"
                    />
                    <Label htmlFor="acak-soal" className="text-xs font-normal cursor-pointer">Acak Urutan Soal</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      id="tampil-jawaban"
                      checked={tampilkanJawaban} 
                      onCheckedChange={setTampilkanJawaban} 
                      className="scale-90 origin-left"
                    />
                    <Label htmlFor="tampil-jawaban" className="text-xs font-normal cursor-pointer">Lihat Jawaban</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-muted/40 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="h-8 text-xs"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              size="sm"
              disabled={isPending || !judul}
              className="h-8 text-xs px-4"
            >
              {isPending
                ? "Menyimpan..."
                : assessment
                  ? "Simpan Perubahan"
                  : "Buat Asesmen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

