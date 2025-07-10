import { createClient } from '@supabase/supabase-js' // Importing the functions from the supabase package

export default function getSupabaseClient() {
  console.trace('Creating Supabase client') // Trace log for debugging
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL // Setting our supabaseUrl value (either from local or vercel environment variables)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Setting our supabaseAnonKey value (either from local or vercel environment variables)

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables') // Throws an error if the values are missing
  }

  return createClient(supabaseUrl, supabaseAnonKey) // Returns the supabase function with the keys attached
}


