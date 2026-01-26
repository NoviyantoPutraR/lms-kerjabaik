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

    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error("User ID is required");
    }

    // 1. Get auth_id from pengguna table before deleting
    const { data: pengguna, error: fetchError } = await supabaseAdmin
      .from("pengguna")
      .select("auth_id")
      .eq("id", user_id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Delete user from Supabase Auth (this will cascade delete pengguna due to foreign key if configured,
    // but usually we delete auth user manually)
    if (pengguna?.auth_id) {
      const { error: deleteAuthError } =
        await supabaseAdmin.auth.admin.deleteUser(pengguna.auth_id);
      if (deleteAuthError) throw deleteAuthError;
    }

    // 3. If no auth_id or if cascade didn't work/not configured, force delete from public.pengguna
    // (Note: usually deleting auth user cascades to public.pengguna if FK is set to ON DELETE CASCADE)
    // We'll try to delete explicitly just in case to ensure cleanup
    const { error: deleteDataError } = await supabaseAdmin
      .from("pengguna")
      .delete()
      .eq("id", user_id);

    if (deleteDataError) throw deleteDataError;

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
