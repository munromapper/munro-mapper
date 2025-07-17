// src/app/explore/page.tsx
import { redirect } from 'next/navigation';

// Redirect from / to /explore/map at the server level
export default function Page() {
  redirect('/explore/map');
}