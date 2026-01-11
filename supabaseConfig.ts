// =========================================================================
// ENVIRONMENT VARIABLES CONFIGURATION
// =========================================================================

// These values are pulled from your hosting environment (Vercel) or local .env file.
// They must be prefixed with VITE_ to be exposed to the browser.

export const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

// =========================================================================