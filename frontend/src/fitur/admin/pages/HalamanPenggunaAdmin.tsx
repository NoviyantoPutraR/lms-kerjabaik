import { useState } from "react";
import {
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
} from "../hooks/useAdminUsers";
import { DialogPenggunaAdmin } from "@/fitur/admin/komponen/DialogPenggunaAdmin";
import { Button } from "@/komponen/ui/button";
import { Input } from "@/komponen/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/komponen/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/komponen/ui/alert-dialog";
import { Search, Plus } from "lucide-react";
import { TabelPenggunaAdmin } from "../komponen/TabelPenggunaAdmin";
import type { AdminUserFilters, AdminUserData } from "../tipe/admin.types";
import type { Database } from "@/shared/tipe/database.types";
import { useToast } from "@/komponen/ui/use-toast";

type Pengguna = Database["public"]["Tables"]["pengguna"]["Row"];

export function HalamanPenggunaAdmin() {
  const [filters, setFilters] = useState<AdminUserFilters>({
    page: 1,
    limit: 20,
  });
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Pengguna | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    nama: string;
  } | null>(null);

  const { data: usersData, isLoading } = useAdminUsers(filters);
  const createUserMutation = useCreateAdminUser();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();
  const { toast } = useToast();

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleRoleFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      role: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? undefined : value,
      page: 1,
    }));
  };

  const handleCreateUser = async (data: AdminUserData) => {
    try {
      await createUserMutation.mutateAsync(data);
      setUserDialogOpen(false);
      toast({
        title: "User berhasil dibuat",
        description: `${data.nama_lengkap} telah ditambahkan ke sistem.`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal membuat user",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (data: AdminUserData) => {
    if (!editingUser) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        data,
      });
      setUserDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "User berhasil diupdate",
        description: `Perubahan pada ${data.nama_lengkap} telah disimpan.`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal update user",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  const handleSubmitUser = (data: AdminUserData) => {
    if (editingUser) {
      handleUpdateUser(data);
    } else {
      handleCreateUser(data);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: Pengguna) => {
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const confirmDeleteUser = (user: { id: string; nama: string }) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      toast({
        title: "User berhasil dihapus",
        description: `${userToDelete.nama} telah dihapus dari sistem.`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal menghapus user",
        description: error.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manajemen Pengguna
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola akses, peran, dan status pengguna dalam organisasi Anda
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
                className="pl-10 h-10 shadow-none border-muted focus-visible:ring-blue-500"
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <Select
              value={filters.role || "all"}
              onValueChange={handleRoleFilter}
            >
              <SelectTrigger className="h-10 shadow-none border-muted">
                <SelectValue placeholder="Semua Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Peran</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="instruktur">Instruktur</SelectItem>
                <SelectItem value="pembelajar">Pembelajar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="h-10 shadow-none border-muted">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Non-Aktif</SelectItem>
                <SelectItem value="suspended">Ditangguhkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      {usersData && (
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
          <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
            Menampilkan <span className="font-bold">{usersData.data.length}</span> dari <span className="font-bold">{usersData.count}</span> pengguna
            {filters.search || filters.role || filters.status
              ? " (hasil filter)"
              : ""}
          </p>
        </div>
      )}

      {/* Table */}
      <TabelPenggunaAdmin
        users={usersData?.data || []}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onDelete={(user) =>
          confirmDeleteUser({ id: user.id, nama: user.nama_lengkap })
        }
      />

      {/* Pagination */}
      {usersData && usersData.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t mt-2">
          <p className="text-sm text-muted-foreground">
            Halaman <span className="font-bold text-foreground">{usersData.page}</span> dari <span className="font-bold text-foreground">{usersData.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={usersData.page === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))
              }
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={usersData.page === usersData.totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))
              }
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* User Dialog */}
      <DialogPenggunaAdmin
        open={userDialogOpen}
        onOpenChange={(open: boolean) => {
          setUserDialogOpen(open);
          if (!open) setEditingUser(null);
        }}
        onSubmit={handleSubmitUser}
        isSubmitting={
          createUserMutation.isPending || updateUserMutation.isPending
        }
        user={editingUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open: boolean) => setDeleteDialogOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna{" "}
              <span className="font-bold text-foreground">{userToDelete?.nama}</span> secara
              permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
