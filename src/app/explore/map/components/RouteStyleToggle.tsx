import { useMapState } from '@/contexts/MapStateContext';

export default function RouteStyleToggle() {
    const { routeStyleMode, setRouteStyleMode } = useMapState();
    
    return (
        <div className="absolute bottom-45 right-6 z-10 pointer-events-auto">
            <button 
                className={`flex items-center justify-center p-2 rounded-full shadow-md bg-mist border-2 
                          transition-colors duration-300 ease-in-out
                          ${routeStyleMode === 'gradient' ? 'border-slate' : 'border-mist'}`}
                onClick={() => setRouteStyleMode(routeStyleMode === 'gradient' ? 'standard' : 'gradient')}
                aria-label={`Route style: ${routeStyleMode === 'gradient' ? 'Showing gradient' : 'Showing standard'}`}
                title={`Route style: ${routeStyleMode === 'gradient' ? 'Showing gradient' : 'Showing standard'}`}
            >
                <div className="w-7 h-7">
                    {routeStyleMode === 'gradient' ? (
                        <div className="bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 w-full h-1 rounded-full my-1.5"></div>
                    ) : (
                        <div className="bg-green-500 w-full h-1 rounded-full my-1.5"></div>
                    )}
                </div>
            </button>
        </div>
    );
}