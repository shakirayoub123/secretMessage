import { Link } from 'react-router-dom';
import AnimatedLogo from "./AnimatedLogo";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#1F2630] shadow-lg transition-all">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-1 group cursor-pointer">
                    <AnimatedLogo 
                        variant="compact"
                        containerClass="group-hover:rotate-12 transition-transform duration-500 mr-2" 
                        sizeClass="w-7 h-7" 
                        iconSize="text-[12px]"
                    />
                    <span className="text-xl font-bold tracking-tighter text-white uppercase">
                        YOUR <span className="text-pink">SECRET</span>
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
