// src/app/explore/map/munro/[munro]/page.tsx
// Page component for displaying a specific Munro's route and hill details

import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '@/utils/data/clientDataFetchers';
import type { Munro } from '@/types/data/dataTypes';

type MunroRouteParams = {
  params: Promise<{ munro: string }>;
};

export async function generateStaticParams() {
  const munros = await fetchMunroData();
  return (munros ?? []).map((munro) => ({
    munro: munro.slug,
  }));
}

export async function generateMetadata({ params }: MunroRouteParams) {
  const munros = await fetchMunroData();
  const resolvedParams = await params;
  const munro = munros?.find((m) => m.slug === resolvedParams.munro);

  if (!munro) {
    return {
      title: "Munro not found | Munro Mapper",
      description: "This Munro could not be found.",
    };
  }

  return {
    title: `${munro.name} | Munro Mapper`,
    description: `See details, routes, and stats for ${munro.name}.`,
  };
}

export default async function MunroSidebarDetail({ params }: MunroRouteParams) {
  const resolvedParams = await params;
  const munroSlug = resolvedParams.munro;
  
  const [munros, routeLinks, routes] = await Promise.all([
    fetchMunroData(),
    fetchRouteMunroLinks(),
    fetchRouteData(),
  ]);

  const munro = munros?.find((m) => m.slug === munroSlug);
  const routeLink = routeLinks?.find((link) => link.munroId === munro?.id);
  const route = routes?.find((r) => r.id === routeLink?.routeId) ?? null;

  const routeMunroLinks = routeLinks?.filter(link => link.routeId === route?.id) ?? [];
  const routeMunros = routeMunroLinks
    .map(link => munros?.find(m => m.id === link.munroId))
    .filter((m): m is Munro => Boolean(m));

  if (!munro) {
    return <div className="p-6">Munro not found.</div>;
  }

  return (
    <div>
        <h1>{munro.name}</h1>
    </div>
  )
}

