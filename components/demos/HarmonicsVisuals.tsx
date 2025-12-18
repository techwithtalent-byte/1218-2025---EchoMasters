
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlButton from './ControlButton';

export const NonLinearPropagationVisual: React.FC = () => {
    const [mi, setMi] = useState(0.4);

    const { wavePath, harmonicAmplitude } = useMemo(() => {
        const distortion = (mi - 0.2) / 1.6;
        let path = "M 0 50";
        const amplitude = 40;
        const sections = 4;
        const sectionWidth = 400 / sections;
        for (let i = 0; i < sections; i++) {
            const startX = i * sectionWidth;
            const peakSkew = distortion * (sectionWidth / 4);
            path += ` C ${startX + sectionWidth / 4 + peakSkew} ${50 - amplitude}, ${startX + sectionWidth / 4 + peakSkew} ${50 - amplitude}, ${startX + sectionWidth / 2} 50`;
            path += ` C ${startX + sectionWidth * 3/4 - peakSkew} ${50 + amplitude}, ${startX + sectionWidth * 3/4 - peakSkew} ${50 + amplitude}, ${startX + sectionWidth} 50`;
        }
        return { wavePath: path, harmonicAmplitude: Math.max(0, distortion * 80) };
    }, [mi]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="h-48 bg-black rounded-lg overflow-hidden relative">
                    <svg width="200%" height="100%" className="absolute top-0 left-0" style={{ animation: `pressure-wave-sync 4s linear infinite` }}>
                        <path d={wavePath} stroke="#f97316" strokeWidth="3" fill="none" style={{ transition: 'd 0.3s ease-in-out' }} />
                    </svg>
                </div>
                 <div className="h-48 bg-black/50 rounded-lg p-2 flex flex-col justify-end">
                    <div className="w-full h-full flex items-end justify-center gap-12 border-b-2 border-gray-600">
                        <div className="flex flex-col items-center"><div className="w-8 bg-cyan-400 h-[80px]"></div><p className="text-xs mt-1 text-cyan-300">f₀</p></div>
                        <div className="flex flex-col items-center"><div className="w-8 bg-orange-500 transition-all" style={{ height: `${harmonicAmplitude}px` }}></div><p className="text-xs mt-1 text-orange-400">2f₀</p></div>
                    </div>
                </div>
            </div>
             <div className="mt-4">
                <label className="block text-white/80 mb-2">Acoustic Power (MI): {mi.toFixed(1)}</label>
                <input type="range" min="0.2" max="1.8" step="0.1" value={mi} onChange={e => setMi(Number(e.target.value))} className="w-full accent-yellow-400" />
            </div>
        </div>
    );
};

export const HarmonicImagingVisual: React.FC = () => {
    const [mode, setMode] = useState<'Fundamental' | 'Harmonic'>('Fundamental');
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setMode('Fundamental')} secondary={mode !== 'Fundamental'}>Fundamental</ControlButton>
                <ControlButton onClick={() => setMode('Harmonic')} secondary={mode !== 'Harmonic'}>Harmonic (THI)</ControlButton>
            </div>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden border border-white/10 group">
                {/* Background Noise/Texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}></div>

                {/* Structure 1: Cyst (Left) */}
                <div className={`absolute w-20 h-20 rounded-full border-2 top-1/3 left-1/4 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden ${mode === 'Harmonic' ? 'border-white bg-black shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-gray-500 bg-gray-900'}`}>
                     {/* Internal noise in fundamental mode (clutter) */}
                     <div className={`absolute inset-0 bg-gray-600/30 transition-opacity duration-500 ${mode === 'Fundamental' ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '2px 2px' }}></div>
                </div>
                <p className={`absolute top-[55%] left-[25%] -translate-x-1/2 text-[10px] font-mono transition-colors duration-500 ${mode === 'Harmonic' ? 'text-white' : 'text-gray-600'}`}>Cyst</p>

                {/* Structure 2: Solid Mass (Right) */}
                <div className={`absolute w-24 h-16 rounded-lg top-1/2 left-3/4 transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 ${mode === 'Harmonic' ? 'bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-gray-600'}`} />
                <p className={`absolute top-[65%] left-[75%] -translate-x-1/2 text-[10px] font-mono transition-colors duration-500 ${mode === 'Harmonic' ? 'text-white' : 'text-gray-600'}`}>Mass</p>

                {/* Near-field Clutter Layer (Fundamental Only) */}
                <div className={`absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-[2px] transition-opacity duration-700 pointer-events-none z-10 ${mode === 'Fundamental' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-2 left-2 bg-red-500/80 text-white text-[10px] font-bold px-2 py-1 rounded">NEAR-FIELD CLUTTER</div>
                </div>

                {/* Dynamic Overlays for Harmonic Mode */}
                <AnimatePresence>
                    {mode === 'Harmonic' && (
                        <>
                            {/* Scanning Clean Effect */}
                            <motion.div 
                                initial={{ top: 0, opacity: 0.5 }}
                                animate={{ top: '100%', opacity: 0 }}
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                                className="absolute left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_20px_5px_rgba(34,211,238,0.3)] z-20 pointer-events-none"
                            />
                            
                            {/* Signal Improvement Indicator */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-4 right-4 bg-black/60 border border-cyan-400/50 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm z-30"
                            >
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                Signal-to-Noise: HIGH
                            </motion.div>

                             {/* Suppression Label */}
                             <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 left-4 bg-black/60 border border-white/20 text-white/70 px-3 py-1.5 rounded-lg text-xs font-mono backdrop-blur-sm z-30"
                            >
                                Fundamental Freq: Filtered
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const ElastographyVisual: React.FC = () => (
    <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
        <h4 className="text-sm font-bold text-white mb-2">Elastography Concept</h4>
        <div className="h-24 bg-gradient-to-r from-blue-900 to-green-900 rounded relative overflow-hidden flex items-center justify-center border border-white/10">
             <div className="w-12 h-12 rounded-full bg-blue-500/50 border-2 border-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">Hard</div>
             <div className="ml-8 text-xs text-white/70 font-mono">
                 <span className="text-blue-300">Blue = Stiff</span><br/>
                 <span className="text-green-300">Green = Soft</span>
             </div>
        </div>
    </div>
);

export const ThreeDVisual: React.FC = () => (
    <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
        <h4 className="text-sm font-bold text-white mb-2">3D Volume Rendering</h4>
        <div className="h-32 bg-black rounded relative overflow-hidden flex items-center justify-center perspective-[500px] border border-white/10">
             <div className="w-16 h-16 bg-orange-500/20 border border-orange-400 rounded rotate-y-12 rotate-x-12 transform-style-3d shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center">
                 <div className="text-[10px] text-orange-200 font-mono text-center">Voxel<br/>Volume</div>
             </div>
        </div>
    </div>
);
