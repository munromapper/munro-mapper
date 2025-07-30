// utils/units.ts
export function convertHeight(heightMeters: number, to: 'metres' | 'feet') {
  return to === 'feet' ? Math.round(heightMeters * 3.280839895) : heightMeters;
}

export function getHeightUnitLabel(unit: 'metres' | 'feet') {
  return unit === 'feet' ? 'ft' : 'm';
}

export function convertLength(lengthKm: number, to: 'kilometres' | 'miles') {
  return to === 'miles'
    ? (lengthKm * 0.621371).toFixed(2)
    : lengthKm.toFixed(2);
}

export function getLengthUnitLabel(unit: 'kilometres' | 'miles') {
  return unit === 'miles' ? 'mi' : 'km';
}