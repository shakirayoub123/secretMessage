import "../index.css";
import successSvg from "../assets/secret.svg"; // Replace with the path to your success image
import { useState } from "react";
import CryptoJS from "crypto-js";

function SecretTextInput() {
    const [secret, setSecret] = useState("");
    const [password, setPassword] = useState("");
    const [decryptionLink, setDecryptionLink] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const encryptSecret = (message, password) => {
        return CryptoJS.AES.encrypt(message, password).toString();
    };

    const createSecret = () => {
        if (!secret.trim()) {
            alert("Please enter a secret!");
            return;
        }

        if (!password || password.trim().length < 4) {
            alert("Password must be at least 4 characters long.");
            return;
        }

        const encrypted = encryptSecret(secret, password);
        const decryptionURL = `${window.location.origin}/decrypt?secret=${encodeURIComponent(encrypted)}`;

        setDecryptionLink(decryptionURL);
        setIsSuccess(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(decryptionLink).then(() => {
            alert("Decryption link copied to clipboard!");
        });
    };

    const resetForm = () => {
        setSecret("");
        setPassword("");
        setDecryptionLink("");
        setIsSuccess(false);
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "600px", color: "#fff" }}>
            {!isSuccess ? (
                <>
                    <div className="text-center mb-4">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                            <img src={successSvg} alt="Secret SVG" style={{ width: "100px", marginRight: "18px" }} />
                            <h1 className="fw-bold" style={{ fontSize: "2rem", color: "#ff007f" }}>Share a secret</h1>
                        </div>
                        <p className="text-light" style={{ fontSize: "2rem" }}>
                            ...with a link that only works <u className="text-pink">one time</u> and then self-destructs.
                        </p>
                    </div>

                    <textarea
                        className="form-control bg-black text-light border-secondary"
                        placeholder="What's your secret?"
                        maxLength={140}
                        rows={4}
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        style={{ color: "#ffffff", caretColor: "#ffffff" }}
                    ></textarea>
                    <small className={`d-block text-end mt-1 ${secret.length > 140 ? 'text-danger' : 'text-muted'}`}>
                        {140 - secret.length} characters remaining
                    </small>

                    <input
                        type="password"
                        className="form-control bg-black text-light border-secondary mt-3"
                        placeholder="Set a password for your secret"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ color: "#ffffff", caretColor: "#ffffff" }}
                    />

                    <button className="btn btn-tool btnSecret mt-3 mb-2 float-end" onClick={createSecret}>
                        CREATE SECRET LINK
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <img src={successSvg} alt="Success SVG" style={{ width: "100px", marginBottom: "18px" }} />
                    <h1 className="fw-bold" style={{ fontSize: "2.5rem", color: "#ff007f" }}>Success!</h1>
                    <p className="text-light" style={{ fontSize: "1.2rem" }}>
                        Your secret link has been created - now share it with your confidant.
                    </p>

                    <div className="bg-black text-light p-3 rounded" style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                        <a href={decryptionLink} target="_blank" rel="noopener noreferrer" className="text-pink">
                            {decryptionLink}
                        </a>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <button onClick={copyToClipboard} className="btn btnSecret mx-2">
                            COPY
                        </button>
                        <button onClick={resetForm} className="btn btn-secondary mx-2">
                            CREATE NEW SECRET
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SecretTextInput;
