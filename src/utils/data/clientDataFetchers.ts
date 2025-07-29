// src/utils/data/clientDataFetchers.ts
// This file contains client-side data fetchers for the application

import { map } from 'framer-motion/client';
import { supabase } from '../auth/supabaseClient';
import { Munro, Route, RouteMunroLink, UserProfile, UserSubscription, Friend } from '@/types/data/dataTypes';

/**
 * Fetches Munro data from Supabase.
 * @returns An array of Munro objects or null if an error occurs.
 */
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

/**
 * Fetches Route data from Supabase.
 * @returns An array of Route objects or null if an error occurs.
 */
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
        garminLink: route.garmin_link,
    })) as Route[];
}

/**
 * Fetches Route-Munro links from Supabase.
 * @returns An array of RouteMunroLink objects or null if an error occurs.
 */
export async function fetchRouteMunroLinks(): Promise<RouteMunroLink[] | null> {
    const { data, error } = await supabase.from('route_munro_links').select('*');
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

/**
 * Fetches user profile data for the given user ID
 * @param userId The ID of the user
 * @returns A promise that resolves to the user profile or null
 */
export async function fetchUserProfile(userId: string) {
    if (userId === null) {
        return null;
    }
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
            user_id,
            first_name,
            last_name,
            email_opt_in,
            profile_photo_url,
            preferences,
            user_discriminators(discriminator),
            user_premium_status(premium_status)
        `)
        .eq('user_id', userId)
        .single() as {
        data: {
            user_id: string;
            first_name: string;
            last_name: string;
            email_opt_in: boolean;
            profile_photo_url: string;
            preferences: {
                length_unit: string;
                elevation_unit: string;
            }
            user_discriminators: { discriminator: string };
            user_premium_status: { premium_status: string};
        } | null;
        error: string | null;
        };

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return {
        id: data?.user_id,
        firstName: data?.first_name,
        lastName: data?.last_name,
        isEmailOptIn: data?.email_opt_in,
        profilePhotoUrl: data?.profile_photo_url,
        preferences: data?.preferences ? {
            lengthUnit: data.preferences.length_unit,
            elevationUnit: data.preferences.elevation_unit
        } : {
            lengthUnit: 'kilometres',
            elevationUnit: 'metres'
        },
        discriminator: data?.user_discriminators?.discriminator,
        isPremium: data?.user_premium_status?.premium_status
    } as UserProfile;
}

export async function fetchAllUserProfiles() {
    const { data, error } = await supabase
        .from('user_profiles')
        .select(`
            user_id,
            first_name,
            last_name,
            email_opt_in,
            profile_photo_url,
            preferences,
            user_discriminators(discriminator),
            user_premium_status(premium_status)
        `) as {
        data: {
            user_id: string;
            first_name: string;
            last_name: string;
            email_opt_in: boolean;
            profile_photo_url: string;
            preferences: {
                length_unit: string;
                elevation_unit: string;
            }
            user_discriminators: { discriminator: string };
            user_premium_status: { premium_status: string};
        }[] | null;
        error: string | null;
    };

    if (error) {
        console.error('Error fetching user profiles:', error);
        return null;
    }

    if (!data || !Array.isArray(data)) {
        return [];
    }

    return data.map((item) => ({
        id: item.user_id,
        firstName: item.first_name,
        lastName: item.last_name,
        isEmailOptIn: item.email_opt_in,
        profilePhotoUrl: item.profile_photo_url,
        preferences: item.preferences ? {
            lengthUnit: item.preferences.length_unit,
            elevationUnit: item.preferences.elevation_unit
        } : {
            lengthUnit: 'kilometres',
            elevationUnit: 'metres'
        },
        discriminator: item.user_discriminators?.discriminator,
        isPremium: item.user_premium_status?.premium_status
    })) as UserProfile[];
}

/**
 * Fetches the subscription details for a user.
 * @param userId The ID of the user whose subscription to fetch
 * @returns A promise that resolves to the user's subscription or null
 */
export async function fetchUserSubscription(userId: string): Promise<UserSubscription[] | null> {
    if (userId === null) {
        return null;
    }
    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching user subscription:', error);
        return null;
    }

    return data.map((subscription) => ({
        id: subscription.id,
        userId: subscription.user_id,
        stripeCustomerId: subscription.stripe_customer_id,
        stripeSubscriptionId: subscription.stripe_subscription_id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        createdAt: subscription.created_at,
        updatedAt: subscription.updated_at,
        canceledAt: subscription.canceled_at,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
    })) as UserSubscription[];
}

/**
 * Fetches friends of the given user
 * @param userId The ID of the user whose friends to fetch
 * @return A promise that resolves to an array of friends or null
 */
export async function fetchUserFriends(userId: string): Promise<Friend[] | null> {
    if (userId === null) {
        return null;
    }
    const { data, error } = await supabase
        .from('user_friends')
        .select('*')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    if (error) {
        console.error('Error fetching user friends:', error);
        return null;
    }

    return data.map((item) => ({
        id: item.id,
        requesterId: item.requester_id,
        addresseeId: item.addressee_id,
        requestStatus: item.status,
        createdAt: item.created_at,
        respondedAt: item.responded_at,
    })) as Friend[];
}

/**
 * Bags a Munro for a user.
 * @param userId The ID of the user.
 * @param munroId The ID of the Munro to bag.
 * @returns A promise that resolves when the operation is complete.
 */
export async function bagMunro(userId: string, munroId: number) {
  return supabase.from('bagged_munros').upsert({ user_id: userId, munro_id: munroId });
}

/**
 * Unbags a Munro for a user.
 * @param userId The ID of the user.
 * @param munroId The ID of the Munro to unbag.
 * @returns A promise that resolves when the operation is complete.
 */
export async function unbagMunro(userId: string, munroId: number) {
  return supabase.from('bagged_munros').delete().eq('user_id', userId).eq('munro_id', munroId);
}