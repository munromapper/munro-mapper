import MapComponent from './components/MapComponent'

export default function MapLayout({ children }: { children: React.ReactNode}) {

    return(

        <div id="map-container" className="w-full h-full relative bg-moss">
            <MapComponent />
            <div id="map-overlay-content" className="absolute w-full h-full p-10 flex top-0 pointer-events-none">
                <div id="map-sidebar-wrapper" className="w-75 bg-mist p-5 rounded-2xl pointer-events-auto">
                    {children}
                </div>
                <div id="map-filter-wrapper">
                    {/* Filter Component Will Go Here */}
                </div>
            </div>
        </div>

    )

}