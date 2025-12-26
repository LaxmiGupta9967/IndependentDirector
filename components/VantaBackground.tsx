import React, { useEffect, useRef } from 'react';

// Make Vanta function available in the scope
declare global {
    interface Window {
        VANTA: {
            NET: (options: {
                el: HTMLElement | null;
                mouseControls: boolean;
                touchControls: boolean;
                gyroControls: boolean;
                minHeight: number;
                minWidth: number;
                scale: number;
                scaleMobile: number;
                color: number;
                backgroundColor: number;
                points: number;
                maxDistance: number;
                spacing: number;
            }) => { destroy: () => void; };
        };
    }
}

const VantaBackground: React.FC = () => {
    const vantaRef = useRef<HTMLDivElement>(null);
    const vantaEffect = useRef<any>(null);

    useEffect(() => {
        // Ensure Vanta is available and we have a ref to the element
        if (window.VANTA?.NET && vantaRef.current) {
            // Destroy the previous instance if it exists
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
            }

            // Create a new instance with theme-specific colors
            vantaEffect.current = window.VANTA.NET({
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x14b8a6,        // Teal for dark
                backgroundColor: 0x0a192f, // Navy for dark
                points: 12.00,
                maxDistance: 25.00,
                spacing: 18.00
            });
        }

        // Cleanup on component unmount
        return () => {
            if (vantaEffect.current) {
                vantaEffect.current.destroy();
                vantaEffect.current = null;
            }
        };
    }, []); // Rerun effect when theme changes

    return (
        <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />
    );
};

export default VantaBackground;