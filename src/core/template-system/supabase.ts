/**
 * Supabase Client Configuration
 * Initialize Supabase client for database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Warn in development if not configured
if (typeof window !== 'undefined' && (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key')) {
  console.warn('⚠️ Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

// Create Supabase client with proper session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage (default, but explicit)
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    // Automatically refresh token before expiry
    autoRefreshToken: true,
    // Persist session across tabs
    persistSession: true,
    // Detect session from URL (for OAuth, magic links, etc.)
    detectSessionInUrl: true,
  },
});

// Debug: Log the current session/role
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('Supabase session:', session ? 'authenticated' : 'anonymous (anon role)');
    console.log('Using key:', supabaseAnonKey?.substring(0, 20) + '...');
  });
}
