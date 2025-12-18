import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ControlSlider: React.FC<{ label: string; value: number | string; unit: string; min?: number; max?: number; step?: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, unit, min, max, step, onChange }) => (
    <div>
        <label className="block text-white/80 mb-2 text-sm">{label}: <span className="font-mono text-yellow-400">{value} {unit}</span></label>
        <input type="range" min={min} max={max} step={step} value={Number(value)} onChange={onChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
    </div>
);

export const LongitudinalWaveVisual: React.FC = () => {
    const particleCount = 200;
    const particles = useMemo(() => Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: (i % 20) * 5 + 2.5,
        y: Math.floor(i / 20) * 6 + 4,
    })), [particleCount]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 overflow-hidden my-4 not-prose">
            <div className="h-48 relative flex items-center mb-4 border-y-2 border-dashed border-white/10 py-4">
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-20 bg-[#d4af37] rounded-r-md z-10"
                    style={{ animation: `transducer-vibrate 0.1s linear infinite` }}
                ></div>
                
                <svg width="100%" height="100%" className="ml-4">
                    {/* Particles */}
                    {particles.map(p => (
                        <motion.circle 
                            key={p.id}
                            cx={p.x} 
                            cy={p.y} 
                            r="1" 
                            fill="#f4e4bc"
                            animate={{
                                cx: p.x + 3 * Math.sin(p.x * 0.2 + Date.now() / 250)
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    ))}
                     {/* Pressure Wave Overlay */}
                     <motion.path
                        d="M 0 50 C 25 10, 25 10, 50 50 S 75 90, 100 50 S 125 10, 150 50 S 175 90, 200 50"
                        stroke="url(#pressureGradient)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, -16] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <defs>
                        <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#f4e4bc" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-1/4 left-[15%] text-xs font-bold text-white bg-black/50 px-2 rounded">→ Compression</div>
                <div className="absolute bottom-1/4 left-[40%] text-xs font-bold text-white/70 bg-black/50 px-2 rounded">→ Rarefaction</div>
            </div>
        </div>
    );
};


export const WaveParametersVisual: React.FC = () => {
    const [frequency, setFrequency] = useState(5); // MHz
    const [amplitude, setAmplitude] = useState(50); // %
    const speedOfSound = 1.54; // mm/µs

    const { period, wavelength, pathData, cycleWidth } = useMemo(() => {
        const T = 1 / frequency;
        const lambda = speedOfSound / frequency;
        
        const numCycles = 4;
        const viewboxWidth = 200;
        const actualCycleWidth = (lambda / (speedOfSound/5)) * (viewboxWidth / numCycles); // Scale wavelength visually
        
        let path = "M 0 50";
        for (let i = 0; i < numCycles * 2; i++) { // draw more cycles to fill space
            const startX = i * actualCycleWidth;
            const cycleAmp = (amplitude / 100) * 45;
            path += ` Q ${startX + actualCycleWidth / 4} ${50 - cycleAmp}, ${startX + actualCycleWidth / 2} 50`;
            path += ` Q ${startX + actualCycleWidth * 3 / 4} ${50 + cycleAmp}, ${startX + actualCycleWidth} 50`;
        }

        return { period: T, wavelength: lambda, pathData: path, cycleWidth: actualCycleWidth };
    }, [frequency, amplitude]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="h-48 relative flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="w-full h-full overflow-hidden">
                    <path d="M 0 50 H 200" stroke="#444" strokeWidth="1" />
                    {/* Wavelength marker */}
                    <motion.g animate={{ x: cycleWidth - cycleWidth/2 }}>
                        <rect x="0" y="10" width={cycleWidth} height={80} fill="rgba(250, 204, 21, 0.1)" stroke="#facc15" strokeDasharray="2" strokeWidth="0.5"/>
                        <text x={cycleWidth/2} y="20" fill="#facc15" fontSize="6" textAnchor="middle">λ</text>
                    </motion.g>
                    {/* Amplitude marker */}
                    <motion.g animate={{ x: cycleWidth * 1.25 - cycleWidth/2 }}>
                        <line x1="0" y1={50 - (amplitude/100 * 45)} x2="0" y2="50" stroke="#67e8f9" strokeWidth="1" />
                        <text x="2" y={50 - (amplitude/200 * 45)} fill="#67e8f9" fontSize="5">A</text>
                    </motion.g>

                    <motion.path d={pathData} fill="none" stroke="#facc15" strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    />
                </svg>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ControlSlider label="Frequency" value={frequency.toFixed(1)} unit="MHz" min={1} max={10} step={0.5} onChange={e => setFrequency(Number(e.target.value))} />
                <ControlSlider label="Amplitude" value={amplitude} unit="%" min={10} max={100} onChange={e => setAmplitude(Number(e.target.value))} />
            </div>
             <div className="grid grid-cols-2 gap-4 mt-4 text-center bg-black/30 p-2 rounded-lg">
                <div><p className="text-sm text-white/70">Period (T):</p><p className="font-mono font-bold text-lg text-white">{period.toFixed(2)} µs</p></div>
                <div><p className="text-sm text-white/70">Wavelength (λ):</p><p className="font-mono font-bold text-lg text-white">{wavelength.toFixed(2)} mm</p></div>
            </div>
        </div>
    );
};


export const TissueInteractionVisual: React.FC = () => {
    const TISSUES = {
        'Fat': { impedance: 1.38, speed: 1450, color: 'rgba(253, 224, 71, 0.2)' },
        'Liver': { impedance: 1.65, speed: 1570, color: 'rgba(251, 146, 60, 0.2)' },
        'Muscle': { impedance: 1.70, speed: 1580, color: 'rgba(248, 113, 113, 0.2)' },
        'Bone': { impedance: 7.80, speed: 4080, color: 'rgba(209, 213, 219, 0.2)' },
        'Air': { impedance: 0.0004, speed: 330, color: 'rgba(147, 197, 253, 0.2)' },
    };
    type TissueKey = keyof typeof TISSUES;

    const [tab, setTab] = useState<'reflection' | 'refraction'>('reflection');
    const [tissue1, setTissue1] = useState<TissueKey>('Fat');
    const [tissue2, setTissue2] = useState<TissueKey>('Muscle');

    const { reflectionCoefficient, transmissionCoefficient, refractionAngle, incidentAngle } = useMemo(() => {
        const z1 = TISSUES[tissue1].impedance;
        const z2 = TISSUES[tissue2].impedance;
        const c1 = TISSUES[tissue1].speed;
        const c2 = TISSUES[tissue2].speed;
        const incAngle = 20; // degrees

        const rc = Math.pow((z2 - z1) / (z2 + z1), 2);
        const tc = 1 - rc;

        const sinIncident = Math.sin(incAngle * Math.PI / 180);
        const sinRefracted = sinIncident * (c2 / c1);
        const refrAngle = Math.asin(Math.min(1, sinRefracted)) * 180 / Math.PI;

        return { reflectionCoefficient: rc, transmissionCoefficient: tc, refractionAngle: refrAngle, incidentAngle: incAngle };
    }, [tissue1, tissue2]);
    
    const TissueSelector: React.FC<{id: 1|2}> = ({id}) => (
         <div>
            <label className="text-sm text-white/70">Tissue {id}</label>
            <select onChange={(e) => (id === 1 ? setTissue1(e.target.value as TissueKey) : setTissue2(e.target.value as TissueKey))} value={id === 1 ? tissue1: tissue2} className="w-full bg-gray-700 p-2 rounded text-white">
                {(Object.keys(TISSUES) as TissueKey[]).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
    );

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center border-b border-white/20 mb-4">
                <button onClick={() => setTab('reflection')} className={`px-4 py-2 text-sm font-semibold ${tab === 'reflection' ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-white/70'}`}>Reflection</button>
                <button onClick={() => setTab('refraction')} className={`px-4 py-2 text-sm font-semibold ${tab === 'refraction' ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-white/70'}`}>Refraction</button>
            </div>
            <div className="h-64 bg-black rounded-lg relative overflow-hidden flex">
                <div className="w-1/2 h-full" style={{ backgroundColor: TISSUES[tissue1].color }} />
                <div className="w-1/2 h-full" style={{ backgroundColor: TISSUES[tissue2].color }} />
                
                <AnimatePresence>
                    <motion.div key={tissue1+tissue2+tab} className="absolute inset-0">
                        {/* Incident Beam */}
                        <motion.div className="absolute w-2 h-40 bg-orange-500 origin-bottom" 
                            style={{ top: '50%', left: '50%', y: '-100%', rotate: tab === 'refraction' ? incidentAngle : 0 }}
                            initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ duration: 0.5, delay: 0.1 }} />
                        {/* Reflected Beam */}
                        <motion.div className="absolute w-2 bg-orange-500 origin-top"
                             style={{ top: '50%', left: '50%', rotate: tab === 'refraction' ? -incidentAngle : 0 }}
                             initial={{ height: 0, opacity: 0 }} animate={{ height: '40%', opacity: reflectionCoefficient }} transition={{ duration: 0.5, delay: 0.6 }} />
                         {/* Transmitted Beam */}
                        <motion.div className="absolute w-2 bg-orange-500 origin-top"
                             style={{ top: '50%', left: '50%', rotate: tab === 'refraction' ? refractionAngle : 0 }}
                             initial={{ height: 0, opacity: 0 }} animate={{ height: '40%', opacity: transmissionCoefficient }} transition={{ duration: 0.5, delay: 0.6 }} />
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <TissueSelector id={1} />
                <TissueSelector id={2} />
            </div>

            {tab === 'reflection' && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-center bg-black/30 p-2 rounded-lg">
                    <div><p className="text-sm text-white/70">Reflection:</p><p className="font-mono font-bold text-lg text-yellow-400">{(reflectionCoefficient*100).toFixed(1)}%</p></div>
                    <div><p className="text-sm text-white/70">Transmission:</p><p className="font-mono font-bold text-lg text-white">{(transmissionCoefficient*100).toFixed(1)}%</p></div>
                </div>
            )}
             {tab === 'refraction' && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-center bg-black/30 p-2 rounded-lg">
                    <div><p className="text-sm text-white/70">Incident Angle:</p><p className="font-mono font-bold text-lg text-white">{incidentAngle}°</p></div>
                    <div><p className="text-sm text-white/70">Refracted Angle:</p><p className="font-mono font-bold text-lg text-yellow-400">{refractionAngle.toFixed(1)}°</p></div>
                </div>
            )}
        </div>
    );
};