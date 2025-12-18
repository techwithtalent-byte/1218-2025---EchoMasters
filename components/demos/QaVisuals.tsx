import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlButton from './ControlButton';

const ResolutionTarget: React.FC<{ spacing: number; isVertical?: boolean; isDegraded?: boolean; }> = ({ spacing, isVertical, isDegraded }) => {
    const degradationFactor = isDegraded ? 2 : 1;
    const blurAmount = isDegraded ? Math.max(0, 3 - spacing) : 0;
    return (
        <div className={`flex ${isVertical ? 'flex-col h-12 justify-center' : 'w-12 items-center'}`} style={{ gap: `${spacing * degradationFactor}px`}}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-full ${isVertical ? 'w-2 h-0.5' : 'w-0.5 h-2'}`} style={{ filter: `blur(${blurAmount}px)`, transition: 'filter 0.5s' }}/>
            ))}
        </div>
    );
};

export const QaPhantomVisual: React.FC = () => {
    const [isDegraded, setIsDegraded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000); // Animation duration
    };
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phantom */}
                <div className="h-80 bg-gray-700/50 rounded-lg p-4 relative overflow-hidden">
                    <p className="absolute top-2 left-2 text-xs text-white/70 font-bold">QA PHANTOM</p>
                     {/* Horizontal Pins */}
                    <div className="absolute top-[20%] left-[10%] w-[80%] h-0.5 bg-gray-500" />
                    <div className="absolute top-[40%] left-[10%] w-[80%] h-0.5 bg-gray-500" />
                    <div className="absolute top-[60%] left-[10%] w-[80%] h-0.5 bg-gray-500" />
                    {/* Vertical Pins */}
                     <div className="absolute top-[10%] left-[25%] h-[80%] w-0.5 bg-gray-500" />
                     <div className="absolute top-[10%] left-[50%] h-[80%] w-0.5 bg-gray-500" />
                     <div className="absolute top-[10%] left-[75%] h-[80%] w-0.5 bg-gray-500" />
                     <AnimatePresence>
                     {isScanning && (
                         <motion.div 
                             className="absolute top-0 bottom-0 w-20 bg-yellow-400/20 border-x-2 border-yellow-400"
                             initial={{ x: "-100%" }}
                             animate={{ x: "400%" }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 2, ease: "linear" }}
                         />
                     )}
                     </AnimatePresence>
                </div>
                {/* B-Mode Image */}
                <div className="h-80 bg-black rounded-lg p-4 relative overflow-hidden">
                    <p className="absolute top-2 left-2 text-xs text-white/70 font-bold">B-MODE IMAGE</p>
                    {/* Horizontal Pins */}
                    <div className={`absolute top-[20%] left-[10%] w-[80%] h-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />
                    <div className={`absolute top-[40%] left-[10%] w-[80%] h-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />
                    <div className={`absolute top-[60%] left-[10%] w-[80%] h-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />
                     {/* Vertical Pins */}
                     <div className={`absolute top-[10%] left-[25%] h-[80%] w-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />
                     <div className={`absolute top-[10%] left-[50%] h-[80%] w-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />
                     <div className={`absolute top-[10%] left-[75%] h-[80%] w-0.5 ${isDegraded ? 'bg-gray-400/50 blur-sm' : 'bg-white'}`} />

                     <AnimatePresence>
                     {isScanning && (
                         <motion.div 
                             className="absolute top-0 right-0 bottom-0 bg-black"
                             initial={{ left: "0%" }}
                             animate={{ left: "100%" }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 2, ease: "linear" }}
                         />
                     )}
                     </AnimatePresence>
                </div>
            </div>
             <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <ControlButton onClick={handleScan} disabled={isScanning}>
                    {isScanning ? 'Scanning...' : 'Perform Sweep Scan'}
                </ControlButton>
                <div className="text-center">
                    <label className="toggle-switch">
                        <input type="checkbox" checked={isDegraded} onChange={e => setIsDegraded(e.target.checked)} />
                        <span className="slider"></span>
                    </label>
                    <span className="ml-2 text-sm text-white/80 align-middle">Simulate Degraded System</span>
                </div>
            </div>
        </div>
    );
};