import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import AnimatedLogo from "./AnimatedLogo";

function Footer() {
    const year = new Date().getFullYear();

    const product = [
        { label: "Create a secret", to: "/" },
        { label: "Privacy policy", to: "/privacy" },
    ];

    const socials = [
        { icon: FaTwitter, label: "Twitter", url: "https://x.com/shakirayoub5?s=21" },
        { icon: FaFacebook, label: "Facebook", url: "https://www.facebook.com/share/18VJmv1ou9/?mibextid=wwXIfr" },
        { icon: FaLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/shakir-ayoub-318526338/" },
        { icon: FaGithub, label: "GitHub", url: "https://github.com" },
    ];

    return (
        <footer className="relative z-10 w-full mt-auto bg-[#0D1117] border-t border-[#1F2630]">
            <div className="w-full max-w-6xl mx-auto px-6 py-12 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-8">
                    {/* Brand + short pitch */}
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <AnimatedLogo variant="compact" sizeClass="w-9 h-9" iconSize="text-[10px]" containerClass="group-hover:scale-105 transition-transform" />
                            <div>
                                <p className="text-white font-semibold text-base leading-tight">YourSecret</p>
                                <p className="text-[#8B95A1] text-xs mt-0.5">Sealed until it's opened</p>
                            </div>
                        </div>
                        <p className="text-[#8B95A1] text-sm leading-relaxed">
                            Share a message once. It's encrypted end-to-end and disappears the moment
                            it's read, so nothing lingers where it shouldn't.
                        </p>
                    </div>

                    {/* Product links */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white text-sm font-semibold">Product</p>
                        <nav className="flex flex-col gap-2.5">
                            {product.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className="text-[#8B95A1] text-sm hover:text-pink transition-colors w-fit cursor-pointer"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Trust + status */}
                    <div className="flex flex-col gap-3">
                        <p className="text-white text-sm font-semibold">Security</p>
                        <div className="flex flex-col gap-2.5 text-sm text-[#8B95A1]">
                            <p>AES-256 encryption</p>
                            <p>Zero-knowledge storage</p>
                            <div className="flex items-center gap-2 pt-1 cursor-pointer group transition-all">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3DDC97] opacity-60" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3DDC97]" />
                                </span>
                                <span className="text-[#C9D1D9] group-hover:text-pink transition-colors">All systems operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-[#1F2630] flex flex-col-reverse md:flex-row items-center justify-between gap-5">
                    <p className="text-[#66707B] text-xs">
                        &copy; {year} YourSecret. Built by{" "}
                        <span className="text-[#C9D1D9] font-medium cursor-pointer hover:text-pink transition-colors">Shakir</span>.
                    </p>

                    <div className="flex gap-2">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="w-9 h-9 rounded-full bg-[#161B22] border border-[#1F2630] flex items-center justify-center text-[#8B95A1] hover:text-pink hover:border-pink/40 hover:bg-pink/5 transition-all cursor-pointer shadow-lg hover:shadow-pink/10"
                            >
                                <social.icon className="text-sm" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;