
import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 1: The Concept of Tissue Stiffness ---
const StiffnessConceptSection: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <DemoSection
            title="The Concept of Tissue Stiffness"
            description="Elastography is a method to visualize and measure how stiff or soft tissues are. Stiff tissues deform less under pressure than soft tissues."
        >
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl p-4 flex justify-around items-center">
                    {/* Soft Tissue */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-4 bg-gray-500 rounded-md transition-transform duration-300" style={{ transform: isPressed ? 'translateY(20px)' : 'translateY(0)' }} />
                        <div className="w-24 h-24 mt-2 bg-green-500/50 border-2 border-green-400 rounded-lg transition-transform duration-300" style={{ transform: isPressed ? 'scaleY(0.7)' : 'scaleY(1)' }} />
                        <p className="mt-2 font-semibold text-green-300">Soft Tissue</p>
                    </div>
                    {/* Hard Nodule */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-4 bg-gray-500 rounded-md transition-transform duration-300" style={{ transform: isPressed ? 'translateY(20px)' : 'translateY(0)' }} />
                        <div className="w-24 h-24 mt-2 bg-blue-500/50 border-2 border-blue-400 rounded-lg transition-transform duration-300" style={{ transform: isPressed ? 'scaleY(0.95)' : 'scaleY(1)' }} />
                        <p className="mt-2 font-semibold text-blue-300">Hard Nodule</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <ControlButton onClick={() => { setIsPressed(true); setTimeout(() => setIsPressed(false), 500); }}>
                        {isPressed ? 'Compressing...' : 'Apply Pressure'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Strain (Compression) Elastography ---
const StrainElastographySection: React.FC = () => {
    const [compression, setCompression] = useState(0);

    const elastogramOpacity = compression / 100;
    const tissueScaleY = 1 - (compression / 100) * 0.05;

    return (
        <DemoSection
            title="Strain (Compression) Elastography"
            description="This qualitative method uses manual compression to assess relative tissue stiffness. Softer tissues deform more (high strain), while harder tissues deform less (low strain)."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-600 rounded-xl relative overflow-hidden">
                    {/* B-Mode Image */}
                    <div className="absolute inset-0 transition-transform duration-100" style={{ transform: `scaleY(${tissueScaleY})` }}>
                        <div className="w-24 h-24 absolute bg-gray-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    {/* Elastogram Overlay */}
                    <div className="absolute inset-0 mix-blend-multiply transition-opacity duration-300" style={{ opacity: elastogramOpacity }}>
                        <div className="w-full h-full bg-gradient-to-br from-green-500 via-yellow-400 to-green-500"></div>
                        <div className="w-24 h-24 absolute bg-blue-600 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Applied Compression</label>
                    <input type="range" min="0" max="100" value={compression} onChange={e => setCompression(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{compression}%</div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-left text-sm">
                        <h4 className="font-bold text-yellow-400 mb-2">Color Map Key</h4>
                        <p><span className="font-bold text-green-400">Green/Yellow:</span> Soft (High Strain)</p>
                        <p><span className="font-bold text-blue-400">Blue:</span> Hard (Low Strain)</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Shear Wave Elastography (SWE) ---
const ShearWaveElastographySection: React.FC = () => {
    const [animationState, setAnimationState] = useState<'idle' | 'push' | 'waves' | 'map'>('idle');
    const [stiffness, setStiffness] = useState(1.5); // Shear wave speed in m/s

    const youngsModulus = 3 * Math.pow(stiffness, 2); // E = 3 * ρ * c², assuming ρ ≈ 1

    const handleSendPulse = () => {
        if (animationState !== 'idle') return;
        setAnimationState('push');
        setTimeout(() => setAnimationState('waves'), 300);
        setTimeout(() => setAnimationState('map'), 300 + 1500 / stiffness);
        setTimeout(() => setAnimationState('idle'), 4000);
    };

    return (
        <DemoSection
            title="Shear Wave Elastography (SWE)"
            description="This quantitative method uses an Acoustic Radiation Force Impulse (ARFI) to create tiny shear waves. The system measures how fast these waves travel—faster in stiff tissue, slower in soft tissue."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-600 rounded-xl relative overflow-hidden">
                    {/* Push Pulse */}
                    {animationState === 'push' &&
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-12 bg-yellow-300 rounded-full shadow-[0_0_20px_10px_#fef08a]" style={{ animation: 'arfi-push-pulse 0.3s ease-out forwards' }} />
                    }
                    {/* Shear Waves */}
                    {animationState === 'waves' && ['-8px', '8px'].map(offset =>
                        <div key={offset} className="absolute top-1/2 left-1/2 -translate-y-1/2 w-1 h-12 bg-cyan-300/80 rounded-full" style={{
                            transform: `translateX(${offset})`,
                            animation: `shear-wave-ripple ${1.5 / stiffness}s linear forwards`
                        }} />
                    )}
                    {/* Quantitative Map */}
                    {animationState === 'map' &&
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 rounded-lg border-2 border-white/50 animate-fade-in" style={{ background: `rgba(0, 100, 255, ${youngsModulus / 30})` }}>
                            <div className="absolute bottom-1 right-2 text-white font-bold">{youngsModulus.toFixed(1)} kPa</div>
                        </div>
                    }
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Tissue Stiffness (Shear Wave Speed)</label>
                    <input type="range" min="0.8" max="3.5" step="0.1" value={stiffness} onChange={e => setStiffness(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{stiffness.toFixed(1)} m/s</div>
                    <div className="mt-4">
                        <ControlButton onClick={handleSendPulse} disabled={animationState !== 'idle'} fullWidth>
                            {animationState === 'idle' ? 'Send ARFI Pulse' : 'Measuring...'}
                        </ControlButton>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Young's Modulus (E):</p>
                        <p className="text-2xl font-bold text-white mt-1">{youngsModulus.toFixed(1)} kPa</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 4: Clinical Simulation: Liver Fibrosis Staging ---
const FIBROSIS_STAGES = {
    'F0-F1': { stiffness: 5.5, color: 'rgba(0, 255, 0, 0.6)', label: "No to Mild Fibrosis" },
    'F2': { stiffness: 8.0, color: 'rgba(255, 255, 0, 0.6)', label: "Significant Fibrosis" },
    'F3': { stiffness: 11.0, color: 'rgba(255, 165, 0, 0.6)', label: "Severe Fibrosis" },
    'F4': { stiffness: 15.0, color: 'rgba(255, 0, 0, 0.6)', label: "Cirrhosis" },
};
type FibrosisStage = keyof typeof FIBROSIS_STAGES;

const ClinicalSimulationSection: React.FC = () => {
    const [stage, setStage] = useState<FibrosisStage>('F0-F1');

    const selectedStage = FIBROSIS_STAGES[stage];

    return (
        <DemoSection
            title="Clinical Simulation: Liver Fibrosis Staging"
            description="SWE is a non-invasive tool to stage liver fibrosis. Select a fibrosis stage to see the corresponding stiffness measurement and learn its clinical significance."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 rounded-xl relative overflow-hidden bg-gray-700">
                    <div className="absolute inset-0 bg-gray-600 opacity-50" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '6px 6px' }}></div>
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-4 border-dashed border-yellow-300 rounded-lg p-2">
                        <div className="w-full h-full rounded transition-colors duration-300" style={{ backgroundColor: selectedStage.color }}></div>
                        <span className="absolute -top-6 left-0 text-yellow-300 text-sm font-semibold">Measurement ROI</span>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <h4 className="text-white/80 mb-2 text-center">Select Fibrosis Stage:</h4>
                    <div className="flex flex-col gap-2">
                        {(Object.keys(FIBROSIS_STAGES) as FibrosisStage[]).map(s => (
                            <ControlButton key={s} onClick={() => setStage(s)} secondary={stage !== s}>{s}</ControlButton>
                        ))}
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Median Stiffness:</p>
                        <p className="text-2xl font-bold text-white mt-1">{selectedStage.stiffness.toFixed(1)} kPa</p>
                        <p className="text-md font-semibold text-yellow-400 mt-2">{selectedStage.label}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const ElastographyDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <StiffnessConceptSection />
            <StrainElastographySection />
            <ShearWaveElastographySection />
            <ClinicalSimulationSection />
        </div>
    );
};

export default ElastographyDemo;
