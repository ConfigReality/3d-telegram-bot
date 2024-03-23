import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';
import { config } from 'dotenv';
config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);