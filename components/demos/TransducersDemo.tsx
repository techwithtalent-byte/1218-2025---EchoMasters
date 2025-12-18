
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';

const PiezoelectricEffectSection: React.FC = () => {
    const [animationState, setAnimationState] = useState<'idle' | 'sending' | 'receiving'>('idle');

    const handleSend = () => {
        if (animationState !== 'idle') return;
        setAnimationState('sending');
        setTimeout(() => setAnimationState('idle'), 2000);
    };

    const handleReceive = () => {
        if (animationState !== 'idle') return;
        setAnimationState('receiving');
        setTimeout(() => setAnimationState('idle'), 2000);
    };

    return (
        <DemoSection
            title="Interactive Piezoelectric Effect Lab"
            description="PZT crystals convert electrical energy to sound (converse effect) and sound back to electricity (direct effect). This is the core principle of any transducer."
        >
            <div className="bg-gray-900 rounded-xl p-8 border border-white/10 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-48">
                    {/* Left side: Voltage */}
                    <div className="flex flex-col items-center justify-center">
                        <AnimatePresence>
                            {animationState === 'sending' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [1, 1, 0], scale: 1.5, x: ['-20%', '80%'] }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className="text-5xl absolute z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                                >⚡</motion.div>
                            )}
                        </AnimatePresence>
                        <ControlButton onClick={handleSend} disabled={animationState !== 'idle'} secondary>Apply Voltage</ControlButton>
                    </div>

                    {/* Center: Crystal */}
                    <div className="flex flex-col items-center justify-center relative">
                         <AnimatePresence>
                            {animationState === 'receiving' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, x: '80%' }}
                                    animate={{ opacity: [1, 1, 0], scale: 1, x: '0%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className="absolute z-20"
                                >
                                    <svg width="40" height="30" viewBox="0 0 30 20"><path d="M0 10 C 5 0, 10 0, 15 10 S 20 20, 25 10 S 30 0, 30 10" stroke="#67e8f9" strokeWidth="2" fill="none" /></svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="relative">
                            {/* Crystal Block */}
                            <motion.div
                                animate={{
                                    scaleX: animationState === 'sending' ? [1, 1.15, 0.85, 1] : 1,
                                    scaleY: animationState === 'sending' ? [1, 0.85, 1.15, 1] : 1,
                                    filter: animationState !== 'idle' ? 'brightness(1.5) drop-shadow(0 0 15px rgba(103,232,249,0.5))' : 'brightness(1)',
                                }}
                                transition={{ duration: 0.4, times: [0, 0.3, 0.7, 1], repeat: animationState === 'sending' ? 2 : 0 }}
                                className="w-32 h-12 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-md border border-gray-400 flex items-center justify-center"
                            >
                                <span className="text-[10px] font-mono text-white/50 tracking-widest">PZT</span>
                            </motion.div>
                            {/* Glow Effect Layer */}
                            {animationState !== 'idle' && (
                                <motion.div 
                                    className="absolute inset-0 bg-cyan-400 rounded-md mix-blend-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.8, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                            )}
                        </div>

                         <AnimatePresence>
                             {animationState === 'sending' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, x: '0%' }}
                                    animate={{ opacity: [1, 1, 0], scale: 1, x: '80%' }}
                                    transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
                                    className="absolute z-20"
                                >
                                    <svg width="40" height="30" viewBox="0 0 30 20"><path d="M0 10 C 5 0, 10 0, 15 10 S 20 20, 25 10 S 30 0, 30 10" stroke="#f97316" strokeWidth="2" fill="none" /></svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right side: Pressure/Voltmeter */}
                    <div className="flex flex-col items-center justify-center">
                         <AnimatePresence>
                             {animationState === 'receiving' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: [1, 1, 0], scale: 1.5, x: ['80%', '-20%'] }}
                                    transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
                                    className="text-5xl absolute z-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                                >⚡</motion.div>
                            )}
                        </AnimatePresence>
                        <ControlButton onClick={handleReceive} disabled={animationState !== 'idle'} secondary>Apply Pressure</ControlButton>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const DampingResolutionSection: React.FC = () => {
    const [damping, setDamping] = useState(70); // 0-100

    const { pulseCycles, sensitivity, isResolved } = useMemo(() => {
        const cycles = Math.max(2, 8 - (damping / 100) * 6);
        const sens = 100 - damping * 0.5;
        const spl = cycles * 0.3; // simplified
        const axialRes = spl / 2;
        return {
            pulseCycles: cycles,
            sensitivity: sens,
            isResolved: axialRes < 0.8
        };
    }, [damping]);

    return (
        <DemoSection
            title="Damping & Axial Resolution"
            description="The backing material shortens the pulse (improving axial resolution) but decreases sensitivity. It's a critical trade-off."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Transducer and B-Mode */}
                <div className="space-y-4">
                    <div className="h-40 bg-gray-900 rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-white/10">
                         {/* Backing Material */}
                         <div className="h-24 w-12 bg-gray-700 rounded-l-md border-r border-black relative" style={{ opacity: 0.4 + damping/160 }}>
                             <div className="absolute inset-0 flex items-center justify-center -rotate-90 text-[10px] text-white/30 font-bold uppercase tracking-wider">Backing</div>
                         </div>
                         {/* Crystal */}
                         <div className="h-24 w-4 bg-gradient-to-r from-cyan-600 to-cyan-400 border-x border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
                         {/* Matching Layer */}
                         <div className="h-24 w-2 bg-gray-400 rounded-r-md"></div>
                         
                         <AnimatePresence>
                             <motion.div
                                key={pulseCycles}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 180, opacity: [1, 1, 0] }}
                                transition={{ duration: 1.5, ease: 'linear', repeat: Infinity, repeatDelay: 0.5 }}
                                className="absolute ml-8"
                            >
                                <svg height="40" viewBox={`0 0 ${pulseCycles * 10} 40`}>
                                     <path d={`M0 20 C ${pulseCycles*2.5} 0, ${pulseCycles*7.5} 0, ${pulseCycles*10} 20`} stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
                                     <path d={`M0 20 C ${pulseCycles*2.5} 40, ${pulseCycles*7.5} 40, ${pulseCycles*10} 20`} stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                             </motion.div>
                         </AnimatePresence>
                    </div>
                    <div className="h-32 bg-black rounded-xl p-4 relative flex items-center justify-center border border-white/20">
                        <p className="absolute top-2 left-2 text-xs font-bold text-white/50">B-Mode Result</p>
                        <div className="flex items-center gap-2 transition-all duration-300" style={{ filter: `blur(${isResolved ? 0 : 3}px)` }}>
                            <div className="w-1.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full" />
                            <div className="w-1.5 h-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Controls and readouts */}
                <div className="space-y-6">
                     <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <label className="block text-white/80 mb-3 text-sm font-bold">Damping Level</label>
                        <input type="range" min="0" max="100" value={damping} onChange={e => setDamping(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                        <div className="flex justify-between text-xs text-white/40 mt-2">
                            <span>Light (High Q)</span>
                            <span>Heavy (Low Q)</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl text-center border transition-colors duration-300 ${isResolved ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                            <p className="text-xs text-white/70 uppercase tracking-widest mb-1">Axial Res</p>
                            <p className={`text-lg font-bold ${isResolved ? 'text-green-400' : 'text-red-400'}`}>{isResolved ? 'Resolved' : 'Unresolved'}</p>
                        </div>
                        <div className="p-4 rounded-xl text-center bg-white/5 border border-white/10">
                            <p className="text-xs text-white/70 uppercase tracking-widest mb-1">Sensitivity</p>
                            <p className="text-lg font-bold text-white">{sensitivity.toFixed(0)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const FrequencySelectionSection: React.FC = () => {
    const [frequency, setFrequency] = useState(7); // MHz

    const { penetration, resolutionBlur } = useMemo(() => {
        const pen = 100 - (frequency - 2) * 6;
        const blur = Math.max(0, 3 - (frequency/15 * 3));
        return { penetration: pen, resolutionBlur: blur };
    }, [frequency]);

    return (
        <DemoSection
            title="Frequency vs. Resolution & Penetration"
            description="The eternal trade-off in ultrasound: higher frequency gives better resolution but lower penetration."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-900 rounded-xl relative overflow-hidden p-4 border border-white/10 shadow-inner">
                    {/* Beam Visualization */}
                    <div className="absolute top-0 w-32 h-full left-1/2 -translate-x-1/2 origin-top" style={{ transform: `scaleY(${penetration/100})`, transition: 'transform 0.3s' }}>
                        <div className="w-full h-full bg-gradient-to-b from-yellow-400/60 to-transparent blur-sm" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}/>
                    </div>
                    {/* Inset B-Mode Zoom */}
                    <div className="absolute top-4 right-4 w-24 h-24 bg-black rounded-lg border border-white/20 p-2 flex items-center justify-center shadow-lg">
                         <div className="flex items-center gap-1.5 transition-all duration-300" style={{ filter: `blur(${resolutionBlur}px)` }}>
                            <div className="w-1 h-6 bg-white rounded-full" />
                            <div className="w-1 h-6 bg-white rounded-full" />
                        </div>
                        <span className="absolute bottom-1 right-2 text-[8px] text-white/40">ZOOM</span>
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-xs text-white/70">Penetration Depth</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <label className="block text-white/80 mb-2 font-bold text-sm">Transducer Frequency</label>
                        <input type="range" min="2" max="15" step="1" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-xs text-white/40">2 MHz (Penetration)</span>
                            <span className="text-xl font-mono text-yellow-400 font-bold">{frequency} MHz</span>
                            <span className="text-xs text-white/40">15 MHz (Detail)</span>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const TransducersDemo: React.FC = () => {
  return (
    <div className="space-y-12">
      <PiezoelectricEffectSection />
      <DampingResolutionSection />
      <FrequencySelectionSection />
      <KnowledgeCheck
        moduleId="transducers"
        question="Which component of the transducer is primarily responsible for improving axial resolution by shortening the pulse?"
        options={["Matching layer", "Piezoelectric crystal", "Backing material", "Acoustic lens"]}
        correctAnswer="Backing material"
        explanation="The backing (or damping) material absorbs the backward vibrations of the crystal, shortening the spatial pulse length (SPL). Better axial resolution is a direct result of a shorter SPL."
      />
    </div>
  );
};

export default TransducersDemo;
