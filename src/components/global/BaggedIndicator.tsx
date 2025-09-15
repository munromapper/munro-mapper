// src/components/BaggedIndicator.tsx
// Component for the reusable 'bagged' indicator in the UI

'use client';
import { useState } from 'react';
import CheckboxInput from "./forms/CheckboxInput";
import { useBaggedMunroContext } from "@/contexts/BaggedMunroContext";
import { useAuthContext } from '@/contexts/AuthContext';

type BaggedIndicatorProps = {
  munroId: number;
};

export default function BaggedIndicator({
  munroId
}: BaggedIndicatorProps) {
  const { isBagged, toggleBagged, loading } = useBaggedMunroContext();
  const { user, openAuthModal } = useAuthContext();

  const bagged = isBagged(munroId);
  const isLoggedIn = !!user;

  const handleIndicatorClick = () => {
    if (!isLoggedIn) {
      openAuthModal('logIn');
    }
  };

  return (
    <div 
      className={`rounded-full transition duration-250 ease-in-out relative
                 ${bagged ? "bg-apple" : "bg-petal"}
                 ${!isLoggedIn ? "cursor-pointer" : ""}`}
      onClick={handleIndicatorClick}
    >
      <CheckboxInput
        label={bagged ? "Bagged" : "Not Bagged"}
        name={`bagged-${munroId}`}
        checked={bagged}
        onChange={() => isLoggedIn && toggleBagged(munroId, !bagged)}
        disabled={!isLoggedIn}
      />
    </div>
  );

}