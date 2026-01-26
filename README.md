# LMS Academy - Learning Management System Multi-Tenant

Platform Learning Management System (LMS) berbasis arsitektur multi-tenant yang dirancang untuk organisasi di Indonesia.

## 🎯 Fitur MVP

### 1. Authentication

- Login dengan Supabase Auth
- Session management
- Role-based access control (RBAC)

### 2. User Management

- CRUD pengguna dengan role: Superadmin, Admin, Instruktur, Pembelajar
- Multi-tenant user isolation
- User profile management

### 3. Course Management

- Pembuatan dan pengelolaan kursus
- Modul dan materi pembelajaran
- Enrollment system
- Progress tracking

### 4. Assessment

- Quiz dan ujian online
- Berbagai tipe soal: Pilihan ganda, Benar/Salah, Isian singkat, Esai
- Auto-grading untuk objective questions
- Manual grading untuk esai

### 5. Reporting

- Dashboard analytics per role
- Laporan progress pembelajaran
- Laporan penilaian
- Export data

## 🛠️ Tech Stack

- **Frontend**: Vite + React + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Auth & Backend**: Supabase (PostgreSQL + RLS)
- **Deployment**: Docker + Dokploy (VPS)

## 📁 Struktur Project

```
ACADEMY/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── app/             # App configuration
│   │   ├── features/        # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── users/       # User management
│   │   │   ├── courses/     # Course management
│   │   │   ├── assessments/ # Assessment & quiz
│   │   │   ├── reports/     # Reporting & analytics
│   │   │   └── dashboard/   # Dashboard per role
│   │   ├── shared/          # Shared resources
│   │   │   ├── components/  # Reusable components
│   │   │   ├── hooks/       # Custom hooks
│   │   │   ├── types/       # TypeScript types
│   │   │   └── utils/       # Utility functions
│   │   └── lib/             # External library configs
│   ├── public/
│   └── package.json
│
└── supabase/                # Supabase configuration
    └── migrations/          # Database migrations
        ├── 20260121_initial_schema.sql
        └── 20260121_rls_policies.sql
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ dan npm
- Supabase account
- Git

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd ACADEMY
```

2. **Setup Frontend**

```bash
cd frontend
npm install
```

3. **Setup Environment Variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials Supabase Anda:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup Database**

Buka Supabase Dashboard → SQL Editor, lalu jalankan migration files secara berurutan:

- `supabase/migrations/20260121_initial_schema.sql`
- `supabase/migrations/20260121_rls_policies.sql`

5. **Run Development Server**

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📊 Database Schema

### Tabel Utama

- **tenant** - Data organisasi/tenant
- **pengguna** - Data pengguna dengan role
- **kursus** - Data kursus pembelajaran
- **modul** - Modul dalam kursus
- **materi** - Materi pembelajaran
- **enrollment** - Pendaftaran kursus
- **progress** - Progress pembelajaran
- **asesmen** - Data asesmen/quiz
- **soal** - Soal dalam asesmen
- **percobaan_asesmen** - Percobaan mengerjakan asesmen
- **jawaban** - Jawaban pengguna

### Row Level Security (RLS)

Semua tabel menggunakan RLS untuk isolasi data multi-tenant:

- Superadmin dapat akses semua data
- Admin hanya dapat akses data tenant mereka
- Instruktur dapat akses kursus yang mereka kelola
- Pembelajar hanya dapat akses data mereka sendiri

## 👥 User Roles

### Superadmin

- Mengelola semua tenant
- Akses penuh ke seluruh sistem
- Konfigurasi global

### Admin Organisasi

- Mengelola pengguna di tenant
- Mengelola kursus dan konten
- Melihat laporan organisasi

### Instruktur

- Membuat dan mengelola kursus
- Membuat asesmen
- Menilai pembelajar

### Pembelajar

- Mengikuti kursus
- Mengerjakan asesmen
- Melihat progress belajar

## 🔐 Security

- Row Level Security (RLS) untuk isolasi data
- JWT-based authentication via Supabase
- Role-based access control (RBAC)
- Secure password hashing
- HTTPS only in production

## 📝 Naming Convention

- **Database**: Bahasa Indonesia (snake_case)
- **Code**: English (camelCase untuk variables, PascalCase untuk components)
- **Timestamp columns**: English (`created_at`, `updated_at`)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

Untuk bantuan dan pertanyaan, hubungi tim development.

---

**Status**: MVP Development Phase
**Version**: 0.1.0
**Last Updated**: Januari 2026
