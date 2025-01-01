import StarryBackground from "./StaryBackground.jsx";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    return (
        <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
            {/* Background Layer */}
            <StarryBackground />

            {/* Foreground Content */}
            <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
        </div>
    );
};

export default Layout;
