
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, BrainIcon, TargetIcon, TrophyIcon } from '../Icons';

type Phase = 'chaos' | 'scanning' | 'aligning' | 'mastery';

// Generate static nodes but we will animate their positions
const NODE_COUNT = 25;
const NODES = Array.from({ length: NODE_COUNT }).map((_, i) => ({
    id: i,
    // Base random positions
    baseX: Math.random() * 90 + 5, 
    baseY: Math.random() * 80 + 10,
    // Types: 'weakness' (needs focus), 'noise' (already known/irrelevant), 'strength' (core skills)
    type: Math.random() > 0.6 ? 'weakness' : Math.random() > 0.3 ? 'noise' : 'strength',
    // Random drift offsets
    driftDuration: Math.random() * 3 + 2,
    driftX: Math.random() * 10 - 5,
    driftY: Math.random() * 10 - 5,
}));

const AIStudyPathAnimation: React.FC = () => {
    const [phase, setPhase] = useState<Phase>('chaos');

    useEffect(() => {
        const cycle = async () => {
            while (true) {
                setPhase('chaos');
                await new Promise(r => setTimeout(r, 3500));
                setPhase('scanning');
                await new Promise(r => setTimeout(r, 2500));
                setPhase('aligning');
                await new Promise(r => setTimeout(r, 2000));
                setPhase('mastery');
                await new Promise(r => setTimeout(r, 4500));
            }
        };
        cycle();
    }, []);

    const getStatusText = () => {
        switch (phase) {
            case 'chaos': return "Analyzing Knowledge Base...";
            case 'scanning': return "Detecting Proficiency Gaps...";
            case 'aligning': return "Optimizing Learning Vector...";
            case 'mastery': return "Path to Mastery Calibrated.";
        }
    };

    const getStatusColor = () => {
        switch (phase) {
            case 'chaos': return "text-white/50";
            case 'scanning': return "text-cyan-400";
            case 'aligning': return "text-[var(--gold)]";
            case 'mastery': return "text-green-400";
        }
    };

    return (
        <div className="relative w-full h-72 bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />
            
            {/* Status Indicator */}
            <div className="absolute top-4 left-0 right-0 text-center z-20">
                <motion.div 
                    key={phase}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-white/5 backdrop-blur-md text-xs font-mono font-bold tracking-widest uppercase ${getStatusColor()}`}
                >
                    {phase === 'chaos' && <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />}
                    {phase === 'scanning' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                    {phase === 'aligning' && <BrainIcon className="w-3.5 h-3.5 animate-bounce" />}
                    {phase === 'mastery' && <TrophyIcon className="w-3.5 h-3.5 text-green-400" />}
                    {getStatusText()}
                </motion.div>
            </div>

            {/* Animation Container */}
            <div className="relative w-[85%] h-40 mt-8">
                <AnimatePresence>
                    {NODES.map((node, i) => {
                        // Logic for positions based on phase
                        let x = node.baseX + '%';
                        let y = node.baseY + '%';
                        let opacity = 1;
                        let scale = 1;
                        let color = 'bg-white/10'; // Default gray
                        let border = 'border-white/20';
                        let shadow = 'shadow-none';

                        if (node.type === 'weakness') {
                            color = 'bg-red-500/20';
                            border = 'border-red-500/50';
                        } else if (node.type === 'strength') {
                            color = 'bg-[var(--gold)]/20';
                            border = 'border-[var(--gold)]/50';
                        }

                        // PHASE: CHAOS (Drifting)
                        const isDrifting = phase === 'chaos';

                        // PHASE: SCANNING
                        if (phase === 'scanning') {
                            if (node.type === 'noise') opacity = 0.1;
                            if (node.type === 'weakness') {
                                color = 'bg-red-500/40';
                                border = 'border-red-400';
                                shadow = 'shadow-[0_0_15px_rgba(248,113,113,0.3)]';
                            }
                        }

                        // PHASE: ALIGNING & MASTERY
                        if (phase === 'aligning' || phase === 'mastery') {
                            if (node.type === 'noise') {
                                opacity = 0; // Hide noise completely
                                scale = 0;
                            } else {
                                // Align useful nodes into a line
                                // Filter out noise to calculate index in the line
                                const relevantNodes = NODES.filter(n => n.type !== 'noise');
                                const index = relevantNodes.findIndex(n => n.id === node.id);
                                const total = relevantNodes.length;
                                
                                x = `${(index / (total - 1)) * 100}%`;
                                y = '50%';
                                
                                if (phase === 'mastery') {
                                    // Turn everything green/gold in mastery
                                    color = 'bg-green-500';
                                    border = 'border-green-300';
                                    shadow = 'shadow-[0_0_15px_rgba(34,197,94,0.6)]';
                                    // Add a slight wave effect
                                    y = `calc(50% + ${Math.sin(index * 0.5 + Date.now()/800) * 8}px)`; 
                                } else {
                                    color = 'bg-[var(--gold)]';
                                    border = 'border-[var(--gold)]';
                                    shadow = 'shadow-[0_0_10px_var(--gold)]';
                                }
                            }
                        }

                        return (
                            <motion.div
                                key={node.id}
                                layout // Magic prop for smooth layout transitions
                                initial={{ x: node.baseX + '%', y: node.baseY + '%' }}
                                animate={{ 
                                    x: isDrifting ? [node.baseX + '%', (node.baseX + node.driftX) + '%', node.baseX + '%'] : x,
                                    y: isDrifting ? [node.baseY + '%', (node.baseY + node.driftY) + '%', node.baseY + '%'] : y,
                                    opacity, 
                                    scale,
                                    backgroundColor: phase === 'mastery' ? '#22c55e' : undefined
                                }}
                                transition={{ 
                                    x: isDrifting ? { duration: node.driftDuration, repeat: Infinity, ease: "easeInOut" } : { type: 'spring', stiffness: 60, damping: 20 },
                                    y: isDrifting ? { duration: node.driftDuration * 1.2, repeat: Infinity, ease: "easeInOut" } : { type: 'spring', stiffness: 60, damping: 20 },
                                    default: { duration: 0.5 },
                                    delay: phase === 'aligning' ? i * 0.03 : 0 
                                }}
                                className={`absolute w-3 h-3 rounded-full border ${color} ${border} ${shadow}`}
                            >
                                {phase === 'scanning' && node.type === 'weakness' && (
                                    <motion.div 
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{ scale: 2.5, opacity: [0, 0.8, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 rounded-full border border-red-500"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Scan Line (Only during scanning) */}
                {phase === 'scanning' && (
                    <motion.div
                        initial={{ left: '-5%' }}
                        animate={{ left: '105%' }}
                        transition={{ duration: 2, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent z-10 blur-sm"
                    >
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
                    </motion.div>
                )}

                {/* Connecting Path Line (Aligning/Mastery) */}
                {(phase === 'aligning' || phase === 'mastery') && (
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 0.5 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 origin-left ${phase === 'mastery' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-[var(--gold)] shadow-[0_0_10px_var(--gold)]'}`}
                    />
                )}
                
                {/* Mastery Sparkle */}
                {phase === 'mastery' && (
                    <motion.div 
                        initial={{ offsetDistance: '0%' }}
                        animate={{ offsetDistance: '100%' }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                        className="absolute w-24 h-24 bg-white/10 blur-xl rounded-full z-0"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                         <SparklesIcon className="w-full h-full text-white animate-spin-slow opacity-50" />
                    </motion.div>
                )}
            </div>
            
            {/* CTA Overlay (visible only at end of loop) */}
            <AnimatePresence>
                {phase === 'mastery' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-6"
                    >
                        <div className="bg-green-500/10 text-green-300 px-5 py-2 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <TargetIcon className="w-4 h-4" />
                            Study Efficiency Optimized
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIStudyPathAnimation;
