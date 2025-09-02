// src/app/explore/map/page.tsx
// This file contains the content for list view area of the 'map view' page in the 'explore' section of the application

'use client';
import React, { useState } from 'react';
import SidebarListPage from './components/SidebarListPage';
import { useMapState } from "@/contexts/MapStateContext";
import { motion } from 'framer-motion';

export default function MapPage() {

  return (
    <div className="rounded-xl w-full">
      <SidebarListPage />
    </div>
  );
}