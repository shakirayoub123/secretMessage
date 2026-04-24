import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaLockOpen, FaSkullCrossbones, FaCopy, FaUnlock, FaEye, FaDownload, FaLink } from "react-icons/fa";
import { supabase } from "../supabase";

const MySwal = withReactContent(Swal);

function DecryptSecret() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [decryptedData, setDecryptedData] = useState(null); // { type, name, data }
    const [error, setError] = useState("");
    const [step, setStep] = useState("initial");
    const [needsPassword, setNeedsPassword] = useState(true);
    const navigate = useNavigate();

    const showAlert = (title, message, icon) => {
        MySwal.fire({
            toast: true,
            position: "top-end",
            icon,
            title,
            text: message,
            showConfirmButton: false,
            timer: 3000,
            background: '#1a1a1a',
            color: '#fff'
        });
    };

    const getSecretIdFromUrl = () => {
        const hash = window.location.hash;
        if (!hash) return null;
        const params = new URLSearchParams(hash.substring(1));
        return params.get("id");
    };

    const fetchEncryptedSecret = async (id) => {
        const { data, error } = await supabase
            .from('secrets')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;

        if (data.is_storage) {
            // If it's in storage, fetch the text from the public URL
            const response = await fetch(data.data);
            return await response.text();
        }
        return data.data;
    };

    const decryptSecret = async (pwd = password) => {
        const secretId = getSecretIdFromUrl();
        if (!secretId) {
            setError("Invalid link format.");
            return;
        }

        try {
            const encryptedSecret = await fetchEncryptedSecret(secretId);
            if (!encryptedSecret) {
                setError("This secret has been deleted or expired.");
                showAlert("Error", "Secret not found.", "error");
                return;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedSecret, pwd);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (!originalText) {
                setError("Decryption failed. The key might be incorrect.");
                showAlert("Access Denied", "Incorrect password.", "error");
            } else {
                try {
                    const parsed = JSON.parse(originalText);
                    setDecryptedData(parsed);
                } catch (e) {
                    setDecryptedData({ type: "text", data: originalText });
                }
                setError("");
                setStep("decrypted");
                showAlert("Unlocked", "Secret decrypted successfully.", "success");
            }
        } catch (e) {
            console.error(e);
            setError("The data is corrupted or invalid.");
            showAlert("Error", "Decryption error occurred.", "error");
        }
    };

    const handleReveal = async () => {
        const secretId = getSecretIdFromUrl();
        if (!secretId) {
            setError("No secret ID found in the URL.");
            return;
        }

        try {
            const encryptedSecret = await fetchEncryptedSecret(secretId);
            if (!encryptedSecret) {
                setError("This secret has been deleted or expired.");
                return;
            }

            const bytes = CryptoJS.AES.decrypt(encryptedSecret, "");
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (originalText) {
                try {
                    const parsed = JSON.parse(originalText);
                    setDecryptedData(parsed);
                } catch (e) {
                    setDecryptedData({ type: "text", data: originalText });
                }
                setError("");
                setStep("decrypted");
                setNeedsPassword(false);
                showAlert("Unlocked", "Access granted.", "success");
                return;
            }
        } catch (e) {
            console.error(e);
        }

        setNeedsPassword(true);
        setStep("password");
    };

    const destroySecret = async () => {
        const secretId = getSecretIdFromUrl();
        if (secretId) {
            try {
                await supabase
                    .from('secrets')
                    .delete()
                    .eq('id', secretId);
            } catch (e) {
                console.error("Delete error:", e);
            }
        }
        setDecryptedData(null);
        setStep("initial");
        showAlert("Destroyed", "The secret has been purged from the cloud.", "success");
        navigate("/");
    };

    const copyToClipboard = () => {
        if (decryptedData?.type === "file" && decryptedData?.data.startsWith("data:image/")) {
            showAlert("Info", "Cannot copy image to clipboard as text.", "info");
            return;
        }
        navigator.clipboard.writeText(decryptedData?.data || "");
        showAlert("Copied", "Copied to clipboard.", "success");
    };

    const downloadFile = () => {
        const link = document.createElement("a");
        link.href = decryptedData.data;
        link.download = decryptedData.name || "secret-file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showAlert("Success", "File downloaded.", "success");
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4 py-12">
            <div className="w-full max-w-xl glass-card rounded-3xl p-8 md:p-12 transition-all duration-500 animate-in fade-in zoom-in">
                {step === "initial" && (
                    <div className="text-center space-y-8">
                        <div className="inline-block p-6 rounded-full bg-pink/10 border border-pink/20 animate-bounce">
                            <FaLockOpen className="text-4xl text-pink" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                                Message <span className="text-pink">Detected</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-light leading-relaxed">
                                You've received a private encrypted secret. 
                                <span className="block mt-2 text-pink/80 text-sm font-medium uppercase tracking-[0.2em]">
                                    One-time view only
                                </span>
                            </p>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest leading-relaxed">
                                Warning: Opening this secret will destroy it permanently after you close the session.
                            </p>
                            <button
                                className="w-full btn-premium bg-pink text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-pink/20"
                                onClick={handleReveal}
                            >
                                Reveal Secret
                            </button>
                        </div>
                    </div>
                )}

                {step === "password" && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Security <span className="text-pink">Check</span></h1>
                            <p className="text-gray-400">This secret is protected by an additional password.</p>
                        </div>

                        <div className="relative">
                            <FaUnlock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                className="w-full bg-black/40 text-white border border-white/10 rounded-2xl py-5 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-pink/50 focus:border-pink/50 transition-all placeholder:text-gray-600"
                                placeholder="Enter password to unlock"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError("");
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && decryptSecret()}
                            />
                        </div>

                        <button
                            className="w-full btn-premium bg-pink text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-pink/20"
                            onClick={() => decryptSecret()}
                        >
                            Unlock Message
                        </button>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center animate-shake">
                                {error}
                            </div>
                        )}
                    </div>
                )}

                {step === "decrypted" && (
                    <div className="space-y-8 animate-in zoom-in duration-500">
                        <div className="text-center space-y-4">
                            <div className="inline-block p-4 rounded-full bg-green-500/10 border border-green-500/20">
                                <FaEye className="text-3xl text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Access <span className="text-pink">Granted</span></h1>
                            <p className="text-gray-400 text-sm uppercase tracking-widest">Secret Message Below</p>
                        </div>

                        <div className="relative group">
                            <div className="w-full bg-black/60 border border-white/10 rounded-3xl p-4 md:p-6 text-center text-white glass-card shadow-inner overflow-hidden min-h-[150px] flex flex-col items-center justify-center">
                                {decryptedData?.type === "file" ? (
                                    decryptedData.data.startsWith("data:image/") ? (
                                        <img 
                                            src={decryptedData.data} 
                                            alt="Secret" 
                                            className="w-full rounded-2xl animate-in fade-in zoom-in duration-700" 
                                        />
                                    ) : (
                                        <div className="space-y-4 p-8">
                                            <FaLink className="text-6xl text-pink mx-auto animate-pulse" />
                                            <p className="text-lg font-bold text-white uppercase tracking-widest">{decryptedData.name}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Document / File Secret</p>
                                        </div>
                                    )
                                ) : decryptedData?.type === "link" ? (
                                    <div className="space-y-4 p-8">
                                        <FaLink className="text-6xl text-pink mx-auto animate-pulse" />
                                        <p className="text-sm font-mono text-gray-400 break-all">{decryptedData.data}</p>
                                        <a 
                                            href={decryptedData.data} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-block bg-pink text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-pink/20 hover:scale-105 transition-transform"
                                        >
                                            Visit Secret Link
                                        </a>
                                    </div>
                                ) : (
                                    <div className="p-4 md:p-6 text-xl md:text-2xl font-medium leading-relaxed">
                                        {decryptedData?.data}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -top-3 -left-3 bg-pink text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-white shadow-lg">
                                Unlocked
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {decryptedData?.type === "file" ? (
                                <button
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-bold uppercase tracking-widest border border-white/10 transition-all"
                                    onClick={downloadFile}
                                >
                                    <FaDownload /> Download
                                </button>
                            ) : (
                                <button
                                    className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-bold uppercase tracking-widest border border-white/10 transition-all"
                                    onClick={copyToClipboard}
                                >
                                    <FaCopy /> Copy
                                </button>
                            )}
                            <button
                                className="flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-5 rounded-2xl font-bold uppercase tracking-widest border border-red-500/10 transition-all"
                                onClick={destroySecret}
                            >
                                <FaSkullCrossbones /> Destroy
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-gray-600 uppercase tracking-[0.4em] pt-4">
                            Purge session after reading
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DecryptSecret;
