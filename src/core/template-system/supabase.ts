/**
 * Supabase Client Configuration
 * Initialize Supabase client for database operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug: Log the current session/role
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('Supabase session:', session ? 'authenticated' : 'anonymous (anon role)');
    console.log('Using key:', supabaseAnonKey?.substring(0, 20) + '...');
  });
}
