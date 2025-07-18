// src/app/explore/map/[munro]/page.tsx
import { fetchMunroData } from '@/utils/clientDataFetchers';
import Link from 'next/link';

type MunroPageProps = {
  params: { munro: string };
};

export async function generateStaticParams() {
  const munros = await fetchMunroData();
  return (munros ?? []).map((munro) => ({
    munro: munro.slug,
  }));
}

export default async function MunroSidebarDetail(props: MunroPageProps) {
  const { params } = props;
  const munros = await fetchMunroData();
  const munro = munros?.find((m) => m.slug === params.munro);

  if (!munro) {
    return <div className="p-6">Munro not found.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="w-full p-6 flex flex-col gap-2 shadow-md">
        <Link href={`/explore/map/`}>Go Back</Link>
        <h1>{munro.name}</h1>
        <h2 className="text-moss mt-2">&quot;{munro.nameMeaning || 'Name Meaning'}&quot;</h2>
      </div>
      <div className="p-6 flex-1">
        <p className="text-l">{munro.description || 'No description available.'}</p>
        <div className="flex gap-8 mt-6">
          <div>
            <h4 className="text-moss">Rank</h4>
            <p className="text-xl">#{munro.id}</p>
          </div>
          <div>
            <h4 className="text-moss">Height</h4>
            <p className="text-xl">{munro.height || '1200m'}</p>
          </div>
          <div>
            <h4 className="text-moss">Region</h4>
            <p className="text-xl">{munro.region || 'Scotland'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

