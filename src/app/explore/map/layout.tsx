import MapComponent from './components/MapComponent' // Importing the main MapComponent to show on the page

export default function MapLayout({ children }: { children: React.ReactNode}) {

    return(

        <div className="w-full h-full relative"> {/* Main map container element */}
            <MapComponent /> {/* MapComponent Component being added */}
            <div className="absolute w-full h-full p-10 flex top-0 pointer-events-none"> {/* Element Housing all of the content that will appear above the map */}
                <div className="w-75 bg-mist p-5 rounded-2xl pointer-events-auto"> {/* Sidebar Element that either houses the list, or the munro information */}
                    {children} {/* List Content or Munro Info Content */}
                </div>
                <div id="map-filter-wrapper">
                    {/* Filter Component Will Go Here */}
                </div>
            </div>
        </div>

    )

}