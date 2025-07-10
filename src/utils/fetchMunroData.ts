import getSupabaseClient from './supabaseClient'

export default async function fetchMunroData() {
    const supabase = getSupabaseClient();
    const {data, error} = await supabase.from('munros').select('*');

    if (error) {
        console.error('Error fetching munro data:', error);
        return[];
    }

    console.log('Raw Munro Data:', data)

    return data || [];
}