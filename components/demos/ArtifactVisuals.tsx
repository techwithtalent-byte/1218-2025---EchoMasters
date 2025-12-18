import React, { useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import ControlButton from './ControlButton';

export const PropagationArtifactsVisual: React.FC = () => {
    const [artifact, setArtifact] = useState<'Reverberation' | 'Mirror'>('Reverberation');
    const [animationKey, setAnimationKey] = useState(0);

    const mirrorPulseStyle: React.CSSProperties = {
        '--reflector-pos': `60%`,
        '--object-pos-y': `40%`,
        '--object-pos-x': `25%`,
        animation: `mirror-path-animation 4s linear forwards`
    } as React.CSSProperties;

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setArtifact('Reverberation')} secondary={artifact !== 'Reverberation'}>Reverberation</ControlButton>
                <ControlButton onClick={() => setArtifact('Mirror')} secondary={artifact !== 'Mirror'}>Mirror Image</ControlButton>
            </div>
            <div className="relative h-80 bg-black rounded-lg overflow-hidden p-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-400 rounded-b-md"></div>
                {artifact === 'Reverberation' && (
                    <>
                        <div className="absolute h-1 w-full bg-white/50 top-[30%]" />
                        <div className="absolute h-1 w-full bg-white/50 top-[60%]" />
                        <div key={animationKey} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-400 rounded-full" style={{ '--reflector1-pos': '30%', '--reflector2-pos': '60%', animation: `reverberation-bounce 3s ease-in-out forwards` }} />
                        <div className="absolute right-4 top-[60%] h-1 w-1/4 bg-red-500 opacity-70" />
                        <div className="absolute right-4 top-[90%] h-1 w-1/4 bg-red-500 opacity-40" />
                    </>
                )}
                {artifact === 'Mirror' && (
                    <>
                        <div className="absolute left-0 right-0 h-2 bg-cyan-400/80 rounded-full top-[60%]" />
                        <div className="absolute w-10 h-10 bg-green-500 rounded-full top-[40%] left-[25%]" />
                        <div className="absolute w-10 h-10 bg-red-500/70 border-2 border-dashed border-red-300 rounded-full top-[80%] left-[25%]" />
                        {animationKey > 0 && <div key={animationKey} className="absolute w-3 h-3 bg-orange-400 rounded-full -translate-x-1/2 -translate-y-1/2" style={mirrorPulseStyle}></div>}
                    </>
                )}
            </div>
             <button onClick={() => setAnimationKey(p => p + 1)} className="text-xs text-center w-full mt-2 text-white/60 hover:text-white">Replay Animation</button>
        </div>
    );
};

export const AttenuationArtifactsVisual: React.FC = () => {
    const [artifact, setArtifact] = useState<'Shadowing' | 'Enhancement'>('Shadowing');

    const visuals = {
        'Shadowing': { objectColor: 'bg-gray-300', effectStyle: { background: 'linear-gradient(to bottom, transparent, #00000099)', height: '50%'} },
        'Enhancement': { objectColor: 'bg-black/50 border-2 border-gray-500', effectStyle: { background: 'linear-gradient(to bottom, transparent, #ffffff44)', height: '50%'} },
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setArtifact('Shadowing')} secondary={artifact !== 'Shadowing'}>Shadowing</ControlButton>
                <ControlButton onClick={() => setArtifact('Enhancement')} secondary={artifact !== 'Enhancement'}>Enhancement</ControlButton>
            </div>
            <div className="relative h-64 bg-gray-600 rounded-lg overflow-hidden flex justify-center items-center">
                <div className={`w-20 h-20 rounded-full ${visuals[artifact].objectColor}`} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20" style={visuals[artifact].effectStyle} />
                 <div className="absolute top-0 bottom-0 w-1 bg-yellow-400/50" style={{ animation: `line-scan 3s linear infinite` }} />
            </div>
        </div>
    );
};