import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LayOut from "./components/LayOut.jsx";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SecretTextInput from "./components/SecretTextInput";
import DecryptionPage from "./components/DecryptionPage.jsx";

function App() {
    return (
        <Router>
            <LayOut>
                <NavBar />
                <div className="container mt-5">
                    <Routes>
                        <Route path="/" element={<SecretTextInput />} />
                        <Route path="/decrypt" element={<DecryptionPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
                <Footer />
            </LayOut>
        </Router>
    );
}

export default App;
