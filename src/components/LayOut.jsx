import StarryBackground from "./StaryBackground.jsx";

const Layout = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-pink selection:text-white flex flex-col">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <StarryBackground />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col flex-grow">
                {children}
            </div>

            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink/10 blur-[120px] rounded-full pointer-events-none z-0 will-change-[transform]"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink/5 blur-[120px] rounded-full pointer-events-none z-0 will-change-[transform]"></div>
        </div>
    );
};

export default Layout;
