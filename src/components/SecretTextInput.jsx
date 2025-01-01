import "../index.css"; // Ensure your CSS file handles global styles.
import secretSvg from '../assets/secret.svg'; // Adjust the path based on your folder structure

function SecretTextInput() {
    return (
        <div className="container mt-5" style={{ maxWidth: "600px", color: "#fff" }}>
            {/* Header Section */}
            <div className="text-center mb-4">
                <div className="d-flex justify-content-center align-items-center mb-3">
                    <i
                        className="bi bi-send-fill"
                        style={{
                            fontSize: "2rem",
                            color: "#ff007f", // Pink color for the icon.
                            marginRight: "8px",
                        }}
                    ></i>

                    <img src={secretSvg} alt="Secret SVG" style={{width: "100px", height: "100px", marginRight: "18px"}}/>

                    <h1 className="fw-bold" style={{fontSize: "2rem", color: "#ff007f"}}>
                        Share a secret
                    </h1>
                </div>
                <p className="text-light" style={{fontSize: "2rem"}}>
                    ...with a link that only works <u className="text-pink">one time</u> and then self-destructs.
                </p>
            </div>

            {/* Card Container */}
            <div className="card bg-black text-white shadow p-3">
                {/* Tab Section */}
                <div className="d-flex gap-4 mb-3">
                    <span className="text-uppercase text-pink fw-bold">Text</span>
                    <span className="text">File</span>
                </div>

                {/* Input Section */}
                <textarea
                    className="form-control bg-black text-light border-secondary"
                    placeholder="What's your secret?"
                    maxLength={140}
                    rows={4}
                    style={{
                        color: "#ffffff", // Ensures white text in the textarea.
                        caretColor: "#ffffff", // White cursor.
                    }}
                ></textarea>
                <small className="d-block text-end text-muted mt-1">140</small>

                {/* Button */}
                <button className="btn btn-pink text-light w-100 mt-3 fw-bold">
                    CREATE SECRET LINK
                </button>
            </div>

            {/* Footer Section */}
            <div className="text-light text-center mt-3 small">
                <i className="bi bi-shield-lock-fill"></i> End-to-end encrypted &nbsp;
                <i className="bi bi-globe"></i> Swiss privacy &nbsp;
                <i className="bi bi-fire"></i> Without a trace
            </div>

        </div>
    );
}

export default SecretTextInput;
