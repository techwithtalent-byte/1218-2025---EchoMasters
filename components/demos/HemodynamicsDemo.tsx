
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';

// --- Section 1: Poiseuille's Law ---
const PoiseuillesLawSection: React.FC = () => {
    const [stenosisPercent, setStenosisPercent] = useState(0); // 0-80%

    const flowRate = useMemo(() => {
        const radius = 1 - (stenosisPercent / 100);
        return Math.pow(radius, 4) * 100;
    }, [stenosisPercent]);

    const vesselPath = `M 0 20 C 50 20, 50 ${20 - stenosisPercent * 0.2}, 100 0 C 150 ${20 - stenosisPercent * 0.2}, 150 20, 200 20 L 200 80 C 150 80, 150 ${80 + stenosisPercent * 0.2}, 100 100 C 50 ${80 + stenosisPercent * 0.2}, 50 80, 0 80 Z`;

    return (
        <DemoSection
            title="Poiseuille's Law: The Power of Radius"
            description="Blood flow is proportional to the vessel's radius to the fourth power (r⁴). This means even a small stenosis has a massive impact on flow."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-56 bg-gray-900 rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-white/10 shadow-inner">
                    <svg width="100%" height="100%" viewBox="0 0 200 100">
                        <defs>
                            <linearGradient id="vesselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                        <path d={vesselPath} fill="url(#vesselGradient)" stroke="#ef4444" strokeWidth="1" className="transition-all duration-300" />
                        {Array.from({ length: 15 }).map((_, i) => (
                            <circle key={i} cx={i * 14} cy="50" r="2" className="fill-red-300 opacity-70" style={{ animation: `pulse-race ${2 + (stenosisPercent/100)*8}s linear infinite`, animationDelay: `${i * 0.2}s`}} />
                        ))}
                    </svg>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2 font-semibold">Stenosis (% Diameter)</label>
                    <input type="range" min="0" max="80" value={stenosisPercent} onChange={e => setStenosisPercent(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{stenosisPercent}%</div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-4 text-center">
                        <p className="text-xs text-white/70 uppercase tracking-widest">Resulting Flow Rate</p>
                        <p className="text-4xl font-bold text-white mt-1">{flowRate.toFixed(1)}%</p>
                        <p className="text-xs text-white/40 mt-1">of normal</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Flow Patterns ---
const FlowPatternsSection: React.FC = () => {
    const [velocity, setVelocity] = useState(50); // cm/s

    const isTurbulent = velocity > 150;
    const spectralBroadening = isTurbulent ? (velocity - 150) / 2 : 0;

    const waveformPath = `M 0 80 L 100 80 L 150 30 L 200 80 L 300 80`;

    return (
        <DemoSection
            title="Flow Patterns: Laminar vs. Turbulent"
            description="At low velocities, blood flows in smooth layers (laminar). At high velocities or past a stenosis, flow becomes chaotic (turbulent), which appears as 'spectral broadening' on Doppler."
        >
             <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-56 bg-gray-900 rounded-xl p-4 flex flex-col justify-around relative overflow-hidden border border-white/10 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent"></div>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="relative h-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="absolute w-8 h-1 bg-red-400 rounded-full shadow-[0_0_5px_rgba(248,113,113,0.5)]" style={{ 
                                    left: `${i * 10}%`, 
                                    top: `${50}%`,
                                    transform: `translateY(-50%) ${isTurbulent ? `rotate(${(Math.random() - 0.5) * 60}deg) translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)` : ''}`,
                                    animation: `pulse-race ${300 / velocity}s linear infinite`,
                                    animationDelay: `${i * 0.1}s`,
                                    transition: 'transform 0.3s'
                                }} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/3 h-56 bg-black rounded-xl p-2 border border-white/20 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <svg width="100%" height="100%" viewBox="0 0 300 100" className="relative z-10">
                        <path d={waveformPath} stroke="#fff" strokeWidth="2" fill="none" opacity="0.3" />
                        <path d={waveformPath} stroke="#facc15" strokeWidth={Math.max(2, spectralBroadening)} fill="none" style={{ filter: `blur(${spectralBroadening/4}px)`, transition: 'stroke-width 0.3s' }} />
                    </svg>
                    <div className="absolute bottom-2 right-2 text-xs font-mono text-white/50">Spectral Trace</div>
                </div>
            </div>
            <div className="mt-6">
                <label className="block text-white/80 mb-2 font-semibold">Flow Velocity</label>
                <input type="range" min="30" max="300" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-white/50">Laminar</span>
                    <span className="font-mono text-lg text-yellow-400">{velocity} cm/s</span>
                    <span className="text-xs text-white/50">Turbulent</span>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Vascular Resistance ---
type ResistanceType = 'High' | 'Low (Exercise)' | 'Low (Organ)';
const WAVEFORM_DATA = {
    'High': "M 0 80 L 50 80 L 75 20 L 100 85 L 125 75 L 150 80 L 200 80 L 225 20 L 250 85 L 275 75 L 300 80",
    'Low (Exercise)': "M 0 80 L 50 80 L 100 30 L 150 60 L 200 80 L 250 30 L 300 60",
    'Low (Organ)': "M 0 80 Q 50 80, 100 40 T 200 40 T 300 40",
};

const VascularResistanceSection: React.FC = () => {
    const [resistance, setResistance] = useState<ResistanceType>('High');

    const waveformPath = WAVEFORM_DATA[resistance];

    return (
        <DemoSection
            title="Vascular Resistance & Waveforms"
            description="Doppler waveforms reflect downstream resistance. High-resistance beds (resting muscle) show triphasic flow, while low-resistance beds (organs, exercising muscle) have continuous forward flow in diastole."
        >
            <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-2/3 h-56 bg-black rounded-xl p-2 border border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <svg key={resistance} width="100%" height="100%" viewBox="0 0 300 100" className="relative z-10">
                        <path d={waveformPath} stroke="#67e8f9" strokeWidth="3" fill="none" strokeDasharray="1000" style={{ animation: `draw-waveform 2s ease-out forwards`}} />
                    </svg>
                 </div>
                 <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                    <h4 className="text-white/80 mb-2 text-center text-sm font-bold uppercase tracking-widest">Select Vascular Bed</h4>
                    <div className="space-y-2">
                        {(['High', 'Low (Exercise)', 'Low (Organ)'] as ResistanceType[]).map(r => (
                            <ControlButton key={r} onClick={() => setResistance(r)} secondary={resistance !== r} fullWidth>
                                {r} Resistance
                            </ControlButton>
                        ))}
                    </div>
                 </div>
            </div>
        </DemoSection>
    );
}

const HemodynamicsDemo: React.FC = () => {
    return (
        <div className="space-y-12">
            <PoiseuillesLawSection />
            <FlowPatternsSection />
            <VascularResistanceSection />
            <KnowledgeCheck
                moduleId="hemodynamics"
                question="According to Poiseuille's Law, which factor has the greatest effect on blood flow?"
                options={["Blood Viscosity", "Vessel Length", "Pressure Gradient", "Vessel Radius"]}
                correctAnswer="Vessel Radius"
                explanation="Flow is proportional to the radius to the fourth power (r⁴). This exponential relationship means that even a small change in vessel radius has a massive impact on flow, far more than any other factor."
            />
        </div>
    );
};

export default HemodynamicsDemo;
