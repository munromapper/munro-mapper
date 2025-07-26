// src/app/layout.tsx
// This file is the main root layout for the application

import "./globals.css";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import GlobalClientElements from "./GlobalClientElements";
import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata = {
  title: "Munro Mapper | Home",
  description: "A tool for mapping Munros in Scotland",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

    return (
        <html lang="en">
          <AuthProvider>
            <body className="h-full relative font-body-font-family font-light letter-spacing-0.025em text-mist bg-slate transition duration-250 ease-in-out">
              {children}
            </body>
            <GlobalClientElements />
          </AuthProvider>
        </html>
    )
}