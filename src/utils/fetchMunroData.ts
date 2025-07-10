import getSupabaseClient from './supabaseClient' // Importing the getSupabaseClient function from our supabaseClient utility function

export default async function fetchMunroData() {
    const supabase = getSupabaseClient(); // Sets the value of supabase to the value returned from the function - createClient(supabaseUrl, supabaseAnonKey), which is a supabase utility in which we've fed our keys
    const {data, error} = await supabase.from('munros').select('*'); // Sets the data to the data fetched from supabase, or an error if it fails to fetch (from the 'munros' table, and selecting all content, *)

    // If theres an error, log it in the console and return
    if (error) {
        console.error('Error fetching munro data:', error);
        return[];
    }

    console.log('Raw Munro Data:', data)

    // If there is no error and we get data, return that data from the function
    return data || [];
}