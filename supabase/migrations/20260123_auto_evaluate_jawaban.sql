-- ============================================================================
-- Auto Evaluate Jawaban Trigger
-- ============================================================================
-- Migration: 20260123_auto_evaluate_jawaban
-- Description: Trigger untuk otomatis mengevaluasi jawaban dan menghitung nilai
-- ============================================================================

-- Function untuk mengevaluasi jawaban
CREATE OR REPLACE FUNCTION evaluate_jawaban()
RETURNS TRIGGER AS $$
DECLARE
    v_soal RECORD;
    v_is_correct BOOLEAN := false;
    v_poin DECIMAL(5,2) := 0;
BEGIN
    -- Ambil data soal
    SELECT * INTO v_soal FROM soal WHERE id = NEW.soal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Soal tidak ditemukan';
    END IF;

    -- Evaluasi berdasarkan tipe soal
    CASE v_soal.tipe
        WHEN 'pilihan_ganda' THEN
            -- Untuk pilihan ganda, cek apakah key yang dipilih benar
            -- Cari opsi yang benar dari JSONB array
            v_is_correct := EXISTS (
                SELECT 1 
                FROM jsonb_array_elements(v_soal.opsi) AS opt
                WHERE (opt->>'key') = NEW.jawaban_pengguna 
                AND (opt->>'benar')::boolean = true
            );
            
        WHEN 'pilihan_ganda_multiple' THEN
            -- Untuk multiple choice, bandingkan array jawaban
            -- Ambil semua key yang benar dari opsi
            DECLARE
                v_correct_keys JSONB;
                v_user_keys JSONB;
            BEGIN
                -- Dapatkan semua key yang benar
                SELECT jsonb_agg(opt->>'key') INTO v_correct_keys
                FROM jsonb_array_elements(v_soal.opsi) AS opt
                WHERE (opt->>'benar')::boolean = true;
                
                -- Bandingkan dengan jawaban user (sudah dalam bentuk JSONB array)
                v_user_keys := NEW.jawaban_pengguna_multiple;
                
                -- Cek apakah sama persis (semua benar dan tidak ada yang salah)
                v_is_correct := (v_correct_keys @> v_user_keys AND v_user_keys @> v_correct_keys);
            END;
            
        WHEN 'benar_salah' THEN
            -- Untuk benar/salah, bandingkan langsung dengan jawaban_benar
            v_is_correct := LOWER(TRIM(NEW.jawaban_pengguna)) = LOWER(TRIM(v_soal.jawaban_benar));
            
        WHEN 'isian_singkat' THEN
            -- Untuk isian singkat, bandingkan case-insensitive dan trim whitespace
            v_is_correct := LOWER(TRIM(NEW.jawaban_pengguna)) = LOWER(TRIM(v_soal.jawaban_benar));
            
        WHEN 'esai' THEN
            -- Untuk esai, tidak auto-evaluate (perlu manual grading)
            v_is_correct := NULL;
            v_poin := 0;
            
        ELSE
            RAISE EXCEPTION 'Tipe soal tidak dikenali: %', v_soal.tipe;
    END CASE;

    -- Hitung poin jika benar (kecuali esai)
    IF v_is_correct = true THEN
        v_poin := v_soal.poin;
    ELSIF v_is_correct = false THEN
        v_poin := 0;
    ELSE
        -- NULL untuk esai atau yang belum dievaluasi
        v_poin := 0;
    END IF;

    -- Set nilai pada record
    NEW.benar := v_is_correct;
    NEW.poin_diperoleh := v_poin;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-evaluate sebelum insert atau update
DROP TRIGGER IF EXISTS trigger_evaluate_jawaban ON jawaban;
CREATE TRIGGER trigger_evaluate_jawaban
    BEFORE INSERT OR UPDATE ON jawaban
    FOR EACH ROW
    EXECUTE FUNCTION evaluate_jawaban();

-- ============================================================================
-- Function untuk menghitung total nilai percobaan asesmen
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_attempt_score()
RETURNS TRIGGER AS $$
DECLARE
    v_total_poin DECIMAL(5,2);
    v_max_poin DECIMAL(5,2);
    v_nilai DECIMAL(5,2);
BEGIN
    -- Hitung total poin yang diperoleh
    SELECT COALESCE(SUM(poin_diperoleh), 0) INTO v_total_poin
    FROM jawaban
    WHERE percobaan_id = NEW.percobaan_id;
    
    -- Hitung total poin maksimal dari semua soal di asesmen ini
    SELECT COALESCE(SUM(s.poin), 0) INTO v_max_poin
    FROM soal s
    INNER JOIN percobaan_asesmen pa ON pa.asesmen_id = s.asesmen_id
    WHERE pa.id = NEW.percobaan_id;
    
    -- Hitung nilai persentase
    IF v_max_poin > 0 THEN
        v_nilai := (v_total_poin / v_max_poin) * 100;
    ELSE
        v_nilai := 0;
    END IF;
    
    -- Update nilai di percobaan_asesmen
    UPDATE percobaan_asesmen
    SET nilai = v_nilai
    WHERE id = NEW.percobaan_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk update nilai setelah jawaban disimpan
DROP TRIGGER IF EXISTS trigger_calculate_score ON jawaban;
CREATE TRIGGER trigger_calculate_score
    AFTER INSERT OR UPDATE ON jawaban
    FOR EACH ROW
    EXECUTE FUNCTION calculate_attempt_score();

-- ============================================================================
-- Indexes untuk performa
-- ============================================================================

-- Index untuk mempercepat pencarian opsi yang benar
CREATE INDEX IF NOT EXISTS idx_soal_opsi_gin ON soal USING gin(opsi);
