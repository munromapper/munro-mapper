// src/utils/map/mapFilterFunction.ts
// This file contains the filterMunros function which filters a list of Munros based on various criteria

import { Munro, Route, RouteMunroLink, Filters } from '@/types/data/dataTypes';

interface FilterParams {
    filters: Filters;
    munros: Munro[];
    routeData: Route[];
    routeLinks: RouteMunroLink[];
    userBaggedMunros: number[];
    friendsBaggedMunros: Record<string, number[]>;
}

/**
 * Filters Munros based on the provided filters and associated routes.
 * @param filters - The filter criteria to apply.
 * @param munros - The list of Munros to filter.
 * @param routeData - The list of routes to consider for filtering.
 * @param routeLinks - The links between routes and Munros.
 * @param baggedMunroIds - The IDs of Munros that have been marked as bagged by the current user.
 * @returns A filtered list of Munros that match the criteria.
 */
export function filterMunros({
    filters,
    munros,
    routeData,
    routeLinks,
    userBaggedMunros,
    friendsBaggedMunros
}: FilterParams): Munro[] {

    const routeById = new Map<number, Route>(routeData.map(route => [route.id, route]));
    const routesByMunro = new Map<number, Route[]>();
    const [minLength, maxLength] = filters.length;
    const [minAscent, maxAscent] = filters.ascent;

    for (const link of routeLinks) {
        const route = routeById.get(link.routeId);
        if (!route) continue;
        if (!routesByMunro.has(link.munroId)) {
            routesByMunro.set(link.munroId, []);
        }
        routesByMunro.get(link.munroId)!.push(route);
    }

    if (filters.friends && filters.friends.selectedPeople.length > 0) {
        const baggedLists = filters.friends.selectedPeople.map(id => {
            if (id === 'me') {
                return userBaggedMunros;
            } else if (friendsBaggedMunros[id]) {
                return friendsBaggedMunros[id];
            } else {
                return [];
            }
        });

        if (filters.friends.baggedMode === 'bagged') {
            munros = munros.filter(munro =>
                baggedLists.every(list => list.includes(munro.id))
            );
        } else {
            munros = munros.filter(munro =>
                baggedLists.every(list => !list.includes(munro.id))
            );
        }
    }

    return munros.filter(munro => {
        const routes = routesByMunro.get(munro.id);
        if (!routes || routes.length === 0) {
            return false;
        }

        return routes.some(route => {

            if (route.length < minLength || route.length > maxLength) {
                console.log(`Route ${route.id} filtered out by length: ${route.length} not in [${minLength}, ${maxLength}]`);
            }
            return (
                (filters.routeStyle === 'all' || route.style === filters.routeStyle) &&
                (filters.difficulty === 'all' || route.difficulty === filters.difficulty) &&
                route.length >= minLength && route.length <= maxLength &&
                route.ascent >= minAscent && route.ascent <= maxAscent
            );
        });
    });
}
