// src/app/layout.tsx
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Header } from '@/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
        <body className="m-0 h-full w-full font-body-font-family">
          <Header />
          <main className="h-[calc(100vh-85px)]">
            {children}
            <SpeedInsights />
          </main>
        </body>
    </html>
  );
}