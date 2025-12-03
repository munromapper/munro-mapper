// src/components/ModalElement.tsx
// ModalElement component for displaying modals in the application

'use client';

import React from "react";
import { createPortal } from 'react-dom';
import { CrossIcon } from "@/components/global/SvgComponents";
import { AnimatePresence, motion } from "framer-motion";

type ModalElementProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeButtonBgClass?: string;
  closeButtonHoverBgClass?: string;
};

/**
 * ModalElement component renders a modal dialog.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} children - Content to display inside the modal.
 * @param {string} [closeButtonBgClass='bg-pebble'] - Tailwind class for close button background.
 */
export default function ModalElement({ 
    isOpen, 
    onClose, 
    children,
    closeButtonBgClass = 'bg-pebble',
    closeButtonHoverBgClass = 'hover:bg-apple' 
}: ModalElementProps) {

    // Render nothing on the server
    if (typeof window === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center text-slate font-normal"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-slate/70 z-[1000]"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/* Modal content */}
            <motion.div
              className="relative z-[1001] w-full md:w-auto rounded-t-xl md:rounded-xl shadow-xl overflow-hidden max-h-[80vh]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              // Remove mobile caps; only cap on desktop
            >
              {/* Desktop-only sizing caps */}
              <div className="md:min-w-[320px] md:max-w-[90vw]">
                <button
                  className={`absolute top-6 right-6 rounded-full w-8 h-8 p-[10px] ${closeButtonBgClass} flex items-center justify-center cursor-pointer ${closeButtonHoverBgClass} transition`}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <div className="flex items-center justify-center">
                    <CrossIcon />
                  </div>
                </button>
                {/* Scrollable content area */}
                <div className="max-h-[80vh] overflow-y-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
}