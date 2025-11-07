// src/app/explore/dashboard/components/PremiumAdvertSmall.tsx
// This file contains the premium advert small component for the dashboard page

import { TickIcon, CrossIcon, PremiumIcon } from "@/components/global/SvgComponents";
import Link from "next/link";

const FEATURES = [
  { label: "Smart hill filters", free: false, plus: true },
  { label: "Bagged vs friends", free: false, plus: true },
  { label: "Satellite mapping", free: false, plus: true },
  { label: "GPX downloads", free: false, plus: true },
];

export default function PremiumAdvertSmall() {
  return (
    <section className="rounded-xl p-8 border border-lilac bg-premium flex flex-col items-stretch">
      <div className="flex items-center gap-3 mb-9">
        <h2 className="text-2xl text-slate flex-1">Subscribe to Plus</h2>
        <span className="w-9 h-9 p-2.5 flex items-center justify-center rounded-md bg-heather">
          <PremiumIcon currentColor="var(--color-cloud)" />
        </span>
      </div>
      <table className="w-full border-collapse mb-9">
        <thead>
          <tr>
            <th className="text-left font-normal px-4 py-4">Feature</th>
            <th className="w-14 text-center font-normal px-4 py-4">Free</th>
            <th className="w-14 text-center font-normal px-4 py-4 bg-lilac/25 rounded-t-md">Plus</th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((f, i) => (
            <tr key={f.label} className="border-t border-dashed border-heather">
              <td className="pl-4 py-4 text-slate text-base">{f.label}</td>
              <td className="px-4 py-4 text-center">
                {f.free ? (
                  <span className="inline-flex items-center justify-center w-3 h-3"><TickIcon /></span>
                ) : (
                  <span className="inline-flex items-center justify-center w-3 h-3"><CrossIcon /></span>
                )}
              </td>
              <td className={`px-4 py-4 text-center bg-heather/20 ${i === FEATURES.length - 1 ? "rounded-b-md" : ""}`}>
                {f.plus ? (
                  <span className="inline-flex items-center justify-center w-3 h-3"><TickIcon /></span>
                ) : (
                  <span className="inline-flex items-center justify-center w-3 h-3"><CrossIcon /></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        href="/pricing"
        className="w-full py-2 rounded-full bg-heather/30 border border-heather/30 text-slate text-center cursor-pointer hover:bg-transparent hover:text-heather transition duration-250 ease-in-out text-lg"
      >
        Subscribe to Plus
      </Link>
    </section>
  );
}