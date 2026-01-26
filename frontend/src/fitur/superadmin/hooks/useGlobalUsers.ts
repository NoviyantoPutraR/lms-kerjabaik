import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchGlobalUsers,
  getGlobalUser,
  updateUserStatus,
  getAdminUsers,
  createGlobalUser,
  updateGlobalUser,
  deleteGlobalUser,
} from "../api/usersApi";
import type {
  GlobalUserFilters,
  CreateUserData,
  UpdateUserData,
} from "../api/usersApi";
import { createAuditLog } from "../api/auditLogsApi";
import { useAuthStore } from "@/fitur/autentikasi/stores/authStore";

/**
 * Hook untuk search global users
 */
export function useGlobalUsers(filters?: GlobalUserFilters) {
  return useQuery({
    queryKey: ["global-users", filters],
    queryFn: () => searchGlobalUsers(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook untuk get single user
 */
export function useGlobalUser(id: string) {
  return useQuery({
    queryKey: ["global-user", id],
    queryFn: () => getGlobalUser(id),
    enabled: !!id,
  });
}

/**
 * Hook untuk get admin users
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk create user
 */
export function useCreateGlobalUser() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: CreateUserData) => createGlobalUser(data),
    onSuccess: async (newUser) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["global-users"] });

      // Log activity
      if (user) {
        await createAuditLog({
          id_pengguna: user.id,
          aksi: "CREATE",
          tipe_sumber_daya: "pengguna",
          id_sumber_daya: newUser.id,
          detail: {
            user_name: newUser.nama_lengkap,
            role: newUser.role,
            id_lembaga: newUser.id_lembaga,
          },
        });
      }
    },
  });
}

/**
 * Hook untuk update user
 */
export function useUpdateGlobalUser() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) =>
      updateGlobalUser(userId, data),
    onSuccess: async (updatedUser, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["global-users"] });
      queryClient.invalidateQueries({
        queryKey: ["global-user", variables.userId],
      });

      // Log activity
      if (user) {
        await createAuditLog({
          id_pengguna: user.id,
          aksi: "UPDATE",
          tipe_sumber_daya: "pengguna",
          id_sumber_daya: updatedUser.id,
          detail: {
            user_name: updatedUser.nama_lengkap,
            changes: variables.data,
          },
        });
      }
    },
  });
}

/**
 * Hook untuk update user status
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "aktif" | "nonaktif" | "suspended";
    }) => updateUserStatus(userId, status),
    onSuccess: async (updatedUser, variables) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["global-users"] });
      queryClient.invalidateQueries({
        queryKey: ["global-user", variables.userId],
      });

      // Log activity
      if (user) {
        await createAuditLog({
          id_pengguna: user.id,
          aksi: "UPDATE_STATUS",
          tipe_sumber_daya: "pengguna",
          id_sumber_daya: updatedUser.id,
          detail: {
            user_name: updatedUser.nama_lengkap,
            new_status: variables.status,
          },
        });
      }
    },
  });
}

/**
 * Hook untuk delete user
 */
export function useDeleteGlobalUser() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (userId: string) => deleteGlobalUser(userId),
    onSuccess: async (_, userId) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["global-users"] });

      // Log activity
      if (user) {
        await createAuditLog({
          id_pengguna: user.id,
          aksi: "DELETE",
          tipe_sumber_daya: "pengguna",
          id_sumber_daya: userId,
          detail: {
            id_pengguna: userId,
          },
        });
      }
    },
  });
}
