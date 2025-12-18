import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ControlButton from './ControlButton';

export const ReceiverFunctionsVisual: React.FC = () => {
    const functions = ['Gain', 'TGC', 'Compression', 'Demodulation', 'Reject'];
    const [activeFunction, setActiveFunction] = useState('Gain');

    const info = {
        'Gain': 'Overall amplification of all returning echoes. Like turning up the volume.',
        'TGC': 'Depth-specific amplification to compensate for attenuation. Makes deeper structures brighter.',
        'Compression': 'Reduces the dynamic range of signals to fit the display. Affects contrast.',
        'Demodulation': 'Rectification and smoothing. Converts the radiofrequency signal into a video signal.',
        'Reject': 'Eliminates very low-level signals, cleaning up noise from the image.',
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {functions.map(fn => <button key={fn} onClick={() => setActiveFunction(fn)} className={`px-3 py-1 text-xs rounded-full ${activeFunction === fn ? 'bg-yellow-400 text-black font-bold' : 'bg-white/10 text-white/80'}`}>{fn}</button>)}
            </div>
            <div className="flex items-center justify-between text-white/70 font-bold text-sm">
                <span>Signal In</span>
                <span>Signal Out</span>
            </div>
            <div className="flex items-center justify-between bg-black/30 rounded-full p-1">
                {functions.map((fn, index) => (
                    <React.Fragment key={fn}>
                        <motion.div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${activeFunction === fn ? 'bg-yellow-400 text-black ring-2 ring-white' : 'bg-gray-600 text-white'}`}
                            animate={{ scale: activeFunction === fn ? 1.1 : 1 }}
                        >
                            {fn}
                        </motion.div>
                        {index < functions.length - 1 && <div className="flex-grow h-0.5 bg-gray-500 mx-1" />}
                    </React.Fragment>
                ))}
            </div>
            <div className="mt-4 p-3 bg-black/40 rounded-lg text-center text-sm text-yellow-300 min-h-[3rem]">
                {info[activeFunction as keyof typeof info]}
            </div>
        </div>
    );
};


export const DisplayModesVisual: React.FC = () => {
    const [mode, setMode] = useState<'B-Mode' | 'A-Mode' | 'M-Mode'>('B-Mode');

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setMode('B-Mode')} secondary={mode !== 'B-Mode'}>B-Mode</ControlButton>
                <ControlButton onClick={() => setMode('A-Mode')} secondary={mode !== 'A-Mode'}>A-Mode</ControlButton>
                <ControlButton onClick={() => setMode('M-Mode')} secondary={mode !== 'M-Mode'}>M-Mode</ControlButton>
            </div>
            <div className="relative h-64 bg-black rounded-lg">
                {/* B-Mode Base */}
                <div className={`absolute inset-0 flex flex-col justify-around items-center p-4 transition-opacity duration-300 ${mode !== 'A-Mode' ? 'opacity-30' : 'opacity-10'}`}>
                    <div className="w-2/3 h-2 bg-gray-400 rounded-full" />
                    <div className="w-1/2 h-2 bg-gray-500 rounded-full" />
                    <div className="w-3/4 h-2 bg-gray-300 rounded-full" />
                </div>

                {mode === 'B-Mode' && <p className="text-center p-8 text-white">Brightness of dots corresponds to echo amplitude.</p>}
                
                {mode === 'A-Mode' && (
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <line x1="5" y1="80" x2="95" y2="80" stroke="#444" strokeWidth="1" />
                        <path d="M 5 80 L 25 80 L 25 40 L 30 80 L 50 80 L 50 50 L 55 80 L 80 80 L 80 20 L 85 80 L 95 80" stroke="#facc15" strokeWidth="2" fill="none" />
                        <text x="50" y="10" textAnchor="middle" fill="white" fontSize="6">Amplitude Mode</text>
                    </svg>
                )}

                {mode === 'M-Mode' && (
                    <svg width="200%" height="100%" viewBox="0 0 200 100" className="absolute" style={{ animation: `m-mode-trace-draw 2s linear infinite` }}>
                        <path d="M 0 40 C 25 20, 75 20, 100 40 S 175 60, 200 40" stroke="#67e8f9" strokeWidth="1.5" fill="none" />
                        <path d="M 0 50 C 25 60, 75 60, 100 50 S 175 40, 200 50" stroke="#a5f3fc" strokeWidth="1" fill="none" />
                        <path d="M 0 80 C 25 75, 75 75, 100 80 S 175 85, 200 80" stroke="#fff" strokeWidth="2" fill="none" />
                         <text x="100" y="10" textAnchor="middle" fill="white" fontSize="6">Motion Mode</text>
                    </svg>
                )}
            </div>
        </div>
    );
};