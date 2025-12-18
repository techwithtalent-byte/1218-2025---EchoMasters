import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 1: Carotid Stenosis Measurement Lab ---
const CarotidStenosisSection: React.FC = () => {
    const [stenosis, setStenosis] = useState(60); // % diameter reduction

    const { psv, edv, grade, spectralBroadeningOpacity, plaquePath } = useMemo(() => {
        let psv_val = 80 + stenosis * 3.5;
        let edv_val = 25 + stenosis * 1.8;
        let grade_text = "Normal (<50%)";

        if (stenosis >= 70) {
            psv_val = 230 + (stenosis - 70) * 8;
            edv_val = 100 + (stenosis - 70) * 4;
            grade_text = "Severe Stenosis (≥70%)";
        } else if (stenosis >= 50) {
            psv_val = 125 + (stenosis - 50) * 5.25;
            edv_val = 40 + (stenosis - 50) * 3;
            grade_text = "Moderate Stenosis (50-69%)";
        }
        
        // Spectral broadening increases significantly after 50% stenosis
        const broadening = stenosis > 50 ? Math.min(1, (stenosis - 50) / 40) * 0.7 : 0;

        // Plaque path calculation
        const vesselHeight = 70; // (110 - 40)
        const plaqueBulge = (stenosis / 100) * (vesselHeight / 2);
        const pPath = `M 100 41 Q 150 ${41 + plaqueBulge * 2}, 200 41 L 200 40 L 100 40 Z`;
        
        return { 
            psv: psv_val, 
            edv: edv_val, 
            grade: grade_text, 
            spectralBroadeningOpacity: broadening,
            plaquePath: pPath 
        };
    }, [stenosis]);

    const waveformPath = `M 0 80 L 50 80 L 75 ${80 - psv/10} L 125 ${80 - edv/10} L 150 80 L 200 80 L 225 ${80 - psv/10} L 275 ${80 - edv/10} L 300 80`;

    return (
        <DemoSection
            title="Carotid Stenosis Measurement Lab"
            description="Grade carotid stenosis using both B-mode measurements (% diameter reduction) and Doppler velocities (PSV & EDV), according to standardized criteria."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2 h-80 bg-black rounded-xl relative overflow-hidden p-4">
                    {/* B-mode background texture */}
                    <div className="absolute inset-0 bg-gray-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '5px 5px' }}></div>
                    
                    <svg width="100%" height="100%" viewBox="0 0 300 150">
                        {/* Vessel Walls */}
                        <path d="M 0 40 C 50 38, 250 42, 300 40" stroke="#aaa" strokeWidth="2" fill="none"/>
                        <path d="M 0 110 C 50 112, 250 108, 300 110" stroke="#aaa" strokeWidth="2" fill="none" />
                        
                        {/* Lumen */}
                        <rect x="0" y="41" width="300" height="68" fill="#111" />
                        
                        {/* Plaque */}
                        <path d={plaquePath} fill="#facc15" stroke="#eab308" strokeWidth="0.5" style={{ transition: 'd 0.2s ease-in-out' }} />

                        {/* Sample Gate */}
                        <g transform="translate(150, 0)">
                             <line x1="0" y1={40 + (stenosis/100 * 35) + 5} x2="0" y2={110-5} stroke="#67e8f9" strokeWidth="1.5" strokeDasharray="3" />
                            <line x1="-10" y1={40 + (stenosis/100 * 35) + 5} x2="10" y2={40 + (stenosis/100 * 35) + 5} stroke="#67e8f9" strokeWidth="2" />
                            <line x1="-10" y1={110-5} x2="10" y2={110-5} stroke="#67e8f9" strokeWidth="2" />
                        </g>
                    </svg>
                    <div className="absolute top-2 left-2 text-xs font-bold text-white/70 bg-black/50 px-2 py-1 rounded">B-Mode</div>
                </div>
                <div className="w-full lg:w-1/2 h-80 graticule-bg rounded-xl p-2 relative">
                    <svg width="100%" height="100%" viewBox="0 0 300 100">
                        <defs>
                            <linearGradient id="spectral-fill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="100%" stopColor="#facc15" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        {/* Spectral Broadening Fill */}
                        <path d={waveformPath} fill="url(#spectral-fill)" style={{ transition: 'all 0.3s ease-in-out', fillOpacity: spectralBroadeningOpacity }} />
                        {/* Waveform Outline */}
                        <path d={waveformPath} stroke="#fef08a" strokeWidth="2" fill="none" style={{ transition: 'd 0.3s' }} />
                        {/* Baseline */}
                        <line x1="0" y1="80" x2="300" y2="80" stroke="#555" strokeWidth="1" strokeDasharray="2" />
                        
                        {/* Annotations */}
                        <text x="75" y={78 - psv/10} fill="#fff" fontSize="8" textAnchor="middle" className="font-mono transition-all duration-300">PSV</text>
                        <text x="125" y={88 - edv/10} fill="#fff" fontSize="8" textAnchor="middle" className="font-mono transition-all duration-300">EDV</text>
                    </svg>
                     <div className="absolute top-2 left-2 text-xs font-bold text-white/70 bg-black/50 px-2 py-1 rounded">Spectral Doppler</div>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-white/80 mb-2">Adjust Plaque Buildup (% Diameter Reduction)</label>
                <input type="range" min="0" max="90" value={stenosis} onChange={e => setStenosis(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
            </div>
            <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                <p className="text-sm text-white/70">Stenosis Grade (based on PSV & EDV):</p>
                <p className="text-xl font-bold text-yellow-400 mt-1">{grade}</p>
            </div>
        </DemoSection>
    );
};

// --- Section 2: DVT Compression Simulation ---
const DVTCompressionSection: React.FC = () => {
    const [hasDVT, setHasDVT] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    
    const veinCompressScale = hasDVT ? 0.6 : 0.1;

    return (
        <DemoSection
            title="DVT Compression Maneuver"
            description="The primary method for ruling out a deep vein thrombosis (DVT) is to perform a compression maneuver. A healthy vein will fully coapt (collapse), while a vein with a thrombus will not."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center gap-8">
                    <div className="w-32 h-8 bg-yellow-400 rounded-md transition-transform duration-300" style={{ transform: isCompressing ? 'translateY(30px)' : 'translateY(0)' }}/>
                    <div className="flex gap-8">
                        {/* Vein */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-blue-400 transition-transform duration-300 ease-in-out" style={{ transform: isCompressing ? `scaleY(${veinCompressScale})` : 'scaleY(1)' }}>
                                {hasDVT && <div className="w-8 h-8 rounded-full bg-gray-500 m-auto mt-3" />}
                            </div>
                            <p className="text-sm text-blue-300 mt-2">Vein</p>
                        </div>
                        {/* Artery */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-4 border-red-400 animate-pulse" />
                            <p className="text-sm text-red-300 mt-2">Artery</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                    <div className="flex flex-col gap-2">
                        <ControlButton onClick={() => setHasDVT(false)} secondary={hasDVT}>Normal Vein</ControlButton>
                        <ControlButton onClick={() => setHasDVT(true)} secondary={!hasDVT}>Vein with DVT</ControlButton>
                    </div>
                    <ControlButton onMouseDown={() => setIsCompressing(true)} onMouseUp={() => setIsCompressing(false)} onMouseLeave={() => setIsCompressing(false)}>
                        {isCompressing ? 'Compressing...' : 'Press to Compress'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Ankle-Brachial Index (ABI) ---
const ABISection: React.FC = () => {
    const [brachial, setBrachial] = useState(120);
    const [ankle, setAnkle] = useState(130);

    const abi = useMemo(() => ankle / brachial, [ankle, brachial]);
    
    const interpretation = useMemo(() => {
        if (abi > 1.4) return { text: "Non-compressible", color: "text-purple-300", bg: "bg-purple-500/20", border: "border-purple-500/50" };
        if (abi >= 1.0) return { text: "Normal", color: "text-green-300", bg: "bg-green-500/20", border: "border-green-500/50" };
        if (abi >= 0.7) return { text: "Mild PAD", color: "text-yellow-300", bg: "bg-yellow-500/20", border: "border-yellow-500/50" };
        if (abi >= 0.4) return { text: "Moderate PAD", color: "text-orange-300", bg: "bg-orange-500/20", border: "border-orange-500/50" };
        return { text: "Severe PAD", color: "text-red-300", bg: "bg-red-500/20", border: "border-red-500/50" };
    }, [abi]);

    return (
        <DemoSection
            title="Ankle-Brachial Index (ABI) Walkthrough"
            description="The ABI is a simple, non-invasive test to check for peripheral artery disease (PAD). It compares the blood pressure at the ankle with the pressure in the arm. A low ABI number can indicate narrowing or blockage of the arteries."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3 grid grid-cols-2 gap-4 items-center bg-gray-800/50 p-4 rounded-xl min-h-[24rem]">
                    {/* Arm Visual */}
                    <div className="relative h-full flex justify-center items-center">
                        <svg viewBox="0 0 100 200" className="w-full h-full">
                            <path d="M 60 10 L 70 180 L 30 180 L 40 10 Z" fill="#a16207" />
                            <motion.rect x="35" y="50" width="30" rx="5" fill="#444" 
                                animate={{ height: brachial / 4 }} transition={{ type: 'spring', stiffness: 100 }} />
                            <text x="50" y="45" fill="white" fontSize="8" textAnchor="middle">Brachial: {brachial}</text>
                        </svg>
                    </div>
                    {/* Leg Visual */}
                    <div className="relative h-full flex justify-center items-center">
                         <svg viewBox="0 0 100 200" className="w-full h-full">
                            <path d="M 60 10 L 65 180 L 35 180 L 40 10 Z" fill="#a16207" />
                            <motion.rect x="40" y="120" width="20" rx="5" fill="#444" 
                                 animate={{ height: ankle / 4 }} transition={{ type: 'spring', stiffness: 100 }} />
                            <text x="50" y="115" fill="white" fontSize="8" textAnchor="middle">Ankle: {ankle}</text>
                        </svg>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 flex flex-col justify-center gap-4">
                     <div>
                        <label className="block text-white/80 mb-2">Highest Brachial Pressure (mmHg)</label>
                        <input type="range" min="80" max="200" value={brachial} onChange={e => setBrachial(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    </div>
                     <div>
                        <label className="block text-white/80 mb-2">Highest Ankle Pressure (mmHg)</label>
                        <input type="range" min="30" max="220" value={ankle} onChange={e => setAnkle(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-white/70">ABI = {ankle} / {brachial}</p>
                        <p className="text-4xl font-bold text-white mt-2">{abi.toFixed(2)}</p>
                        <div className={`mt-3 p-2 rounded-lg border ${interpretation.bg} ${interpretation.border}`}>
                            <p className={`text-xl font-semibold ${interpretation.color}`}>{interpretation.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};


const VascularDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <CarotidStenosisSection />
            <DVTCompressionSection />
            <ABISection />
        </div>
    );
};

export default VascularDemo;