import { useState, useEffect } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import successSvg from "../assets/secret.svg";

function AnimatedLogo({ sizeClass = "w-8 h-8", containerClass = "", iconSize = "text-[10px]", variant = "main", ...props }) {
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLocked(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    if (variant === "compact") {
        return (
            <div className={`flex items-center gap-2 ${containerClass}`} {...props}>
                <img 
                    src={successSvg} 
                    alt="YourSecret Logo" 
                    className={`${sizeClass} object-contain transition-transform duration-500`} 
                />
                <div className={`${iconSize} text-pink transition-all duration-500`}>
                    {isLocked ? <FaLock /> : <FaLockOpen />}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative flex items-center justify-center ${containerClass}`} {...props}>
            <img 
                src={successSvg} 
                alt="YourSecret Logo" 
                className={`${sizeClass} object-contain transition-transform duration-500`} 
            />
            <div className={`absolute -bottom-2 -right-2 bg-black/80 rounded-full p-1 border border-white/10 ${iconSize} text-pink transition-all duration-500 shadow-xl`}>
                {isLocked ? <FaLock /> : <FaLockOpen />}
            </div>
        </div>
    );
}

export default AnimatedLogo;
