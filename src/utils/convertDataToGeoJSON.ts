// utils/convertToGeoJSON.ts
import type { Feature, FeatureCollection, Point, GeoJsonProperties } from 'geojson'; // Importing variable types from the geojson library

export default function convertDataToGeoJSON(
  hills: Array<{ latitide: number; longitude: number; [key: string]: any }> // Defining the function with an array of 'hills' as its argument; it must have latitude and longitude values, anything else (key:string) can get passed into the properties object
): FeatureCollection<Point, GeoJsonProperties> { // Defining the return type of the function for Typescript, as a FeatureCollection. Each feature has a 'point' and 'properties'
  const features: Feature<Point, GeoJsonProperties>[] = hills.map((hill) => ({ // Creating a new array called 'features' using .map - this creates a new 'hill' in the geoJSON for each one in the input array
    type: 'Feature', // Tells mapbox this is a Feature object
    geometry: {
      type: 'Point', // Tells mapbox that this is a single point location
      coordinates: [hill.longitude, hill.latitude], // Gives coordinates from the input hill
    },
    properties: { ...hill }, // Copies all the remaining properties from the original data into the properties field automatically
  }));

  console.log('Munro GeoJSON Data', features)

  // Returning the final GeoJSON object, a 'FeatureCollection' called features.
  return {
    type: 'FeatureCollection',
    features,
  };
}
