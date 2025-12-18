import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ControlButton from './ControlButton';

export const AxialResolutionVisual: React.FC = () => {
    const [frequency, setFrequency] = useState(5); // MHz
    const SPEED_OF_SOUND = 1.54; // mm/µs
    const CYCLES_IN_PULSE = 3;

    const { spl_mm, axialResolution_mm } = useMemo(() => {
        const lambda = SPEED_OF_SOUND / frequency;
        const spl = CYCLES_IN_PULSE * lambda;
        return { spl_mm: spl, axialResolution_mm: spl / 2 };
    }, [frequency]);

    const areTargetsResolved = axialResolution_mm < 0.8;

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="h-40 bg-black/80 rounded-xl relative flex items-center justify-center p-4">
                    <p className="absolute top-2 left-2 text-xs text-white/60">A-Mode Display</p>
                    <svg viewBox="0 0 140 100" className="w-48 h-24 overflow-visible">
                        <path d="M 0 80 L 140 80" stroke="#444" strokeWidth="1.5" />
                        <path d="M 0 80 L 40 80 L 50 30 L 60 80 L 80 80 L 90 30 L 100 80 L 140 80" stroke="#fef08a" strokeWidth="2" fill="none" style={{ opacity: areTargetsResolved ? 1 : 0, transition: 'opacity 0.3s' }}/>
                        <path d="M 0 80 L 40 80 C 50 10, 80 10, 90 80 L 140 80" stroke="#fef08a" strokeWidth="2" fill="none" style={{ opacity: areTargetsResolved ? 0 : 1, transition: 'opacity 0.3s' }}/>
                    </svg>
                </div>
                <div className="flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Frequency</label>
                    <input type="range" min="2" max="15" step="0.5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{frequency.toFixed(1)} MHz</div>
                </div>
            </div>
            <div className="mt-4 bg-black/30 p-2 rounded-lg text-center">
                <p className="text-sm text-white/70">Axial Resolution = SPL / 2 = <span className="font-bold text-white text-lg">{axialResolution_mm.toFixed(2)} mm</span></p>
            </div>
        </div>
    );
};

export const LateralResolutionVisual: React.FC = () => {
    const [focusPos, setFocusPos] = useState(50); // % depth
    
    const beamPath = `M 40 0 L ${50 - 20 * (1 - focusPos / 100)} ${focusPos}, 60 0 L ${50 + 20 * (1 - focusPos / 100)} ${focusPos}, 40 0 M 60 0 L ${50 + 20 * (1 - focusPos / 100)} ${focusPos}, ${50 + 40 * (focusPos / 100)} 100, ${50 - 40 * (focusPos / 100)} 100, ${50 - 20 * (1 - focusPos / 100)} ${focusPos}, 40 0`;
    
    const TargetPair: React.FC<{depth: number}> = ({ depth }) => {
        const beamWidthAtDepth = 40 * (1 - Math.abs(focusPos - depth) / 100);
        const isResolved = beamWidthAtDepth < 15;
        const blur = isResolved ? 0 : 2;
        return <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: `${depth}%`, filter: `blur(${blur}px)`, transition: 'filter 0.3s'}}><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /></div>;
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
                 <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d={beamPath} fill="rgba(249, 115, 22, 0.2)" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1" />
                </svg>
                <TargetPair depth={25} /><TargetPair depth={50} /><TargetPair depth={75} />
            </div>
            <div className="mt-4">
                 <label className="block text-white/80 mb-2">Focal Position: {focusPos}%</label>
                 <input type="range" min="10" max="90" value={focusPos} onChange={e => setFocusPos(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
            </div>
        </div>
    );
};