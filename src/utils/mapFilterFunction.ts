// src/utils/mapFilterFunction.ts
import { Munro, Route, RouteMunroLink, Filters } from '@/types';

interface FilterParams {
    filters: Filters;
    munros: Munro[];
    routeData: Route[];
    routeLinks: RouteMunroLink[];
}

export function filterMunros({
    filters,
    munros,
    routeData,
    routeLinks,
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

    // Only include Munros that have at least one associated route
    return munros.filter(munro => {
        const routes = routesByMunro.get(munro.id);
        if (!routes || routes.length === 0) {
            // No routes for this Munro, skip it
            return false;
        }
        // Filtering logic for Munros with routes
        return routes.some(route => {
            return (
                (filters.routeStyle === 'all' || route.style === filters.routeStyle) &&
                (filters.difficulty === 'all' || route.difficulty === filters.difficulty) &&
                route.length >= minLength && route.length <= maxLength &&
                route.ascent >= minAscent && route.ascent <= maxAscent
            );
        });
    });
}
