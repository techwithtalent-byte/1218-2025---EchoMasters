import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 1: Anisotropy Explained ---
const AnisotropySection: React.FC = () => {
    const [angle, setAngle] = useState(0); // degrees from perpendicular

    const echogenicity = useMemo(() => {
        const angleFactor = Math.abs(angle) / 30; // 0 at 0deg, 1 at 30deg
        return Math.max(0.2, 1 - angleFactor);
    }, [angle]);

    const tendonColor = `rgba(229, 231, 235, ${echogenicity})`;

    return (
        <DemoSection
            title="Anisotropy: The Heel-Toe Maneuver"
            description="Tendon echogenicity is highly angle-dependent. The tendon appears brightest (hyperechoic) when the beam is perfectly perpendicular (90°). Tilting the transducer ('heel-toe') causes it to appear dark (hypoechoic), which can mimic a tear."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl relative overflow-hidden p-4 flex flex-col justify-center">
                    <div className="w-32 h-8 bg-yellow-400/80 rounded-md absolute top-4 left-1/2 -translate-x-1/2 transition-transform duration-200" style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} />
                    <div className="h-12 rounded-lg" style={{ backgroundColor: tendonColor, transition: 'background-color 0.2s' }} />
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Transducer Angle (from ⟂)</label>
                    <input type="range" min="-30" max="30" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{angle}°</div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Tendon Tear Pathology ---
type TendonState = 'Normal' | 'Partial Tear' | 'Full Tear';
const TendonTearSection: React.FC = () => {
    const [state, setState] = useState<TendonState>('Normal');
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000);
    };

    const tendonPathology = useMemo(() => {
        let content = <></>;
        switch (state) {
            case 'Partial Tear':
                content = <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-black/80 rounded-b-lg" />;
                break;
            case 'Full Tear':
                content = (
                    <>
                        <div className="absolute left-0 top-0 w-2/5 h-full bg-gray-400 rounded-r-lg" />
                        <div className="absolute right-0 top-0 w-2/5 h-full bg-gray-400 rounded-l-lg" />
                    </>
                );
                break;
            case 'Normal':
            default:
                break;
        }
        return content;
    }, [state]);
    
    return (
        <DemoSection
            title="Tendon Tear Pathology"
            description="Ultrasound is excellent for visualizing tendon injuries. Observe the appearance of a normal tendon, a partial-thickness tear, and a full-thickness tear with fiber retraction."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center overflow-hidden">
                    <AnimatePresence>
                     {isScanning && (
                         <motion.div 
                             className="w-20 h-5 bg-yellow-400/80 rounded-sm mb-2"
                             initial={{ x: "-150%" }}
                             animate={{ x: "150%" }}
                             transition={{ duration: 2, ease: "linear" }}
                         />
                     )}
                     </AnimatePresence>
                    <div className="w-full h-16 bg-gray-400 relative overflow-hidden">
                        <div className="absolute inset-0" style={{ clipPath: isScanning ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)' }}>
                            {/* Fibrillar pattern */}
                            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 3px)`}} />
                            {tendonPathology}
                        </div>
                        <AnimatePresence>
                        {isScanning && (
                            <motion.div
                                className="absolute inset-0 bg-gray-800/50"
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 2, ease: "linear" }}
                                style={{ clipPath: 'inset(0 0 0 100%)' }}
                                onAnimationComplete={() => setIsScanning(false)}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400" />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                    <h4 className="text-white/80 mb-1 text-center">Select Pathology:</h4>
                    <ControlButton onClick={() => setState('Normal')} secondary={state !== 'Normal'}>Normal</ControlButton>
                    <ControlButton onClick={() => setState('Partial Tear')} secondary={state !== 'Partial Tear'}>Partial Tear</ControlButton>
                    <ControlButton onClick={() => setState('Full Tear')} secondary={state !== 'Full Tear'}>Full Tear</ControlButton>
                     <ControlButton onClick={handleScan} disabled={isScanning} className="mt-4">
                        {isScanning ? 'Scanning...' : 'Scan Tendon'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Dynamic Imaging: Subacromial Impingement ---
const DynamicImpingementSection: React.FC = () => {
    const [isAbducting, setIsAbducting] = useState(false);
    return (
        <DemoSection
            title="Dynamic Imaging: Subacromial Impingement"
            description="MSK ultrasound shines with dynamic imaging. By having the patient move, we can visualize pathologies that only occur with motion, such as the supraspinatus tendon getting pinched under the acromion during arm abduction."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-800/50 rounded-xl relative overflow-hidden p-4">
                    {/* Acromion */}
                    <div className="absolute top-4 left-4 w-40 h-16 bg-gray-600 rounded-br-full" />
                    <p className="absolute top-6 left-6 text-sm text-white/70">Acromion</p>
                    {/* Humerus & Tendon */}
                    <div className="absolute top-32 left-8 w-48 h-full transition-transform duration-500" style={{ transform: isAbducting ? 'translateX(-20px)' : 'translateX(0)' }}>
                        <div className="w-32 h-32 bg-gray-500 rounded-t-full" />
                        <div className="absolute top-0 -translate-y-full w-24 h-8 bg-gray-400 left-4 rounded-t-md" />
                         <p className="absolute top-12 left-10 text-sm text-white/70">Humerus</p>
                    </div>
                </div>
                 <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <ControlButton onMouseDown={() => setIsAbducting(true)} onMouseUp={() => setIsAbducting(false)} onMouseLeave={() => setIsAbducting(false)}>
                        {isAbducting ? 'Abducting...' : 'Abduct Arm'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

const MSKDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <AnisotropySection />
            <TendonTearSection />
            <DynamicImpingementSection />
        </div>
    );
};

export default MSKDemo;