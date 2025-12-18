import React, { useState, useMemo, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import ControlButton from './ControlButton';
import { useMotionValue, useTransform } from 'framer-motion';

export const PulseEchoPrincipleVisual: React.FC = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const targetY = useMotionValue(100); // Represents pixels, not depth
    const controls = useAnimation();
    const aModeControls = useAnimation();

    const speedOfSound = 1.54; // mm/µs
    const maxDepthMm = 200; // 20 cm
    const containerHeight = 256; // h-64 in tailwind

    const depthMm = useTransform(targetY, [0, containerHeight], [0, maxDepthMm]);
    const timeOfFlight = useTransform(depthMm, d => (d * 2) / speedOfSound);

    const handleSendPulse = useCallback(async () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const targetPosition = targetY.get();
        const durationDown = (targetPosition / containerHeight) * 1.5;
        const durationUp = durationDown;
        
        controls.set({ y: 0, opacity: 1, scale: 1 });
        aModeControls.set({ pathLength: 1 });

        await controls.start({
            y: targetPosition,
            transition: { duration: durationDown, ease: 'linear' }
        });

        controls.start({
            scale: 0.8,
            transition: { duration: 0.1 }
        });
        
        aModeControls.start({
            pathLength: 1 - ((durationDown + durationUp) / 3),
            transition: { duration: durationDown + durationUp, ease: 'linear' }
        });

        await controls.start({
            y: 0,
            transition: { duration: durationUp, ease: 'linear' }
        });
        
        controls.start({ opacity: 0, transition: { duration: 0.2 } });

        setIsAnimating(false);
    }, [isAnimating, targetY, controls, aModeControls, containerHeight]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-3/4 h-80 flex gap-2">
                    {/* B-Mode */}
                    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-400 rounded-b-md"></div>
                        
                        <motion.div
                            drag="y"
                            dragConstraints={{ top: 20, bottom: containerHeight - 20 }}
                            className="absolute left-1/2 -translate-x-1/2 w-10 h-2 bg-cyan-400 rounded-full cursor-grab active:cursor-grabbing"
                            style={{ y: targetY }}
                        />

                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full"
                            style={{ top: 10 }}
                            animate={controls}
                        />
                    </div>
                    {/* A-Mode */}
                    <div className="relative h-full w-24 bg-black/50 rounded-lg p-2">
                         <svg width="100%" height="100%" viewBox="0 0 50 100" preserveAspectRatio="none">
                            <motion.path
                                d="M 25 100 V 0"
                                stroke="#facc15"
                                strokeWidth="2"
                                animate={aModeControls}
                                style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
                            />
                        </svg>
                    </div>
                </div>
                <div className="w-full md:w-1/4 flex flex-col justify-center gap-4">
                    <div className="bg-black/40 p-3 rounded-lg text-center">
                        <p className="text-sm text-white/70">Depth:</p>
                        <motion.p className="font-mono font-bold text-lg text-white">
                            {useTransform(depthMm, v => `${v.toFixed(1)} mm`).get()}
                        </motion.p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg text-center">
                        <p className="text-sm text-white/70">Time-of-Flight:</p>
                         <motion.p className="font-mono font-bold text-lg text-white">
                            {useTransform(timeOfFlight, v => `${v.toFixed(1)} µs`).get()}
                        </motion.p>
                    </div>
                    <ControlButton onClick={handleSendPulse} disabled={isAnimating}>
                        {isAnimating ? "Pulsing..." : "Send Pulse"}
                    </ControlButton>
                </div>
            </div>
        </div>
    );
};