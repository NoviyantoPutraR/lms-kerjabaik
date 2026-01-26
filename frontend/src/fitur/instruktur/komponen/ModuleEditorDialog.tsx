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
import type { Module, CreateModuleData } from "../api/modulesApi";

interface ModuleEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: Module | null;
  onSave: (data: CreateModuleData) => void;
  isLoading?: boolean;
}

export function ModuleEditorDialog({
  open,
  onOpenChange,
  module,
  onSave,
  isLoading = false,
}: ModuleEditorDialogProps) {
  const [formData, setFormData] = useState<CreateModuleData>({
    judul: "",
    deskripsi: "",
    durasi_menit: undefined,
  });

  // Initialize form when module changes
  useEffect(() => {
    if (module) {
      setFormData({
        judul: module.judul,
        deskripsi: module.deskripsi || "",
        durasi_menit: module.durasi_menit || undefined,
      });
    } else {
      setFormData({
        judul: "",
        deskripsi: "",
        durasi_menit: undefined,
      });
    }
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {module ? "Edit Modul" : "Tambah Modul Baru"}
            </DialogTitle>
            <DialogDescription>
              {module
                ? "Update informasi modul pembelajaran"
                : "Buat modul pembelajaran baru untuk kursus ini"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="judul">
                Judul Modul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
                placeholder="Contoh: Pengenalan React Hooks"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                placeholder="Jelaskan apa yang akan dipelajari di modul ini..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="durasi">Estimasi Durasi (menit)</Label>
              <Input
                id="durasi"
                type="number"
                min="0"
                value={formData.durasi_menit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durasi_menit: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Estimasi waktu yang dibutuhkan untuk menyelesaikan modul ini
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.judul.trim()}
            >
              {isLoading ? "Menyimpan..." : module ? "Update" : "Buat Modul"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
