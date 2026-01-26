import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getModules,
  getModuleDetail,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
} from "../api/modulesApi";
import type { CreateModuleData, UpdateModuleData } from "../api/modulesApi";
import { toast } from "sonner";

/**
 * Hook untuk get modules
 */
export function useModules(kursusId: string) {
  return useQuery({
    queryKey: ["modules", kursusId],
    queryFn: () => getModules(kursusId),
    enabled: !!kursusId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk get module detail
 */
export function useModuleDetail(moduleId: string) {
  return useQuery({
    queryKey: ["module-detail", moduleId],
    queryFn: () => getModuleDetail(moduleId),
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook untuk create module
 */
export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kursusId, data, }: {
        kursusId: string;
        data: CreateModuleData;
      }) => createModule(kursusId, data),
    onSuccess: (_, variables) => {
      toast.success("Modul berhasil dibuat");
      queryClient.invalidateQueries({
        queryKey: ["modules", variables.kursusId],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-course-detail", variables.kursusId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat modul: ${error.message}`);
    },
  });
}

/**
 * Hook untuk update module
 */
export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId, data, }: {
        moduleId: string;
        data: UpdateModuleData;
      }) => updateModule(moduleId, data),
    onSuccess: (updatedModule) => {
      toast.success("Modul berhasil diupdate");
      queryClient.invalidateQueries({
        queryKey: ["modules", updatedModule.id_kursus],
      });
      queryClient.invalidateQueries({
        queryKey: ["module-detail", updatedModule.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-course-detail", updatedModule.id_kursus],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal update modul: ${error.message}`);
    },
  });
}

/**
 * Hook untuk delete module
 */
export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      kursusId: _kursusId,
    }: {
      moduleId: string;
      kursusId: string;
    }) => deleteModule(moduleId),
    onSuccess: (_, variables) => {
      toast.success("Modul berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["modules", variables.kursusId],
      });
      queryClient.invalidateQueries({
        queryKey: ["instructor-course-detail", variables.kursusId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus modul: ${error.message}`);
    },
  });
}

/**
 * Hook untuk reorder modules
 */
export function useReorderModules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kursusId,
      moduleIds,
    }: {
      kursusId: string;
      moduleIds: string[];
    }) => reorderModules(kursusId, moduleIds),
    onSuccess: (_, variables) => {
      toast.success("Urutan modul berhasil diupdate");
      queryClient.invalidateQueries({
        queryKey: ["modules", variables.kursusId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengubah urutan: ${error.message}`);
    },
  });
}
