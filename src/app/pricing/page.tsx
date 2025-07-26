// src/app/pricing/page.tsx
// This file contains the Pricing page for the application, which is currently under construction

import Header from "@/components/header/Header";
import PricingButtons from "./components/PricingButtons";

export default function PricingPage() {

    return (
        <>
            <Header isAppHeader={false} />
            <main className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Pricing Page</h1>
                <p className="text-lg">This page is currently under construction.</p>
                <PricingButtons />
            </main>
        </>
    );
}