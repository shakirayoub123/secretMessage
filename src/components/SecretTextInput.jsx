import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import successSvg from "../assets/secret.svg";
import { FaLock, FaLink, FaPlus, FaChevronDown, FaCopy, FaImage, FaTimes, FaShareAlt } from "react-icons/fa";
import { supabase } from "../supabase";

const MySwal = withReactContent(Swal);

function SecretTextInput() {
    const [secret, setSecret] = useState("");
    const [password, setPassword] = useState("");
    const [decryptionLink, setDecryptionLink] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [fileData, setFileData] = useState(null); // { name, data, type }
    const [activeTab, setActiveTab] = useState("text"); // "text", "file", or "link"
    const fileInputRef = useRef(null);

    const encryptSecret = (message, password) => {
        return CryptoJS.AES.encrypt(message, password).toString();
    };

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
                MySwal.fire({
                    icon: "error",
                    title: "File too large",
                    text: `Please select a ${isImage ? "image under 5MB" : "file under 1MB"}`,
                    background: '#1a1a1a',
                    color: '#fff'
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
                MySwal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: "Please enter a valid URL (starting with http)!",
                    showConfirmButton: false,
                    timer: 3000,
                    background: '#1a1a1a',
                    color: '#fff'
                });
                return;
            }
            payload = JSON.stringify({ type: "link", data: secret });
        }

        if (showPasswordField && (!password || password.trim().length < 4)) {
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Password must be at least 4 characters!",
                showConfirmButton: false,
                timer: 3000,
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        try {
            MySwal.fire({
                title: 'Securing your secret...',
                allowOutsideClick: false,
                didOpen: () => {
                    MySwal.showLoading();
                },
                background: '#1a1a1a',
                color: '#fff'
            });

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
            MySwal.close();
            
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Secret secured with Supabase!",
                showConfirmButton: false,
                timer: 3000,
                background: '#1a1a1a',
                color: '#fff'
            });
        } catch (error) {
            console.error("Supabase Error:", error);
            MySwal.fire({
                icon: "error",
                title: "Setup Required",
                text: "Make sure you have created the 'secrets' table and 'secrets' storage bucket in Supabase!",
                background: '#1a1a1a',
                color: '#fff'
            });
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(decryptionLink).then(() => {
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Link copied!",
                showConfirmButton: false,
                timer: 2000,
                background: '#1a1a1a',
                color: '#fff'
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
        <div className="flex items-center justify-center min-h-[60vh] px-4 py-12">
            <div className="w-full max-w-xl glass-card rounded-3xl p-8 md:p-12 transition-all duration-500 animate-in fade-in zoom-in duration-700">
                {!isSuccess ? (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <div className="inline-block p-4 rounded-2xl bg-pink/10 mb-2">
                                <img src={successSvg} alt="Logo" className="w-16 h-16 animate-pulse-slow" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
                                Share a <span className="text-pink">Secret</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-light leading-relaxed">
                                Create a secure, encrypted link for text or 
                                <span className="text-white font-medium mx-1 italic">documents</span>.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                            <button 
                                onClick={() => setActiveTab("text")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs ${activeTab === "text" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
                            >
                                Text
                            </button>
                            <button 
                                onClick={() => setActiveTab("file")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs ${activeTab === "file" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
                            >
                                <FaPlus className="text-[10px]" /> File
                            </button>
                            <button 
                                onClick={() => setActiveTab("link")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs ${activeTab === "link" ? "bg-pink text-white shadow-lg shadow-pink/20" : "text-gray-500 hover:text-white"}`}
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
                                    className="w-full bg-black/40 text-white border border-white/10 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-pink/50 focus:border-pink/50 transition-all resize-none placeholder:text-gray-600 font-mono"
                                    placeholder={activeTab === "text" ? "Write your secret message here..." : "https://example.com/secret-resource"}
                                    maxLength={activeTab === "text" ? 140 : 500}
                                    rows={4}
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
                            // ... file upload UI (already exists)
                            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold ml-1">Your File</label>
                                {!fileData ? (
                                    <div 
                                        onClick={() => fileInputRef.current.click()}
                                        className="w-full aspect-video bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink/50 hover:bg-pink/5 transition-all group"
                                    >
                                        <FaLink className="text-4xl text-gray-600 group-hover:text-pink transition-colors mb-4" />
                                        <p className="text-sm text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest font-bold">Click to upload file</p>
                                        <p className="text-[10px] text-gray-600 mt-2">Any file up to 1MB (Images 5MB)</p>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileUpload} 
                                            accept="*" 
                                            className="hidden" 
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                        {fileData.type.startsWith("image/") ? (
                                            <img src={fileData.data} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" />
                                        ) : null}
                                        <div className="z-10 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
                                            <FaLink className="text-4xl text-pink mb-2 mx-auto" />
                                            <p className="text-sm font-bold text-white truncate max-w-[200px]">{fileData.name}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{(fileData.data.length * 0.75 / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                                            <button 
                                                onClick={() => setFileData(null)}
                                                className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
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
                                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors py-2"
                                onClick={() => setShowPasswordField(!showPasswordField)}
                            >
                                <FaPlus className={`transition-transform duration-300 ${showPasswordField ? 'rotate-45' : ''}`} />
                                {showPasswordField ? "Hide Security Options" : "Add Password Protection"}
                            </button>

                            {showPasswordField && (
                                <div className="relative animate-in slide-in-from-top-4 duration-300">
                                    <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 text-white border border-white/10 rounded-2xl py-4 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-pink/50 focus:border-pink/50 transition-all placeholder:text-gray-600"
                                        placeholder="Set a custom password (optional)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <button 
                            className="w-full btn-premium bg-pink hover:bg-pink-hover text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-pink/20"
                            onClick={createSecret}
                        >
                            Generate Secure Link
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white shadow-xl"
                                title="Copy to clipboard"
                            >
                                <FaCopy />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <button 
                                onClick={shareLink}
                                className="flex-1 btn-premium bg-pink text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-pink/20 flex items-center justify-center gap-2"
                            >
                                <FaShareAlt /> Share
                            </button>
                            <button 
                                onClick={resetForm}
                                className="flex-1 px-6 py-4 rounded-xl font-bold uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
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
