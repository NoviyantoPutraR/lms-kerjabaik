import { supabase } from "@/pustaka/supabase";

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: "pembelajar"; // Default to pembelajar for self-registration
}

export const authApi = {
  async register({
    email,
    password,
    fullName,
    role = "pembelajar",
  }: RegisterData) {
    try {
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error("Supabase Auth Error:", error);
        throw new Error(error.message || "Gagal mendaftar. Silakan coba lagi.");
      }

      if (!data.user) {
        throw new Error("Gagal membuat akun. Silakan coba lagi.");
      }

      console.log("User registered successfully:", data.user.id);

      // 2. Trigger database akan otomatis membuat entry di tabel pengguna
      // Jika trigger gagal, kita bisa handle di sini sebagai fallback

      return data;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  },
};
