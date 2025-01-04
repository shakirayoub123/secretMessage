import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer
            className="text-white"
            style={{
                padding: "40px 0",
                marginTop: "100px",
            }}
        >
            <div className="container text-center">
                <p className="mb-3" style={{ fontSize: "14px" }}>
                    &copy; {new Date().getFullYear()} Your Secret. All Rights Reserved.
                </p>
                <p className="mb-3" style={{ fontSize: "14px" }}>
                    Securely send and decrypt messages with us!
                </p>
                <div className="d-flex justify-content-center mb-4">
                    <a
                        href="https://x.com/shakirayoub5?s=21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light mx-4"
                        style={{ fontSize: "20px" }}
                    >
                        <FaTwitter />
                    </a>
                    <a
                        href="https://www.facebook.com/share/18VJmv1ou9/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light mx-4"
                        style={{ fontSize: "20px" }}
                    >
                        <FaFacebook />
                    </a>
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light mx-4"
                        style={{ fontSize: "20px" }}
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/shakir-ayoub-318526338/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light mx-4"
                        style={{ fontSize: "20px" }}
                    >
                        <FaLinkedin />
                    </a>
                </div>
                <p style={{ fontSize: "14px" }}>
                    <a
                        href="/privacy-policy"
                        className="text-secondary mx-2"
                        style={{ textDecoration: "none" }}
                    >
                        Privacy Policy
                    </a>
                    |
                    <a
                        href="/terms-of-service"
                        className="text-secondary mx-2"
                        style={{ textDecoration: "none" }}
                    >
                        Terms of Service
                    </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
