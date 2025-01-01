import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadStarShape } from "tsparticles-shape-star";

const StarryBackground = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
        await loadStarShape(main);
    };

    const particlesOptions = {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                onClick: {
                    enable: true,
                    mode: "push",
                },
            },
            modes: {
                repulse: {
                    distance: 80,
                    duration: 0.5,
                },
                push: {
                    quantity: 3,
                },
            },
        },
        particles: {
            number: {
                value: 300,
                density: {
                    enable: true,
                    area: 800,
                },
            },
            color: {
                value: ["#ffffff", "#d2d2d2", "#add8e6"],
            },
            shape: {
                type: "star",
            },
            opacity: {
                value: { min: 0.2, max: 1 },
                random: true,
                animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.1,
                    sync: false,
                },
            },
            size: {
                value: { min: 1, max: 5 },
                random: true,
                animation: {
                    enable: true,
                    speed: 1.5,
                    minimumValue: 0.1,
                    sync: false,
                },
            },
            move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                outModes: {
                    default: "out",
                },
            },
            zIndex: {
                value: { min: 1, max: 100 }, // Simulate depth
            },
        },
        background: {
            color: "#000000",
        },
    };



    return (
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    );
};

export default StarryBackground;
