import mapboxgl from "mapbox-gl"

function createMapMarker(map, feature) {
    const coordinates = feature.geometry.coordinates;
    const { HillName } = feature.properties; // or use any relevant fields

    // Create marker DOM element
    const marker = document.createElement('div');
    marker.classList.add('map-marker');

    const markerInner = document.createElement('div');
    markerInner.classList.add('map-marker-icon');
    marker.appendChild(markerInner);

    // Interactions
    marker.onmouseenter = () => {
        if (!markerInner.classList.contains('map-marker-focused')) {
            markerInner.classList.add('map-marker-active');
        }
    };

    marker.onmouseleave = () => {
        if (!markerInner.classList.contains('map-marker-focused')) {
            markerInner.classList.remove('map-marker-active');
        }
    };

    marker.onclick = () => {
        markerInner.classList.toggle('map-marker-focused');
            console.log("Clicked marker:", HillName); // Or show popup etc
        };

    // Create and add to map
    const newMarker = new mapboxgl.Marker(marker)
        .setLngLat(coordinates)
        .addTo(map);

    return newMarker;
}

export default createMapMarker;
