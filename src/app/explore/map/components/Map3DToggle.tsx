'use client';
import { useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { MapStyleIcon } from '@/components/global/SvgComponents';

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

  useEffect(() => {
    if (!map) return;

    const captureTerrainIfNeeded = () => {
      const style = map.getStyle() as MapboxStyleWithTerrain;
      if (style.terrain) {
        terrainRef.current = { ...style.terrain };
      }
    };

    const apply3DState = () => {
      if (map3DMode) {
        if (terrainRef.current) {
          map.setTerrain(terrainRef.current);
        }
        map.easeTo({ pitch: 60, duration: 300 });
      } else {
        map.setTerrain(null);
        map.easeTo({ pitch: 0, duration: 300 });
      }
    };

    const onStyleLoad = () => {
      const style = map.getStyle() as MapboxStyleWithTerrain;
      if (style.terrain) {
        terrainRef.current = { ...style.terrain };
      }
      apply3DState();
    };

    if (map.isStyleLoaded()) {
      if (!terrainRef.current) captureTerrainIfNeeded();
      apply3DState();
    } else {
      map.once('style.load', onStyleLoad);
    }

    map.on('style.load', onStyleLoad);
    return () => {
      map.off('style.load', onStyleLoad);
    };
  }, [map, map3DMode]);

  return (
    <div className="absolute bottom-71 right-6 z-10 pointer-events-auto" ref={menuRef}>
      <button
        className="relative w-10 h-10 flex items-center justify-center p-3 rounded-full shadow-standard bg-mist cursor-pointer"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Toggle 2D/3D map"
        title="Toggle 2D/3D map"
      >
        <div className="w-7 h-7">
          <MapStyleIcon />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="map-3d-menu"
            role="menu"
            aria-label="Map 3D options"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }}
            className="absolute bottom-0 right-full mr-9 w-48 rounded-xl bg-mist shadow-standard p-2"
          >
            <Option
              title="2D"
              selected={!map3DMode}
              onClick={() => {
                setMap3DMode(false);
                setOpen(false);
              }}
            >
              <MapStyleIcon />
            </Option>
            <Option
              title="3D"
              selected={map3DMode}
              onClick={() => {
                setMap3DMode(true);
                setOpen(false);
              }}
            >
              <MapStyleIcon />
            </Option>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Option({
  title,
  selected,
  onClick,
  children
}: {
  title: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="menuitemradio"
      aria-checked={selected}
      onClick={onClick}
      className={`w-full cursor-pointer flex items-center gap-4 p-2 rounded-lg text-left hover:bg-pebble focus:outline-none transition duration-250 ease-in-out ${
        selected ? 'bg-pebble' : ''
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center">{children}</div>
      <div className="flex-1 text-l font-body-font-family text-slate">{title}</div>
    </button>
  );
}