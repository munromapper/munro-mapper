// src/components/BaggedIndicator.tsx
// Component for the reusable 'bagged' indicator in the UI

'use client';
import { useState } from 'react';
import CheckboxInput from "./forms/CheckboxInput";
import { useBaggedMunroContext } from "@/contexts/BaggedMunroContext";
import { useAuthContext } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from "framer-motion";

type BaggedIndicatorProps = {
  munroId: number;
};

export default function BaggedIndicator({
  munroId
}: BaggedIndicatorProps) {
  const { isBagged, toggleBagged, loading } = useBaggedMunroContext();
  const { user } = useAuthContext();
  const [showPopup, setShowPopup] = useState(false);

  const bagged = isBagged(munroId);
  const isLoggedIn = !!user;

  return (
    <div 
      className={`rounded-full transition duration-250 ease-in-out relative
                 ${bagged ? "bg-apple" : "bg-petal"}`}
      onMouseEnter={() => !isLoggedIn && setShowPopup(true)}
      onMouseLeave={() => !isLoggedIn && setShowPopup(false)}
    >
      <CheckboxInput
        label={bagged ? "Bagged" : "Not Bagged"}
        name={`bagged-${munroId}`}
        checked={bagged}
        onChange={() => isLoggedIn && toggleBagged(munroId, !bagged)}
        disabled={!isLoggedIn}
        className={!isLoggedIn ? "!cursor-not-allowed" : ""}
      />
      
      {/* Custom popup aligned to center above the element */}
      <AnimatePresence>
        {!isLoggedIn && showPopup && (
          <motion.div
            className="absolute top-full left-0 mt-2 z-50 pointer-events-none 
                       bg-mist border border-sage rounded-xl shadow-standard whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="text-m py-1 px-2">
              Sign in to bag Munros
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

}