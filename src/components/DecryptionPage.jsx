import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function DecryptSecret() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [decryptedSecret, setDecryptedSecret] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState("initial"); // Tracks the current step in the UI flow
    const navigate = useNavigate(); // Hook to navigate between routes

    const decryptSecret = () => {
        const encryptedSecret = searchParams.get("secret");
        if (!encryptedSecret) {
            setError("No secret found in the URL.");
            return;
        }

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedSecret, password);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (!originalText) {
                setError("Incorrect password or invalid secret.");
            } else {
                setDecryptedSecret(originalText);
                setError("");
                setStep("decrypted");
            }
        } catch (e) {
            setError("An error occurred while decrypting the secret.");
        }
    };

    const destroySecret = () => {
        setDecryptedSecret("");
        setStep("initial");
        navigate("/encrypt"); // Redirect to the "Encrypt" page
    };

    return (
        <div className="container text-light d-flex flex-column align-items-center mt-5">
            {step === "initial" && (
                <div className="text-center">
                    <h1 className="fw-bold" style={{ fontSize: "2.5rem", color: "#ff007f" }}>
                        Hello
                    </h1>
                    <p>You received a secret.</p>
                    <div
                        className="p-3 mt-3 rounded"
                        style={{
                            backgroundColor: "#20232a",
                            color: "white",
                            fontSize: "1.1rem",
                        }}
                    >
                        <p>Be aware! The following secret can only be revealed one time.</p>

                        <button
                            className="btn btn-tool mt-3"
                            style={{backgroundColor: "#ff007f", color: "white"}}
                            onClick={() => setStep("password")}
                        >
                            REVEAL SECRET
                        </button>
                    </div>
                </div>
            )}

            {step === "password" && (
                <>
                    <h1 className="fw-bold" style={{fontSize: "2.5rem", color: "#ff007f"}}>
                        Decrypt Secret
                    </h1>
                    <p>Enter the password to reveal the secret:</p>

                    <input
                        type="password"
                        className="form-control bg-black text-light border-secondary mb-3"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError("");
                        }}
                        style={{ maxWidth: "400px" }}
                    />

                    <button
                        className="btn btn-tool"
                        onClick={decryptSecret}
                        style={{ backgroundColor: "#ff007f", color: "white" }}
                    >
                        DECRYPT
                    </button>

                    {error && <p className="text-danger mt-3">{error}</p>}
                </>
            )}

            {step === "decrypted" && (
                <div
                    className="text-center p-4 rounded"
                    style={{ maxWidth: "600px", width: "100%" }}
                >
                    <h1 className="fw-bold" style={{ fontSize: "2.5rem", color: "#ff007f" }}>
                        Incoming...
                    </h1>
                    <p>You received a secret.</p>
                    <div
                        className="p-3 mt-3 rounded"
                        style={{backgroundColor: "#2c2f33", color: "white", fontSize: "1.2rem"}}
                    >
                        {decryptedSecret}
                        <div className="d-flex justify-content-between mt-3">
                            <button
                                className="btn btn-danger"
                                onClick={destroySecret}
                                style={{backgroundColor: "#ff007f", color: "white", border: "none"}}
                            >
                                DESTROY SECRET
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigator.clipboard.writeText(decryptedSecret)}
                                style={{backgroundColor: "#ff007f", color: "white", border: "none"}}
                            >
                                COPY
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default DecryptSecret;
