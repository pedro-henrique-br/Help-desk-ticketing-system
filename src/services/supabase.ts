import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_URL;
const supabaseKey = import.meta.env.VITE_APP_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseClient = {
  supabase
}