import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getContents,
  createContent,
  updateContent,
  deleteContent,
  reorderContents,
} from "../api/contentApi";
import type { CreateContentData, UpdateContentData } from "../api/contentApi";

export function useContents(moduleId: string) {
  return useQuery({
    queryKey: ["contents", moduleId],
    queryFn: () => getContents(moduleId),
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId, data, }: {
        moduleId: string;
        data: CreateContentData;
      }) => createContent(moduleId, data),
    onSuccess: (_, variables) => {
      toast.success("Konten berhasil dibuat");
      queryClient.invalidateQueries({
        queryKey: ["contents", variables.moduleId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat konten: ${error.message}`);
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId, data, }: {
        contentId: string;
        data: UpdateContentData;
      }) => updateContent(contentId, data),
    onSuccess: (updatedContent) => {
      toast.success("Konten berhasil diupdate");
      queryClient.invalidateQueries({
        queryKey: ["contents", updatedContent.id_modul],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal update konten: ${error.message}`);
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentId,
      moduleId: _moduleId,
    }: {
      contentId: string;
      moduleId: string;
    }) => deleteContent(contentId),
    onSuccess: (_, variables) => {
      toast.success("Konten berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["contents", variables.moduleId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus konten: ${error.message}`);
    },
  });
}

export function useReorderContents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      moduleId,
      contentIds,
    }: {
      moduleId: string;
      contentIds: string[];
    }) => reorderContents(moduleId, contentIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["contents", variables.moduleId],
      });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengubah urutan konten: ${error.message}`);
    },
  });
}
