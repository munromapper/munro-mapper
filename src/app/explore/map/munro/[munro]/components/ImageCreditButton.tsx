// src/app/explore/map/munro/[munro]/components/ImageCreditButton.tsx
// This component displays a button to pop up the image credit explainer modal

import { useState } from "react";
import { TooltipIcon } from "@/components/global/SvgComponents";
import ModalElement from "@/components/global/Modal";

export default function ImageCreditButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center cursor-pointer"
            >
                <span className="w-3.5 h-3.5 ml-2 relative inline-flex justify-center items-center"><TooltipIcon /></span>
            </button>
            <ModalElement 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                <div className="bg-mist p-9 max-w-125">
                    <h2 className="font-heading-font-family text-4xl mb-6">Image Use</h2>
                    <h3 className="font-heading-font-family text-xxxl mb-4">Licensing</h3>
                    <p className="mb-4 text-moss">Munro Mapper includes photos sourced from <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer" className="underline">Wikimedia Commons</a>, where images are shared under Creative Commons or public domain licenses.</p>
                    <p className="mb-4 text-moss">These licenses allow us to use and share the photos freely, provided the original photographer is credited and the license terms are followed.</p>
                    <p className="text-moss">We&apos;re grateful to the photographers who make their work freely available, and we&apos;re working to replace all photos with our own original images over time.</p>
                    <div className="my-9 w-full h-[1px] border-b border-dashed border-sage"></div>
                    <h3 className="font-heading-font-family text-xxxl mb-4">Accuracy</h3>
                    <p className="mb-4 text-moss">We do our best to match each Munro with a correct photo. However, small details like paths, cairns, or summit markers can change, and there&apos;s a chance that an image may occasionally be misidentified.</p>
                    <p className="text-moss">These photos are provided for general reference and should not be relied on as an exact record of the hill.</p>
                </div>
            </ModalElement>
        </>
    )
}