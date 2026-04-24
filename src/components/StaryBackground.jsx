import { useCallback, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const StarryBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesOptions = useMemo(() => ({
        fullScreen: { enable: true, zIndex: 0 },
        background: {
            color: "#050505",
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: { enable: true, mode: "push" },
                onHover: {
                    enable: true,
                    mode: "grab",
                    parallax: { enable: false, force: 60, smooth: 10 },
                },
                resize: true,
            },
            modes: {
                push: { quantity: 4 },
                grab: { distance: 200, links: { opacity: 0.2 } },
            },
        },
        particles: {
            color: { value: "#ffffff" },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: false,
                opacity: 0.1,
                width: 1,
            },
            collisions: { enable: false },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                random: true,
                speed: 0.2,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 30,
            },
            opacity: {
                anim: { enable: true, speed: 1, opacity_min: 0.05, sync: false },
                value: { min: 0.1, max: 0.7 },
            },
            shape: { type: "circle" },
            size: {
                value: { min: 0.5, max: 1.5 },
                random: true,
            },
            twinkle: {
                particles: {
                    enable: true,
                    color: "#ff007a",
                    frequency: 0.05,
                    opacity: 1,
                },
            },
        },
        detectRetina: false,
    }), []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
        />
    );
};

export default StarryBackground;
