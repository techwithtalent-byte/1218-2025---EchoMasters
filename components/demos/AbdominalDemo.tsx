
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 3: Renal Resistive Index (RI) Calculation Lab ---
const RenalRICalculationLab: React.FC = () => {
    const [psv, setPsv] = useState(60); // cm/s
    const [edv, setEdv] = useState(20); // cm/s

    const ri = useMemo(() => {
        if (psv === 0) return 0;
        return (psv - edv) / psv;
    }, [psv, edv]);

    const interpretation = useMemo(() => {
        if (ri < 0.7) return { text: "Normal Resistance", color: "text-green-400" };
        if (ri <= 0.8) return { text: "Borderline / Indeterminate", color: "text-yellow-400" };
        return { text: "High Resistance (Abnormal)", color: "text-red-400" };
    }, [ri]);

    const waveformPath = `M 0 80 L 50 80 L 75 ${80 - psv/2} C 100 ${80 - psv/2.5}, 125 ${80 - edv/2}, 150 ${80 - edv/2} L 200 80 L 250 80 L 275 ${80 - psv/2} C 300 ${80 - psv/2.5}, 325 ${80 - edv/2}, 350 ${80 - edv/2} L 400 80`;

    return (
        <DemoSection
            title="Renal Resistive Index (RI) Calculation Lab"
            description="The RI is a measure of downstream vascular resistance in the kidney. It's calculated from the spectral Doppler waveform using the formula: RI = (PSV - EDV) / PSV. A normal RI is < 0.7."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-2/3 flex flex-col gap-4">
                    <div className="h-64 graticule-bg rounded-xl p-2 relative">
                         <svg width="100%" height="100%" viewBox="0 0 400 100">
                            <path d={waveformPath} stroke="#fff" strokeWidth="2" fill="#fff" fillOpacity="0.3" style={{ transition: 'd 0.2s' }} />
                            {/* PSV Line */}
                            <line x1="75" y1={80 - psv/2} x2="400" y2={80 - psv/2} stroke="#f87171" strokeWidth="1" strokeDasharray="2" />
                            <text x="5" y={80 - psv/2 + 3} fill="#f87171" fontSize="8" className="font-mono">PSV: {psv}</text>
                            {/* EDV Line */}
                            <line x1="150" y1={80 - edv/2} x2="400" y2={80 - edv/2} stroke="#60a5fa" strokeWidth="1" strokeDasharray="2" />
                            <text x="5" y={80 - edv/2 + 3} fill="#60a5fa" fontSize="8" className="font-mono">EDV: {edv}</text>
                        </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-red-300 text-sm mb-1">Peak Systolic Velocity (PSV)</label>
                            <input type="range" min="30" max="150" value={psv} onChange={e => setPsv(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-400" />
                        </div>
                        <div>
                            <label className="block text-blue-300 text-sm mb-1">End Diastolic Velocity (EDV)</label>
                            <input type="range" min="5" max={psv} value={edv} onChange={e => setEdv(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-white/10 p-6 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm text-white/70">RI = ({psv} - {edv}) / {psv}</p>
                    <p className="text-5xl font-bold text-white mt-2">{ri.toFixed(2)}</p>
                    <p className={`text-xl font-semibold mt-3 ${interpretation.color}`}>{interpretation.text}</p>
                </div>
            </div>
        </DemoSection>
    );
};


const AbdominalDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <RenalRICalculationLab />
        </div>
    );
};

export default AbdominalDemo;
