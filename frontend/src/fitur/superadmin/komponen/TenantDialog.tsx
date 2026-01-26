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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import type { TenantWithStats } from "../tipe/tenant.types";
import { useCheckSlug } from "../hooks/useTenants";

const tenantSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  tipe: z.string().min(1, "Tipe harus dipilih"),
  tipe_custom: z.string().optional(),
  status: z.enum(["aktif", "nonaktif", "suspended"]),
  url_logo: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

interface TenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: TenantWithStats | null;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const TIPE_OPTIONS = [
  { value: "provinsi", label: "Provinsi" },
  { value: "bkd", label: "BKD/BKPSDM" },
  { value: "kampus", label: "Kampus" },
  { value: "korporasi", label: "Korporasi" },
  { value: "custom", label: "Custom (Input Manual)" },
];

export function TenantDialog({
  open,
  onOpenChange,
  tenant,
  onSubmit,
  isSubmitting,
}: TenantDialogProps) {
  const isEdit = !!tenant;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      nama: "",
      slug: "",
      tipe: "provinsi",
      tipe_custom: "",
      status: "aktif",
      url_logo: "",
    },
  });

  const selectedTipe = watch("tipe");
  const slug = watch("slug");

  // Check slug availability
  const { data: isSlugAvailable } = useCheckSlug(
    slug,
    isEdit ? tenant?.id : undefined,
  );

  // Reset form when dialog opens/closes or tenant changes
  useEffect(() => {
    if (open && tenant) {
      reset({
        nama: tenant.nama,
        slug: tenant.slug,
        tipe: TIPE_OPTIONS.some((opt) => opt.value === tenant.tipe)
          ? tenant.tipe
          : "custom",
        tipe_custom: TIPE_OPTIONS.some((opt) => opt.value === tenant.tipe)
          ? ""
          : tenant.tipe,
        status: tenant.status,
        url_logo: tenant.url_logo || "",
      });
    } else if (open) {
      reset({
        nama: "",
        slug: "",
        tipe: "provinsi",
        tipe_custom: "",
        status: "aktif",
        url_logo: "",
      });
    }
  }, [open, tenant, reset]);

  // Auto-generate slug from nama
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nama = e.target.value;
    if (!isEdit) {
      const slug = nama
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", slug);
    }
  };

  const handleFormSubmit = (data: TenantFormValues) => {
    const finalTipe =
      data.tipe === "custom" ? data.tipe_custom || "custom" : data.tipe;

    onSubmit({
      nama: data.nama,
      slug: data.slug,
      tipe: finalTipe,
      status: data.status,
      url_logo: data.url_logo || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Tenant" : "Tambah Tenant Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah informasi tenant yang sudah ada"
              : "Buat tenant baru untuk organisasi"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama">
              Nama Organisasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama"
              {...register("nama")}
              onChange={(e) => {
                register("nama").onChange(e);
                handleNamaChange(e);
              }}
              placeholder="Contoh: Pemerintah Provinsi Jawa Timur"
            />
            {errors.nama && (
              <p className="text-sm text-red-500">{errors.nama.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug/Subdomain <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="provinsi-jatim"
              className="font-mono"
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
            {slug && isSlugAvailable === false && (
              <p className="text-sm text-red-500">Slug sudah digunakan</p>
            )}
            {slug && isSlugAvailable === true && (
              <p className="text-sm text-green-600">Slug tersedia</p>
            )}
          </div>

          {/* Tipe */}
          <div className="space-y-2">
            <Label htmlFor="tipe">
              Tipe Organisasi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedTipe}
              onValueChange={(value) => setValue("tipe", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipe && (
              <p className="text-sm text-red-500">{errors.tipe.message}</p>
            )}
          </div>

          {/* Custom Tipe */}
          {selectedTipe === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="tipe_custom">
                Nama Tipe Custom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tipe_custom"
                {...register("tipe_custom")}
                placeholder="Contoh: Lembaga Pemerintah"
              />
              {errors.tipe_custom && (
                <p className="text-sm text-red-500">
                  {errors.tipe_custom.message}
                </p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("status")}
              onValueChange={(value: any) => setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_logo">Logo URL (Opsional)</Label>
            <Input
              id="url_logo"
              {...register("url_logo")}
              placeholder="https://example.com/logo.png"
              type="url"
            />
            {errors.url_logo && (
              <p className="text-sm text-red-500">{errors.url_logo.message}</p>
            )}
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
            <Button
              type="submit"
              disabled={isSubmitting || !!(slug && isSlugAvailable === false)}
            >
              {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
