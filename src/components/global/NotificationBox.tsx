// src/components/global/NotificationBox.tsx
// This file defines a NotificationBox component for displaying notifications in the application

import React from 'react';
import { motion } from 'framer-motion';
import { sleep } from '@/utils/misc/sleep';
import { SuccessTick, ErrorIcon } from './SvgComponents'; 

interface NotificationBoxProps {
    message: string;
    type: 'success' | 'error';
    duration: number;
    onClose?: () => void;
}

export default function NotificationBox({ 
    message, 
    type,
    duration = 5000,
    onClose
}: NotificationBoxProps) {

    if (!onClose) return

    sleep(duration).then(onClose)

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {Boolean(message) && (
            <motion.div
                className={`fixed bottom-8 right-8 bg-mist p-4 flex items-center gap-5 max-w-200 rounded-lg shadow-standard`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
                <div className={`rounded-lg w-10 h-10 p-2 ${type === 'success' ? 'bg-apple text-slate' : 'bg-blush text-rust'} flex items-center justify-center`}>
                    {type === 'success' ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                            <SuccessTick />
                        </div>
                    ) : (
                        <div className="w-4 h-4 flex items-center justify-center">
                            <ErrorIcon />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="text-xl mb0">{type.charAt(0).toUpperCase() + type.slice(1)}!</p>
                    <p className="text-l text-moss">{message}</p>
                </div>
            </motion.div>
            )}
        </div>
    );
}