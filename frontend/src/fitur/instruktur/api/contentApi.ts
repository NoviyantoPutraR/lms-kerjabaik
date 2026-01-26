import { supabase } from "@/pustaka/supabase";

export type ContentType = "text" | "video" | "file" | "quiz" | "assignment";

export interface Content {
  id: string;
  id_modul: string;
  tipe: ContentType;
  judul: string;
  body: string | null;
  url_berkas: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface CreateContentData {
  tipe: ContentType;
  judul: string;
  body?: string;
  url_berkas?: string;
}

export interface UpdateContentData {
  judul?: string;
  body?: string;
  url_berkas?: string;
}

/**
 * Get all contents for a module
 */
export async function getContents(moduleId: string): Promise<Content[]> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  // Get current user's data
  const { data: currentUserData } = await supabase
    .from("pengguna")
    .select("id, id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUserData) throw new Error("User not found");
  const currentUser = currentUserData as { id: string; id_lembaga: string };

  // Get module to check ownership via course
  const { data: moduleData } = await supabase
    .from("modul")
    .select(
      `
      id,
      kursus:id_kursus (
        id_instruktur,
        id_lembaga
      )
    `,
    )
    .eq("id", moduleId)
    .single();

  if (!moduleData) throw new Error("Module not found");

  const moduleWithCourse = moduleData as unknown as {
    kursus: { id_instruktur: string; id_lembaga: string };
  };
  const course = moduleWithCourse.kursus;

  if (
    course.id_lembaga !== currentUser.id_lembaga ||
    course.id_instruktur !== currentUser.id
  ) {
    throw new Error("Unauthorized access to module");
  }

  const { data, error } = await (supabase.from("materi") as any)
    .select("*, body:konten")
    .eq("id_modul", moduleId)
    .order("urutan", { ascending: true });

  if (error) {
    // If table doesn't exist yet, return empty array gracefully regarding DB schema sync status
    if (error.code === "42P01") return [];
    throw error;
  }
  return data || [];
}

/**
 * Create new content
 */
export async function createContent(
  moduleId: string,
  data: CreateContentData,
): Promise<Content> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  const { data: currentUserData } = await supabase
    .from("pengguna")
    .select("id, id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUserData) throw new Error("User not found");
  const currentUser = currentUserData as { id: string; id_lembaga: string };

  // Verify module ownership
  const { data: moduleData } = await supabase
    .from("modul")
    .select(`id, kursus:id_kursus (id_instruktur, id_lembaga)`)
    .eq("id", moduleId)
    .single();

  if (!moduleData) throw new Error("Module not found");

  const moduleWithCourse = moduleData as unknown as {
    kursus: { id_instruktur: string; id_lembaga: string };
  };
  const course = moduleWithCourse.kursus;

  if (
    course.id_lembaga !== currentUser.id_lembaga ||
    course.id_instruktur !== currentUser.id
  ) {
    throw new Error("Unauthorized");
  }

  // Get max urutan
  const { data: maxContent, error: maxError } = await (
    supabase.from("materi") as any
  )
    .select("urutan")
    .eq("id_modul", moduleId)
    .order("urutan", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError && maxError.code !== "PGRST116") {
    console.error("Error fetching max urutan:", maxError);
  }

  const nextUrutan = maxContent ? (maxContent as any).urutan + 1 : 1;

  const { data: newContent, error } = await (supabase.from("materi") as any)
    .insert({
      id_modul: moduleId,
      tipe:
        data.tipe === "text"
          ? "teks"
          : data.tipe === "file"
            ? "dokumen"
            : data.tipe,
      judul: data.judul,
      konten: data.body || null,
      url_berkas: data.url_berkas || null,
      urutan: nextUrutan,
    })
    .select("*, body:konten")
    .single();

  if (error) throw error;
  return newContent as Content;
}

/**
 * Update content
 */
export async function updateContent(
  contentId: string,
  data: UpdateContentData,
): Promise<Content> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  const { data: currentUserData } = await supabase
    .from("pengguna")
    .select("id, id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUserData) throw new Error("User not found");
  const currentUser = currentUserData as { id: string; id_lembaga: string };

  // Verify content ownership via module via course is tricky without helper,
  // so we fetch content -> module -> course
  const { data: contentData } = await supabase
    .from("materi")
    .select(
      `
      *,
      modul:id_modul (
        kursus:id_kursus (
          id_instruktur,
          id_lembaga
        )
      )
    `,
    )
    .eq("id", contentId)
    .single();

  if (!contentData) throw new Error("Content not found");

  // Explicit type casting to handle deep relations
  const contentWithRelations = contentData as unknown as {
    modul: {
      kursus: {
        id_instruktur: string;
        id_lembaga: string;
      };
    };
  };

  const course = contentWithRelations.modul.kursus;

  if (
    course.id_lembaga !== currentUser.id_lembaga ||
    course.id_instruktur !== currentUser.id
  ) {
    throw new Error("Unauthorized");
  }

  const { data: updatedContent, error } = await (supabase.from("materi") as any)
    .update({
      judul: data.judul,
      konten: data.body,
      url_berkas: data.url_berkas,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contentId)
    .select("*, body:konten")
    .single();

  if (error) throw error;
  return updatedContent as Content;
}

/**
 * Delete content
 */
export async function deleteContent(contentId: string): Promise<void> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  const { data: currentUserData } = await supabase
    .from("pengguna")
    .select("id, id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUserData) throw new Error("User not found");
  const currentUser = currentUserData as { id: string; id_lembaga: string };

  // Verify ownership
  const { data: contentData } = await supabase
    .from("materi")
    .select(
      `
      modul:id_modul (
        kursus:id_kursus (
          id_instruktur,
          id_lembaga
        )
      )
    `,
    )
    .eq("id", contentId)
    .single();

  if (!contentData) throw new Error("Content not found");

  const contentWithRelations = contentData as unknown as {
    modul: {
      kursus: {
        id_instruktur: string;
        id_lembaga: string;
      };
    };
  };
  const course = contentWithRelations.modul.kursus;

  if (
    course.id_lembaga !== currentUser.id_lembaga ||
    course.id_instruktur !== currentUser.id
  ) {
    throw new Error("Unauthorized");
  }

  const { error } = await (supabase.from("materi") as any)
    .delete()
    .eq("id", contentId);

  if (error) throw error;
}

/**
 * Reorder contents
 */
export async function reorderContents(
  moduleId: string,
  contentIds: string[],
): Promise<void> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  const { data: currentUserData } = await supabase
    .from("pengguna")
    .select("id, id_lembaga")
    .eq("auth_id", authUser.id)
    .single();

  if (!currentUserData) throw new Error("User not found");
  const currentUser = currentUserData as { id: string; id_lembaga: string };

  // Verify module ownership
  const { data: moduleData } = await supabase
    .from("modul")
    .select(`id, kursus:id_kursus (id_instruktur, id_lembaga)`)
    .eq("id", moduleId)
    .single();

  const moduleWithCourse = moduleData as unknown as {
    kursus: { id_instruktur: string; id_lembaga: string };
  } | null;

  const course = moduleWithCourse?.kursus;
  if (!course || course.id_instruktur !== currentUser.id) {
    throw new Error("Unauthorized");
  }

  // Batch update
  const updates = contentIds.map((id, index) =>
    (supabase.from("materi") as any)
      .update({ urutan: index + 1 })
      .eq("id", id)
      .eq("id_modul", moduleId),
  );

  await Promise.all(updates);
}
