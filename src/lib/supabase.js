import { createClient } from "@supabase/supabase-js";

// Browser Supabase client, used only by the /admin area (it lives in the admin chunk).
// It uses the public anon key: row-level security decides what a signed-in admin can do.
const url = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

// Captured before Supabase reads (and clears) the URL hash, so the reset-password page
// can show why a recovery link failed (e.g. #error_code=otp_expired).
export const initialHash = typeof window !== "undefined" ? window.location.hash : "";

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
