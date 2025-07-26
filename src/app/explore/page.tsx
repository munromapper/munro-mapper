// src/app/explore/page.tsx
// Redirect from /explore to /explore/map.

import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/explore/map');
}