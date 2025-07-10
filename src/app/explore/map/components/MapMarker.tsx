import { motion } from "framer-motion";
import { useState } from "react";

export default function MapMarker() {

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const showInner = isHovered || isFocused;

    return (

        <div className="relative w-[25px] h-[27px] cursor-pointer bg-[url('/icons/map-marker-default.svg')] bg-cover bg-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsFocused(!isFocused)}
        >
            <motion.div
                className="absolute inset-0 w-full h-full bg-[url('/icons/map-marker-active.svg')] bg-cover bg-center"
                animate={{ opacity: showInner ? 1 : 0}}
                transition={{ duration: 0.25, ease: "easeInOut"}}
            />
        </div>

    );

}