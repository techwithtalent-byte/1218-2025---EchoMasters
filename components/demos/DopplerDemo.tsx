
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';

// --- Section 1: Interactive Doppler Principle Lab (RE-DESIGNED) ---
const DopplerEquationLab: React.FC = () => {
    const [direction, setDirection] = useState<'towards' | 'away'>('towards');
    const [speed, setSpeed] = useState(60); // cm/s

    // Physics Constants
    const FREQUENCY_MHZ = 5;
    const SPEED_OF_SOUND_MS = 1540;
    const ANGLE_DEG = 60; // Standard clinical angle

    const { dopplerShiftHz, waveformPath, color, label } = useMemo(() => {
        const angleRad = ANGLE_DEG * (Math.PI / 180);
        // "Towards" is defined as approaching the beam face
        const velocityMS = (direction === 'towards' ? 1 : -1) * (speed / 100);
        const freqHz = FREQUENCY_MHZ * 1_000_000;
        
        const shift = (2 * freqHz * velocityMS * Math.cos(angleRad)) / SPEED_OF_SOUND_MS;
        
        const isPositive = shift > 0;
        const color = isPositive ? 'text-red-400' : 'text-blue-400';
        const bgColor = isPositive ? 'bg-red-500' : 'bg-blue-500';
        const label = isPositive ? "Red (Towards)" : "Blue (Away)";

        // Generate a simple waveform path
        const amplitude = Math.min(40, Math.abs(shift) / 50); // Scale height by shift
        const directionMult = isPositive ? -1 : 1; // -1 goes UP in SVG coords, 1 goes DOWN
        
        let path = "M 0 50";
        for(let i=0; i<300; i+=10) {
            // Create a noisy but periodic wave
            const y = 50 + (amplitude * Math.sin(i * 0.1) * directionMult * (0.8 + Math.random()*0.4)); 
            path += ` L ${i} ${y}`;
        }

        return { dopplerShiftHz: shift, waveformPath: path, color, bgColor, label };
    }, [direction, speed]);

    return (
        <DemoSection
            title="Interactive Doppler Principle Lab"
            description="The Doppler Effect causes a change in frequency when sound reflects off moving blood cells. We use the acronym BART: Blue Away, Red Towards."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Simulation Pane */}
                <div className="flex flex-col gap-4">
                    {/* Vessel View */}
                    <div className="relative h-64 bg-black rounded-xl overflow-hidden border-2 border-white/10 shadow-inner">
                        {/* Background Tissue */}
                        <div className="absolute inset-0 bg-gray-900 opacity-50" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                        
                        {/* Transducer & Beam */}
                        <div className="absolute top-0 right-10 w-20 h-10 bg-gray-400 rounded-b-lg z-20 flex justify-center items-center border-b-2 border-gray-500">
                            <div className="w-16 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        {/* Beam Path */}
                        <div className="absolute top-10 right-20 w-[2px] h-[300px] bg-yellow-400/30 origin-top transform rotate-[30deg] z-10"></div>

                        {/* Vessel */}
                        <div className="absolute top-1/2 left-0 right-0 h-24 -translate-y-1/2 bg-gray-800/80 border-y-2 border-gray-600 flex items-center overflow-hidden">
                            {/* Direction Arrow Background */}
                            <div className={`absolute inset-0 flex items-center justify-center opacity-10 font-black text-9xl select-none ${color}`}>
                                {direction === 'towards' ? '→' : '←'}
                            </div>

                            {/* Particles */}
                            {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-3 h-3 rounded-full shadow-sm ${direction === 'towards' ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50'}`}
                                    initial={{ x: direction === 'towards' ? -20 : 400, opacity: 0 }}
                                    animate={{ 
                                        x: direction === 'towards' ? 400 : -20,
                                        opacity: [0, 1, 1, 0]
                                    }}
                                    transition={{
                                        duration: 300 / speed, // Faster speed = Lower duration
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.3,
                                    }}
                                    style={{ top: `${Math.random() * 60 + 20}%` }}
                                />
                            ))}
                        </div>
                        
                        {/* Labels */}
                        <div className="absolute bottom-2 left-2 text-xs text-white/50 font-mono">
                            Vessel Flow: <span className={color}>{direction.toUpperCase()}</span> Probe
                        </div>
                    </div>

                    {/* Spectral Display Visual */}
                    <div className="h-32 bg-black rounded-xl border border-white/20 relative overflow-hidden">
                        {/* Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                        
                        {/* Baseline */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50"></div>
                        
                        {/* Trace */}
                        <svg className="absolute inset-0 w-full h-full preserve-3d">
                            <motion.path 
                                d={waveformPath} 
                                stroke={direction === 'towards' ? '#f87171' : '#60a5fa'} 
                                strokeWidth="2" 
                                fill="none"
                                initial={{ pathLength: 0, x: -50 }}
                                animate={{ pathLength: 1, x: 0 }}
                                transition={{ duration: 0.1, ease: 'linear' }}
                            />
                        </svg>

                        <div className="absolute top-2 right-2 bg-gray-900/80 px-2 py-1 rounded text-xs border border-white/10">
                            <span className="text-white/60">Shift:</span> <span className={`font-mono font-bold ${color}`}>{dopplerShiftHz > 0 ? '+' : ''}{dopplerShiftHz.toFixed(0)} Hz</span>
                        </div>
                        <div className="absolute bottom-1 left-2 text-[10px] text-white/30">SPECTRAL DISPLAY</div>
                    </div>
                </div>

                {/* Controls & Explanation */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h4 className="font-bold text-lg text-white mb-4">1. Control Blood Flow</h4>
                        <div className="flex gap-4 mb-6">
                            <button 
                                onClick={() => setDirection('towards')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${direction === 'towards' ? 'bg-red-500/20 border-red-500 text-white' : 'bg-black border-white/10 text-white/50 hover:bg-white/5'}`}
                            >
                                <span className="text-2xl">🛑</span>
                                <span className="font-bold uppercase text-xs tracking-wider">Towards Probe</span>
                                <span className="text-[10px] opacity-70">(Positive Shift)</span>
                            </button>
                            <button 
                                onClick={() => setDirection('away')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${direction === 'away' ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-black border-white/10 text-white/50 hover:bg-white/5'}`}
                            >
                                <span className="text-2xl">🔷</span>
                                <span className="font-bold uppercase text-xs tracking-wider">Away From Probe</span>
                                <span className="text-[10px] opacity-70">(Negative Shift)</span>
                            </button>
                        </div>

                        <label className="block text-white/80 mb-2 text-sm font-semibold">2. Adjust Speed</label>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-white/50">Slow</span>
                            <input 
                                type="range" 
                                min="20" 
                                max="200" 
                                value={speed} 
                                onChange={e => setSpeed(Number(e.target.value))} 
                                className={`flex-grow h-2 rounded-lg appearance-none cursor-pointer ${direction === 'towards' ? 'bg-red-900 accent-red-500' : 'bg-blue-900 accent-blue-500'}`} 
                            />
                            <span className="text-xs text-white/50">Fast</span>
                        </div>
                        <div className="text-center mt-2 font-mono text-xl font-bold">{speed} cm/s</div>
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">🚑</div>
                            <div>
                                <h5 className="font-bold text-white text-sm">The Ambulance Analogy</h5>
                                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                                    Just like an ambulance siren sounds <strong>higher pitched</strong> as it comes <strong>TOWARDS</strong> you (compressed waves), and <strong>lower pitched</strong> as it goes <strong>AWAY</strong> (stretched waves), ultrasound works the same way.
                                </p>
                                <div className="mt-3 flex gap-2 text-[10px] font-mono uppercase">
                                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30">Towards = Higher Freq</span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">Away = Lower Freq</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};


// --- Section 2: Doppler Modes (REFINED) ---
const DopplerModesSection: React.FC = () => {
    const [mode, setMode] = useState<DopplerMode>('PW');
    const [gateDepth, setGateDepth] = useState(50); // %

    const isGateInVessel = gateDepth > 45 && gateDepth < 55;

    const ModeInfo = {
        'CW': { title: "Continuous Wave (CW)", desc: "Uses two crystals to continuously send and receive. It can measure very high velocities without aliasing but suffers from range ambiguity (no depth information)."},
        'PW': { title: "Pulsed Wave (PW)", desc: "Uses one crystal to send short pulses and listen at a specific depth (range resolution). It is subject to aliasing at high velocities."},
        'Color': { title: "Color Doppler", desc: "Provides real-time, 2D visualization of blood flow direction and mean velocity overlaid on a B-mode image. It is angle-dependent and subject to aliasing."},
        'Power': { title: "Power Doppler", desc: "Detects the presence and strength (amplitude) of flow, not direction or velocity. It is highly sensitive to slow flow and less angle-dependent."},
    };
    type DopplerMode = keyof typeof ModeInfo;

    // Scrolling Path for PW Trace: 4 cycles of waveform
    // Cycle: Flat(25) -> Peak(10) -> Dip(25) -> Flat(40) = 100 width
    // 400 total width to cover 300 viewbox and scroll
    const scrollingPath = "M 0 50 L 25 50 L 35 20 L 60 40 L 75 50 L 100 50 L 125 50 L 135 20 L 160 40 L 175 50 L 200 50 L 225 50 L 235 20 L 260 40 L 275 50 L 300 50 L 325 50 L 335 20 L 360 40 L 375 50 L 400 50";

    return (
        <DemoSection
            title="Doppler Modes Explained"
            description="Each Doppler mode has unique advantages. In this interactive lab, drag the Pulsed Wave (PW) sample gate. Notice how a spectral waveform ONLY appears when the gate is correctly placed inside the vessel, demonstrating the principle of range resolution."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                 <div className="w-full lg:w-1/3 flex flex-col gap-2">
                    <h4 className="text-white/80 mb-2 text-center text-sm font-bold uppercase tracking-wider">Select Mode</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        {(Object.keys(ModeInfo) as DopplerMode[]).map(m => (
                            <ControlButton key={m} onClick={() => setMode(m)} secondary={mode !== m}>{ModeInfo[m].title}</ControlButton>
                        ))}
                    </div>
                    <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10 flex-grow">
                        <p className="text-sm text-white/80 leading-relaxed">{ModeInfo[mode].desc}</p>
                    </div>
                </div>
                <div className="w-full lg:w-2/3 flex flex-col gap-4">
                    <div className="relative h-72 bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                        {/* 3D Vessel Effect */}
                        <div className="absolute w-full h-16 top-1/2 -translate-y-1/2 bg-gradient-to-b from-red-950 via-red-900 to-red-950 border-y border-red-500/20">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="absolute w-2 h-2 bg-red-400 rounded-full shadow-[0_0_4px_rgba(248,113,113,0.8)] opacity-60" style={{ top: `${Math.random() * 80 + 10}%`, animation: `pw-doppler-flow 4s linear infinite`, animationDelay: `${Math.random() * 2}s`}} />
                            ))}
                        </div>
                        
                        {mode === 'CW' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-cyan-400/20 border-x border-cyan-400/30 animate-[cw-beam-shimmer_2s_ease-in-out_infinite]"></div>}
                        
                        {mode === 'PW' && <>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-yellow-400/30 dashed"></div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-cyan-400/5">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400/80 rounded-full blur-sm animate-[pw-pulse-travel_2s_linear_infinite]"></div>
                            </div>
                            <div className="absolute w-24 h-1 left-1/2 -translate-x-1/2 bg-yellow-400 cursor-ns-resize z-20 flex items-center justify-center gap-8" style={{ top: `${gateDepth}%` }}>
                                <div className="w-1 h-3 bg-yellow-400"></div>
                                <div className="w-1 h-3 bg-yellow-400"></div>
                            </div>
                            <input type="range" min="10" max="90" value={gateDepth} onChange={e => setGateDepth(Number(e.target.value))} className="absolute w-24 h-10 left-1/2 -translate-x-1/2 cursor-ns-resize opacity-0 z-30" style={{ top: `${gateDepth - 5}%` }} />
                        </>}
                        
                        {mode === 'Color' && <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white/50 bg-gradient-to-b from-red-600/60 via-transparent to-blue-600/60 animate-[color-doppler-flow_1s_linear_infinite] mix-blend-screen"></div>}
                        
                        {mode === 'Power' && <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-dashed border-white/50 bg-orange-500/60 animate-[power-doppler-flow_2s_ease-in-out_infinite] mix-blend-screen"></div>}
                    </div>
                    
                     {mode === 'PW' && (
                         <div className="h-32 bg-black rounded-xl p-2 relative border border-white/10 overflow-hidden">
                             {/* Spectral Grid */}
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                             
                             {/* Live Sweep Line */}
                             <motion.div 
                                className="absolute top-0 bottom-0 w-0.5 bg-green-500/50 z-20 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                animate={{ left: ['0%', '100%'] }}
                                transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                             />

                             <svg width="100%" height="100%" viewBox="0 0 300 100" className="relative z-10">
                                <AnimatePresence mode="wait">
                                    {isGateInVessel ? (
                                        <motion.path 
                                            key="scrolling"
                                            d={scrollingPath}
                                            stroke="#fef08a" 
                                            strokeWidth="2" 
                                            fill="none"
                                            strokeLinejoin="round"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, x: [-100, 0] }} // Scroll pattern
                                            exit={{ opacity: 0 }}
                                            transition={{ 
                                                opacity: { duration: 0.2 },
                                                x: { repeat: Infinity, duration: 1.5, ease: "linear" } 
                                            }}
                                        />
                                    ) : (
                                        <motion.path 
                                            key="flat"
                                            d="M 0 50 H 300" 
                                            stroke="#fef08a" 
                                            strokeWidth="2" 
                                            fill="none"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                             </svg>
                             <div className="absolute top-2 right-2 text-[10px] text-[var(--gold)] font-mono bg-black/50 px-2 rounded border border-[var(--gold)]/20">PW SPECTRAL TRACE</div>
                         </div>
                     )}
                </div>
            </div>
        </DemoSection>
    );
}

// --- Section 3: Clinical Simulation ---
const ClinicalSimulation: React.FC = () => {
    const [choiceA, setChoiceA] = useState<string | null>(null);
    const [choiceB, setChoiceB] = useState<string | null>(null);

    return (
        <DemoSection
            title="Clinical Simulation: Choosing the Right Mode"
            description="Apply your knowledge. For each clinical scenario, choose the most appropriate Doppler mode to obtain the required diagnostic information."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Scenario A */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">🫀</div>
                        <h4 className="font-bold text-white">Case A: Mitral Stenosis</h4>
                    </div>
                    <p className="text-sm text-white/70 mb-6 flex-grow">You suspect extremely high velocities across the valve (> 2 m/s). You must quantify the peak velocity accurately, but precise depth localization is less critical.</p>
                    <div className="flex gap-2">
                        <ControlButton onClick={() => setChoiceA('CW')} fullWidth secondary={choiceA !== 'CW'}>CW Doppler</ControlButton>
                        <ControlButton onClick={() => setChoiceA('PW')} fullWidth secondary={choiceA !== 'PW'}>PW Doppler</ControlButton>
                    </div>
                    {choiceA && (
                        <div className={`mt-4 p-3 rounded-lg text-sm border ${choiceA === 'CW' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                            <strong className="font-bold">{choiceA === 'CW' ? 'Correct!' : 'Incorrect.'}</strong> CW Doppler measures high velocities without aliasing, making it ideal here.
                        </div>
                    )}
                </div>
                 {/* Scenario B */}
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-xl">🧠</div>
                        <h4 className="font-bold text-white">Case B: Carotid Plaque</h4>
                    </div>
                    <p className="text-sm text-white/70 mb-6 flex-grow">You need to measure flow velocity precisely within a specific narrow segment of the carotid artery to determine the degree of stenosis.</p>
                    <div className="flex gap-2">
                        <ControlButton onClick={() => setChoiceB('CW')} fullWidth secondary={choiceB !== 'CW'}>CW Doppler</ControlButton>
                        <ControlButton onClick={() => setChoiceB('PW')} fullWidth secondary={choiceB !== 'PW'}>PW Doppler</ControlButton>
                    </div>
                    {choiceB && (
                        <div className={`mt-4 p-3 rounded-lg text-sm border ${choiceB === 'PW' ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                             <strong className="font-bold">{choiceB === 'PW' ? 'Correct!' : 'Incorrect.'}</strong> PW Doppler provides range resolution, allowing specific sampling of the stenotic jet.
                        </div>
                    )}
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 4: Doppler Aliasing Lab ---
const DopplerAliasingSection: React.FC = () => {
    const [velocity, setVelocity] = useState(50); // cm/s
    const [prf, setPrf] = useState(6); // kHz
    const [baselineShift, setBaselineShift] = useState(0); // -50 to 50

    const NYQUIST_LIMIT_KHZ = prf / 2;
    const DOPPLER_SHIFT_SCALE_FACTOR = 0.08; // Simplified kHz per cm/s
    const trueDopplerShiftKhz = velocity * DOPPLER_SHIFT_SCALE_FACTOR;
    const isAliasing = trueDopplerShiftKhz > NYQUIST_LIMIT_KHZ;
    
    const nyquistVelocity = NYQUIST_LIMIT_KHZ / DOPPLER_SHIFT_SCALE_FACTOR;
    
    const waveformPath = useMemo(() => {
        const baselineY = 50 - baselineShift;
        const scaleHeight = 100; // viewbox height
        const nyquistHeight = scaleHeight / 2;

        let path = `M 0 ${baselineY}`;
        const peakShift = (trueDopplerShiftKhz / NYQUIST_LIMIT_KHZ) * nyquistHeight;

        for (let i = 0; i < 4; i++) {
            const x = i * 75;
            let peakY = baselineY - peakShift;

            if (peakY < 0) { // Aliasing occurred
                const overshoot = -peakY;
                peakY = 100 - (overshoot % scaleHeight);
            }
            path += ` L ${x + 25} ${baselineY} L ${x + 37.5} ${peakY} L ${x + 50} ${baselineY + 5} L ${x + 75} ${baselineY}`;
        }
        return path;
    }, [trueDopplerShiftKhz, NYQUIST_LIMIT_KHZ, baselineShift]);

    return (
        <DemoSection
            title="Interactive Doppler Aliasing Lab"
            description="Aliasing occurs when the Doppler shift exceeds the Nyquist Limit (half the PRF). The waveform wraps around, and flow color reverses. Use controls to fix it."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualization Pane */}
                <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    {/* B-Mode Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black"></div>
                    
                    {/* Transducer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-b-xl border-b border-x border-gray-600 z-20"></div>
                    
                    {/* Vessel */}
                    <div className="absolute w-full h-16 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 top-1/2 -translate-y-1/2 opacity-50"></div>
                    
                    <div className="absolute w-full h-12 top-1/2 -translate-y-1/2 overflow-hidden">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="absolute w-2.5 h-2.5 rounded-full shadow-sm" style={{
                                backgroundColor: isAliasing ? '#67e8f9' : '#f87171', // cyan when aliasing, red otherwise
                                top: `${Math.random() * 80 + 10}%`,
                                animation: `pw-doppler-flow ${400 / velocity}s linear infinite`,
                                animationDelay: `${Math.random() * 2}s`,
                                transition: 'background-color 0.3s'
                            }} />
                        ))}
                    </div>
                    {/* Sample Gate UI */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-yellow-400/30 dashed"></div>
                    <div className="absolute w-20 h-8 left-1/2 -translate-x-1/2 border-2 border-yellow-400/80 rounded top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                </div>

                {/* Controls & Spectral Display Pane */}
                <div className="flex flex-col gap-4">
                    <div className="h-56 bg-black rounded-xl p-2 relative border border-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                        <svg width="100%" height="100%" viewBox="0 0 300 100" className="relative z-10">
                            <defs>
                                <linearGradient id="aliasing-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fef08a" />
                                    <stop offset="100%" stopColor="#facc15" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                            <motion.line x1="0" x2="300" stroke="#666" strokeWidth="1" strokeDasharray="4"
                                animate={{ y1: 50 - baselineShift, y2: 50 - baselineShift }}
                            />
                            <motion.line x1="0" x2="300" stroke="#f87171" strokeWidth="1" strokeDasharray="2" 
                                animate={{ y1: 0, y2: 0 }}
                            />
                             <motion.line x1="0" x2="300" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2" 
                                animate={{ y1: 100, y2: 100 }}
                            />
                            <motion.path d={waveformPath} stroke="#facc15" strokeWidth="2" fill="url(#aliasing-fill)" />
                        </svg>
                        <motion.div className="absolute left-2 text-[10px] text-red-300 font-mono bg-black/50 px-1 rounded" animate={{ top: 2 }}>+{nyquistVelocity.toFixed(0)} cm/s</motion.div>
                        <motion.div className="absolute left-2 text-[10px] text-blue-300 font-mono bg-black/50 px-1 rounded" animate={{ bottom: 2 }}>-{nyquistVelocity.toFixed(0)} cm/s</motion.div>
                    </div>
                    
                    <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                        <div>
                            <label className="block text-white/80 mb-1 text-sm font-semibold">Blood Flow Velocity</label>
                            <input type="range" min="10" max="150" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                            <div className="flex justify-between text-xs text-white/40 mt-1"><span>Low</span><span>High ({velocity} cm/s)</span></div>
                        </div>
                        <div>
                            <label className="block text-white/80 mb-1 text-sm font-semibold">PRF (Scale)</label>
                            <input type="range" min="2" max="12" step="0.5" value={prf} onChange={e => setPrf(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                            <div className="flex justify-between text-xs text-white/40 mt-1"><span>Low</span><span>High ({prf.toFixed(1)} kHz)</span></div>
                        </div>
                        <div>
                            <label className="block text-white/80 mb-1 text-sm font-semibold">Baseline Shift</label>
                            <input type="range" min="-50" max="50" value={baselineShift} onChange={e => setBaselineShift(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                        </div>
                        <div className={`p-3 rounded-lg text-center font-bold border transition-colors duration-300 ${isAliasing ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-green-500/20 border-green-500/50 text-green-300'}`}>
                            {isAliasing ? '⚠️ ALIASING DETECTED' : '✅ OPTIMAL SETTINGS'}
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Gain vs. SNR Component ---
const GainSnrSection: React.FC = () => {
    const [outputPower, setOutputPower] = useState(50); // %
    const [receiverGain, setReceiverGain] = useState(50); // %

    const snr = useMemo(() => {
        // SNR is directly proportional to output power in this simulation
        return outputPower;
    }, [outputPower]);

    const imageStyle: React.CSSProperties = {
        // Gain controls brightness
        filter: `brightness(${0.5 + receiverGain / 100})`,
    };

    const noiseOverlayStyle: React.CSSProperties = {
        // SNR (from output power) controls noise visibility
        opacity: 0.6 - (snr / 100) * 0.55, // Opacity from 0.6 down to ~0.05
        backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bT1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlRGlmZnVzZExpZ2h0aW5nIGluPSJTb3VyY2VHcmFwaGljIiByZXN1bHQ9ImxpZ2h0IiBzdXJmYWNlU2NhbGU9IjEwIj48ZmVEaXN0YW50TGlnaHQgYXppbXV0aD0iMjIwIiBlbGV2YXRpb249IjgwIi8+PC9mZURpZmZ1c2VMaWdodGluZz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIvPjwvc3ZnPg==')`
    };

    return (
        <DemoSection
            title="Gain vs. Signal-to-Noise Ratio (SNR)"
            description="Understand the critical difference between Receiver Gain and Output Power. Output Power improves the actual signal quality (SNR), while Gain only amplifies both the signal and the noise."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image and SNR Meter */}
                <div className="flex flex-col gap-4">
                    <div className="relative h-64 bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-800 to-black flex items-center justify-center" style={imageStyle}>
                            <div className="w-32 h-32 rounded-full border-8 border-gray-400/50"></div>
                            <div className="absolute w-16 h-16 rounded-xl bg-gray-500/80 top-[30%] left-[30%] rotate-12"></div>
                        </div>
                        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay" style={noiseOverlayStyle}></div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-sm text-white/70 font-bold">Signal-to-Noise Ratio (SNR)</p>
                            <span className="text-xs font-mono text-[var(--gold)]">{snr}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                                animate={{ width: `${snr}%` }}
                                transition={{ type: 'spring', stiffness: 50 }}
                            />
                        </div>
                         <p className="text-[10px] text-center mt-2 text-white/40 uppercase tracking-widest">SNR affected by Output Power only</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col justify-center gap-6">
                     <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-green-500/30 transition-colors">
                        <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                            Output Power (Transmitter)
                        </h4>
                        <input type="range" min="10" max="100" value={outputPower} onChange={e => setOutputPower(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                        <p className="text-xs text-white/60 mt-2 leading-relaxed">Increases the strength of the pulse sent into the body. Improves SNR but increases patient exposure.</p>
                    </div>
                     <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:border-yellow-400/30 transition-colors">
                        <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zM3.75 10a.75.75 0 01.75-.75h11.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                           Receiver Gain
                        </h4>
                        <input type="range" min="10" max="100" value={receiverGain} onChange={e => setReceiverGain(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                         <p className="text-xs text-white/60 mt-2 leading-relaxed">Amplifies the entire received signal (including noise). Makes image brighter but does NOT improve SNR.</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- New Section: Doppler Waveform Analysis ---
const WAVEFORM_TYPES = {
    laminar: {
        title: "Laminar Flow (Normal)",
        description: "Characterized by a narrow, well-defined waveform and a clear 'spectral window' below the peak. This indicates that most red blood cells are moving at a uniform velocity, typical of normal arteries.",
        path: "M 0 80 L 25 80 C 35 80, 40 30, 50 30 C 60 30, 65 80, 75 80 L 150 80 L 175 80 C 185 80, 190 30, 200 30 C 210 30, 215 80, 225 80 L 300 80",
        fill: "none",
    },
    turbulent: {
        title: "Turbulent Flow (Spectral Broadening)",
        description: "The spectral window is filled in, indicating a wide range of velocities. This 'spectral broadening' is caused by chaotic, disorganized flow, often seen just distal to a significant stenosis.",
        path: "M 0 80 L 25 80 C 35 80, 40 30, 50 30 C 60 30, 65 80, 75 80 L 150 80 L 175 80 C 185 80, 190 30, 200 30 C 210 30, 215 80, 225 80 L 300 80",
        fill: "url(#waveform-fill-gradient)",
    },
    high_resistance: {
        title: "High Resistance (Triphasic)",
        description: "Features a sharp systolic upstroke, brief flow reversal in early diastole (below the baseline), and little to no flow in late diastole. Typical of arteries supplying high-resistance vascular beds, like a resting extremity.",
        path: "M 0 50 L 25 50 C 35 50, 40 20, 50 20 C 60 20, 65 50, 70 50 L 75 50 L 85 65 L 100 45 L 125 50 L 150 50 L 175 50 C 185 50, 190 20, 200 20 C 210 20, 215 50, 220 50 L 225 50 L 235 65 L 250 45 L 275 50 L 300 50",
        fill: "none",
    },
    low_resistance: {
        title: "Low Resistance (Monophasic)",
        description: "Shows a broad systolic peak and continuous, forward flow throughout diastole. This pattern is normal for arteries supplying low-resistance vascular beds that need constant blood supply, such as the internal carotid artery or renal arteries.",
        path: "M 0 80 L 25 80 C 45 80, 50 30, 75 30 C 100 30, 110 55, 150 60 L 175 62 C 195 62, 200 35, 225 35 C 250 35, 260 58, 300 65",
        fill: "none",
    },
    tardus_parvus: {
        title: "Tardus Parvus",
        description: "A monophasic waveform characterized by a slow-rising, delayed systolic upstroke ('tardus') and a low amplitude peak ('parvus'). This is a sign of a significant stenosis located proximal (upstream) to the point of measurement.",
        path: "M 0 80 L 25 80 C 60 80, 70 55, 100 55 C 130 55, 140 80, 150 80 L 175 80 C 210 80, 220 55, 250 55 C 280 55, 290 80, 300 80",
        fill: "none",
    }
};

type WaveformType = keyof typeof WAVEFORM_TYPES;

const DopplerWaveformAnalysisSection: React.FC = () => {
    const [waveform, setWaveform] = useState<WaveformType>('laminar');
    const activeWaveform = WAVEFORM_TYPES[waveform];

    return (
        <DemoSection
            title="Doppler Waveform Analysis"
            description="The shape of the Doppler waveform provides critical diagnostic information about blood flow and downstream vascular resistance. Select a waveform type to learn its significance."
        >
            <div className="flex flex-col md:flex-row gap-8">
                {/* Spectral Display */}
                <div className="w-full md:w-2/3 h-64 bg-black/80 rounded-xl p-4 relative border border-white/10">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <svg key={waveform} width="100%" height="100%" viewBox="0 0 300 100" className="relative z-10">
                        <defs>
                            <linearGradient id="waveform-fill-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="100%" stopColor="#facc15" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#444" strokeWidth="1.5" />
                        <motion.path 
                            d={activeWaveform.path} 
                            stroke="#fef08a" 
                            strokeWidth="2.5" 
                            fill={activeWaveform.fill}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ strokeDashoffset: 1000 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            strokeDasharray="1000"
                        />
                    </svg>
                </div>
                {/* Info Panel */}
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 min-h-[16rem] flex flex-col justify-center">
                        <h4 className="font-bold text-[var(--gold)] mb-3 text-lg">{activeWaveform.title}</h4>
                        <p className="text-sm text-white/80 leading-relaxed">{activeWaveform.description}</p>
                    </div>
                </div>
            </div>
            {/* Controls */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(Object.keys(WAVEFORM_TYPES) as WaveformType[]).map(key => (
                    <ControlButton key={key} onClick={() => setWaveform(key)} secondary={waveform !== key}>
                        {WAVEFORM_TYPES[key].title.split(' (')[0]}
                    </ControlButton>
                ))}
            </div>
        </DemoSection>
    );
};


const DopplerDemo: React.FC = () => {
  return (
    <div className="space-y-12">
      <DopplerEquationLab />
      <DopplerModesSection />
      <ClinicalSimulation />
      <DopplerAliasingSection />
      <GainSnrSection />
      <DopplerWaveformAnalysisSection />
      <KnowledgeCheck
        moduleId="doppler"
        question="Aliasing occurs in PW Doppler when..."
        options={["The Doppler angle is 90 degrees.", "The flow is moving too slowly.", "The Doppler shift exceeds the Nyquist limit.", "Continuous wave Doppler is used."]}
        correctAnswer="The Doppler shift exceeds the Nyquist limit."
        explanation="Aliasing is an artifact that occurs when the Doppler shift from high-velocity flow exceeds half of the Pulse Repetition Frequency (PRF). This limit is known as the Nyquist limit."
      />
    </div>
  );
};

export default DopplerDemo;
