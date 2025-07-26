// src/app/about/page.tsx
// This file contains the About page for the application, which is currently under construction

import Header from "@/components/header/Header";

export default function AboutPage() {
    return (
        <>
            <Header isAppHeader={false} />
            <main className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">About Page</h1>
                <p className="text-lg">This page is currently under construction.</p>
            </main>
        </>
    );
}