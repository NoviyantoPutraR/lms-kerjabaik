// ============================================================================
// Types untuk Fitur Pembelajar
// ============================================================================

/**
 * Data pendaftaran kursus (enrollment)
 */
export interface Enrollment {
    id: string;
    id_kursus: string;
    id_pengguna: string;
    status: 'aktif' | 'selesai' | 'dibatalkan';
    persentase_kemajuan: number;
    tanggal_mulai: string;
    tanggal_selesai?: string;
    created_at: string;
    updated_at: string;
    // Relasi
    kursus?: Course;
}

/**
 * Data kursus (relasi dari enrollment)
 */
export interface Course {
    id: string;
    id_lembaga: string;
    id_instruktur: string;
    judul: string;
    deskripsi?: string;
    url_gambar_mini?: string;
    kategori?: string;
    tingkat?: 'pemula' | 'menengah' | 'lanjutan';
    durasi_menit?: number;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    // Relasi
    instruktur?: Instructor;
    modul?: Module[];
}

/**
 * Data instruktur (relasi dari course)
 */
export interface Instructor {
    id: string;
    nama_lengkap: string;
    email: string;
    url_foto?: string;
}

/**
 * Data modul pembelajaran
 */
export interface Module {
    id: string;
    id_kursus: string;
    judul: string;
    deskripsi?: string;
    urutan: number;
    durasi_menit?: number;
    created_at: string;
    updated_at: string;
    // Relasi
    materi?: Material[];
}

/**
 * Data materi pembelajaran
 */
export interface Material {
    id: string;
    id_modul: string;
    judul: string;
    tipe: 'video' | 'dokumen' | 'teks' | 'link';
    konten?: string;
    url_berkas?: string;
    urutan: number;
    durasi_menit?: number;
    wajib: boolean;
    created_at: string;
    updated_at: string;
    modul?: {
        urutan: number;
        [key: string]: any;
    };
}

/**
 * Progress pembelajaran per materi
 */
export interface MaterialProgress {
    id: string;
    id_pendaftaran: string;
    id_materi: string;
    id_pengguna: string;
    status: 'belum_mulai' | 'sedang_belajar' | 'selesai';
    persentase_kemajuan: number;
    waktu_belajar_detik: number;
    terakhir_diakses?: string;
    created_at: string;
    updated_at: string;
    // Relasi
    materi?: Material;
}

/**
 * Progress pembelajaran per kursus (agregat)
 */
export interface CourseProgress {
    id_pendaftaran: string;
    id_kursus: string;
    total_materi: number;
    materi_selesai: number;
    persentase_kemajuan: number;
    waktu_belajar_total_detik: number;
    terakhir_diakses?: string;
}

/**
 * Data asesmen (ujian/kuis)
 */
export interface Assessment {
    id: string;
    id_kursus: string;
    id_modul?: string;
    judul: string;
    deskripsi?: string;
    tipe: 'kuis' | 'ujian' | 'tugas';
    durasi_menit?: number;
    nilai_kelulusan: number;
    jumlah_percobaan: number; // -1 untuk unlimited
    acak_soal: boolean;
    tampilkan_jawaban: boolean;
    status: 'draft' | 'published' | 'archived';
    created_at: string;
    updated_at: string;
    // Relasi
    kursus?: Course;
    soal?: Question[];
}

/**
 * Data soal
 */
export interface Question {
    id: string;
    id_asesmen: string;
    pertanyaan: string;
    tipe: 'pilihan_ganda' | 'pilihan_ganda_multiple' | 'benar_salah' | 'isian_singkat' | 'esai';
    opsi?: QuestionOption[];
    jawaban_benar?: string;
    poin: number;
    penjelasan?: string;
    urutan: number;
    created_at: string;
    updated_at: string;
}

/**
 * Opsi untuk soal pilihan ganda
 */
export interface QuestionOption {
    key: string;
    value: string;
    benar: boolean;
}

/**
 * Percobaan asesmen
 */
export interface AssessmentAttempt {
    id: string;
    id_asesmen: string;
    id_pengguna: string;
    nomor_percobaan: number;
    status: 'sedang_berjalan' | 'selesai' | 'dibatalkan';
    nilai?: number;
    waktu_mulai: string;
    waktu_selesai?: string;
    created_at: string;
    updated_at: string;
    // Relasi
    asesmen?: Assessment;
    jawaban?: Answer[];
}

/**
 * Jawaban soal
 */
export interface Answer {
    id: string;
    id_percobaan: string;
    id_soal: string;
    jawaban_pengguna?: string;
    jawaban_pengguna_multiple?: string[];
    benar?: boolean;
    poin_diperoleh: number;
    feedback?: string;
    created_at: string;
    updated_at: string;
    // Relasi
    soal?: Question;
}

/**
 * Data tugas
 */
export interface Assignment {
    id: string;
    id_asesmen: string;
    judul: string;
    deskripsi?: string;
    deadline?: string;
    max_file_size: number;
    allowed_extensions?: string[];
    created_at: string;
    updated_at: string;
    // Relasi
    asesmen?: Assessment;
    pengumpulan_tugas?: AssignmentSubmission;
}

/**
 * Pengumpulan tugas
 */
export interface AssignmentSubmission {
    id: string;
    id_tugas: string;
    id_pengguna: string;
    url_berkas: string;
    catatan?: string;
    nilai?: number;
    feedback?: string;
    status: 'dikumpulkan' | 'dinilai' | 'perlu_revisi' | 'ditolak';
    created_at: string;
    updated_at: string;
    // Relasi
    tugas?: Assignment;
}

/**
 * Statistik pembelajar untuk dashboard
 */
export interface LearnerStats {
    total_kursus_aktif: number;
    total_kursus_selesai: number;
    total_tugas_pending: number;
    total_ujian_pending: number;
    rata_rata_progress: number;
}

/**
 * Upcoming deadline (tugas/ujian)
 */
export interface UpcomingDeadline {
    id: string;
    tipe: 'tugas' | 'ujian';
    judul: string;
    kursus_judul: string;
    deadline: string;
    status: 'pending' | 'selesai';
}

/**
 * Recent activity
 */
export interface RecentActivity {
    id: string;
    tipe: 'pendaftaran_kursus' | 'kemajuan_belajar' | 'submission' | 'assessment';
    deskripsi: string;
    timestamp: string;
    kursus_judul?: string;
}
