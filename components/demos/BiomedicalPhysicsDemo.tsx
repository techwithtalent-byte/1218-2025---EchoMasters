import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

const TISSUES = {
    'Fat': { impedance: 1.38, speed: 1450, attenuation: 0.63 },
    'Liver': { impedance: 1.65, speed: 1570, attenuation: 0.75 },
    'Muscle': { impedance: 1.70, speed: 1580, attenuation: 1.09 },
    'Bone': { impedance: 7.80, speed: 4080, attenuation: 5.0 },
    'Air': { impedance: 0.0004, speed: 330, attenuation: 12.0 },
};

type TissueKey = keyof typeof TISSUES;

// --- Section 1: Acoustic Impedance Mismatch ---
const ImpedanceMismatchSection: React.FC = () => {
    const [tissue1, setTissue1] = useState<TissueKey>('Fat');
    const [tissue2, setTissue2] = useState<TissueKey>('Muscle');

    const { reflectionCoefficient, transmissionCoefficient } = useMemo(() => {
        const z1 = TISSUES[tissue1].impedance;
        const z2 = TISSUES[tissue2].impedance;
        
        const rc = Math.pow((z2 - z1) / (z2 + z1), 2) * 100; // As percentage
        const tc = 100 - rc;

        return { reflectionCoefficient: rc, transmissionCoefficient: tc };
    }, [tissue1, tissue2]);

    return (
        <DemoSection
            title="Acoustic Impedance Mismatch"
            description="The amount of reflection at a tissue boundary is determined by the difference in acoustic impedance (Z). A large mismatch causes a strong reflection, while a small mismatch allows most of the sound to pass through."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-900 rounded-xl relative overflow-hidden">
                    <div className="absolute w-1/2 h-full top-0 left-0 p-4" style={{ backgroundColor: `rgba(255, 255, 255, ${TISSUES[tissue1].impedance / 8})` }}>
                        <p className="font-bold text-black">{tissue1}</p>
                        <p className="text-xs text-black/70">Z = {TISSUES[tissue1].impedance.toFixed(2)}</p>
                    </div>
                    <div className="absolute w-1/2 h-full top-0 right-0 p-4" style={{ backgroundColor: `rgba(255, 255, 255, ${TISSUES[tissue2].impedance / 8})` }}>
                        <p className="font-bold text-black text-right">{tissue2}</p>
                         <p className="text-xs text-black/70 text-right">Z = {TISSUES[tissue2].impedance.toFixed(2)}</p>
                    </div>

                    {/* Incident Pulse */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-4 bg-orange-500" style={{ animation: `pulse-race 2s linear infinite`}} />
                    {/* Reflected & Transmitted Beams */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-yellow-400" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-48 h-full origin-left -translate-x-1/2 bg-gradient-to-r from-orange-500/80 to-transparent" style={{ transform: 'scaleX(-1)', opacity: reflectionCoefficient / 100 }} />
                    <div className="absolute top-0 bottom-0 left-1/2 w-48 h-full origin-left -translate-x-1/2 bg-gradient-to-r from-orange-500/80 to-transparent" style={{ opacity: transmissionCoefficient / 100 }} />
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                            <label className="text-sm text-white/70">Tissue 1</label>
                            <select onChange={(e) => setTissue1(e.target.value as TissueKey)} value={tissue1} className="w-full bg-gray-700 p-2 rounded text-white">
                                {(Object.keys(TISSUES) as TissueKey[]).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm text-white/70">Tissue 2</label>
                             <select onChange={(e) => setTissue2(e.target.value as TissueKey)} value={tissue2} className="w-full bg-gray-700 p-2 rounded text-white">
                                {(Object.keys(TISSUES) as TissueKey[]).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                        <p className="text-sm text-white/70">Reflection:</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">{reflectionCoefficient.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-2 text-center">
                        <p className="text-sm text-white/70">Transmission:</p>
                        <p className="text-2xl font-bold text-white mt-1">{transmissionCoefficient.toFixed(1)}%</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Attenuation Spectrum ---
const AttenuationSpectrumSection: React.FC = () => {
    const [tissue, setTissue] = useState<TissueKey>('Liver');
    const { attenuation, color } = {
        'Fat': { attenuation: 0.63, color: '#fde047' }, // yellow-300
        'Liver': { attenuation: 0.75, color: '#fb923c' }, // orange-400
        'Muscle': { attenuation: 1.09, color: '#f87171' }, // red-400
        'Bone': { attenuation: 5.0, color: '#d1d5db' }, // gray-300
        'Air': { attenuation: 12.0, color: '#93c5fd' }, // blue-300
    }[tissue];

    const pathData = useMemo(() => {
        let d = "M 0 100";
        for (let freq = 1; freq <= 15; freq++) {
            const x = (freq - 1) / 14 * 100;
            const y = 100 - (attenuation * freq) * 2; // Scaling factor
            d += ` L ${x} ${y}`;
        }
        return d;
    }, [attenuation]);

    return (
        <DemoSection
            title="Interactive Attenuation Spectrum"
            description="Attenuation is frequency-dependent. Higher frequencies attenuate more rapidly. This effect varies significantly between different tissue types."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-900 rounded-lg p-4 relative">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d={pathData} fill="none" stroke={color} strokeWidth="2" style={{ transition: 'd 0.3s' }} />
                    </svg>
                    <span className="absolute bottom-1 right-2 text-xs text-white/50">Frequency (MHz) →</span>
                    <span className="absolute top-1/2 -left-4 text-xs text-white/50 transform -rotate-90">Attenuation (dB)</span>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                     <h4 className="text-white/80 mb-1 text-center">Select Tissue:</h4>
                    {(Object.keys(TISSUES) as TissueKey[]).map(t => (
                        <ControlButton key={t} onClick={() => setTissue(t)} secondary={tissue !== t}>
                            {t}
                        </ControlButton>
                    ))}
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Rayleigh Scattering ---
const RayleighScatteringSection: React.FC = () => {
    const [frequency, setFrequency] = useState(3); // MHz

    return (
        <DemoSection
            title="Rayleigh Scattering"
            description="When the sound beam encounters structures much smaller than its wavelength (like red blood cells), the sound scatters uniformly in all directions. This effect increases dramatically with frequency (∝ f⁴)."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute top-4 left-4 w-48 h-2 rounded-full bg-orange-500" style={{ transform: `scaleX(${1 - (frequency-1)/14})`, transformOrigin: 'left' }} />
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 bg-red-400 rounded-full" style={{ animation: `rayleigh-scatter 1s ease-in-out infinite alternate`, animationDelay: `${i*0.1}s`}}>
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="absolute inset-0 rounded-full border border-red-500/50" style={{ transform: `scale(${frequency*0.8}) rotate(${j*90}deg)`, opacity: `${1 - (j*0.2)}`, transition: 'all 0.3s' }} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Frequency</label>
                    <input type="range" min="1" max="15" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{frequency} MHz</div>
                </div>
            </div>
        </DemoSection>
    );
};


const BiomedicalPhysicsDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <ImpedanceMismatchSection />
            <AttenuationSpectrumSection />
            <RayleighScatteringSection />
        </div>
    );
};

export default BiomedicalPhysicsDemo;