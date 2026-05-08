import { createClient } from '@supabase/supabase-js';

// Mesma instância utilizada pelo app Android (RachaConta/.../SupabaseClient.kt).
// A anon key é projetada para o cliente; segurança real está nas RLS policies.
const SUPABASE_URL = 'https://feyuhznjpqlhkeouvzcu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleXVoem5qcHFsaGtlb3V2emN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjI0MDUsImV4cCI6MjA4OTc5ODQwNX0.bPekVDpYP2tDf0Llzx4vm-aL6E2MwOtSNnCTxDYOVaI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
