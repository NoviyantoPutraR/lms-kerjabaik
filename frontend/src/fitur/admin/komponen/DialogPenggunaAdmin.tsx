import { useEffect, useMemo } from "react";
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
import type { AdminUserData } from "../tipe/admin.types";
import type { Database } from "@/shared/tipe/database.types";


type Pengguna = Database["public"]["Tables"]["pengguna"]["Row"];

interface UserFormValues {
  nama_lengkap: string;
  email: string;
  password?: string;
  role: "admin" | "instruktur" | "pembelajar";
}

interface DialogPenggunaAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AdminUserData) => void;
  isSubmitting?: boolean;
  user?: Pengguna | null;
}

export function DialogPenggunaAdmin({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  user,
}: DialogPenggunaAdminProps) {
  const isEdit = !!user;

  // Dynamic schema based on edit mode
  const schema = useMemo(() => {
    return z.object({
      nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
      email: z.string().email("Email tidak valid"),
      password: isEdit
        ? z
          .string()
          .optional()
          .refine(
            (val) => !val || val.length === 0 || val.length >= 6,
            "Password minimal 6 karakter jika diisi",
          )
        : z.string().min(6, "Password minimal 6 karakter"),
      role: z.enum(["admin", "instruktur", "pembelajar"]),
    });
  }, [isEdit]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama_lengkap: "",
      email: "",
      password: "",
      role: "pembelajar",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (user) {
      reset({
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        password: "", // Clear password field
        role: user.role as "admin" | "instruktur" | "pembelajar",
      });
    } else {
      reset({
        nama_lengkap: "",
        email: "",
        password: "",
        role: "pembelajar",
      });
    }
  }, [user, reset]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = async (data: UserFormValues) => {
    const submitData: AdminUserData = {
      nama_lengkap: data.nama_lengkap,
      email: data.email,
      role: data.role,
    };

    // Sertakan password jika diisi
    if (data.password && data.password.length >= 6) {
      submitData.password = data.password;
    }

    onSubmit(submitData);
  };

  // Check if role field should be disabled
  // Disable if editing an admin (self or other) or if not permitted
  const isRoleDisabled = isEdit && user?.role === "admin";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User Baru"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah informasi user"
              : "Buat user baru untuk organisasi Anda"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nama Lengkap */}
          <div className="space-y-2">
            <Label htmlFor="nama_lengkap">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nama_lengkap"
              {...register("nama_lengkap")}
              placeholder="John Doe"
            />
            {errors.nama_lengkap && (
              <p className="text-sm text-red-500">
                {errors.nama_lengkap.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              disabled={isEdit} // Cannot change email when editing
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password{" "}
              {isEdit ? (
                <span className="text-gray-500 font-normal">(Opsional)</span>
              ) : (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder={
                isEdit
                  ? "Kosongkan jika tidak ingin mengubah"
                  : "Minimal 6 karakter"
              }
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            {isEdit && (
              <p className="text-xs text-gray-500">
                Kosongkan jika tidak ingin mengubah password
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("role")}
              onValueChange={(value: any) => setValue("role", value)}
              disabled={isRoleDisabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* Show Admin option only if the user is already an admin (for display purpopse) */}
                {watch("role") === "admin" && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
                <SelectItem value="instruktur">Instruktur</SelectItem>
                <SelectItem value="pembelajar">Pembelajar</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
            {isRoleDisabled && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Role admin tidak dapat diubah
              </p>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
