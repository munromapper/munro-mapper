'use client';
import { useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MapStyleIcon, ThreeDIcon } from '@/components/global/SvgComponents';

type MapboxTerrainSpec = {
  source: string;
  exaggeration?: number;
};

type MapboxStyleWithTerrain = {
  terrain?: MapboxTerrainSpec;
};

export default function Map3DToggle() {
  const { map3DMode, setMap3DMode, map } = useMapState();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const terrainRef = useRef<MapboxTerrainSpec | null>(null);

  // Close on outside click / ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Terrain + pitch toggle logic
  useEffect(() => {
    if (!map) return;

    const captureTerrainIfNeeded = () => {
      const style = map.getStyle() as MapboxStyleWithTerrain;
      if (style.terrain) terrainRef.current = { ...style.terrain };
    };

    const applyState = () => {
      if (map3DMode) {
        if (terrainRef.current) map.setTerrain(terrainRef.current);
        map.easeTo({ pitch: 60, duration: 300 });
      } else {
        map.setTerrain(null);
        map.easeTo({ pitch: 0, duration: 300 });
      }
    };

    const onStyleLoad = () => {
      const style = map.getStyle() as MapboxStyleWithTerrain;
      if (style.terrain) terrainRef.current = { ...style.terrain };
      applyState();
    };

    if (map.isStyleLoaded()) {
      if (!terrainRef.current) captureTerrainIfNeeded();
      applyState();
    } else {
      map.once('style.load', onStyleLoad);
    }

    map.on('style.load', onStyleLoad);
    return () => {
      map.off('style.load', onStyleLoad);
    };
  }, [map, map3DMode]);

  const selectMode = (mode: '2d' | '3d') => {
    setMap3DMode(mode === '3d');
    setOpen(false);
  };

  return (
    <div className="absolute bottom-71 right-6 z-10 pointer-events-auto" ref={menuRef}>
      <button
        className="relative w-10 h-10 flex items-center justify-center p-3 rounded-full shadow-standard bg-mist cursor-pointer"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Toggle 2D / 3D map"
        title="Toggle 2D / 3D map"
      >
        <div className="w-7 h-7">
          <ThreeDIcon />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="map-3d-menu"
            role="menu"
            aria-label="Map dimension options"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }}
            className="absolute bottom-0 right-full mr-9 w-64 rounded-xl bg-mist shadow-standard p-2"
          >
            <Option
              title="2D"
              description="Classic top-down map"
              selected={!map3DMode}
              onClick={() => selectMode('2d')}
              preview={<PreviewTerrain />}
            />
            <Option
              title="3D"
              description="Tilt and rotate the map"
              selected={map3DMode}
              onClick={() => selectMode('3d')}
              preview={<PreviewSatellite />}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({
  title,
  description,
  selected,
  onClick,
  preview
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  preview: React.ReactNode;
}) {
  return (
    <button
      role="menuitemradio"
      aria-checked={selected}
      onClick={onClick}
      className="w-full cursor-pointer flex items-center gap-4 p-2 rounded-lg text-left hover:bg-pebble focus:outline-none transition duration-250 ease-in-out"
    >
      <div
        className={`relative w-12 h-12 rounded-md overflow-hidden flex items-center justify-center border-2 transition-colors ${
          selected ? 'border-slate' : 'border-transparent'
        }`}
      >
        {preview}
      </div>
      <div className="flex-1">
        <div className="text-l font-body-font-family text-slate mb-1">{title}</div>
        <div className="text-m font-body-font-family text-moss">{description}</div>
      </div>
    </button>
  );
}

function PreviewTerrain() {
  return (
    <div
      className="w-full h-full bg-center bg-cover"
      style={{ backgroundImage: 'url(/images/mapstylestwod.jpg)' }}
      aria-label="2D preview"
    />
  );
}

function PreviewSatellite() {
  return (
    <div
      className="w-full h-full bg-center bg-cover"
      style={{ backgroundImage: 'url(/images/mapstylesthreed.jpg)' }}
      aria-label="3D preview"
    />
  );
}