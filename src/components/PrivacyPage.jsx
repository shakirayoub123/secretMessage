import Layout from "./LayOut";
import { FaLock, FaUserSecret, FaTrashAlt, FaServer } from "react-icons/fa";
import AnimatedLogo from "./AnimatedLogo";

const PrivacyPage = () => {
    return (
        <Layout>
            <div className="flex-grow flex flex-col items-center justify-center w-full px-4 py-8 overflow-hidden">
                <div className="w-full max-w-4xl space-y-8">
                    
                    {/* Header Section */}
                    <div className="glass-card rounded-3xl p-8 md:p-12 text-center space-y-5 animate-in fade-in zoom-in duration-700">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <AnimatedLogo 
                                    containerClass="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-pink/10 shadow-lg shadow-pink/20 animate-pulse-slow" 
                                    sizeClass="w-8 h-8 md:w-10 md:h-10" 
                                    iconSize="text-[10px]"
                                />
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase m-0 leading-none">
                                    Privacy <span className="text-pink">First</span>
                                </h1>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base font-light leading-relaxed text-center px-2">
                                We don't just promise privacy. 
                                <span className="text-white font-medium mx-1 italic">We make it mathematically impossible to violate it.</span>
                            </p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="glass-card bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-pink/30 hover:bg-pink/5 transition-all group">
                            <FaLock className="text-3xl text-pink mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">End-to-End Encryption</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                Every secret you create is encrypted locally in your browser using the <strong>AES-256 standard</strong>. Your original message never leaves your device.
                            </p>
                        </div>

                        <div className="glass-card bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-pink/30 hover:bg-pink/5 transition-all group">
                            <FaUserSecret className="text-3xl text-pink mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Zero-Knowledge</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                We use a "Zero-Knowledge" architecture. Our servers only see scrambled code. <strong>We do not have the keys to unlock your secrets.</strong>
                            </p>
                        </div>

                        <div className="glass-card bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-pink/30 hover:bg-pink/5 transition-all group">
                            <FaTrashAlt className="text-3xl text-pink mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Self-Destruction</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                Once a secret is decrypted and read, it is purged from the database forever. We don't keep logs, backups, or history.
                            </p>
                        </div>

                        <div className="glass-card bg-black/40 border border-white/10 rounded-3xl p-8 hover:border-pink/30 hover:bg-pink/5 transition-all group">
                            <FaServer className="text-3xl text-pink mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">No Trackers</h3>
                            <p className="text-gray-400 text-sm leading-relaxed font-light">
                                YourSecret contains zero third-party trackers, advertisements, or cookies. Your identity is as anonymous as your message.
                            </p>
                        </div>
                    </div>

                    {/* Footer Box */}
                    <div className="glass-card bg-pink/5 border border-pink/10 rounded-3xl p-8 md:p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Our Security Philosophy</h2>
                        <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                            "If we don't have it, we can't lose it. If we can't see it, we can't share it." 
                            <br/><br/>
                            Everything you share on YourSecret is protected by military-grade encryption. Even if our entire infrastructure were compromised, your secrets would remain safe because only <strong>YOU</strong> (and the person you share with) have the password.
                        </p>
                        <div className="inline-block px-6 py-3 rounded-full bg-pink/20 text-pink text-[10px] font-black uppercase tracking-[0.3em] border border-pink/30 cursor-default">
                            Stay Secure. Stay Anonymous.
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;
