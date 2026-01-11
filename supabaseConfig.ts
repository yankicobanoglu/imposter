// =========================================================================
// ENVIRONMENT VARIABLES CONFIGURATION
// =========================================================================

// These values are pulled from your hosting environment (Vercel) or local .env file.
// They must be prefixed with VITE_ to be exposed to the browser.

// Safely retrieve environment variables to prevent crashes in non-Vite preview environments
const getEnv = () => {
  try {
    // Check if import.meta and import.meta.env exist
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env;
    }
  } catch (e) {
    // Ignore errors in strict environments
  }
  return {};
};

const env = getEnv();

export const SUPABASE_URL = env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || "";

// =========================================================================