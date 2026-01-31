import { supabase } from "@/pustaka/supabase";
import type { 
  ZoomSession, 
  CreateZoomSessionData, 
  UpdateZoomSessionData 
} from "../tipe/instructor.types";

/**
 * Mendapatkan daftar sesi zoom untuk suatu kursus
 */
export async function getZoomSessions(kursusId: string): Promise<ZoomSession[]> {
  const { data, error } = await supabase
    .from("sesi_zoom")
    .select("*")
    .eq("id_kursus", kursusId)
    .order("waktu_mulai", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Membuat sesi zoom baru
 */
export async function createZoomSession(
  kursusId: string, 
  sessionData: CreateZoomSessionData
): Promise<ZoomSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Ambil data lembaga dari pengguna
  const { data: userData, error: userError } = await (supabase.from("pengguna") as any)
    .select("id_lembaga")
    .eq("auth_id", user.id)
    .single();

  if (userError || !userData) {
    console.error("Gagal mengambil data lembaga:", userError);
    throw new Error("Data pengguna tidak ditemukan atau gagal dimuat");
  }

  const { data, error } = await (supabase.from("sesi_zoom") as any)
    .insert({
      ...sessionData,
      id_kursus: kursusId,
      id_lembaga: userData.id_lembaga,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Memperbarui sesi zoom
 */
export async function updateZoomSession(
  sessionId: string, 
  updateData: UpdateZoomSessionData
): Promise<ZoomSession> {
  const { data, error } = await (supabase.from("sesi_zoom") as any)
    .update(updateData)
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Menghapus sesi zoom
 */
export async function deleteZoomSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("sesi_zoom")
    .delete()
    .eq("id", sessionId);

  if (error) throw error;
}
