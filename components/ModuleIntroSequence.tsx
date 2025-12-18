
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoId } from '../types';
import { getModuleIntro } from '../data/moduleIntros';
import { useSound } from '../contexts/SoundContext';

interface ModuleIntroSequenceProps {
    moduleId: DemoId;
    onComplete: () => void;
}

const ModuleIntroSequence: React.FC<ModuleIntroSequenceProps> = ({ moduleId, onComplete }) => {
    const introData = getModuleIntro(moduleId);
    const [lineIndex, setLineIndex] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isFinished, setIsFinished] = useState(false);
    const { playTypewriter, playScan, playClick } = useSound();

    useEffect(() => {
        // Start with a scan sound
        playScan();
        // Initial typewriter sound for first line
        playTypewriter();
        
        let timeoutId: any;
        let currentIndex = 0;

        const runSequence = () => {
            // Get current line text to calculate read time
            const currentLineText = introData.lines[currentIndex];
            // Calculate dynamic duration: Faster timing
            // Base 1.5s + 30ms per character
            const duration = Math.max(1500, 1000 + (currentLineText?.length || 0) * 30);

            timeoutId = setTimeout(() => {
                currentIndex++;
                if (currentIndex < introData.lines.length) {
                    setLineIndex(currentIndex);
                    playTypewriter();
                    runSequence();
                } else {
                    setIsFinished(true);
                    // Slight pause before finishing
                    timeoutId = setTimeout(onComplete, 800); 
                }
            }, duration);
        };

        runSequence();

        return () => clearTimeout(timeoutId);
    }, [moduleId, onComplete, introData, playTypewriter, playScan]);

    const handleSkip = () => {
        playClick();
        onComplete();
    };

    return (
        <motion.div 
            className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Tech Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none" />
            
            {/* Moving Scan Line */}
            <motion.div 
                className="absolute top-0 w-full h-1 bg-[var(--gold)]/30 shadow-[0_0_20px_var(--gold)] blur-sm"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <button 
                onClick={handleSkip}
                className="absolute top-8 right-8 text-[10px] text-white/30 hover:text-[var(--gold)] uppercase tracking-widest border border-white/10 px-3 py-1 rounded hover:bg-white/5 transition-colors z-50"
            >
                Skip Intro
            </button>

            <div className="relative z-10 max-w-2xl px-8 w-full text-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-[10px] font-mono text-[var(--gold)] uppercase tracking-[0.5em] mb-2">
                        {introData.subtext}
                    </h2>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                        {introData.title}
                    </h1>
                </motion.div>

                {/* Narrative Lines */}
                <div className="h-32 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={lineIndex}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.5 }}
                            className="text-xl sm:text-2xl text-white/80 font-light leading-relaxed"
                        >
                            "{introData.lines[lineIndex]}"
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress Loader */}
                <div className="mt-12 w-64 mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-[var(--gold)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ 
                            duration: introData.lines.reduce((acc, line) => acc + Math.max(1.5, 1.0 + line.length * 0.03), 0) + 0.8, 
                            ease: "linear" 
                        }}
                    />
                </div>
                <p className="mt-2 text-[9px] font-mono text-white/30 animate-pulse">
                    LOADING SIMULATION ASSETS...
                </p>
            </div>
        </motion.div>
    );
};

export default ModuleIntroSequence;
