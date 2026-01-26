import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with Admin (Service Role) key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Get request body
    const { email, password, nama_lengkap, role, id_lembaga } = await req.json();

    // 1. Create user in Supabase Auth (Auto confirmed)
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto confirm email
        user_metadata: {
          nama_lengkap,
        },
      });

    if (authError) {
      throw authError;
    }

    if (!authUser.user) {
      throw new Error("Failed to create user");
    }

    // 2. Create user in public.pengguna
    const { data: pengguna, error: penggunaError } = await supabaseAdmin
      .from("pengguna")
      .insert({
        auth_id: authUser.user.id,
        email,
        nama_lengkap,
        role,
        id_lembaga, // Fixed: tenant_id -> id_lembaga
        status: "aktif",
      })
      .select()
      .single();

    if (penggunaError) {
      // Rollback: Delete auth user if public record fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw penggunaError;
    }

    return new Response(JSON.stringify(pengguna), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
