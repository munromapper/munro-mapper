"use client";

import { useState } from "react";
import ShareModal from "./ShareModal";
import { ShareIcon } from "@/components/global/SvgComponents";

interface ShareButtonProps {
  munroName: string;
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export default function ShareButton({ munroName }: ShareButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Always get the current URL on the client
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShareClick = async () => {
    if (isMobileDevice() && navigator.share) {
      try {
        await navigator.share({
          title: munroName,
          text: `Check out ${munroName} on MunroMapper!`,
          url: shareUrl,
        });
      } catch {
        // ignore cancel/error
      }
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        className="py-2 px-4 bg-mist border border-sage rounded-full cursor-pointer flex items-center justify-center gap-3"
        onClick={handleShareClick}
        type="button"
      >
        <span>Share with friends</span>
        <span className="inline-flex w-4 h-4">
          <ShareIcon />
        </span>
      </button>
      <ShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        shareUrl={shareUrl}
        munroName={munroName}
      />
    </>
  );
}