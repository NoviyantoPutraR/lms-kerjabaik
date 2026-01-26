-- ============================================================================
-- LMS Multi-Tenant - Seed Data for Testing Reports
-- ============================================================================
-- Migration: 20260122_seed_data_reports
-- Description: Insert sample data untuk testing fitur Pelaporan & Analitik
-- ============================================================================

-- Catatan: Migration ini akan insert data sample untuk tenant yang sudah ada
-- Pastikan sudah ada minimal 1 tenant, beberapa pengguna, dan beberapa kursus

-- ============================================================================
-- SEED DATA ENROLLMENT
-- ============================================================================

-- Insert sample enrollments untuk testing
-- Ambil data tenant, pengguna, dan kursus yang sudah ada
DO $$
DECLARE
  v_tenant_id UUID;
  v_kursus_ids UUID[];
  v_pengguna_ids UUID[];
  v_kursus_id UUID;
  v_pengguna_id UUID;
  i INTEGER;
  j INTEGER;
BEGIN
  -- Ambil tenant pertama
  SELECT id INTO v_tenant_id FROM tenant LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RAISE NOTICE 'Tidak ada tenant, skip seed data';
    RETURN;
  END IF;

  -- Ambil semua kursus dari tenant ini
  SELECT ARRAY_AGG(id) INTO v_kursus_ids 
  FROM kursus 
  WHERE tenant_id = v_tenant_id 
  AND status = 'published'
  LIMIT 10;

  -- Ambil semua pembelajar dari tenant ini
  SELECT ARRAY_AGG(id) INTO v_pengguna_ids 
  FROM pengguna 
  WHERE tenant_id = v_tenant_id 
  AND role = 'pembelajar'
  LIMIT 20;

  -- Jika tidak ada kursus atau pengguna, skip
  IF v_kursus_ids IS NULL OR v_pengguna_ids IS NULL THEN
    RAISE NOTICE 'Tidak ada kursus atau pengguna, skip seed data';
    RETURN;
  END IF;

  -- Insert enrollments dengan berbagai status dan progress
  FOR i IN 1..LEAST(array_length(v_kursus_ids, 1), 10) LOOP
    v_kursus_id := v_kursus_ids[i];
    
    FOR j IN 1..LEAST(array_length(v_pengguna_ids, 1), 15) LOOP
      v_pengguna_id := v_pengguna_ids[j];
      
      -- Skip jika enrollment sudah ada
      IF NOT EXISTS (
        SELECT 1 FROM enrollment 
        WHERE kursus_id = v_kursus_id 
        AND pengguna_id = v_pengguna_id
      ) THEN
        -- Insert enrollment dengan random progress dan status
        INSERT INTO enrollment (
          kursus_id,
          pengguna_id,
          status,
          progress_persen,
          tanggal_mulai,
          tanggal_selesai
        ) VALUES (
          v_kursus_id,
          v_pengguna_id,
          CASE 
            WHEN random() < 0.2 THEN 'selesai'
            WHEN random() < 0.1 THEN 'dibatalkan'
            ELSE 'aktif'
          END,
          CASE 
            WHEN random() < 0.2 THEN 100
            WHEN random() < 0.3 THEN 0
            ELSE (random() * 100)::DECIMAL(5,2)
          END,
          NOW() - (random() * 90 || ' days')::INTERVAL,
          CASE 
            WHEN random() < 0.2 THEN NOW() - (random() * 30 || ' days')::INTERVAL
            ELSE NULL
          END
        );
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Seed data enrollment berhasil dibuat';
END $$;

-- ============================================================================
-- SEED DATA ASESMEN & SUBMISSION
-- ============================================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_kursus_ids UUID[];
  v_kursus_id UUID;
  v_asesmen_id UUID;
  v_enrollment_ids UUID[];
  v_enrollment_id UUID;
  v_pengguna_id UUID;
  i INTEGER;
  j INTEGER;
BEGIN
  -- Ambil tenant pertama
  SELECT id INTO v_tenant_id FROM tenant LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RETURN;
  END IF;

  -- Ambil kursus yang sudah ada
  SELECT ARRAY_AGG(id) INTO v_kursus_ids 
  FROM kursus 
  WHERE tenant_id = v_tenant_id 
  AND status = 'published'
  LIMIT 10;

  IF v_kursus_ids IS NULL THEN
    RETURN;
  END IF;

  -- Untuk setiap kursus, buat beberapa asesmen
  FOR i IN 1..LEAST(array_length(v_kursus_ids, 1), 5) LOOP
    v_kursus_id := v_kursus_ids[i];
    
    -- Buat 2-3 asesmen per kursus
    FOR j IN 1..2 LOOP
      -- Insert asesmen
      INSERT INTO asesmen (
        kursus_id,
        judul,
        deskripsi,
        tipe,
        durasi_menit,
        passing_score,
        status
      ) VALUES (
        v_kursus_id,
        CASE j
          WHEN 1 THEN 'Kuis Modul ' || i
          WHEN 2 THEN 'Ujian Akhir ' || i
          ELSE 'Tugas ' || i
        END,
        'Asesmen untuk testing laporan',
        CASE j
          WHEN 1 THEN 'kuis'
          WHEN 2 THEN 'ujian'
          ELSE 'tugas'
        END,
        CASE j
          WHEN 1 THEN 30
          WHEN 2 THEN 90
          ELSE 60
        END,
        70,
        'published'
      ) RETURNING id INTO v_asesmen_id;

      -- Ambil enrollments untuk kursus ini
      SELECT ARRAY_AGG(id) INTO v_enrollment_ids
      FROM enrollment
      WHERE kursus_id = v_kursus_id
      LIMIT 10;

      IF v_enrollment_ids IS NOT NULL THEN
        -- Buat submissions untuk asesmen ini
        FOREACH v_enrollment_id IN ARRAY v_enrollment_ids LOOP
          -- Ambil pengguna_id dari enrollment
          SELECT pengguna_id INTO v_pengguna_id
          FROM enrollment
          WHERE id = v_enrollment_id;

          -- Insert percobaan asesmen
          INSERT INTO percobaan_asesmen (
            asesmen_id,
            pengguna_id,
            nomor_percobaan,
            status,
            nilai,
            waktu_mulai,
            waktu_selesai
          ) VALUES (
            v_asesmen_id,
            v_pengguna_id,
            1,
            CASE 
              WHEN random() < 0.8 THEN 'selesai'
              ELSE 'sedang_berjalan'
            END,
            CASE 
              WHEN random() < 0.8 THEN (40 + random() * 60)::DECIMAL(5,2)
              ELSE NULL
            END,
            NOW() - (random() * 60 || ' days')::INTERVAL,
            CASE 
              WHEN random() < 0.8 THEN NOW() - (random() * 50 || ' days')::INTERVAL
              ELSE NULL
            END
          );
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Seed data asesmen dan submission berhasil dibuat';
END $$;

-- ============================================================================
-- UPDATE STATISTICS
-- ============================================================================

-- Update progress_persen di enrollment berdasarkan data yang ada
-- (Ini optional, hanya untuk membuat data lebih realistis)

RAISE NOTICE 'Seed data untuk testing reports berhasil dibuat!';
RAISE NOTICE 'Silakan refresh halaman /admin/reports untuk melihat hasilnya';
