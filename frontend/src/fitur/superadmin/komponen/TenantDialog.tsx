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
import { Building, Link, Edit, Add } from "iconsax-react";

const tenantSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    slug: z
      .string()
      .min(3, "Slug minimal 3 karakter")
      .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
    tipe: z.string().min(1, "Tipe harus dipilih"),
    tipe_custom: z.string().optional(),
    status: z.enum(["aktif", "nonaktif", "suspended"]),
    url_logo: z.string().url("URL tidak valid").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (
        data.tipe === "custom" &&
        (!data.tipe_custom || data.tipe_custom.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Nama tipe custom harus diisi jika memilih Custom",
      path: ["tipe_custom"],
    },
  );

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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0 rounded-2xl data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:slide-in-from-bottom-[4%] data-[state=open]:zoom-in-[0.98] transition-all">
        <DialogHeader className="p-6 bg-gray-50/50 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              {isEdit ? <Edit size={20} variant="Bold" /> : <Add size={20} variant="Bold" />}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-gray-800">
                {isEdit ? "Edit Tenant" : "Tambah Tenant Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                {isEdit
                  ? "Ubah informasi dan konfigurasi tenant"
                  : "Daftarkan organisasi baru ke dalam sistem"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="nama" className="text-xs font-semibold text-gray-700">
                Nama Organisasi <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                <Input
                  id="nama"
                  {...register("nama")}
                  onChange={(e) => {
                    register("nama").onChange(e);
                    handleNamaChange(e);
                  }}
                  placeholder="Contoh: Pemerintah Provinsi Jawa Timur"
                  className="pl-9 h-10 rounded-xl border-gray-200 focus:border-violet-200 focus:ring-violet-100"
                />
              </div>
              {errors.nama && (
                <p className="text-[10px] text-red-500 font-medium ml-1">{errors.nama.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs font-semibold text-gray-700">
                Slug/Subdomain <span className="text-red-500">*</span>
              </Label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono group-focus-within:text-violet-500">/</span>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="provinsi-jatim"
                  className="pl-6 font-mono text-xs h-10 rounded-xl border-gray-200 focus:border-violet-200 focus:ring-violet-100 bg-gray-50/50"
                />
              </div>
              {errors.slug ? (
                <p className="text-[10px] text-red-500 font-medium ml-1">{errors.slug.message}</p>
              ) : slug && isSlugAvailable === false ? (
                <p className="text-[10px] text-red-500 font-medium ml-1">Slug sudah digunakan</p>
              ) : slug && isSlugAvailable === true ? (
                <p className="text-[10px] text-green-600 font-medium ml-1 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Slug tersedia</p>
              ) : null}
            </div>

            {/* Tipe */}
            <div className="space-y-2">
              <Label htmlFor="tipe" className="text-xs font-semibold text-gray-700">
                Tipe Organisasi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedTipe}
                onValueChange={(value) => setValue("tipe", value)}
              >
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-violet-100 text-sm">
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
                <p className="text-[10px] text-red-500 font-medium ml-1">{errors.tipe.message}</p>
              )}
            </div>

            {/* Custom Tipe */}
            {selectedTipe === "custom" && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="tipe_custom" className="text-xs font-semibold text-gray-700">
                  Nama Tipe Custom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tipe_custom"
                  {...register("tipe_custom")}
                  placeholder="Contoh: Lembaga Pemerintah"
                  className="h-10 rounded-xl border-gray-200 focus:border-violet-200 focus:ring-violet-100"
                />
                {errors.tipe_custom && (
                  <p className="text-[10px] text-red-500 font-medium ml-1">
                    {errors.tipe_custom.message}
                  </p>
                )}
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-xs font-semibold text-gray-700">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value: any) => setValue("status", value)}
              >
                <SelectTrigger className="h-10 rounded-xl border-gray-200 focus:ring-violet-100 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="nonaktif">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span> Non-Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Suspended
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="url_logo" className="text-xs font-semibold text-gray-700">URL Logo (Opsional)</Label>
              <div className="relative group">
                <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                <Input
                  id="url_logo"
                  {...register("url_logo")}
                  placeholder="https://example.com/logo.png"
                  type="url"
                  className="pl-9 h-10 rounded-xl border-gray-200 focus:border-violet-200 focus:ring-violet-100"
                />
              </div>
              {errors.url_logo && (
                <p className="text-[10px] text-red-500 font-medium ml-1">{errors.url_logo.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl border-gray-200 hover:bg-gray-50 h-10 px-6"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !!(slug && isSlugAvailable === false)}
              className="rounded-xl bg-[#7B6CF0] hover:bg-[#6a5cd6] text-white shadow-lg shadow-violet-200 h-10 px-6"
            >
              {isSubmitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
