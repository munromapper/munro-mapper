// utils/units.ts
export function convertHeight(heightMeters: number, to: 'metres' | 'feet') {
  return to === 'feet' ? Math.round(heightMeters * 3.280839895) : heightMeters;
}

export function getHeightUnitLabel(unit: 'metres' | 'feet') {
  return unit === 'feet' ? 'ft' : 'm';
}

export function convertLength(lengthMeters: number, to: 'kilometres' | 'miles') {
  return to === 'miles' ? (lengthMeters / 1609.344).toFixed(2) : (lengthMeters / 1000).toFixed(2);
}

export function getLengthUnitLabel(unit: 'kilometres' | 'miles') {
  return unit === 'miles' ? 'mi' : 'km';
}