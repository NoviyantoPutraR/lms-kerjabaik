# 📘 LMS DESIGN MANIFEST: Single Source of Truth 

Dokumen ini adalah acuan utama untuk pengembangan UI/UX. Semua komponen harus mengikuti token dan aturan di bawah ini tanpa kecuali.


Core Stack & Libraries
Framework: React

Styling: Tailwind CSS

Component Library: Shadcn UI (Customized for "Sharp" look)

Icons: Lucide Icons (Stroke 2px, Size 20px/16px)

Charts: Recharts (Minimalist & Professional)

Language: Bahasa Indonesia Baku (Formal)

---

## 1. Standar Bahasa: Glosarium UI/UX Baku

Semua teks yang muncul di layar (Label, Tombol, Notifikasi) **WAJIB** menggunakan istilah berikut:

| Kategori | Inggris (Source) | Indonesia (Baku) |
| --- | --- | --- |
| **Navigasi** | Dashboard, Course, Assignment | **Dasbor, Kursus, Tugas** |
| **Aksi** | Submit, Edit, Delete, Save | **Kirim, Sunting, Hapus, Simpan** |
| **Status** | In Progress, Completed, Overdue | **Sedang Berjalan, Selesai, Terlambat** |
| **Input** | Placeholder, Search, Settings | **Contoh Teks, Cari, Pengaturan** |
| **Instruktur** | Student Progress, Grade, Assessment | **Progres Peserta, Nilai, Penilaian** |

---

## 2. Design Tokens (CSS Variables) - 

*Update: Menambahkan sistem layer dan efek sharp.*

```css
:root {
  /* Brand Colors - Sharp & Trustworthy */
  --color-primary: #0a2a4a; 
  --color-accent: #00b5d9; 
  
  /* Surface & Backgrounds */
  --color-bg-app: #f8fafc;        /* Latar belakang aplikasi utama */
  --color-surface-card: #ffffff;  /* Latar belakang komponen kartu */
  --color-surface-subtle: #f1f5f9; /* Untuk area sidebar atau header */
  
  /* Semantic Status (Opacity 10% for backgrounds) */
  --color-success: #16a34a; 
  --color-danger: #dc2626; 
  --color-warning: #f59e0b; 
  --color-info: #0ea5e9;

  /* Typography Scale */
  --font-main: "Inter", sans-serif;
  --text-h1: 700 2rem/1.2 var(--font-main);
  --text-base: 400 1rem/1.5 var(--font-main);
  --text-sm: 400 0.875rem/1.5 var(--font-main);

  /* Layout & Spacing */
  --sidebar-width: 280px;
  --header-height: 72px;
  --gap-standard: 1.5rem; /* 24px */

  /* Sharpness Definitions */
  --radius-sharp: 4px;   /* Untuk tombol dan input */
  --radius-card: 8px;    /* Untuk container besar */
  --border-thin: 1px solid #e2e8f0;
  
  /* Effects */
  --shadow-flat: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-elevated: 0 10px 15px -3px rgba(10, 42, 74, 0.08);
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

```

---

## 3. Sistem Komponen & Layout

### A. Layout Struktur (The LMS Frame)

1. **Sidebar (Navigasi Utama):** Background `--color-primary`, teks putih. Semua ikon menggunakan Lucide dengan `strokeWidth={2}`.
2. **Header:** Sticky, background `--color-surface-card`, `--border-thin` di bagian bawah.
3. **Main Content:** Padding `--gap-standard`. Gunakan sistem **Grid** untuk menyusun kartu progres.

### B. Desain Kartu (Card System)

*Setiap kartu harus memiliki 3 variasi:*

* **Default:** `--border-thin`, tanpa bayangan.
* **Hover:** `--shadow-elevated`, border tetap thin, transisi `--transition-fast`.
* **Active/Selected:** Border `2px solid --color-accent`.

### C. Form & Input (Sharp UI)

* **Input Field:** Tinggi `42px`, `--radius-sharp`, border warna neutral. Saat fokus, border berubah menjadi `--color-accent` dengan ring `2px`.
* **Tombol (Buttons):** Tanpa gradasi. Warna solid. Teks **Kapital** di awal saja (Sentence case).

---

## 4. Ikonografi: Lucide Icons

Untuk menjaga konsistensi, agen Antigravity harus memanggil ikon Lucide dengan standar berikut:

* **Ukuran:** `size={20}` untuk sidebar, `size={16}` untuk elemen dalam tabel/nilai.
* **Stroke:** `strokeWidth={2}` (untuk kesan tajam/sharp).
* **Daftar Ikon Utama:**
* Dasbor: `LayoutDashboard`
* Kursus: `BookOpen`
* Peserta: `Users`
* Tugas: `ClipboardList`
* Pengaturan: `Settings`



---

## 5. Efek & Interaksi Modern

1. **Skeleton Loading:** Gunakan efek *pulse* pada kontainer abu-abu terang sebelum data muncul.
2. **Smooth Scaling:** Saat hover pada kartu kursus, berikan efek `scale(1.01)` yang sangat halus.
3. **Status Indicator:** Bukan hanya warna, gunakan ikon kecil di samping teks status (contoh: Ikon `CheckCircle` untuk status "Selesai").

## 6. Global Design Tokens (Tailwind & CSS)
:root {
  /* Brand Palette - Deep & Sharp */
  --color-primary: #0a2a4a;        /* Deep Navy */
  --color-primary-foreground: #ffffff;
  --color-accent: #00b5d9;         /* Cyber Cyan */
  --color-accent-foreground: #ffffff;

  /* Semantic Palette (Recharts & Status) */
  --color-success: #16a34a;        /* Selesai / Lulus */
  --color-danger: #dc2626;         /* Gagal / Terlambat */
  --color-warning: #f59e0b;        /* Peringatan / Perlu Review */
  --color-info: #3b82f6;           /* Informasi Tambahan */

  /* Neutral Surface */
  --background: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;               /* Sharp 1px Borders */
  
  /* Typography Scale (Inter Font) */
  --text-h1: 700 1.875rem/1.2;     /* 30px */
  --text-h2: 600 1.5rem/1.3;       /* 24px */
  --text-body: 400 1rem/1.6;       /* 16px */
  --text-caption: 400 0.875rem/1.5; /* 14px */

  /* Sharpness Constraints */
  --radius-sharp: 4px;             /* Mandat untuk Button, Input, & Shadcn Components */
  --radius-card: 6px;              /* Mandat untuk Card & Dashboard Elements */
}

## 7. Data Visualization Strategy (Recharts)

Untuk instruktur memantau "Progres Peserta", gunakan aturan visualisasi berikut:

Bar Chart: Gunakan siku tajam (bukan radius bulat). Warna utama: --color-accent.

Line Chart: Gunakan type="monotone" dengan strokeWidth={2}.

Tooltip: Custom Shadcn Tooltip dengan latar belakang --color-primary dan teks putih.

Bahasa: Label sumbu X dan Y wajib Bahasa Indonesia (contoh: "Jumlah Peserta", "Rentang Nilai").

## 8. Empty States Pattern (Kondisi Kosong)
Jika data tidak ditemukan atau belum ada aktivitas, gunakan struktur ini:

Container: Centered, padding --space-xl.

Icon: Lucide Icon (pilih yang relevan, e.g., SearchX atau Inbox), size 48px, color --color-muted.

Copywriting:

Judul: "Data Tidak Ditemukan" atau "Belum Ada Peserta Terdaftar"

Deskripsi: Kalimat instruktif yang membantu (e.g., "Silakan tambahkan kursus baru untuk mulai memantau progres.")

Action: Tombol primer dengan teks baku (e.g., "Tambah Kursus").

## 9. Shadcn UI Customization Rules
Agen Antigravity harus mengikuti aturan modifikasi komponen Shadcn berikut:

Button: Semua button harus memiliki rounded-none atau rounded-sm (4px). Tanpa gradasi.

Card: Menggunakan border tipis 1px, shadow sangat halus (shadow-sm).

Input: Fokus border harus menggunakan --color-accent.

Lucide Consistency:

Dashboard: LayoutDashboard

User Progress: BarChart3

Settings: Settings2

Logout: LogOut

## 10. Glosarium Bahasa Indonesia Baku (SSoT)
Wajib digunakan di semua komponen UI:
Istilah Sumber   | Istilah Baku (LMS) |Konteks UI
Participant Progress | Progres Peserta |Judul Fitur Instruktur
Attendance | Kehadiran | Laporan 
Grade Average | Rerata Nilai | Visualisasi Data
Last Accessed | Terakhir Diakses | Tabel Peserta
Action Required | Perlu Tindakan | Notifikasi
Batch/Class | Angkatan / Kelas | Filter Data