// src/components/ModalElement.tsx
// ModalElement component for displaying modals in the application

import React from "react";
import { CrossIcon } from "@/components/global/SvgComponents";
import { AnimatePresence, motion } from "framer-motion";

type ModalElementProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * ModalElement component renders a modal dialog.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} children - Content to display inside the modal.
 */
export default function ModalElement({ 
    isOpen, 
    onClose, 
    children 
}: ModalElementProps) {

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center text-slate font-normal"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-slate opacity-70"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/* Modal content */}
            <motion.div
              className="relative rounded-xl shadow-xl overflow-hidden z-10"
              style={{ minWidth: 320, maxWidth: "90vw" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-6 right-6 rounded-full w-8 h-8 p-[10px] bg-pebble flex items-center justify-center cursor-pointer hover:bg-apple transition"
                onClick={onClose}
                aria-label="Close modal"
              >
                <div className="flex items-center justify-center">
                  <CrossIcon />
                </div>
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}