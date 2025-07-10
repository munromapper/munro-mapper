import { motion } from "framer-motion"; // Imports framer motion libraries
import { useState } from "react"; // Imports react functions for tracking state

export default function MapMarker() {

    const [isHovered, setIsHovered] = useState(false);  // Creates the 'isHovered' state and sets it to false by default, also creates the setIsHovered function used to update the state
    const [isFocused, setIsFocused] = useState(false);  // Creates the 'isFocused' state and sets it to false by default, also creates the setIsFocused function used to update the state

    const showInner = isHovered || isFocused; // Creates a showInner variable that is 'true' if either isHovered or isFocused is set to true

    // Creating the MapMarker element
    return (

        <div className="relative w-[25px] h-[27px] cursor-pointer bg-[url('/icons/map-marker-default.svg')] bg-cover bg-center"
            onMouseEnter={() => setIsHovered(true)} // Event listener for mouse enter that sets isHovered to true
            onMouseLeave={() => setIsHovered(false)} // Event listener for mouse leave that sets isHovered to false
            onClick={() => setIsFocused(!isFocused)} // Event listener for clicks that sets isFocused to true
        >
            <motion.div // This is the inner div with the active hover state, that appears in front of the base appearance, initialised as a motion.div for animations
                className="absolute inset-0 w-full h-full bg-[url('/icons/map-marker-active.svg')] bg-cover bg-center"
                animate={{ opacity: showInner ? 1 : 0}} // Animate opacity based on the value of showInner, 1 if true, 0 if false
                transition={{ duration: 0.25, ease: "easeInOut"}} // Sets the animation transition values
            />
        </div>

    );

}