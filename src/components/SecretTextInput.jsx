import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import AnimatedLogo from "./AnimatedLogo";
import { FaLock, FaLink, FaPlus, FaChevronDown, FaCopy, FaImage, FaTimes, FaShareAlt } from "react-icons/fa";
import { supabase } from "../supabase";

const MySwal = withReactContent(Swal).mixin({
    background: 'rgba(15, 15, 15, 0.95)',
    color: '#fff',
    backdrop: `rgba(0,0,0,0.6)`,
    customClass: {
        popup: 'glass-card border border-white/10 rounded-3xl shadow-2xl shadow-pink/10',
        confirmButton: 'btn-premium bg-pink hover:bg-pink-hover text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest mt-4',
        cancelButton: 'px-6 py-3 rounded-xl font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all mt-4 ml-2',
        title: 'text-2xl font-bold text-white uppercase tracking-tight',
        htmlContainer: 'text-gray-400',
    },
    buttonsStyling: false,
    showClass: {
        popup: 'animate-swal-show'
    },
    hideClass: {
        popup: 'animate-swal-hide'
    }
});

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    background: '#1A1C20',
    color: '#fff',
    width: 'max-content',
    padding: '0',
    customClass: {
        popup: 'border border-white/10 rounded-full shadow-2xl backdrop-blur-md mt-2 md:mt-4 flex items-center !min-h-0 !py-1 !px-3 md:!py-1.5 md:!px-5 !w-max max-w-[90vw]',
        title: 'text-[10px] md:text-xs font-semibold tracking-wide text-white m-0',
        icon: '!scale-50 !m-0 !p-0'
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});
function SecretTextInput() {
    const [secret, setSecret] = useState("");
    const [password, setPassword] = useState("");
    const [decryptionLink, setDecryptionLink] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fileData, setFileData] = useState(null); // { name, data, type }
    const [activeTab, setActiveTab] = useState("text"); // "text", "file", or "link"
    const fileInputRef = useRef(null);

    const encryptSecret = (message, password) => {
        return CryptoJS.AES.encrypt(message, password).toString();
    };

    const showAlert = (title, message, icon) => {
        Toast.fire({
            icon,
            title: message ? message : title
        });
    };

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.5 quality now that we are using hash fragments (more space!)
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
                    resolve(dataUrl);
                };
            };
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Limit to 1MB for non-image files to keep URLs stable
            const isImage = file.type.startsWith("image/");
            const limit = isImage ? 5 * 1024 * 1024 : 1024 * 1024;
            
            if (file.size > limit) {
                Toast.fire({
                    icon: "error",
                    title: `Please select an ${isImage ? "image under 5MB" : "file under 1MB"}`
                });
                return;
            }

            if (isImage) {
                const compressed = await compressImage(file);
                setFileData({ name: file.name, data: compressed, type: file.type });
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setFileData({ name: file.name, data: event.target.result, type: file.type });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const createSecret = async () => {
        let payload;
        if (activeTab === "text") {
            if (!secret.trim()) {
                showAlert("Error", "Please enter a secret message!", "error");
                return;
            }
            payload = JSON.stringify({ type: "text", data: secret });
        } else if (activeTab === "file") {
            if (!fileData) {
                showAlert("Error", "Please upload a file or image!", "error");
                return;
            }
            payload = JSON.stringify({ type: "file", ...fileData });
        } else if (activeTab === "link") {
            if (!secret.trim() || !secret.startsWith("http")) {
                Toast.fire({
                    icon: "error",
                    title: "Please enter a valid URL (starting with http)!"
                });
                return;
            }
            payload = JSON.stringify({ type: "link", data: secret });
        }

        if (showPasswordField && (!password || password.trim().length < 4)) {
            Toast.fire({
                icon: "error",
                title: "Password must be at least 4 characters!"
            });
            return;
        }

        try {
            setIsLoading(true);

            // Encrypt the payload locally
            const encrypted = encryptSecret(payload, password);
            
            let finalData = encrypted;
            let isUsingStorage = false;

            // If the encrypted data is large (Postgres cell limit is 8KB-1GB, but for URLs let's use Storage if > 50KB)
            if (encrypted.length > 50000) {
                isUsingStorage = true;
                const fileName = `secrets/${Date.now()}.txt`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('secrets')
                    .upload(fileName, encrypted, {
                        contentType: 'text/plain',
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('secrets')
                    .getPublicUrl(fileName);
                
                finalData = publicUrl;
            }
            
            const { data, error } = await supabase
                .from('secrets')
                .insert([
                    { 
                        data: finalData, 
                        is_storage: isUsingStorage,
                        has_password: showPasswordField,
                        type: activeTab
                    }
                ])
                .select();

            if (error) throw error;

            const decryptPath = `/decrypt#id=${data[0].id}`;
            const decryptionURL = `${window.location.origin}${decryptPath}`;

            setDecryptionLink(decryptionURL);
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            Toast.fire({
                icon: "success",
                title: "Secret secured successfully!"
            });
        } catch (error) {
            console.error("Supabase Error:", error);
            Toast.fire({
                icon: "error",
                title: "Setup Required: Check Supabase tables and storage."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(decryptionLink).then(() => {
            Toast.fire({
                icon: "success",
                title: "Link copied to clipboard!"
            });
        });
    };

    const shareLink = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Secret Message',
                text: 'You have received an encrypted secret!',
                url: decryptionLink,
            }).catch(console.error);
        } else {
            copyToClipboard();
        }
    };

    const resetForm = () => {
        setSecret("");
        setPassword("");
        setDecryptionLink("");
        setIsSuccess(false);
        setShowPasswordField(false);
        setFileData(null);
    };

    return (
        <div className="flex-grow flex items-center justify-center w-full px-4 py-2 overflow-hidden">
            <div className="w-full max-w-xl glass-card rounded-3xl p-6 md:p-8 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                {!isSuccess ? (
                    <div className="space-y-5">
                        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                <AnimatedLogo 
                                    containerClass="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-pink/10 shadow-lg shadow-pink/20 animate-pulse-slow" 
                                    sizeClass="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
                                    iconSize="text-[8px] sm:text-[10px]"
                                />
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase m-0 leading-none">
                                    Share a <span className="text-pink">Secret</span>
                                </h1>
                            </div>
                            <p className="text-gray-400 text-xs sm:text-sm md:text-base font-light leading-relaxed text-center px-2">
                                Create a secure, encrypted link for text or 
                                <span className="text-white font-medium mx-1 italic">documents</span>.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                            <button 
                                onClick={() => setActiveTab("text")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs cursor-pointer ${activeTab === "text" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
                            >
                                Text
                            </button>
                            <button 
                                onClick={() => setActiveTab("file")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs cursor-pointer ${activeTab === "file" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
                            >
                                <FaPlus className="text-[10px]" /> File
                            </button>
                            <button 
                                onClick={() => setActiveTab("link")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs cursor-pointer ${activeTab === "link" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
                            >
                                <FaLink /> Link
                            </button>
                        </div>

                        {activeTab === "text" || activeTab === "link" ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">
                                    {activeTab === "text" ? "Your Message" : "Secret URL"}
                                </label>
                                <textarea
                                    className="w-full bg-black/40 text-white border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink/50 focus:border-pink/50 transition-all resize-none placeholder:text-gray-600 font-mono"
                                    placeholder={activeTab === "text" ? "Write your secret message here..." : "https://example.com/secret-resource"}
                                    maxLength={activeTab === "text" ? 140 : 500}
                                    rows={3}
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                ></textarea>
                                {activeTab === "text" && (
                                    <div className="flex justify-end mt-2">
                                        <span className={`text-[10px] font-mono tracking-widest ${secret.length > 130 ? 'text-pink' : 'text-gray-600'}`}>
                                            {140 - secret.length} CHARS LEFT
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Your File</label>
                                {!fileData ? (
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-full h-32 md:h-36 bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink/50 hover:bg-pink/5 transition-all group"
                                    >
                                        <FaLink className="text-2xl text-gray-600 group-hover:text-pink transition-colors mb-2" />
                                        <p className="text-xs text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest font-bold">Click to upload file</p>
                                        <p className="text-[10px] text-gray-600 mt-1">Any file up to 1MB (Images 5MB)</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileUpload} 
                                            accept="*" 
                                            className="hidden" 
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-32 md:h-36 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex flex-col items-center justify-center p-4 text-center space-y-2">
                                        {fileData.type.startsWith("image/") ? (
                                            <img src={fileData.data} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />
                                        ) : null}
                                        <div className="z-10 bg-white/5 p-4 rounded-3xl border border-white/10 shadow-xl">
                                            <FaLink className="text-2xl text-pink mb-1 mx-auto" />
                                            <p className="text-xs font-bold text-white truncate max-w-[200px]">{fileData.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{(fileData.data.length * 0.75 / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                                            <button 
                                                onClick={() => setFileData(null)}
                                                className="bg-red-500 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors py-2 cursor-pointer"
                                onClick={() => setShowPasswordField(!showPasswordField)}
                            >
                                <FaPlus className={`transition-transform duration-300 ${showPasswordField ? 'rotate-45' : ''}`} />
                                {showPasswordField ? "Hide Security Options" : "Add Password Protection"}
                            </button>

                            {showPasswordField && (
                                <div className="relative animate-in slide-in-from-top-4 duration-300">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 text-white border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink/50 focus:border-pink/50 transition-all placeholder:text-gray-600"
                                        placeholder="Set a custom password (optional)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <button 
                            className={`w-full flex items-center justify-center gap-3 btn-premium bg-pink hover:bg-pink-hover text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-pink/20 text-xs cursor-pointer transition-all active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                            onClick={createSecret}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Encrypting...
                                </>
                            ) : (
                                "Generate Secure Link"
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="inline-block p-6 rounded-full bg-green-500/10 border border-green-500/20">
                            <FaLink className="text-4xl text-green-500" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Secret Ready!</h2>
                            <p className="text-gray-400">Your message is encrypted and waiting.</p>
                        </div>

                        <div className="group relative">
                            <div className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 break-all font-mono text-sm text-pink/90 relative overflow-hidden flex items-center justify-between gap-4">
                                <span className="truncate max-w-[80%] opacity-50">
                                    {decryptionLink}
                                </span>
                                <div className="absolute inset-0 bg-pink/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <button 
                                onClick={copyToClipboard}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white shadow-xl cursor-pointer"
                                title="Copy to clipboard"
                            >
                                <FaCopy />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 pt-4">
                            <button 
                                onClick={shareLink}
                                className="flex-1 btn-premium bg-pink text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-pink/20 flex items-center justify-center gap-2 text-xs cursor-pointer transition-all active:scale-[0.98]"
                            >
                                <FaShareAlt /> Share
                            </button>
                            <button 
                                onClick={resetForm}
                                className="flex-1 px-6 py-3 rounded-xl font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs cursor-pointer active:scale-[0.98]"
                            >
                                Create New
                            </button>
                        </div>
                        
                        <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">
                            This link can only be opened once.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SecretTextInput;
