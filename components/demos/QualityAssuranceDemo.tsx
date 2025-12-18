
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';

// --- Section 1: Distance Accuracy ---
const TARGETS = [{ id: 1, depth: 20 }, { id: 2, depth: 50 }, { id: 3, depth: 100 }]; // mm
const PIXELS_PER_MM = 3;

const DistanceAccuracySection: React.FC = () => {
    const phantomRef = useRef<HTMLDivElement>(null);
    const [caliper1, setCaliper1] = useState({ x: 50, y: TARGETS[0].depth * PIXELS_PER_MM });
    const [caliper2, setCaliper2] = useState({ x: 50, y: TARGETS[2].depth * PIXELS_PER_MM });
    const [dragging, setDragging] = useState<'caliper1' | 'caliper2' | null>(null);

    const measuredDistance = Math.abs(caliper2.y - caliper1.y) / PIXELS_PER_MM;
    const trueDistance = 100-20; // Hardcoded for 20mm to 100mm measurement
    const error = ((measuredDistance - trueDistance) / trueDistance) * 100;
    const isPass = Math.abs(error) <= 2.0;

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragging || !phantomRef.current) return;
        const rect = phantomRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        if (dragging === 'caliper1') setCaliper1(prev => ({ ...prev, y: Math.max(0, Math.min(rect.height, y)) }));
        if (dragging === 'caliper2') setCaliper2(prev => ({ ...prev, y: Math.max(0, Math.min(rect.height, y)) }));
    }, [dragging]);

    const handleMouseUp = useCallback(() => {
        setDragging(null);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <DemoSection
            title="Distance Accuracy & Calibration"
            description="Verify the machine's electronic calipers are accurate using a phantom with targets at known distances. Acceptance criteria is typically within ±2%."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div ref={phantomRef} className="w-full md:w-2/3 h-96 bg-gray-800/50 rounded-xl p-4 relative cursor-crosshair" onMouseUp={handleMouseUp}>
                    {TARGETS.map(target => (
                         <div key={target.id} className="w-full h-0.5 bg-white/50 flex items-center" style={{ position: 'absolute', top: `${target.depth * PIXELS_PER_MM}px` }}>
                            <span className="text-xs text-white/70 ml-2">{target.depth} mm</span>
                         </div>
                    ))}
                    {/* Calipers */}
                    <div className="absolute w-full h-full top-0 left-0">
                        <div className="absolute w-full h-0.5 bg-yellow-400" style={{ top: `${caliper1.y}px` }} />
                        <div className="absolute w-0.5 h-full bg-yellow-400" style={{ left: `${caliper1.x}px` }} />
                         <div onMouseDown={() => setDragging('caliper1')} className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-black cursor-ns-resize" style={{ top: `${caliper1.y}px`, left: `${caliper1.x}px`, transform: 'translate(-50%, -50%)' }} />

                        <div className="absolute w-full h-0.5 bg-yellow-400" style={{ top: `${caliper2.y}px` }} />
                        <div onMouseDown={() => setDragging('caliper2')} className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-black cursor-ns-resize" style={{ top: `${caliper2.y}px`, left: `${caliper1.x}px`, transform: 'translate(-50%, -50%)' }} />
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-white/70">True Distance:</p>
                        <p className="text-xl font-bold text-white mt-1">{trueDistance.toFixed(1)} mm</p>
                    </div>
                     <div className="bg-white/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-white/70">Measured Distance:</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">{measuredDistance.toFixed(1)} mm</p>
                    </div>
                     <div className={`p-4 rounded-lg text-center transition-colors duration-300 ${isPass ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                        <p className="text-sm text-white/70">Error: {error.toFixed(2)}%</p>
                        <p className="text-xl font-bold text-white mt-1">{isPass ? '✅ PASS' : '❌ FAIL'}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Resolution Phantom ---
const ResolutionTarget: React.FC<{ spacing: number; isVertical?: boolean; isDegraded?: boolean; }> = ({ spacing, isVertical, isDegraded }) => {
    const numTargets = 5;
    const degradationFactor = isDegraded ? 2 : 1;
    const blurAmount = isDegraded ? Math.max(0, 3 - spacing) : 0;

    return (
        <div className={`flex ${isVertical ? 'flex-col h-16 justify-center' : 'w-16 items-center'}`} style={{ gap: `${spacing * degradationFactor}px`}}>
            {Array.from({ length: numTargets }).map((_, i) => (
                <div key={i} className={`bg-white rounded-full ${isVertical ? 'w-2 h-0.5' : 'w-0.5 h-2'}`} style={{ filter: `blur(${blurAmount}px)`, transition: 'filter 0.5s' }}/>
            ))}
        </div>
    );
};

const ResolutionSection: React.FC = () => {
    const [isDegraded, setIsDegraded] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        // Match animation duration
        setTimeout(() => setIsScanning(false), 2200);
    };
    
    return (
        <DemoSection
            title="Resolution Phantom Testing"
            description="Assess axial (horizontal targets) and lateral (vertical targets) resolution via a simulated scan. A degraded system loses the ability to distinguish between closely spaced objects."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phantom View */}
                <div className="h-80 bg-gray-700/50 rounded-lg p-4 relative overflow-hidden">
                    <p className="absolute top-2 left-2 text-xs text-white/70 font-bold">QA PHANTOM</p>
                    <div className="absolute top-[25%] left-[10%] w-[80%] h-0.5 bg-gray-500/50" />
                    <div className="absolute top-[50%] left-[10%] w-[80%] h-0.5 bg-gray-500/50" />
                    <div className="absolute top-[75%] left-[10%] w-[80%] h-0.5 bg-gray-500/50" />
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                className="absolute top-0 w-24 h-5 bg-yellow-400/80 rounded-sm shadow-lg"
                                initial={{ x: "-25%" }}
                                animate={{ x: "125%" }}
                                transition={{ duration: 2, ease: "linear" }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* B-Mode Image View */}
                <div className="h-80 bg-black rounded-lg p-6 relative overflow-hidden">
                    <p className="absolute top-2 left-2 text-xs text-white/70 font-bold z-20">B-MODE IMAGE</p>
                    <div className="relative flex flex-col justify-between h-full z-10">
                         <div>
                            <h4 className="text-sm font-semibold text-white/70 mb-2">Axial Resolution Targets</h4>
                            <div className="flex justify-around items-center h-16">
                                {[3, 2, 1, 0.5].map(s => <ResolutionTarget key={s} spacing={s} isDegraded={isDegraded} />)}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white/70 mb-2">Lateral Resolution Targets</h4>
                            <div className="flex justify-around items-center h-16">
                                {[3, 2, 1, 0.5].map(s => <ResolutionTarget key={s} spacing={s} isVertical isDegraded={isDegraded} />)}
                            </div>
                        </div>
                    </div>
                    <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                className="absolute inset-0 bg-black z-20"
                                initial={{ x: "0%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 2, ease: "linear", delay: 0.1 }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400 opacity-50" />
                            </motion.div>
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
        </DemoSection>
    );
};

// --- Section 3: Image Integrity ---
type IntegrityState = 'Good' | 'Banding' | 'Dropout';
const ImageIntegritySection: React.FC = () => {
    const [state, setState] = useState<IntegrityState>('Good');

    return (
        <DemoSection
            title="Image Integrity Inspection"
            description="Visually inspect for the dead zone, uniformity, and artifacts like banding or element dropout which indicate equipment problems."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-600 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-4 bg-black/80 z-10 flex items-center justify-center text-xs font-bold text-yellow-400">DEAD ZONE</div>
                     {state === 'Banding' && (
                        <div className="absolute inset-0 flex justify-around">
                            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="w-8 h-full bg-black/20"></div>)}
                        </div>
                    )}
                    {state === 'Dropout' && (
                        <div className="absolute inset-0 flex justify-center">
                            <div className="w-12 h-full bg-black/70"></div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gray-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '5px 5px' }}></div>
                </div>
                 <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                    <h4 className="text-white/80 mb-1 text-center">Select View:</h4>
                     <ControlButton onClick={() => setState('Good')} secondary={state !== 'Good'}>Uniform Image</ControlButton>
                     <ControlButton onClick={() => setState('Banding')} secondary={state !== 'Banding'}>Banding Artifacts</ControlButton>
                     <ControlButton onClick={() => setState('Dropout')} secondary={state !== 'Dropout'}>Element Dropout</ControlButton>
                 </div>
            </div>
        </DemoSection>
    );
}

const QualityAssuranceDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <DistanceAccuracySection />
            <ResolutionSection />
            <ImageIntegritySection />
            <KnowledgeCheck
                moduleId="qa"
                question="What is the primary goal of a Quality Assurance (QA) program in ultrasound?"
                options={["To increase patient throughput.", "To ensure proper and consistent equipment operation.", "To practice scanning on phantoms.", "To fulfill a legal requirement only."]}
                correctAnswer="To ensure proper and consistent equipment operation."
                explanation="The main purpose of QA is to regularly test ultrasound equipment to ensure it is functioning correctly, producing high-quality images, and performing consistently over time, which is essential for accurate diagnosis and patient safety."
            />
        </div>
    );
};

export default QualityAssuranceDemo;
