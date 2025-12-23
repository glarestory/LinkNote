import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// These environment variables will be needed
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''; // Use Service Key for backend admin privileges if needed, or Anon key if using RLS with auth context

if (!supabaseUrl) {
    console.warn('Missing SUPABASE_URL environment variable');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
