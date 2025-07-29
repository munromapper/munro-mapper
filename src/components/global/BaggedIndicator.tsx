// src/components/BaggedIndicator.tsx
// Component for the reusable 'bagged' indicator in the UI

'use client';
import CheckboxInput from "./forms/CheckboxInput";
import { useBaggedMunroContext } from "@/contexts/BaggedMunroContext";

type BaggedIndicatorProps = {
  munroId: number;
};

export default function BaggedIndicator({
  munroId
}: BaggedIndicatorProps) {
  const { isBagged, toggleBagged, loading } = useBaggedMunroContext();

  const bagged = isBagged(munroId);

  return (
    <div className={`rounded-full transition duration-250 ease-in-out
                     ${bagged ? "bg-apple" : "bg-petal"}`}
    >
      <CheckboxInput
        label={bagged ? "Bagged" : "Not Bagged"}
        name={`bagged-${munroId}`}
        checked={bagged}
        onChange={() => toggleBagged(munroId, !bagged)}
      />
    </div>
  );

}