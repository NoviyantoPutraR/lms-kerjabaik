import { supabase } from "@/pustaka/supabase";

// Type definitions for Supabase query results
interface CourseOwnership {
  id: string;
  id_instruktur: string;
  id_lembaga: string;
}

interface ModuleWithCourse extends Module {
  kursus: CourseOwnership;
}

/**
 * Module data types
 */
export interface Module {
  id: string;
  id_kursus: string;
  judul: string;
  deskripsi: string | null;
  urutan: number;
  durasi_menit: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateModuleData {
  judul: string;
  deskripsi?: string;
  durasi_menit?: number;
}

export interface UpdateModuleData {
  judul?: string;
  deskripsi?: string;
  durasi_menit?: number;
}

/**
 * Get all modules for a course
 */
export async function getModules(kursusId: string): Promise<Module[]> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Verify course ownership
  const { data: course } = (await supabase
    .from("kursus")
    .select("id, id_instruktur, id_lembaga")
    .eq("id", kursusId)
    .eq("id_lembaga", currentUser.id_lembaga)
    .single()) as {
    data: { id: string; id_instruktur: string; id_lembaga: string } | null;
  };

  if (!course) throw new Error("Course not found");
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to access this course");
  }

  // Get modules
  const { data, error } = await supabase
    .from("modul")
    .select("*")
    .eq("id_kursus", kursusId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get module detail
 */
export async function getModuleDetail(moduleId: string): Promise<Module> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Get module with course verification
  const { data: module, error } = await supabase
    .from("modul")
    .select(
      `
      *,
      kursus:id_kursus (
        id,
        id_instruktur,
        id_lembaga
      )
    `,
    )
    .eq("id", moduleId)
    .single();

  if (error) throw error;
  if (!module) throw new Error("Module not found");

  // Verify ownership
  const typedModule = module as unknown as ModuleWithCourse;
  const course = typedModule.kursus;
  if (course.id_lembaga !== currentUser.id_lembaga) {
    throw new Error("Tenant mismatch");
  }
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to access this module");
  }

  const { kursus, ...moduleData } = typedModule;
  return moduleData as Module;
}

/**
 * Create new module
 */
export async function createModule(
  kursusId: string,
  data: CreateModuleData,
): Promise<Module> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Verify course ownership
  const { data: course } = (await supabase
    .from("kursus")
    .select("id, id_instruktur, id_lembaga")
    .eq("id", kursusId)
    .eq("id_lembaga", currentUser.id_lembaga)
    .single()) as {
    data: { id: string; id_instruktur: string; id_lembaga: string } | null;
  };

  if (!course) throw new Error("Course not found");
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to modify this course");
  }

  // Get max urutan
  const { data: maxModule } = await supabase
    .from("modul")
    .select("urutan")
    .eq("id_kursus", kursusId)
    .order("urutan", { ascending: false })
    .limit(1)
    .maybeSingle();

  const typedMaxModule = maxModule as { urutan: number } | null;
  const nextUrutan = typedMaxModule ? typedMaxModule.urutan + 1 : 1;

  // Create module
  const { data: newModule, error } = await (supabase.from("modul") as any)
    .insert({
      id_kursus: kursusId,
      judul: data.judul,
      deskripsi: data.deskripsi || null,
      durasi_menit: data.durasi_menit || null,
      urutan: nextUrutan,
    })
    .select()
    .single();

  if (error) throw error;
  return newModule as Module;
}

/**
 * Update module
 */
export async function updateModule(
  moduleId: string,
  data: UpdateModuleData,
): Promise<Module> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Get module with course verification
  const { data: module } = await supabase
    .from("modul")
    .select(
      `
      *,
      kursus:id_kursus (
        id,
        id_instruktur,
        id_lembaga
      )
    `,
    )
    .eq("id", moduleId)
    .single();

  if (!module) throw new Error("Module not found");

  // Verify ownership
  const typedModule = module as unknown as ModuleWithCourse;
  const course = typedModule.kursus;
  if (course.id_lembaga !== currentUser.id_lembaga) {
    throw new Error("Tenant mismatch");
  }
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to modify this module");
  }

  // Update module
  const updateData: any = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedModule, error } = await (supabase.from("modul") as any)
    .update(updateData)
    .eq("id", moduleId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!updatedModule) throw new Error("Gagal mengupdate modul");

  return updatedModule as Module;
}

/**
 * Delete module
 */
export async function deleteModule(moduleId: string): Promise<void> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Get module with course verification
  const { data: module } = await supabase
    .from("modul")
    .select(
      `
      *,
      kursus:id_kursus (
        id,
        id_instruktur,
        id_lembaga
      )
    `,
    )
    .eq("id", moduleId)
    .single();

  if (!module) throw new Error("Module not found");

  // Verify ownership
  const typedModule = module as unknown as ModuleWithCourse;
  const course = typedModule.kursus;
  if (course.id_lembaga !== currentUser.id_lembaga) {
    throw new Error("Tenant mismatch");
  }
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to delete this module");
  }

  // Delete module
  const { error } = await supabase.from("modul").delete().eq("id", moduleId);

  if (error) throw error;
}

/**
 * Reorder modules
 */
export async function reorderModules(
  kursusId: string,
  moduleIds: string[],
): Promise<void> {
  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) throw new Error("Not authenticated");

  // Get current user's data
  const { data: currentUser } = (await supabase
    .from("pengguna")
    .select("id, id_lembaga, role")
    .eq("auth_id", authUser.id)
    .single()) as {
    data: { id: string; id_lembaga: string; role: string } | null;
  };

  if (!currentUser) throw new Error("User not found");
  if (currentUser.role !== "instruktur") throw new Error("Unauthorized");

  // Verify course ownership
  const { data: course } = (await supabase
    .from("kursus")
    .select("id, id_instruktur, id_lembaga")
    .eq("id", kursusId)
    .eq("id_lembaga", currentUser.id_lembaga)
    .single()) as {
    data: { id: string; id_instruktur: string; id_lembaga: string } | null;
  };

  if (!course) throw new Error("Course not found");
  if (course.id_instruktur !== currentUser.id) {
    throw new Error("You don't have permission to modify this course");
  }

  // Update urutan for each module
  const updates = moduleIds.map((moduleId, index) => {
    const updateData: any = { urutan: index + 1 };
    return (supabase.from("modul") as any)
      .update(updateData)
      .eq("id", moduleId)
      .eq("id_kursus", kursusId);
  });

  await Promise.all(updates);
}
