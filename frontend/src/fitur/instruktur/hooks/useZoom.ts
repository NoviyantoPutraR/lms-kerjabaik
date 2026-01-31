import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getZoomSessions, 
  createZoomSession, 
  updateZoomSession, 
  deleteZoomSession 
} from "../api/zoomApi";
import type { 
  CreateZoomSessionData, 
  UpdateZoomSessionData 
} from "../tipe/instructor.types";

/**
 * Hook untuk mendapatkan daftar sesi zoom
 */
export function useZoomSessions(kursusId: string) {
  return useQuery({
    queryKey: ["zoom-sessions", kursusId],
    queryFn: () => getZoomSessions(kursusId),
    enabled: !!kursusId,
  });
}

/**
 * Hook untuk aksi mutasi (Create, Update, Delete)
 */
export function useZoomMutations(kursusId: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateZoomSessionData) => createZoomSession(kursusId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-sessions", kursusId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: UpdateZoomSessionData }) => 
      updateZoomSession(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-sessions", kursusId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sessionId: string) => deleteZoomSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zoom-sessions", kursusId] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
