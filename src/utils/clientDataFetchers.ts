// src/utils/clientDataFetchers.ts
import { supabase } from './supabaseClient';
import { Munro, Route, RouteMunroLink } from '../types';

export async function fetchMunroData(): Promise<Munro[] | null> {
    const { data, error } = await supabase.from('munros').select('*');
    if (error) {
        console.error('Error fetching Munro data:', error);
        return null;
    } else if (!data || data.length === 0) {
        console.warn('No Munro data found.');
        return [];
    }

    return data.map((munro) => ({
        id: munro.id,
        name: munro.name,
        latitude: munro.latitude,
        longitude: munro.longitude,
        height: munro.height,
        region: munro.region,
        nameMeaning: munro.name_meaning,
        description: munro.description,
        slug: munro.slug,
    })) as Munro[];
}

export async function fetchRouteData(): Promise<Route[] | null> {
    const { data, error } = await supabase.from('routes').select('*');
    if (error) {
        console.error('Error fetching Route data:', error);
        return null;
    } else if (!data || data.length === 0) {
        console.warn('No Route data found.');
        return [];
    }

    return data.map((route) => ({
        id: route.id,
        name: route.name,
        gpxFile: route.gpx_file,
        description: route.description,
        length: route.length,
        ascent: route.ascent,
        difficulty: route.difficulty,
        startLocation: route.start_location,
        startLink: route.start_link,
        style: route.style,
        estimatedTime: route.estimated_time,
    })) as Route[];
}

export async function fetchRouteMunroLinks(): Promise<RouteMunroLink[] | null> {
    const { data, error } = await supabase.from('route-munro-links').select('*');
    if (error) {
        console.error('Error fetching Route-Munro links:', error);
        return null;
    } else if (!data || data.length === 0) {
        console.warn('No Route-Munro links found.');
        return [];
    }

    return data.map((link) => ({
        id: link.id,
        routeId: link.route_id,
        munroId: link.munro_id,
    })) as RouteMunroLink[];
}