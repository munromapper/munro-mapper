// utils/convertToGeoJSON.ts
import type { Feature, FeatureCollection, Point, GeoJsonProperties } from 'geojson';

export default function convertDataToGeoJSON(
  hills: Array<{ lat: number; lon: number; [key: string]: any }>
): FeatureCollection<Point, GeoJsonProperties> {
  const features: Feature<Point, GeoJsonProperties>[] = hills.map((hill) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [hill.longitude, hill.latitude],
    },
    properties: { ...hill },
  }));

  console.log('Munro GeoJSON Data', features)

  return {
    type: 'FeatureCollection',
    features,
  };
}
