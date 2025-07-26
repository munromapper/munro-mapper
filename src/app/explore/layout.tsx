// src/app/explore/layout.tsx
// This file contains the layout for the 'explore' section of the application

import Header from "@/components/header/Header";
import ExploreSidebar from "./components/ExploreSidebar";

interface ExploreLayoutProps {
  children: React.ReactNode;
}

export default function ExploreLayout({ children }: ExploreLayoutProps) {
  return (
    <>
        <Header isAppHeader={true} />
        <main className="h-[calc(100vh-5.5rem)] flex items-stretch">
            <ExploreSidebar />
            <div id="explore-page-content" className="flex-1">
              {children}
            </div>
        </main>
    </>
  );
}