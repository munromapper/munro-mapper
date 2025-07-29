// src/app/explore/map/page.tsx
// This file contains the content for list view area of the 'map view' page in the 'explore' section of the application

'use client';
import { useMapState } from "@/contexts/MapStateContext";

export default function MapPage() {
  const { munros, setVisibleMunros } = useMapState();

  return (
    <div>
      Munro Page content
    </div>
  );
}