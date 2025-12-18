
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';
import { motion } from 'framer-motion';

// --- Section 1: Axial Resolution ---
const AxialResolutionSection: React.FC = () => {
    const [frequency, setFrequency] = useState(5); // MHz
    const SPEED_OF_SOUND = 1540; // m/s
    const CYCLES_IN_PULSE = 3;

    const wavelength_mm = (SPEED_OF_SOUND / (frequency * 1_000_000)) * 1000;
    const spl_mm = CYCLES_IN_PULSE * wavelength_mm;
    const axialResolution_mm = spl_mm / 2;

    const targetSeparation_mm = 0.8;
    const areTargetsResolved = axialResolution_mm < targetSeparation_mm;
    
    const blurAmount = areTargetsResolved ? 0 : 2;

    return (
        <DemoSection
            title="Axial Resolution (LARRD)"
            description="Determined by Spatial Pulse Length (SPL). A higher frequency creates a shorter wavelength and shorter SPL, allowing closer objects along the beam's axis to be resolved."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 grid grid-rows-2 gap-4">
                    {/* B-Mode Display */}
                    <div className="h-40 bg-gray-800/50 rounded-xl relative flex items-center justify-center p-4">
                        <p className="absolute top-2 left-2 text-xs text-white/60">B-Mode Image</p>
                        <div className="flex items-center gap-4 transition-all duration-300" style={{ filter: `blur(${blurAmount}px)`}}>
                            <div className="w-2 h-8 bg-cyan-400 rounded-sm" />
                            <div className="w-2 h-8 bg-cyan-400 rounded-sm" />
                        </div>
                    </div>

                    {/* A-Mode Display */}
                    <div className="h-40 bg-black/80 rounded-xl p-4 relative flex items-center justify-center">
                        <p className="absolute top-2 left-2 text-xs text-white/60">A-Mode Display</p>
                        <svg viewBox="0 0 140 100" className="w-48 h-24 overflow-visible">
                            <path d="M 0 80 L 140 80" stroke="#444" strokeWidth="1.5" />
                            {/* Resolved Path */}
                            <path 
                                d="M 0 80 L 40 80 L 50 30 L 60 80 L 80 80 L 90 30 L 100 80 L 140 80" 
                                stroke="#fef08a" 
                                strokeWidth="2" 
                                fill="none"
                                style={{ opacity: areTargetsResolved ? 1 : 0, transition: 'opacity 0.3s' }}
                            />
                            {/* Unresolved Path */}
                            <path 
                                d="M 0 80 L 40 80 C 50 10, 80 10, 90 80 L 140 80" 
                                stroke="#fef08a" 
                                strokeWidth="2" 
                                fill="none"
                                style={{ opacity: areTargetsResolved ? 0 : 1, transition: 'opacity 0.3s' }}
                            />
                        </svg>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Frequency</label>
                    <input type="range" min="2" max="15" step="0.5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{frequency.toFixed(1)} MHz</div>
                </div>
            </div>
            <div className="mt-6 bg-gray-800/50 p-4 rounded-lg font-mono text-sm">
                <p>SPL = Cycles × (c/f) = {CYCLES_IN_PULSE} × ({SPEED_OF_SOUND}/{frequency.toFixed(1)}MHz) = <span className="font-bold text-white">{spl_mm.toFixed(2)} mm</span></p>
                <p>Axial Res. = SPL / 2 = <span className="font-bold text-white text-lg">{axialResolution_mm.toFixed(2)} mm</span></p>
                 <div className={`mt-2 p-2 rounded text-center font-sans font-bold ${areTargetsResolved ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}`}>
                    {areTargetsResolved ? `✅ RESOLVED (0.8mm > ${axialResolution_mm.toFixed(2)}mm)` : `❌ UNRESOLVED (0.8mm < ${axialResolution_mm.toFixed(2)}mm)`}
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Lateral Resolution ---
const LateralResolutionSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focalDepth, setFocalDepth] = useState(150); // in pixels
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        setFocalDepth(Math.max(20, Math.min(rect.height - 20, y)));
    }, [isDragging]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const beamPath = `M 40 0 L ${50 - 20 * (1 - focalDepth / 280)} ${focalDepth}, 60 0 L ${50 + 20 * (1 - focalDepth / 280)} ${focalDepth}, 40 0 M 60 0 L ${50 + 20 * (1 - focalDepth / 280)} ${focalDepth}, ${50 + 40 * (focalDepth / 280)} 280, ${50 - 40 * (focalDepth / 280)} 280, ${50 - 20 * (1 - focalDepth / 280)} ${focalDepth}, 40 0`;
    
    const TargetPair: React.FC<{depth: number}> = ({ depth }) => {
        const beamWidthAtDepth = 40 * (1 - Math.abs(focalDepth - depth) / 280);
        const isResolved = beamWidthAtDepth < 15;
        const blur = isResolved ? 0 : 2;
        return (
             <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2" style={{ top: `${depth}px`, filter: `blur(${blur}px)`, transition: 'filter 0.3s'}}>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </div>
        )
    };
    
    return (
        <DemoSection
            title="Lateral Resolution (Azimuthal)"
            description="Determined by beam width. Lateral resolution is best at the focal point and degrades in the near and far fields. Drag the focal point to see the effect."
        >
            <div ref={containerRef} className="relative h-80 bg-gray-800/50 rounded-xl overflow-hidden cursor-ns-resize" onMouseUp={handleMouseUp}>
                <svg width="100%" height="100%" viewBox="0 0 100 280" preserveAspectRatio="none">
                    <path d={beamPath} fill="rgba(249, 115, 22, 0.2)" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="1" />
                </svg>
                <div className="absolute w-full h-0.5 bg-yellow-400/80 border-y border-black" style={{ top: `${focalDepth}px` }}/>
                <div className="absolute left-2 text-xs font-bold text-yellow-400 bg-black/50 px-2 py-1 rounded" style={{ top: `${focalDepth - 10}px` }}>Focal Zone</div>
                <div onMouseDown={() => setIsDragging(true)} className="absolute left-full -translate-x-8 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg cursor-ns-resize" style={{ top: `${focalDepth}px`, transform: 'translateY(-50%)' }}>
                    ↕
                </div>
                <TargetPair depth={50} />
                <TargetPair depth={150} />
                <TargetPair depth={250} />
            </div>
        </DemoSection>
    );
};

// --- Section 3: Elevational Resolution ---
const ElevationalResolutionSection: React.FC = () => {
    const [isThickSlice, setIsThickSlice] = useState(true);

    return (
        <DemoSection
            title="Elevational Resolution (Slice Thickness)"
            description="The 'forgotten' third dimension. A thick beam slice can average tissue, causing artifacts like filling in anechoic structures (partial volume artifact)."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 grid grid-cols-2 gap-4">
                    {/* 3D View */}
                    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center" style={{ perspective: '300px' }}>
                        <p className="text-sm text-white/70 mb-4">3D View of Beam & Targets</p>
                        <div className="relative w-48 h-48" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-20deg)' }}>
                            <div className="absolute w-20 h-32 bg-cyan-400 rounded-full top-8 left-12" style={{ transform: 'translateZ(-10px)' }}></div>
                            <div className="absolute w-12 h-12 bg-gray-400 rounded-md top-16 left-8"></div>
                            <div className="absolute w-full h-full bg-orange-500/30 transition-transform duration-300" style={{ transform: isThickSlice ? 'translateZ(-20px) scaleY(1.5)' : 'translateZ(-5px) scaleY(0.5)' }}></div>
                        </div>
                    </div>
                    {/* 2D Ultrasound View */}
                    <div className="bg-black/80 rounded-xl p-4 flex items-center justify-center">
                         <div className="w-24 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                             <div className="w-12 h-12 rounded-full bg-black relative overflow-hidden">
                                {isThickSlice && <div className="absolute inset-0 bg-gray-400/30 animate-fade-in"></div>}
                             </div>
                         </div>
                    </div>
                </div>
                 <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                    <h4 className="text-white/80 mb-1 text-center">Select Slice Thickness:</h4>
                     <ControlButton onClick={() => setIsThickSlice(true)} secondary={!isThickSlice}>Thick Slice (Poor Res.)</ControlButton>
                     <ControlButton onClick={() => setIsThickSlice(false)} secondary={isThickSlice}>Thin Slice (Good Res.)</ControlButton>
                      <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className={`text-xl font-bold ${isThickSlice ? 'text-red-400' : 'text-green-400'}`}>
                            {isThickSlice ? 'Partial Volume Artifact!' : 'Clean Image'}
                        </p>
                    </div>
                 </div>
            </div>
        </DemoSection>
    );
}


const ResolutionDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <AxialResolutionSection />
            <LateralResolutionSection />
            <ElevationalResolutionSection />
            <KnowledgeCheck
                moduleId="resolution"
                question="Which of these factors improves Axial Resolution?"
                options={["Lower Frequency", "Higher Frequency", "Wider Beam Width", "Slower Propagation Speed"]}
                correctAnswer="Higher Frequency"
                explanation="Axial resolution is determined by Spatial Pulse Length (SPL). A higher frequency results in a shorter wavelength, which creates a shorter SPL, thus improving axial resolution (LARRD)."
            />
        </div>
    );
};

export default ResolutionDemo;
