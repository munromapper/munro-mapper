declare module '@mapbox/togeojson' {
  import type { FeatureCollection } from 'geojson';
  
  export function gpx(doc: Document): FeatureCollection;
  export function kml(doc: Document): FeatureCollection;
  export function tcx(doc: Document): FeatureCollection;
}