import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LayOut from "./components/LayOut.jsx";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SecretTextInput from "./components/SecretTextInput";
import DecryptionPage from "./components/DecryptionPage.jsx";
import PrivacyPage from "./components/PrivacyPage.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <LayOut>
                <NavBar />
                <Routes>
                    <Route path="/" element={<SecretTextInput />} />
                    <Route path="/decrypt" element={<DecryptionPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
            </LayOut>
        </Router>
    );
}

export default App;
