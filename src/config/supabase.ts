import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in the console but keep the public site rendering.
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Check .env.local or the Vercel environment.");
}

export const supabase = createClient(supabaseUrl ?? "http://localhost", supabaseAnonKey ?? "missing-key");
