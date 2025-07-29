// src/app/explore/list/page.tsx
// This file contains the page content for the explore/list page

import MunroTable from './components/MunroTable';
import { BaggedMunroProvider } from "@/contexts/BaggedMunroContext";
import { ListPageProvider } from "@/contexts/ListPageContext";
import { fetchMunroData } from "@/utils/data/clientDataFetchers";
import MunroSearchBar from './components/MunroSearchBar';

export default async function ListLayout() {
    const munros = await fetchMunroData();
    return (
        <div className="bg-mist text-slate h-full px-16 pt-16 pb-0 flex flex-col overflow-hidden">
            <BaggedMunroProvider>
                <ListPageProvider>
                    <div>
                        <h1 className="text-5xl font-heading-font-family">Munro list</h1>
                        <div className="flex gap-16 items-end justify-between w-full">
                                <h2 className="text-moss text-xl mt-6 max-w-[40%]">Ad amet excepteur pariatur dolore eiusmod dolore. Nisi proident id consectetur excepteur ullamco elit aliqua adipisicing.</h2>
                                <MunroSearchBar />
                        </div>
                    </div>
                    <div className="mt-12 flex-1 flex flex-col h-full w-full overflow-hidden">
                        <MunroTable munros={munros ?? []} />
                    </div>
                </ListPageProvider>
            </BaggedMunroProvider>
        </div>
    );
}