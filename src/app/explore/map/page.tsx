// src/app/explore/map/page.tsx
// This file contains the content for list view area of the 'map view' page in the 'explore' section of the application

'use client';
import React from 'react';
import SidebarListPage from './components/SidebarListPage';

export default function MapPage() {

  return (
    <div className="rounded-xl w-full max-md:rounded-none max-md:h-full">
      <SidebarListPage />
    </div>
  );
}