// src/app/page.tsx
// This file contains the content for the 'home' page of the application

import React from "react";
import Header from "@/components/header/Header";

export default function HomePage() {

  return (
      <>
        <Header isAppHeader={false} />
        <main className="h-full">
          <section className="h-[150vh] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-cover bg-center z-0">
              <div className="absolute inset-0 bg-slate/60" />
              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/home-hero-image.webp')" }} />
            </div>
            <div className="relative z-20 w-full max-w-[1600px] mx-auto px-24">
              <div className="text-center mx-auto flex flex-col items-center gap-8">
                <h1 className="text-[4rem] max-w-150 font-heading-font-family leading-tight">Bag your Munros. Track your <span className="text-neon">progress.</span></h1>
                <p className="text-xxxl max-w-160">We give hillwalkers the tools, maps, and tracking features they need to plan routes, log climbs, and explore every Munro.</p>
              </div>
            </div>
          </section>
        </main>
        <div className="absolute z-10 flex items-stretch justify-between inset-0 max-w-[1600px] mx-auto px-24 pointer-events-none">
          <div className="w-[1px] border border-moss" />
          <div className="w-[1px] border border-dashed border-moss" />
          <div className="w-[1px] border border-dashed border-moss" />
          <div className="w-[1px] border border-moss" />
        </div>
      </>
  )
}