import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not set. The application will not connect to the database.');
}

// Create a single supabase client with Next.js specific fetch options to bypass cache
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (...args) => fetch(args[0], { ...args[1], cache: 'no-store' }),
  },
});
