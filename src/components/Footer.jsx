import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className="relative z-10 py-16 px-6 border-t border-white/5 mt-auto bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink rounded-xl flex items-center justify-center rotate-6 shadow-lg shadow-pink/20">
                                <span className="text-white font-black text-sm tracking-tighter">YS</span>
                            </div>
                            <div>
                                <span className="text-white font-bold uppercase tracking-widest block text-xs">YourSecret</span>
                                <span className="text-gray-600 text-[8px] uppercase tracking-[0.3em]">End-to-End Encrypted</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-[10px] max-w-[200px] leading-relaxed text-center md:text-left uppercase tracking-wider font-light">
                            Securing your digital conversations with military-grade AES-256 encryption.
                        </p>
                    </div>
                    
                    {/* Developer Section */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex flex-col items-center group cursor-default">
                            <p className="text-gray-600 text-[8px] uppercase tracking-[0.4em] mb-1">Architected by</p>
                            <span className="text-white font-bold text-xl tracking-[0.1em] transition-all group-hover:text-pink duration-500">SHAKIR</span>
                            <div className="w-8 h-[1px] bg-pink/30 mt-1 group-hover:w-12 transition-all duration-500"></div>
                        </div>
                        <div className="flex gap-5 mt-4">
                            {[
                                { icon: FaTwitter, url: "https://x.com/shakirayoub5?s=21" },
                                { icon: FaFacebook, url: "https://www.facebook.com/share/18VJmv1ou9/?mibextid=wwXIfr" },
                                { icon: FaLinkedin, url: "https://www.linkedin.com/in/shakir-ayoub-318526338/" },
                                { icon: FaGithub, url: "https://github.com" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-white transition-all duration-300"
                                >
                                    <social.icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col items-center md:items-end gap-6">
                        <div className="flex items-center gap-8">
                            <Link to="/privacy" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b border-transparent hover:border-pink pb-1">Privacy Policy</Link>
                            <Link to="/" className="text-gray-400 hover:text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-b border-transparent hover:border-pink pb-1">Create Secret</Link>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-400 text-[9px] uppercase tracking-widest font-bold">Systems Operational</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-700 text-[8px] uppercase tracking-[0.5em]">&copy; {new Date().getFullYear()} YOURSECRET. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-6">
                        <p className="text-gray-800 text-[8px] uppercase tracking-[0.2em]">Zero-Knowledge Protocol</p>
                        <p className="text-gray-800 text-[8px] uppercase tracking-[0.2em]">AES-256 Standard</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
