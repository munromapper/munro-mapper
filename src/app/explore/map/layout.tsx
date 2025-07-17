// src/app/explore/map/layout.tsx
import { MapComponent } from './components/MapComponent'
import { SidebarComponent } from './components/SidebarComponent'
import FilterComponent from './components/filtercomponents/FilterComponent'
import { MapDataProvider } from '@/contexts/MapDataContext'

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <MapDataProvider>
            <div className="relative w-full h-full">
                <div className="absolute z-0 w-full h-full bg-moss">
                    <MapComponent/>
                </div>
                <div className="p-6 absolute z-10 w-full h-full flex gap-6 items-start pointer-events-none">
                    <aside className="pointer-events-auto h-full">
                        <SidebarComponent>
                            {children}
                        </SidebarComponent>
                    </aside>
                    <div className="pointer-events-auto">
                        <FilterComponent/>
                    </div>
                </div>
            </div>
        </MapDataProvider>
    )
}