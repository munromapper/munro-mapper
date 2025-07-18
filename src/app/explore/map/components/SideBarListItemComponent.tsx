// src/ap[p/explore/map/components/SideBarListItemComponent.tsx
import { Munro } from '@/types';
import Link from 'next/link';

type Props = {
    munro: Munro;
};

export default function SideBarListItemComponent({ munro }: Props) {
    return (
        <Link href={`/explore/map/munro/${munro.slug}`}>
            <div className="h-56 bg-sage rounded-t-xl">
            </div>
            <div className="p-9 rounded-b-xl border-l border-b border-r border-dashed border-sage">
                <div className="mb-6">
                    <h2 className="font-medium">{munro.name}</h2>
                    <h3 className="text-moss mt-2">&quot;{munro.nameMeaning || 'Name Meaning'}&quot;</h3>
                </div>
                <div>
                    <p className="text-l">{munro.description || 'The third highest mountain in Britain, Braeriach is perhaps the finest of the Cairngorms. Reaching its vast summit plateau requires a long approach walk, as this area remains a truly wild place .'}</p>
                </div>
                <div className="flex gap-8 mt-6">
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
            </div>
        </Link>
    )
}