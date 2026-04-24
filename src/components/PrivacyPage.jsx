import Layout from "./LayOut";
import { FaShieldAlt, FaLock, FaUserSecret, FaTrashAlt, FaServer } from "react-icons/fa";

const PrivacyPage = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto pt-20 px-4 pb-32">
                <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="w-20 h-20 bg-pink/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pink/20 rotate-3">
                        <FaShieldAlt className="text-4xl text-pink" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
                        Privacy <span className="text-pink">First</span>
                    </h1>
                    <p className="text-gray-500 text-lg uppercase tracking-[0.2em] max-w-2xl mx-auto font-light leading-relaxed">
                        We don't just promise privacy. <br/> 
                        <span className="text-white font-bold">We make it mathematically impossible to violate it.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    <div className="glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group">
                        <FaLock className="text-3xl text-pink mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">End-to-End Encryption</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Every secret you create is encrypted locally in your browser using the <strong>AES-256 standard</strong>. 
                            Your original message never leaves your device.
                        </p>
                    </div>

                    <div className="glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group">
                        <FaUserSecret className="text-3xl text-pink mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Zero-Knowledge</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            We use a "Zero-Knowledge" architecture. This means our servers (and Supabase) only see scrambled code. 
                            <strong> We do not have the keys to unlock your secrets.</strong>
                        </p>
                    </div>

                    <div className="glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group">
                        <FaTrashAlt className="text-3xl text-pink mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Self-Destruction</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            Once a secret is decrypted and read, it is purged from the database forever. 
                            We don't keep logs, backups, or history of your shared content.
                        </p>
                    </div>

                    <div className="glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:bg-white/[0.07] transition-all group">
                        <FaServer className="text-3xl text-pink mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">No Trackers</h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            YourSecret contains zero third-party trackers, advertisements, or cookies that can identify you. 
                            Your identity is as anonymous as your message.
                        </p>
                    </div>
                </div>

                <div className="mt-20 glass-card bg-pink/5 border border-pink/10 rounded-[3rem] p-12 text-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">Our Security Philosophy</h2>
                    <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                        "If we don't have it, we can't lose it. If we can't see it, we can't share it." 
                        <br/><br/>
                        Everything you share on YourSecret is protected by military-grade encryption. 
                        Even if our entire infrastructure were compromised, your secrets would remain safe because only <strong>YOU</strong> (and the person you share with) have the password.
                    </p>
                    <div className="inline-block px-8 py-3 rounded-full bg-pink/20 text-pink text-xs font-black uppercase tracking-[0.3em] border border-pink/30">
                        Stay Secure. Stay Anonymous.
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;
