
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EchoBotMascotProps {
    size?: number;
    isThinking?: boolean;
    className?: string;
}

const EchoBotMascot: React.FC<EchoBotMascotProps> = ({ size = 64, isThinking = false, className = '' }) => {
    return (
        <div style={{ width: size, height: size }} className={`relative select-none ${className}`}>
            {/* Hovering Motion Wrapper */}
            <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full flex items-center justify-center"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="goldMascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="50%" stopColor="#fce9b5" />
                            <stop offset="100%" stopColor="#b08d2f" />
                        </linearGradient>
                        <filter id="glowMascot">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Outer Rotating Ring */}
                    <motion.path 
                        d="M 50 10 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke="url(#goldMascotGrad)" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                        opacity="0.6"
                    />
                    <motion.path 
                        d="M 50 90 A 40 40 0 0 1 10 50" 
                        fill="none" 
                        stroke="url(#goldMascotGrad)" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                        opacity="0.6"
                    />

                    {/* Inner Counter-Rotating Ring */}
                    <motion.circle 
                        cx="50" cy="50" r="32" 
                        stroke="#fff" 
                        strokeWidth="1" 
                        strokeDasharray="10 20" 
                        fill="none" 
                        opacity="0.3"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        style={{ originX: "50px", originY: "50px" }}
                    />

                    {/* Main Chassis Body */}
                    <circle cx="50" cy="50" r="22" fill="#151515" stroke="#333" strokeWidth="1" />
                    
                    {/* Eye/Lens Container */}
                    <circle cx="50" cy="50" r="14" fill="#000" stroke="#222" strokeWidth="1" />

                    {/* The Eye (Pupil) */}
                    <motion.circle 
                        cx="50" cy="50" r="6" 
                        fill="url(#goldMascotGrad)"
                        filter="url(#glowMascot)"
                        animate={isThinking ? { scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 1 }}
                        transition={{ duration: isThinking ? 0.6 : 0, repeat: isThinking ? Infinity : 0 }}
                    />
                    
                    {/* Scanning Line (when active/thinking) */}
                    <AnimatePresence>
                        {isThinking && (
                            <motion.rect
                                x="28" y="48" width="44" height="4" fill="url(#goldMascotGrad)" opacity="0.3"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: [0, 40, 0], opacity: [0, 0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Glint */}
                    <path d="M 60 35 Q 65 35 62 42" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
            </motion.div>
            
            {/* Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--gold)]/20 blur-md rounded-full" />
        </div>
    );
};

export default EchoBotMascot;
