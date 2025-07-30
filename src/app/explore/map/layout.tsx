// src/app/explore/map/layout.tsx
// This file contains the layout for the 'map view' page of the 'explore' section of the application

import { MapStateProvider } from "@/contexts/MapStateContext";
import { BaggedMunroProvider } from "@/contexts/BaggedMunroContext";
import MapPageComponent from "./components/MapPageComponent";

export const metadata = {
  title: 'Munro Mapper | Map View',
  description: 'Explore the map and discover new routes and munros.',
};

interface MapLayoutProps {
  children: React.ReactNode;
}

export default function MapLayout({ children }: MapLayoutProps) {
  return (
    <>
      <div className="bg-mist text-slate h-full relative">
          <BaggedMunroProvider>
            <MapStateProvider>
              <MapPageComponent>
                {children}
              </MapPageComponent>
            </MapStateProvider>
          </BaggedMunroProvider>
      </div>
    </>
  );
}