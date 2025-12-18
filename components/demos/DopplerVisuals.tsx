import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ControlButton from './ControlButton';

export const DopplerPrincipleVisual: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="h-48 relative overflow-hidden flex items-center justify-center">
                {/* Transducer (Observer) */}
                <div className="absolute top-4 left-4 w-20 h-5 bg-yellow-400 rounded-md" />

                {/* Waves */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 rounded-full border-2 border-cyan-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                            scale: [0.5, 8],
                            opacity: [1, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: i * 0.4,
                            ease: "linear",
                        }}
                    />
                ))}

                {/* Blood Cell (Moving Source) */}
                <motion.div
                    className="absolute w-6 h-6 bg-red-500 rounded-full"
                    style={{ top: '50%', y: '-50%' }}
                    animate={{ x: [-120, 120] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 4,
                        ease: 'easeInOut'
                    }}
                />

                <div className="absolute top-2 right-2 text-xs text-white/70">
                    <p className="text-red-400">Higher Frequency (Towards)</p>
                    <p className="text-blue-400">Lower Frequency (Away)</p>
                </div>
            </div>
        </div>
    );
};

export const DopplerModesVisual: React.FC = () => {
    const [mode, setMode] = useState<'CW' | 'PW' | 'Color' | 'Power'>('PW');

    const visuals = {
        'CW': { info: 'Two crystals: one sends, one receives continuously. No aliasing, but no depth info (range ambiguity).', el: <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-cyan-400/30 animate-[cw-beam-shimmer_2s_ease-in-out_infinite]"></div> },
        'PW': { info: 'One crystal sends short pulses and listens at a specific depth (sample gate). Has depth info, but can alias.', el: <><div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-cyan-400/10"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 animate-[pw-pulse-travel_2s_linear_infinite]"></div></div><div className="absolute w-16 h-3 left-1/2 -translate-x-1/2 border-y-2 border-yellow-400 top-1/2"></div></> },
        'Color': { info: 'Shows 2D flow direction (BART) and mean velocity. Subject to aliasing.', el: <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white/50 bg-gradient-to-b from-red-500/50 via-transparent to-blue-500/50 animate-[color-doppler-flow_1s_linear_infinite]"></div> },
        'Power': { info: 'Highly sensitive to slow flow. Shows presence of flow only (no direction/velocity).', el: <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white/50 bg-orange-500/50 animate-[power-doppler-flow_2s_ease-in-out_infinite]"></div> },
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <ControlButton onClick={() => setMode('CW')} secondary={mode !== 'CW'}>CW</ControlButton>
                <ControlButton onClick={() => setMode('PW')} secondary={mode !== 'PW'}>PW</ControlButton>
                <ControlButton onClick={() => setMode('Color')} secondary={mode !== 'Color'}>Color</ControlButton>
                <ControlButton onClick={() => setMode('Power')} secondary={mode !== 'Power'}>Power</ControlButton>
            </div>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
                <div className="absolute w-full h-10 bg-red-900/50 top-1/2 -translate-y-1/2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-red-400 rounded-full" style={{ top: `${Math.random() * 80 + 10}%`, animation: `pw-doppler-flow 4s linear infinite`, animationDelay: `${Math.random() * 2}s`}} />
                    ))}
                </div>
                {visuals[mode].el}
            </div>
            <div className="mt-4 p-3 bg-black/40 rounded-lg text-center text-sm text-yellow-300 min-h-[3rem]">
                {visuals[mode].info}
            </div>
        </div>
    );
};

export const AliasingCorrectionVisual: React.FC = () => (
    <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
        <h4 className="text-sm font-bold text-white mb-2">Aliasing Correction</h4>
        <div className="h-24 bg-black rounded relative overflow-hidden flex items-center justify-center border border-white/10">
             <svg width="100%" height="100%" viewBox="0 0 200 100">
                <path d="M 0 50 L 20 50 L 30 10 M 35 90 L 40 50 L 60 50" stroke="#facc15" strokeWidth="2" fill="none"/>
                <line x1="0" y1="50" x2="200" y2="50" stroke="#555" strokeDasharray="4"/>
             </svg>
             <p className="absolute bottom-1 right-2 text-xs text-white/50">Nyquist Limit Exceeded</p>
        </div>
        <p className="text-xs text-white/70 mt-2 text-center">Wrap-around occurs when Shift &gt; PRF/2</p>
    </div>
);

export const SpectralWaveformVisual: React.FC = () => (
    <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
        <h4 className="text-sm font-bold text-white mb-2">Spectral Waveform Analysis</h4>
        <div className="h-24 bg-black rounded relative overflow-hidden border border-white/10">
             <svg width="100%" height="100%" viewBox="0 0 200 100">
                <path d="M 0 80 L 20 80 L 30 20 L 40 70 L 50 80 L 70 80" stroke="#fff" strokeWidth="2" fill="none"/>
                <rect x="30" y="20" width="10" height="60" fill="white" fillOpacity="0.1"/>
             </svg>
             <p className="absolute top-1 right-2 text-xs text-white/50">Velocity (Y) vs Time (X)</p>
        </div>
    </div>
);

export const TissueDopplerVisual: React.FC = () => (
    <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
        <h4 className="text-sm font-bold text-white mb-2">Tissue Doppler Imaging (TDI)</h4>
        <div className="h-24 bg-black rounded relative overflow-hidden flex items-center justify-center border border-white/10">
             <div className="text-center">
                 <p className="text-xs text-red-400 font-bold mb-1">High Amplitude / Low Velocity</p>
                 <div className="w-full h-1 bg-red-500/50 mb-1"></div>
                 <p className="text-[10px] text-white/50">(Wall Motion Signal)</p>
             </div>
        </div>
    </div>
);
