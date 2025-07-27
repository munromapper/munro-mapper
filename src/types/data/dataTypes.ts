// src/types/data/dataTypes.ts
// This file defines the data types used in the application

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    isEmailOptIn: boolean;
    profilePhotoUrl: string | null;
    discriminator: string;
    isPremium: string;
} | null;

export type Friend = {
    id: string;
    requesterId: string;
    addresseeId: string;
    requestStatus: string;
    createdAt: string;
    respondedAt: string | null;
} | null;

export type Munro = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    height: number;
    region: string;
    nameMeaning: string;
    description: string;
    slug: string;
}

export type Route = {
    id: number;
    name: string;
    gpxFile: string;
    description: string;
    length: number;
    ascent: number;
    difficulty: string;
    startLocation: string;
    startLink: string;
    style: string;
    estimatedTime: number;
    garminLink: string;
}

export type RouteMunroLink = {
    id: number;
    routeId: number;
    munroId: number;
}

export type GpxRoute = {
  id: number;
  coordinates: [number, number][];
  name: string;
  rawGpx: string;
};