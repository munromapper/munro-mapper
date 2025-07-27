// src/app/success/page.tsx
// This file defines the Success page that users see after a successful subscription payment

import Header from "@/components/header/Header";

export default function SuccessPage() {

    return (
        <>
            <Header isAppHeader={false} />
            <main className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Success Page</h1>
                <p className="text-lg">Thank you for your payment!</p>
            </main>
        </>
    );
}