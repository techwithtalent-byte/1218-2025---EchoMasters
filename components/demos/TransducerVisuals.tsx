import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlButton from './ControlButton';

export const TransducerAnatomyVisual: React.FC = () => {
    const [animationState, setAnimationState] = useState<'idle' | 'sending' | 'receiving'>('idle');

    const handleSend = () => {
        if (animationState !== 'idle') return;
        setAnimationState('sending');
        setTimeout(() => setAnimationState('idle'), 1500);
    };

    const handleReceive = () => {
        if (animationState !== 'idle') return;
        setAnimationState('receiving');
        setTimeout(() => setAnimationState('idle'), 1500);
    };
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="h-48 flex items-center justify-around">
                {/* Voltage */}
                <div className="w-24 text-center">
                    <AnimatePresence>
                        {animationState === 'sending' && (
                             <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], x: [0, 40] }} transition={{ duration: 0.5 }}>⚡</motion.div>
                        )}
                         {animationState === 'receiving' && (
                             <motion.div initial={{ opacity: 0, scale: 0.5, x: 40 }} animate={{ opacity: [0, 1, 0], x: [40, 0] }} transition={{ duration: 0.5, delay: 0.5 }}>⚡</motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* Transducer */}
                <div className="flex justify-center items-center gap-0.5">
                    <div className="w-12 h-24 bg-gray-600 rounded-l-lg" />
                    <motion.div 
                        className="w-2 h-24 bg-yellow-400" 
                        animate={{
                            scaleX: animationState === 'sending' ? [1, 1.2, 1] : animationState === 'receiving' ? [1, 0.8, 1] : 1,
                        }}
                        transition={{ duration: 0.3, repeat: animationState === 'sending' ? 2 : 0 }}
                    />
                    <div className="w-1 h-24 bg-cyan-400 rounded-r-lg" />
                </div>
                {/* Sound Wave */}
                <div className="w-24 text-center">
                    <AnimatePresence>
                        {animationState === 'sending' && (
                             <motion.div initial={{ opacity: 0, scale: 0.5, x: -40 }} animate={{ opacity: [0, 1, 0], x: [-40, 0] }} transition={{ duration: 0.5, delay: 0.5 }}>)))</motion.div>
                        )}
                         {animationState === 'receiving' && (
                             <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], x: [0, -40] }} transition={{ duration: 0.5 }}>)))</motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
             <div className="mt-2 flex justify-center gap-4">
                <button onClick={handleSend} disabled={animationState !== 'idle'} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 disabled:opacity-50">Send Pulse</button>
                <button onClick={handleReceive} disabled={animationState !== 'idle'} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 disabled:opacity-50">Receive Echo</button>
            </div>
        </div>
    );
};

export const ArrayTypesVisual: React.FC = () => {
    const [type, setType] = useState<'Linear' | 'Convex' | 'Phased'>('Linear');

    const visuals = {
        'Linear': { 
            head: <div className="w-32 h-6 bg-gray-400 rounded-t-md" />, 
            shape: (
                <div className="w-32 h-40 bg-yellow-400/20 relative overflow-hidden">
                    <motion.div className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                        animate={{ x: [0, 128, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    />
                </div>
            ),
            app: "Vascular, Small Parts" 
        },
        'Convex': { 
            head: <div className="w-24 h-6 bg-gray-400 rounded-t-full" />, 
            shape: (
                 <div className="w-40 h-40 bg-yellow-400/20 relative" style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}>
                     <motion.div className="absolute top-0 h-full w-0.5 bg-yellow-500 origin-top"
                        style={{ left: '50%' }}
                        animate={{ rotate: [-30, 30, -30] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    />
                 </div>
            ),
            app: "Abdomen, OB/GYN" 
        },
        'Phased': { 
            head: <div className="w-12 h-6 bg-gray-400 rounded-t-md" />, 
            shape: (
                <div className="w-48 h-40 bg-yellow-400/20 relative" style={{ clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0% 100%)' }}>
                     <motion.div className="absolute top-0 h-full w-0.5 bg-yellow-500 origin-top"
                        style={{ left: '50%' }}
                        animate={{ rotate: [-45, 45, -45] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    />
                </div>
            ),
            app: "Cardiac, Transcranial" 
        },
    };

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setType('Linear')} secondary={type !== 'Linear'}>Linear</ControlButton>
                <ControlButton onClick={() => setType('Convex')} secondary={type !== 'Convex'}>Convex</ControlButton>
                <ControlButton onClick={() => setType('Phased')} secondary={type !== 'Phased'}>Phased Array</ControlButton>
            </div>
            <div className="h-64 flex flex-col items-center justify-center gap-4">
                {visuals[type].head}
                {visuals[type].shape}
                <p className="font-bold text-yellow-300">{visuals[type].app}</p>
            </div>
        </div>
    );
};

export const BeamFocusingVisual: React.FC = () => {
    const [focus, setFocus] = useState<'near' | 'mid' | 'far'>('mid');
    
    const delays = {
        'near': [2, 1, 0, 1, 2],
        'mid': [4, 2, 0, 2, 4],
        'far': [6, 3, 0, 3, 6],
    };

    const activeDelays = delays[focus];
    const focalPointY = { near: 30, mid: 60, far: 90 }[focus];

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setFocus('near')} secondary={focus !== 'near'}>Near Focus</ControlButton>
                <ControlButton onClick={() => setFocus('mid')} secondary={focus !== 'mid'}>Mid Focus</ControlButton>
                <ControlButton onClick={() => setFocus('far')} secondary={focus !== 'far'}>Far Focus</ControlButton>
            </div>
            <div className="h-64 relative flex flex-col items-center">
                <div className="flex justify-center gap-1 w-40 h-4 bg-gray-600 rounded-t-md p-1">
                    {activeDelays.map((delay, i) => (
                        <motion.div key={i} className="w-full h-full bg-yellow-400 rounded-sm"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: delay * 0.05, duration: 0.2 }}
                        />
                    ))}
                </div>
                 <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute top-4">
                    <motion.path
                        d={`M 30 0 C 40 ${focalPointY/2}, 40 ${focalPointY/2}, 50 ${focalPointY} C 60 ${focalPointY/2}, 60 ${focalPointY/2}, 70 0`}
                        fill="none" stroke="rgba(250, 204, 21, 0.5)" strokeWidth="1"
                        initial={{ d: `M 50 0 C 50 30, 50 30, 50 60 C 50 30, 50 30, 50 0`}}
                        animate={{ d: `M 30 0 C 40 ${focalPointY/2}, 40 ${focalPointY/2}, 50 ${focalPointY} C 60 ${focalPointY/2}, 60 ${focalPointY/2}, 70 0`}}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                    <line x1="0" y1={focalPointY} x2="100" y2={focalPointY} stroke="#fff" strokeWidth="0.5" strokeDasharray="2" />
                </svg>
                 <p className="absolute bottom-4 text-xs text-white/70">Time delays create a curved wavefront, focusing the beam at a specific depth.</p>
            </div>
        </div>
    );
};