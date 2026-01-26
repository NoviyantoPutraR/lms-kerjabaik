// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lembaga: {
        Row: {
          id: string;
          nama: string;
          slug: string;
          tipe: "provinsi" | "bkd" | "kampus" | "korporasi";
          status: "aktif" | "nonaktif" | "suspended";
          kuota_pengguna: number;
          kuota_penyimpanan: number;
          url_logo: string | null;
          konfigurasi: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama: string;
          slug: string;
          tipe: "provinsi" | "bkd" | "kampus" | "korporasi";
          status?: "aktif" | "nonaktif" | "suspended";
          kuota_pengguna?: number;
          kuota_penyimpanan?: number;
          url_logo?: string | null;
          konfigurasi?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama?: string;
          slug?: string;
          tipe?: "provinsi" | "bkd" | "kampus" | "korporasi";
          status?: "aktif" | "nonaktif" | "suspended";
          kuota_pengguna?: number;
          kuota_penyimpanan?: number;
          url_logo?: string | null;
          konfigurasi?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      pengguna: {
        Row: {
          id: string;
          id_lembaga: string;
          auth_id: string;
          email: string;
          nama_lengkap: string;
          role: "superadmin" | "admin" | "instruktur" | "pembelajar";
          url_foto: string | null;
          nomor_telepon: string | null;
          status: "aktif" | "nonaktif" | "suspended";
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_lembaga: string;
          auth_id: string;
          email: string;
          nama_lengkap: string;
          role: "superadmin" | "admin" | "instruktur" | "pembelajar";
          url_foto?: string | null;
          nomor_telepon?: string | null;
          status?: "aktif" | "nonaktif" | "suspended";
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_lembaga?: string;
          auth_id?: string;
          email?: string;
          nama_lengkap?: string;
          role?: "superadmin" | "admin" | "instruktur" | "pembelajar";
          url_foto?: string | null;
          nomor_telepon?: string | null;
          status?: "aktif" | "nonaktif" | "suspended";
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      kursus: {
        Row: {
          id: string;
          id_lembaga: string;
          id_instruktur: string | null;
          judul: string;
          deskripsi: string | null;
          url_gambar_mini: string | null;
          kategori: string | null;
          tingkat: "pemula" | "menengah" | "lanjutan" | null;
          durasi_menit: number | null;
          status: "draft" | "published" | "archived";
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_lembaga: string;
          id_instruktur?: string | null;
          judul: string;
          deskripsi?: string | null;
          url_gambar_mini?: string | null;
          kategori?: string | null;
          tingkat?: "pemula" | "menengah" | "lanjutan" | null;
          durasi_menit?: number | null;
          status?: "draft" | "published" | "archived";
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_lembaga?: string;
          id_instruktur?: string | null;
          judul?: string;
          deskripsi?: string | null;
          url_gambar_mini?: string | null;
          kategori?: string | null;
          tingkat?: "pemula" | "menengah" | "lanjutan" | null;
          durasi_menit?: number | null;
          status?: "draft" | "published" | "archived";
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      modul: {
        Row: {
          id: string;
          id_kursus: string;
          judul: string;
          deskripsi: string | null;
          urutan: number;
          durasi_menit: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_kursus: string;
          judul: string;
          deskripsi?: string | null;
          urutan: number;
          durasi_menit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_kursus?: string;
          judul?: string;
          deskripsi?: string | null;
          urutan?: number;
          durasi_menit?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      materi: {
        Row: {
          id: string;
          id_modul: string;
          judul: string;
          tipe: "video" | "dokumen" | "teks" | "link";
          konten: string | null;
          url_berkas: string | null;
          urutan: number;
          durasi_menit: number | null;
          wajib: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_modul: string;
          judul: string;
          tipe: "video" | "dokumen" | "teks" | "link";
          konten?: string | null;
          url_berkas?: string | null;
          urutan: number;
          durasi_menit?: number | null;
          wajib?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_modul?: string;
          judul?: string;
          tipe?: "video" | "dokumen" | "teks" | "link";
          konten?: string | null;
          url_berkas?: string | null;
          urutan?: number;
          durasi_menit?: number | null;
          wajib?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pendaftaran_kursus: {
        Row: {
          id: string;
          id_kursus: string;
          id_pengguna: string;
          status: "aktif" | "selesai" | "dibatalkan";
          persentase_kemajuan: number;
          tanggal_mulai: string;
          tanggal_selesai: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_kursus: string;
          id_pengguna: string;
          status?: "aktif" | "selesai" | "dibatalkan";
          persentase_kemajuan?: number;
          tanggal_mulai?: string;
          tanggal_selesai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_kursus?: string;
          id_pengguna?: string;
          status?: "aktif" | "selesai" | "dibatalkan";
          persentase_kemajuan?: number;
          tanggal_mulai?: string;
          tanggal_selesai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kemajuan_belajar: {
        Row: {
          id: string;
          id_pendaftaran: string;
          id_materi: string;
          id_pengguna: string;
          status: "belum_mulai" | "sedang_belajar" | "selesai";
          persentase_kemajuan: number;
          waktu_belajar_detik: number;
          terakhir_diakses: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_pendaftaran: string;
          id_materi: string;
          id_pengguna: string;
          status?: "belum_mulai" | "sedang_belajar" | "selesai";
          persentase_kemajuan?: number;
          waktu_belajar_detik?: number;
          terakhir_diakses?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_pendaftaran?: string;
          id_materi?: string;
          id_pengguna?: string;
          status?: "belum_mulai" | "sedang_belajar" | "selesai";
          persentase_kemajuan?: number;
          waktu_belajar_detik?: number;
          terakhir_diakses?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      asesmen: {
        Row: {
          id: string;
          id_kursus: string;
          id_modul: string | null;
          judul: string;
          deskripsi: string | null;
          tipe: "kuis" | "ujian" | "tugas";
          durasi_menit: number | null;
          nilai_kelulusan: number;
          jumlah_percobaan: number;
          acak_soal: boolean;
          tampilkan_jawaban: boolean;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_kursus: string;
          id_modul?: string | null;
          judul: string;
          deskripsi?: string | null;
          tipe: "kuis" | "ujian" | "tugas";
          durasi_menit?: number | null;
          nilai_kelulusan?: number;
          jumlah_percobaan?: number;
          acak_soal?: boolean;
          tampilkan_jawaban?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_kursus?: string;
          id_modul?: string | null;
          judul?: string;
          deskripsi?: string | null;
          tipe?: "kuis" | "ujian" | "tugas";
          durasi_menit?: number | null;
          nilai_kelulusan?: number;
          jumlah_percobaan?: number;
          acak_soal?: boolean;
          tampilkan_jawaban?: boolean;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      soal: {
        Row: {
          id: string;
          id_asesmen: string;
          pertanyaan: string;
          tipe:
          | "pilihan_ganda"
          | "pilihan_ganda_multiple"
          | "benar_salah"
          | "isian_singkat"
          | "esai";
          opsi: Json | null;
          jawaban_benar: string | null;
          poin: number;
          penjelasan: string | null;
          urutan: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_asesmen: string;
          pertanyaan: string;
          tipe:
          | "pilihan_ganda"
          | "pilihan_ganda_multiple"
          | "benar_salah"
          | "isian_singkat"
          | "esai";
          opsi?: Json | null;
          jawaban_benar?: string | null;
          poin?: number;
          penjelasan?: string | null;
          urutan: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_asesmen?: string;
          pertanyaan?: string;
          tipe?:
          | "pilihan_ganda"
          | "pilihan_ganda_multiple"
          | "benar_salah"
          | "isian_singkat"
          | "esai";
          opsi?: Json | null;
          jawaban_benar?: string | null;
          poin?: number;
          penjelasan?: string | null;
          urutan?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      percobaan_asesmen: {
        Row: {
          id: string;
          id_asesmen: string;
          id_pengguna: string;
          nomor_percobaan: number;
          status: "sedang_berjalan" | "selesai" | "dibatalkan";
          nilai: number | null;
          waktu_mulai: string;
          waktu_selesai: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_asesmen: string;
          id_pengguna: string;
          nomor_percobaan: number;
          status?: "sedang_berjalan" | "selesai" | "dibatalkan";
          nilai?: number | null;
          waktu_mulai?: string;
          waktu_selesai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_asesmen?: string;
          id_pengguna?: string;
          nomor_percobaan?: number;
          status?: "sedang_berjalan" | "selesai" | "dibatalkan";
          nilai?: number | null;
          waktu_mulai?: string;
          waktu_selesai?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jawaban: {
        Row: {
          id: string;
          id_percobaan: string;
          id_soal: string;
          jawaban_pengguna: string | null;
          jawaban_pengguna_multiple: Json | null;
          benar: boolean | null;
          poin_diperoleh: number;
          feedback: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_percobaan: string;
          id_soal: string;
          jawaban_pengguna?: string | null;
          jawaban_pengguna_multiple?: Json | null;
          benar?: boolean | null;
          poin_diperoleh?: number;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_percobaan?: string;
          id_soal?: string;
          jawaban_pengguna?: string | null;
          jawaban_pengguna_multiple?: Json | null;
          benar?: boolean | null;
          poin_diperoleh?: number;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tugas: {
        Row: {
          id: string;
          id_asesmen: string | null;
          judul: string;
          deskripsi: string | null;
          deadline: string | null;
          max_file_size: number | null;
          allowed_extensions: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_asesmen?: string | null;
          judul: string;
          deskripsi?: string | null;
          deadline?: string | null;
          max_file_size?: number | null;
          allowed_extensions?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_asesmen?: string | null;
          judul?: string;
          deskripsi?: string | null;
          deadline?: string | null;
          max_file_size?: number | null;
          allowed_extensions?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pengumpulan_tugas: {
        Row: {
          id: string;
          id_tugas: string | null;
          id_pengguna: string | null;
          url_berkas: string;
          catatan: string | null;
          nilai: number | null;
          feedback: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          id_tugas?: string | null;
          id_pengguna?: string | null;
          url_berkas: string;
          catatan?: string | null;
          nilai?: number | null;
          feedback?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          id_tugas?: string | null;
          id_pengguna?: string | null;
          url_berkas?: string;
          catatan?: string | null;
          nilai?: number | null;
          feedback?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sertifikat: {
        Row: {
          id: string;
          id_pendaftaran: string | null;
          id_pengguna: string | null;
          id_kursus: string | null;
          nomor_sertifikat: string;
          tanggal_terbit: string | null;
          nilai_akhir: number | null;
          url_berkas: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          id_pendaftaran?: string | null;
          id_pengguna?: string | null;
          id_kursus?: string | null;
          nomor_sertifikat: string;
          tanggal_terbit?: string | null;
          nilai_akhir?: number | null;
          url_berkas?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          id_pendaftaran?: string | null;
          id_pengguna?: string | null;
          id_kursus?: string | null;
          nomor_sertifikat?: string;
          tanggal_terbit?: string | null;
          nilai_akhir?: number | null;
          url_berkas?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      log_audit: {
        Row: {
          id: string;
          id_pengguna: string | null;
          id_lembaga: string | null;
          aksi: string;
          tipe_sumber_daya: string;
          id_sumber_daya: string | null;
          detail: Json;
          alamat_ip: string | null;
          agen_pengguna: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          id_pengguna?: string | null;
          id_lembaga?: string | null;
          aksi: string;
          tipe_sumber_daya: string;
          id_sumber_daya?: string | null;
          detail?: Json;
          alamat_ip?: string | null;
          agen_pengguna?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          id_pengguna?: string | null;
          id_lembaga?: string | null;
          aksi?: string;
          tipe_sumber_daya?: string;
          id_sumber_daya?: string | null;
          detail?: Json;
          alamat_ip?: string | null;
          agen_pengguna?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
