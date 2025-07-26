// src/app/GlobalClientElements.tsx
// This file contains global client-side elements for the application

'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import NotificationBox from "@/components/global/NotificationBox";

export default function GlobalClientElements() {
    const { globalMessage, setGlobalMessage } = useAuthContext();

    return (
        <AnimatePresence>
            {globalMessage && (
                <NotificationBox 
                    message={globalMessage}
                    type="success"
                    duration={10000}
                    onClose={() => setGlobalMessage(null)} 
                />
            )}
        </AnimatePresence>
    );
}