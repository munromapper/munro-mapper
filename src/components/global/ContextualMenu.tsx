// src/components/global/ContextualMenu.tsx
// This component defines a contextual menu that can be used to display options anywhere on the site

import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ContextualMenuProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ContextualMenu({ 
    isOpen, 
    onClose, 
    children 
}: ContextualMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-50 bg-mist border border-sage rounded-xl shadow-standard whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <div className="p-2">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}