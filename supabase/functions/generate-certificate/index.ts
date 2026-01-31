import { serve } from "http/server.ts";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Helper untuk konversi hex ke rgb format pdf-lib (0-1)
function hexToRgb(hex: string | undefined, defaultColor = { r: 0, g: 0, b: 0 }) {
  if (!hex) return rgb(defaultColor.r, defaultColor.g, defaultColor.b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ) : rgb(defaultColor.r, defaultColor.g, defaultColor.b);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Otorisasi diperlukan");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) throw new Error("Sesi tidak valid");

    const body = await req.json().catch(() => ({}));
    const { id_kursus } = body;
    if (!id_kursus) throw new Error("ID Kursus wajib diisi");

    // 1. Ambil data pendaftaran, profil, dan KURSUS (untuk metadata sertifikat)
    const { data: pendaftaran, error: enrollError } = await supabaseAdmin
      .from("pendaftaran_kursus")
      .select(`
        id,
        persentase_kemajuan,
        id_pengguna,
        pengguna:id_pengguna (nama_lengkap),
        kursus:id_kursus (judul, metadata)
      `)
      .eq("id_pengguna", (await supabaseAdmin.from("pengguna").select("id").eq("auth_id", user.id).single()).data?.id)
      .eq("id_kursus", id_kursus)
      .single();

    if (enrollError || !pendaftaran) throw new Error("Pendaftaran tidak ditemukan");
    if (Math.round(pendaftaran.persentase_kemajuan) < 100) throw new Error("Kursus belum selesai");

    const config = pendaftaran.kursus.metadata?.certificate_config;
    const namaSiswa = pendaftaran.pengguna.nama_lengkap;
    const judulKursus = pendaftaran.kursus.judul;

    // 2. Cek/Buat record sertifikat (nomor seri)
    let { data: sertifikat } = await supabaseAdmin
      .from("sertifikat")
      .select("*")
      .eq("id_pendaftaran", pendaftaran.id)
      .maybeSingle();

    if (!sertifikat) {
      const { data: nomorSertifikat, error: rpcError } = await supabaseAdmin
        .rpc("generate_nomor_sertifikat_v2", {
          p_kursus_id: id_kursus,
          p_pengguna_id: pendaftaran.id_pengguna
        });
      if (rpcError) throw rpcError;

      const { data: newCert, error: insertError } = await supabaseAdmin
        .from("sertifikat")
        .insert({
          id_pendaftaran: pendaftaran.id,
          id_pengguna: pendaftaran.id_pengguna,
          id_kursus: id_kursus,
          nomor_sertifikat: nomorSertifikat,
          nama_lengkap_snapshot: namaSiswa,
          issued_at: new Date().toISOString()
        })
        .select().single();
      if (insertError) throw insertError;
      sertifikat = newCert;
    }

    // 3. GENERATE PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape
    const { width, height } = page.getSize();
    
    // Embed Font
    const fontJudul = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Render Background Image if exists
    if (config?.url_background) {
      try {
        const bgResp = await fetch(config.url_background);
        const bgBytes = await bgResp.arrayBuffer();
        let bgImage;
        if (config.url_background.toLowerCase().endsWith('.png')) {
          bgImage = await pdfDoc.embedPng(bgBytes);
        } else {
          bgImage = await pdfDoc.embedJpg(bgBytes);
        }
        page.drawImage(bgImage, { x: 0, y: 0, width, height });
      } catch (e) {
        console.error("Gagal memuat background:", e);
        // Fallback to border if image fails
        page.drawRectangle({ x: 20, y: 20, width: width-40, height: height-40, borderColor: rgb(0.1, 0.1, 0.1), borderWidth: 2 });
      }
    } else {
      // Default simple design
      page.drawRectangle({ x: 20, y: 20, width: width-40, height: height-40, borderColor: rgb(0.1, 0.1, 0.1), borderWidth: 2 });
      page.drawText("SERTIFIKAT KELULUSAN", { x: width/2 - 180, y: height - 120, size: 34, font: fontJudul });
    }

    // Render Text Overlays
    // Default coords if not in config
    const nameX = config?.name_coords?.x ?? width / 2;
    const nameY = config?.name_coords?.y ?? height / 2;
    const nameSize = config?.name_coords?.size ?? 40;

    const courseX = config?.course_coords?.x ?? width / 2;
    const courseY = config?.course_coords?.y ?? height / 2 - 100;
    const courseSize = config?.course_coords?.size ?? 24;

    // Draw Student Name (Centered relative to its X coordinate)
    const nameText = namaSiswa.toUpperCase();
    const nameWidth = fontJudul.widthOfTextAtSize(nameText, nameSize);
    page.drawText(nameText, {
      x: nameX - (nameWidth / 2),
      y: nameY,
      size: nameSize,
      font: fontJudul,
      color: hexToRgb(config?.name_coords?.color, { r: 0.08, g: 0.35, b: 0.65 }),
    });

    // Draw Course Title
    const courseText = judulKursus;
    const courseWidth = fontJudul.widthOfTextAtSize(courseText, courseSize);
    page.drawText(courseText, {
      x: courseX - (courseWidth / 2),
      y: courseY,
      size: courseSize,
      font: fontJudul,
      color: hexToRgb(config?.course_coords?.color, { r: 0, g: 0, b: 0 }),
    });

    // Small Metadata
    page.drawText(`ID Sertifikat: ${sertifikat.nomor_sertifikat}`, { x: 50, y: 50, size: 8, font: fontJudul, opacity: 0.5 });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: { ...corsHeaders, "Content-Type": "application/pdf" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
