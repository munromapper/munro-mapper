// src/components/global/NotificationBox.tsx
// This file defines a NotificationBox component for displaying notifications in the application

import React from 'react';
import { motion } from 'framer-motion';
import { sleep } from '@/utils/misc/sleep'; 

interface NotificationBoxProps {
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
    onClose?: () => void;
}

export default function NotificationBox({ 
    message, 
    type,
    duration = 5000,
    onClose
}: NotificationBoxProps) {
    const boxStyles = {
        success: 'bg-green-100 text-green-800',
        error: 'bg-petal border border-blush text-slate',
        info: 'bg-blue-100 text-blue-800'
    };

    if (!onClose) return

    sleep(duration).then(onClose)

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {Boolean(message) && (
            <motion.div
                className={`fixed bottom-8 right-8 p-4 max-w-100 rounded-lg shadow-standard ${boxStyles[type]}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
                <p className="text-xxxl font-heading-font-family mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}!</p>
                <p className="text-l">{message}</p>
            </motion.div>
            )}
        </div>
    );
}