import type { FeatureCollection } from "geojson";

declare module "@mapbox/togeojson" {
    const toGeoJSON: {
        gpx: (doc: Document) => FeatureCollection;
        kml: (doc: Document) => FeatureCollection;
    };
    export default toGeoJSON;
}