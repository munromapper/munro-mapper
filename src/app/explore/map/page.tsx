// src/app/explore/map/page.tsx
// This file contains the content for list view area of the 'map view' page in the 'explore' section of the application

'use client';
import React, { useState } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import { motion } from 'framer-motion';

export default function MapPage() {
  const { munros, setVisibleMunros, isSidebarExpanded, setSidebarExpanded } = useMapState();

  return (
    <div className="flex flex-col h-full rounded-xl">
      <div className="p-9 border-b border-sage flex flex-col bg-mist pointer-events-auto">
        Header
        <button 
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
          className="cursor-pointer"
          aria-label={isSidebarExpanded ? "Collapse list" : "Expand list"}
        >
          {isSidebarExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            )}
        </button>
      </div>
      <motion.div
        initial={false}
        animate={{ 
          height: isSidebarExpanded ? 'auto' : 0,
          opacity: isSidebarExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden bg-mist flex-1 min-h-0 pointer-events-auto"
      >
        <div className="p-6">
          <ul>
            {/* Render your munro list here */}
            {munros.map(munro => (
              <li key={munro.id}>
                <p>{munro.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}