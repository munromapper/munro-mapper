'use client';

import { useEffect, useRef, useState } from 'react'; // Importing React library functions
import initialiseMap from '@/utils/initialiseMap'; // Importing the map initialisation function
import fetchMunroData from '@/utils/fetchMunroData'; // Importing the data fetch function

export default function MapComponent() {

    const mapRef = useRef<HTMLDivElement | null>(null); // Store the map container reference as a permanent reference between re-renders
    const [munroData, setMunroData] = useState<any[]>([]); // Store the munro data as a state that can change

    // Runs once when MapComponent is mounted
    useEffect(() => {
        const loadData = async () => { // Creates the function loadData, which runs the function fetchMunroData we imported and then sets the 'state' value of munroData to the returned data
            const data = await fetchMunroData();
            setMunroData(data);
        };
        // Running the loadData function
        loadData();
    }, []);

    // Runs whenever the 'state' of munroData is adjusted
    useEffect(() => {
        if (!mapRef.current || munroData.length === 0) return; // If there is no valid map container reference, or munroData is empty, dont run the function
        initialiseMap(mapRef.current, munroData, () => { // Calls the initialiseMap function, passing the current map container reference, the munroData and the onLoad 'void' function of a console.log
            console.log('Map loaded');
        })
    }, [munroData]); // Tells the use effect to run whenever a change in munroData state is detected

    return (

        <div
          ref={mapRef} // Returns a div that is our map container reference into the map container element in our layout
          className="top-0 left-0 w-full h-full z-0"
        />
        
    );

}