// src/app/explore/layout.tsx
// This file contains the layout for the 'explore' section of the application

import Header from "@/components/header/Header";
import ExploreSidebar from "./components/ExploreSidebar";
import MobileMenuBar from "./components/MobileMenuBar";

interface ExploreLayoutProps {
  children: React.ReactNode;
}

export default function ExploreLayout({ children }: ExploreLayoutProps) {
  return (
    <>
        <Header isAppHeader={true} />
        <main className="h-[calc(100vh-6.1rem)] flex items-stretch max-md:flex-col-reverse max-md:h-[calc(100dvh-4.6rem)]">
            <div className="hidden md:block">
              <ExploreSidebar />
            </div>
            <div className="block md:hidden">
              <MobileMenuBar />
            </div>
            <div id="explore-page-content" className="flex-1 transition overflow-auto duration-250 ease-in-out">
              {children}
            </div>
        </main>
    </>
  );
}