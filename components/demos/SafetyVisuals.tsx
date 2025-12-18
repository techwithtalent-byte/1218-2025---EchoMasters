import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ControlButton from './ControlButton';

export const BioeffectMechanismsVisual: React.FC = () => {
    const [effect, setEffect] = useState<'Thermal' | 'Mechanical'>('Thermal');

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setEffect('Thermal')} secondary={effect !== 'Thermal'}>Thermal (Heat)</ControlButton>
                <ControlButton onClick={() => setEffect('Mechanical')} secondary={effect !== 'Mechanical'}>Mechanical (Cavitation)</ControlButton>
            </div>
            <div className="relative h-64 bg-black rounded-lg flex items-center justify-center p-4 text-center">
                {effect === 'Thermal' && (
                    <motion.div key="thermal" initial={{opacity: 0}} animate={{opacity: 1}} className="w-full h-full flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold text-yellow-400 mb-4">Energy absorption causes particle vibration, generating heat.</p>
                        <div className="relative w-48 h-32">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="absolute w-1.5 h-1.5 bg-red-400 rounded-full" style={{
                                    top: `${Math.random() * 90 + 5}%`, left: `${Math.random() * 90 + 5}%`,
                                    animation: `particle-heat-vibration 1s ease-in-out infinite alternate`, animationDelay: `${Math.random() * 0.5}s`
                                }} />
                            ))}
                        </div>
                    </motion.div>
                )}
                 {effect === 'Mechanical' && (
                    <motion.div key="mechanical" initial={{opacity: 0}} animate={{opacity: 1}} className="w-full h-full flex flex-col items-center justify-center">
                         <p className="text-sm font-semibold text-cyan-300 mb-4">Pressure changes cause gas bubbles to form and violently collapse.</p>
                        <div className="relative w-48 h-32 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-cyan-400" style={{ animation: `bubble-cavitation 1.5s ease-in-out infinite` }}></div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export const SafetyIndicesVisual: React.FC = () => {
    type ImagingMode = 'B-Mode' | 'Color Doppler' | 'PW Doppler';
    const [mode, setMode] = useState<ImagingMode>('B-Mode');
    const [power, setPower] = useState(50);

    const { ti, mi } = useMemo(() => {
        let baseMI = 0.1, baseTI = 0.1;
        if (mode === 'Color Doppler') { baseMI = 0.4; baseTI = 0.5; }
        else if (mode === 'PW Doppler') { baseMI = 0.7; baseTI = 1.0; }
        return {
            mi: baseMI * (1 + (power / 100) * 1.5),
            ti: baseTI * (1 + (power / 100) * 2)
        };
    }, [mode, power]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-white/70 block mb-2">Imaging Mode</label>
                    <select onChange={(e) => setMode(e.target.value as ImagingMode)} value={mode} className="w-full bg-gray-700 p-2 rounded text-white">
                        <option>B-Mode</option><option>Color Doppler</option><option>PW Doppler</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm text-white/70 block mb-2">Output Power: {power}%</label>
                    <input type="range" min="10" max="100" value={power} onChange={e => setPower(Number(e.target.value))} className="w-full accent-yellow-400" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4 mt-4 text-center bg-black/30 p-4 rounded-lg">
                <div><p className="text-sm text-white/70">Thermal Index (TI)</p><p className="font-mono font-bold text-2xl text-white">{ti.toFixed(2)}</p></div>
                <div><p className="text-sm text-white/70">Mechanical Index (MI)</p><p className="font-mono font-bold text-2xl text-white">{mi.toFixed(2)}</p></div>
            </div>
        </div>
    );
};