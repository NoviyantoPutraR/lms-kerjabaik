import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import type { KursusWithInstructor } from "../tipe/courses.types";
import { useInstructors } from "../hooks/useAdminCourses";

// Predefined categories (same as in AdminCoursesPage)
const courseCategories = [
  { value: "teknologi", label: "Teknologi" },
  { value: "bisnis", label: "Bisnis & Manajemen" },
  { value: "soft-skills", label: "Soft Skills" },
  { value: "bahasa", label: "Bahasa" },
  { value: "kepemimpinan", label: "Kepemimpinan" },
  { value: "teknis", label: "Kompetensi Teknis" },
  { value: "lainnya", label: "Lainnya" },
];

const courseSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  deskripsi: z.string().optional(),
  kategori: z.string().min(1, "Kategori harus dipilih"),
  id_instruktur: z.string().optional(),
  status: z.enum(["draft", "published"]),
  enrollment_policy: z
    .enum(["self_enrollment", "admin_approval", "auto_enrollment"])
    .default("self_enrollment"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface DialogKursusAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CourseFormValues) => void;
  isSubmitting?: boolean;
  course?: KursusWithInstructor | null; // If provided, edit mode
}

export function DialogKursusAdmin({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  course,
}: DialogKursusAdminProps) {
  const isEdit = !!course;
  const { data: instructors } = useInstructors();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      judul: "",
      deskripsi: "",
      kategori: "",
      id_instruktur: "none",
      status: "draft",
      enrollment_policy: "self_enrollment",
    },
  });

  // Watch values for select components
  const watchedKategori = watch("kategori");
  const watchedInstruktur = watch("id_instruktur");
  const watchedStatus = watch("status");
  const watchedEnrollmentPolicy = watch("enrollment_policy");

  // Reset form when dialog opens/closes or course changes
  useEffect(() => {
    if (open) {
      if (course) {
        reset({
          judul: course.judul,
          deskripsi: course.deskripsi || "",
          kategori: course.kategori || "",
          id_instruktur: course.id_instruktur || "",
          status: (course.status === "archived" ? "draft" : course.status) as
            | "draft"
            | "published",
          enrollment_policy:
            (course as any).enrollment_policy || "self_enrollment",
        });
      } else {
        reset({
          judul: "",
          deskripsi: "",
          kategori: "",
          id_instruktur: "",
          status: "draft",
          enrollment_policy: "self_enrollment",
        });
      }
    }
  }, [open, course, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Kursus" : "Tambah Kursus Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah informasi kursus ini."
              : "Buat kursus baru. Anda bisa menambahkan konten modul nanti."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Judul */}
          <div className="space-y-2">
            <Label htmlFor="judul">
              Judul Kursus <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              {...register("judul")}
              placeholder="Contoh: Dasar Pemrograman Python"
            />
            {errors.judul && (
              <p className="text-sm text-red-500">{errors.judul.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="kategori">
              Kategori <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedKategori}
              onValueChange={(val) => setValue("kategori", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {courseCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.kategori && (
              <p className="text-sm text-red-500">{errors.kategori.message}</p>
            )}
          </div>

          {/* Instruktur (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="instruktur">Instruktur (Opsional)</Label>
            <Select
              value={watchedInstruktur || "none"}
              onValueChange={(val) =>
                setValue("id_instruktur", val === "none" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Instruktur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Belum Ada Instruktur --</SelectItem>
                {instructors?.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.nama_lengkap}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Anda bisa menugaskan instruktur nanti setelah kursus dibuat.
            </p>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              {...register("deskripsi")}
              placeholder="Deskripsi singkat tentang kursus ini..."
              rows={4}
            />
          </div>

          {/* Kebijakan Enrollment */}
          <div className="space-y-2">
            <Label htmlFor="enrollment_policy">
              Kebijakan Enrollment <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watchedEnrollmentPolicy}
              onValueChange={(
                val: "self_enrollment" | "admin_approval" | "auto_enrollment",
              ) => setValue("enrollment_policy", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self_enrollment">
                  Pendaftaran Mandiri
                </SelectItem>
                <SelectItem value="admin_approval">
                  Persetujuan Admin
                </SelectItem>
                <SelectItem value="auto_enrollment">
                  Auto-enrollment (Tenant)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {watchedEnrollmentPolicy === "self_enrollment" &&
                "Peserta dapat mendaftar sendiri ke kursus ini"}
              {watchedEnrollmentPolicy === "admin_approval" &&
                "Pendaftaran memerlukan persetujuan admin"}
              {watchedEnrollmentPolicy === "auto_enrollment" &&
                "Semua user di tenant otomatis terdaftar"}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status Awal</Label>
            <Select
              value={watchedStatus}
              onValueChange={(val: "draft" | "published") =>
                setValue("status", val)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Belum Terbit)</SelectItem>
                <SelectItem value="published">Published (Terbit)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Buat Kursus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
