import LayOut from "./components/LayOut.jsx";
import NavBar from "./components/NavBar";
import SecretTextInput from "./components/SecretTextInput";
import Footer from "./components/Footer";

function App() {
    return (
        <LayOut>
            <NavBar />
            <div className="container mt-5">
                <SecretTextInput />
            </div>
            <Footer />
        </LayOut>
    );
}

export default App;
