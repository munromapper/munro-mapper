// src/app/explore/map/munro/[munro]/components/ShareModal.tsx
// This component includes the contents of the social sharing modal for munro pages

import { useState } from "react";
import ModalElement from "@/components/global/Modal";
import { CopyIcon, WhatsappIcon, MessengerIcon, EmailIcon } from "@/components/global/SvgComponents";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    munroName: string;
}

export default function ShareModal({
    isOpen,
    onClose,
    shareUrl,
    munroName,
}: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Handle error
        }
    };

    const handleWhatsapp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank");
    };

    const handleMessenger = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    };

    const handleEmail = () => {
        window.open(`mailto:?subject=Check out ${munroName} on MunroMapper!&body=${encodeURIComponent(shareUrl)}`, "_blank");
    };

    return (
        <ModalElement isOpen={isOpen} onClose={onClose}>
            <div className="p-12 bg-mist flex flex-col items-center w-110">
                <h2 className="text-3xl sm:text-4xl font-heading-font-family mb-2 text-slate text-center">Share with friends</h2>
                <p className="text-moss text-center mb-12">Copy the link to this Munro or share it directly.</p>
                <div className="w-full flex items-center bg-pebble rounded-full px-6 py-2 mb-12">
                    <span className={`flex-1 text-slate truncate transition-all duration-200 ${copied ? "font-medium" : ""}`}>
                        {copied ? "Link copied!" : shareUrl}
                    </span>
                    <button
                        className="ml-2 p-2 rounded-full cursor-pointer"
                        onClick={handleCopy}
                        aria-label="Copy link"
                    >
                        <span className={`w-4 h-4 flex items-center justify-center transition-colors duration-200 ${copied ? "text-slate" : "text-moss"} hover:text-slate`}>
                           <CopyIcon /> 
                        </span>
                    </button>
                </div>
                <button
                    className="w-full flex items-center gap-3 mb-3 cursor-pointer justify-center border border-sage rounded-full px-4 py-3"
                    onClick={handleWhatsapp}
                >
                    <span className="w-4.5 h-4.5 flex items-center justify-center">
                        <WhatsappIcon />
                    </span>
                    <span>Share on Whatsapp</span>
                </button>
                <button
                    className="w-full flex items-center gap-3 mb-3 cursor-pointer justify-center border border-sage rounded-full px-4 py-3"
                    onClick={handleMessenger}
                >
                    <span className="w-4.5 h-4.5 flex items-center justify-center">
                        <MessengerIcon />
                    </span>
                    <span>Share on Messenger</span>
                </button>
                <button
                    className="w-full flex items-center gap-3 mb-3 cursor-pointer justify-center rounded-full px-4 py-3 border border-apple bg-apple text-slate"
                    onClick={handleEmail}
                >
                    <span className="w-4.5 h-4.5 flex items-center justify-center">
                        <EmailIcon />
                    </span>
                    Email this link
                </button>
            </div>
        </ModalElement>
    );
}