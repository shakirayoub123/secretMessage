import { Link } from 'react-router-dom';
import successSvg from "../assets/secret.svg";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full px-6 py-4 glass-card border-none rounded-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <img 
                        src={successSvg} 
                        alt="Logo" 
                        className="w-8 h-8 transition-transform duration-500 group-hover:rotate-[360deg]" 
                    />
                    <span className="text-xl font-bold tracking-tighter text-white uppercase">
                        YOUR <span className="text-pink">SECRET</span>
                    </span>
                </Link>
                
                <div className="flex items-center gap-8">
                    <Link 
                        to="/" 
                        className="text-sm font-medium text-gray-300 hover:text-pink transition-colors uppercase tracking-widest"
                    >
                        Home
                    </Link>
                    {/* Add more links here if needed */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
