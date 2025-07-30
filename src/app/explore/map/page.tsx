// src/app/explore/map/page.tsx
// This file contains the content for list view area of the 'map view' page in the 'explore' section of the application

'use client';
import React, { useState } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import { motion } from 'framer-motion';

export default function MapPage() {
  const { munros, setVisibleMunros } = useMapState();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col h-full rounded-xl">
      <div className="p-9 border-b border-sage flex flex-col bg-mist pointer-events-auto">
        Header
        <button 
          onClick={() => setIsOpen(open => !open)}
          className="cursor-pointer"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>
      <motion.div
        initial={false}
        animate={{ maxHeight: isOpen ? '72vh' : 0, }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden bg-mist flex-1 min-h-0 pointer-events-auto"
      >
        <ul>
          <li>Munro 1</li>
          <li>Munro 2</li>
          <li>Munro 3</li>
        </ul>
      </motion.div>
    </div>
  );
}