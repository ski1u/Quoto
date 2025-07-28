import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  export async function supabaseAction() {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser(); if (userError) throw userError
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single(); if (error) throw error

    return { supabase, user, metadata: data }
}