
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../contexts/SoundContext';

interface CinematicIntroProps {
    onComplete: () => void;
}

const BOOT_LOG = [
    "INITIALIZING ECHO KERNEL...",
    "LOADING PHYSICS ENGINE (V.4.2)...",
    "CALIBRATING PIEZOELECTRIC ELEMENTS...",
    "CHECKING TRANSDUCER ARRAYS...",
    "VERIFYING AXIAL RESOLUTION [LARRD]...",
    "OPTIMIZING DYNAMIC RANGE...",
    "ESTABLISHING NEURAL LINK...",
    "SYSTEM NOMINAL.",
];

const NARRATIVE_LINES = [
    { text: "In the void of the body...", delay: 0 },
    { text: "Light cannot save you.", delay: 2.5 },
    { text: "Only sound can see.", delay: 5.0, highlight: true },
];

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
    const [stage, setStage] = useState<'boot' | 'narrative' | 'logo'>('boot');
    const [logIndex, setLogIndex] = useState(0);
    const { playTypewriter, playStartup, playSuccess, playClick } = useSound();

    // Trigger startup sound on mount (browser permitting)
    useEffect(() => {
        const timer = setTimeout(() => {
            playStartup();
        }, 500);
        return () => clearTimeout(timer);
    }, [playStartup]);

    // Boot Sequence Timer
    useEffect(() => {
        if (stage === 'boot') {
            if (logIndex < BOOT_LOG.length) {
                const timeout = setTimeout(() => {
                    playTypewriter();
                    setLogIndex(prev => prev + 1);
                }, 150 + Math.random() * 200); // Random typing speed
                return () => clearTimeout(timeout);
            } else {
                setTimeout(() => setStage('narrative'), 800);
            }
        }
    }, [logIndex, stage, playTypewriter]);

    // Narrative Sequence Timer
    useEffect(() => {
        if (stage === 'narrative') {
            const totalDuration = 8000;
            const timer = setTimeout(() => {
                setStage('logo');
                playSuccess(); // Trigger big sound for logo
            }, totalDuration);
            return () => clearTimeout(timer);
        }
    }, [stage, playSuccess]);

    // Logo Sequence Timer
    useEffect(() => {
        if (stage === 'logo') {
            const timer = setTimeout(() => {
                onComplete();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [stage, onComplete]);

    const handleSkip = () => {
        playClick();
        onComplete();
    };

    return (
        <motion.div 
            className="fixed inset-0 z-[999] bg-[#020204] flex flex-col items-center justify-center overflow-hidden font-mono"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5 }}
        >
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Skip Button */}
            <button 
                onClick={handleSkip}
                className="absolute top-8 right-8 text-[10px] text-white/30 hover:text-[var(--gold)] uppercase tracking-widest border border-white/10 px-3 py-1 rounded hover:bg-white/5 transition-colors z-50"
            >
                Skip Intro
            </button>

            {/* STAGE 1: BOOT LOG */}
            <AnimatePresence>
                {stage === 'boot' && (
                    <motion.div 
                        className="w-full max-w-md p-8 text-xs text-green-500/80 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                        {BOOT_LOG.slice(0, logIndex).map((line, i) => (
                            <div key={i} className="mb-1">
                                <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {line}
                            </div>
                        ))}
                        <motion.div 
                            className="w-2 h-4 bg-green-500 mt-2"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STAGE 2: NARRATIVE */}
            <AnimatePresence>
                {stage === 'narrative' && (
                    <div className="relative z-10 text-center px-4">
                        {NARRATIVE_LINES.map((line, index) => (
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ delay: line.delay * 0.5, duration: 1.5 }} // Sped up for UX
                                className={`text-2xl sm:text-4xl md:text-5xl font-light tracking-tight mb-6 ${line.highlight ? 'text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-white/60'}`}
                            >
                                {line.text}
                            </motion.p>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* STAGE 3: LOGO REVEAL */}
            <AnimatePresence>
                {stage === 'logo' && (
                    <motion.div 
                        className="relative z-20 flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, type: "spring", stiffness: 50 }}
                    >
                        {/* Pulse Ring */}
                        <motion.div 
                            className="absolute inset-0 bg-[var(--gold)]/20 rounded-full blur-3xl"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, ease: "easeOut" }}
                        />
                        
                        <div className="flex items-center gap-4 mb-4">
                            <motion.div 
                                className="w-16 h-16 border-2 border-[var(--gold)] rounded-xl flex items-center justify-center bg-black shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                animate={{ rotate: [0, 90, 0] }}
                                transition={{ duration: 2, ease: "anticipate" }}
                            >
                                <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-[var(--gold)]">
                                    <path d="M2 16C2 16 6 6 10 16C14 26 18 6 22 16C26 26 30 16 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </motion.div>
                        </div>

                        <motion.h1 
                            className="text-5xl sm:text-7xl font-black text-white tracking-tighter"
                            initial={{ letterSpacing: "1em", opacity: 0 }}
                            animate={{ letterSpacing: "-0.05em", opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            ECHO<span className="text-[var(--gold)]">MASTERS</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="mt-4 text-[var(--gold)]/60 font-mono text-xs uppercase tracking-[0.5em]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                        >
                            Academy of Ultrasound Physics
                        </motion.p>
                        
                        <motion.div
                            className="mt-8 h-1 w-32 bg-white/10 overflow-hidden rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <motion.div 
                                className="h-full bg-[var(--gold)]"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CinematicIntro;
