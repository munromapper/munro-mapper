// src/utils/data/userPreferencesUpdaters.ts
// This file contains functions to update user preferences in the application.

import { supabase } from '../auth/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface HandleUpdatePreferencesProps {
    event: React.FormEvent<HTMLFormElement>;
    user: User | null;
    elevationUnit: string;
    distanceUnit: string;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccess: (message: string | null) => void;
}

export async function handleUpdatePreferences({
    event,
    user,
    elevationUnit,
    distanceUnit,
    setLoading,
    setError,
    setSuccess,
}: HandleUpdatePreferencesProps): Promise<void> {
    event.preventDefault();
    if (!user) {
        setError("User not authenticated.");
        return;
    }
    setLoading(true);
    setError(null);

    const allowedElevationUnits = ['metres', 'feet'];
    const allowedDistanceUnits = ['kilometres', 'miles'];

    function isValidPreference(value: string, allowed: string[]): boolean {
        return allowed.includes(value);
    }

    if (!isValidPreference(elevationUnit, allowedElevationUnits)) {
        setError("Invalid elevation unit.");
        return;
    }
    if (!isValidPreference(distanceUnit, allowedDistanceUnits)) {
        setError("Invalid distance unit.");
        return;
    }

    const { error } = await supabase
        .from('user_profiles')
        .update({
            preferences: {
                elevation_unit: elevationUnit,
                length_unit: distanceUnit
            }
        })
        .eq('user_id', user.id);

    if (error) {
        setError("Failed to update preferences: " + error.message);
        setLoading(false);
    } else {
        setSuccess("Preferences updated successfully.");
        setLoading(false);
    }
}

