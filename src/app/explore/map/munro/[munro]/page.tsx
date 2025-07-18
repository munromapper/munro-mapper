// src/app/explore/map/[munro]/page.tsx
import { fetchMunroData } from '@/utils/clientDataFetchers';
import BackButton from '@/components/BackButton';
import BaggedIndicator from '@/components/BaggedIndicator';

export async function generateStaticParams() {
  const munros = await fetchMunroData();
  return (munros ?? []).map((munro) => ({
    munro: munro.slug,
  }));
}

export default async function MunroSidebarDetail(props: { params: Promise<{ munro: string }>}) {
  const params = await props.params;
  const munros = await fetchMunroData();
  const munro = munros?.find((m) => m.slug === params.munro);

  if (!munro) {
    return <div className="p-6">Munro not found.</div>;
  }

  return (
      <div className="h-full flex flex-col p-9">
          <div className="flex justify-between items-center gap-10 mb-6">
              <BackButton link="/explore/map/" text="Back" />
              <BaggedIndicator/>
          </div>
          <h1 className="font-medium mb-2">{munro.name}</h1>
          <h2 className="text-moss font-normal">&quot;{munro.nameMeaning || 'Name Meaning'}&quot;</h2>
          <div className="rounded-xl bg-sage h-54 my-9"></div>
          <p className="text-l">{munro.description || 'The third highest mountain in Britain, Braeriach is perhaps the finest of the Cairngorms. Reaching its vast summit plateau requires a long approach walk, as this area remains a truly wild place .'}</p>
          <div className="flex gap-8 mt-9">
              <div>
                  <h4 className="text-moss">Rank</h4>
                  <p className="text-xl">#{munro.id}</p>
              </div>
              <div>
                  <h4 className="text-moss">Height</h4>
                  <p className="text-xl">{munro.height || '1200m'}m</p>
              </div>
              <div>
                  <h4 className="text-moss">Region</h4>
                  <p className="text-xl">{munro.region || 'Scotland'}</p>
              </div>
          </div>
          <div className="border-b border-dashed border-sage my-9"></div>
      </div>
  );
}

