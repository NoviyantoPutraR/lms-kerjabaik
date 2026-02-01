import { useState } from "react";
import { pemberitahuan } from "@/pustaka/pemberitahuan";
import { Button } from "@/komponen/ui/button";
import { Label } from "@/komponen/ui/label";
import { Card, CardContent } from "@/komponen/ui/card";
import { Save, Info, FileText } from "lucide-react";
import { useUpdateAssessment } from "../hooks/useAssessments";
import type { Assessment } from "../tipe/instructor.types";
import TextEditor from "@/komponen/ui/TextEditor";

interface AssignmentBuilderProps {
  assessment: Assessment;
  onSaveSuccess?: () => void;
}

export function AssignmentBuilder({
  assessment,
  onSaveSuccess,
}: AssignmentBuilderProps) {
  const [instructions, setInstructions] = useState(assessment.deskripsi || "");
  const updateMutation = useUpdateAssessment();

  const handleSave = () => {
    pemberitahuan.tampilkanPemuatan("Menyimpan instruksi...");
    updateMutation.mutate(
      {
        assessmentId: assessment.id,
        data: { deskripsi: instructions },
      },
      {
        onSuccess: () => {
          pemberitahuan.hilangkanPemuatan();
          pemberitahuan.sukses("Instruksi tugas berhasil disimpan");
          if (onSaveSuccess) onSaveSuccess();
        },
        onError: (error: any) => {
          pemberitahuan.hilangkanPemuatan();
          pemberitahuan.gagal(error.message || "Gagal menyimpan instruksi");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3 mb-2">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Editor Instruksi Tugas
        </h3>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="h-8 text-xs bg-primary"
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          {updateMutation.isPending ? "Menyimpan..." : "Simpan Instruksi"}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
               <div className="bg-muted/30 border-b px-4 py-2">
                <Label className="text-xs font-medium text-muted-foreground">Area Editor</Label>
               </div>
               <div className="p-0 min-h-[400px]">
                <TextEditor
                  value={instructions}
                  onChange={setInstructions}
                  placeholder="Tulis instruksi tugas lengkap, kriteria penilaian, dan format pengumpulan..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2 text-blue-700">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <h4 className="font-semibold text-sm">Validasi & Tips</h4>
              </div>
              
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p>Pastikan instruksi mencakup:</p>
                  <ul className="list-disc list-inside space-y-1 ml-1 text-foreground/80">
                    <li>Latar belakang & Tujuan tugas</li>
                    <li>Langkah-langkah pengerjaan detil</li>
                    <li>Format hasil akhir (PDF, Video, Link)</li>
                    <li>Tenggat waktu & Bobot nilai</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
