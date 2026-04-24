import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LayOut from "./components/LayOut.jsx";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SecretTextInput from "./components/SecretTextInput";
import DecryptionPage from "./components/DecryptionPage.jsx";
import PrivacyPage from "./components/PrivacyPage.jsx";

function App() {
    return (
        <Router>
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
