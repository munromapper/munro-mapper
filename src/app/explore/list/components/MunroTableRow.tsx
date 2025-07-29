// src/app/explore/list/components/MunroTableRow.tsx
// Creates a single row in the Munro list table to display details of a Munro

'use client';
import Link from 'next/link';
import type { Munro } from '@/types/data/dataTypes';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import BaggedIndicator from '@/components/global/BaggedIndicator';
import { LocationIcon } from '@/components/global/SvgComponents';
import { useAuthContext } from '@/contexts/AuthContext';
import { convertHeight, getHeightUnitLabel } from '@/utils/misc/unitConverters';

type MunroTableRowProps = {
  munro: Munro;
  gridTemplate?: string;
};

export default function MunroTableRow({ munro, gridTemplate }: MunroTableRowProps) {
  const { userProfile } = useAuthContext();
  const { isBagged } = useBaggedMunroContext();
  const bagged = isBagged(munro.id);

  const userHeightUnitPreference = (userProfile?.preferences.elevationUnit === 'feet' ? 'feet' : 'metres') as 'metres' | 'feet';
  const displayHeight = convertHeight(munro.height, userHeightUnitPreference);
  const heightUnitLabel = getHeightUnitLabel(userHeightUnitPreference);

  return (
    <div
      className={`grid w-full items-center text-xl min-w-0 ${bagged ? "bg-apple/15" : ""}`}
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <div className="px-3 py-4 justify-self-start">
        <BaggedIndicator 
          munroId={munro.id}
        />
      </div>
      <div className="px-3 py-4">{munro.name}</div>
      <div className="px-3 py-4">{munro.region}</div>
      <div className="px-3 py-4">{displayHeight}{heightUnitLabel}</div>
      <div className="px-3 py-4">#{munro.id}</div>
      <div className="px-3 py-4">{munro.latitude.toFixed(5)}° N</div>
      <div className="px-3 py-4">{munro.longitude.toFixed(5)}° W</div>
      <div className="px-3 py-4">
        <Link href={`/explore/map/munro/${munro.slug}`}>
          <button className="rounded-lg h-8 w-8 p-2 border border-sage transition cursor-pointer hover:bg-apple" aria-label={`View ${munro.name} on map`}>
            <LocationIcon />
          </button>
        </Link>
      </div>
    </div>
  );
}