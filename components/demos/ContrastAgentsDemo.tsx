
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Knowledge Check Component ---
const KnowledgeCheck: React.FC<{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}> = ({ question, options, correctAnswer, explanation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
  };
  
  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  }

  return (
    <DemoSection title="🧠 Knowledge Check" description="Test your understanding of the concepts presented in this module.">
      <p className="font-semibold text-white/90 mb-4">{question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(option => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          let buttonClass = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
          if (showResult) {
            if (isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
            else if (isSelected) buttonClass = 'bg-red-500/80 border-red-400 text-white';
            else buttonClass = 'bg-white/10 border border-white/20 text-white opacity-50';
          }
          return (
            <button key={option} onClick={() => handleSelect(option)} disabled={showResult} className={`p-3 rounded-lg text-left transition-all duration-300 w-full ${buttonClass}`}>
              {option}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg animate-fade-in">
          <p className="font-bold text-yellow-400">Explanation:</p>
          <p className="text-white/80 mt-2 text-sm">{explanation}</p>
           <div className="text-right mt-2">
            <button onClick={handleReset} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">Try another question</button>
          </div>
        </div>
      )}
    </DemoSection>
  );
};

// --- Section 1: Microbubble Physics & Mechanical Index (MI) ---
const MicrobubblePhysicsSection: React.FC = () => {
    const [mi, setMi] = useState(0.2);

    const isDisrupting = mi >= 1.0;
    const animationName = isDisrupting ? 'microbubble-disruption' : 'microbubble-oscillation';
    const bubbleKey = isDisrupting ? `disrupt-${mi}` : `oscillate-${mi}`;

    const infoText = useMemo(() => {
        if (isDisrupting) {
            return {
                title: "Bubble Disruption (High MI)",
                desc: "At high acoustic pressures, the microbubble expands violently and collapses. This strong, transient signal is useful but destroys the agent in the process.",
                color: "text-red-400"
            };
        }
        return {
            title: "Non-Linear Oscillation (Low MI)",
            desc: "At low acoustic pressures, the bubble expands more than it compresses. This asymmetric oscillation is the source of the strong harmonic signal used in CHI.",
            color: "text-green-400"
        };
    }, [isDisrupting]);

    const bubbleStyle: React.CSSProperties = {
        animationName: animationName,
        animationDuration: isDisrupting ? '1.5s' : '1s',
        animationIterationCount: isDisrupting ? 'forwards' : 'infinite',
        animationTimingFunction: 'ease-in-out'
    };

    return (
        <DemoSection
            title="Microbubble Physics & Mechanical Index (MI)"
            description="Microbubbles are gas-filled shells that resonate in a sound field. Their behavior is highly dependent on the acoustic pressure, measured by the Mechanical Index (MI)."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl p-4 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-yellow-400/50 bg-yellow-400/20 relative" style={bubbleStyle} key={bubbleKey}>
                        <div className="absolute inset-2 rounded-full bg-yellow-100/30"></div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label className="block text-white/80 mb-2">Mechanical Index (MI)</label>
                    <input type="range" min="0.1" max="1.5" step="0.1" value={mi} onChange={e => setMi(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{mi.toFixed(1)}</div>
                     <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className={`text-lg font-bold ${infoText.color}`}>{infoText.title}</p>
                        <p className="text-sm text-white/80 mt-1">{infoText.desc}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Contrast Harmonic Imaging (CHI) ---
const HarmonicImagingSection: React.FC = () => {
    const [mode, setMode] = useState<'fundamental' | 'harmonic'>('harmonic');

    return (
        <DemoSection
            title="Contrast Harmonic Imaging (CHI) Advantage"
            description="By selectively imaging the harmonic frequencies generated by microbubbles, we can suppress the signal from surrounding tissue, creating a high-contrast image of blood flow."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 rounded-xl relative overflow-hidden group border border-white/10 bg-black">
                    {/* Tissue Background */}
                    <div className={`absolute inset-0 bg-gray-700 transition-colors duration-500 ${mode === 'harmonic' ? 'bg-black' : 'bg-gray-700'}`}></div>
                    
                    {/* Tissue Clutter Visualization (Fundamental only) */}
                    <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${mode === 'fundamental' ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Simulated tissue texture/clutter */}
                        <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                        <div className="absolute top-2 left-2 bg-gray-800/80 text-white/70 text-xs px-2 py-1 rounded border border-white/10">Tissue Signal (Clutter)</div>
                    </div>

                    {/* Vessel */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-1/3 bg-gray-800/50"></div>
                    
                    {/* Blood Cells (Fundamental) */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${mode === 'fundamental' ? 'opacity-100' : 'opacity-0'}`}>
                        {Array.from({ length: 20 }).map((_, i) => <div key={i} className="absolute w-1.5 h-1.5 bg-red-500/50 rounded-full" style={{ top: `${40 + Math.random()*20}%`, left: `${Math.random()*95}%` }} />)}
                    </div>
                    
                    {/* Contrast Bubbles (Harmonic) */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${mode === 'harmonic' ? 'opacity-100' : 'opacity-0'}`}>
                         {Array.from({ length: 20 }).map((_, i) => <div key={i} className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-[0_0_8px_2px_#facc15]" style={{ top: `${40 + Math.random()*20}%`, left: `${Math.random()*95}%` }} />)}
                    </div>

                    {/* DYNAMIC OVERLAY FOR HARMONIC MODE */}
                    <AnimatePresence>
                        {mode === 'harmonic' && (
                            <>
                                {/* Scanning Clean Effect */}
                                <motion.div 
                                    initial={{ top: 0, opacity: 0.5 }}
                                    animate={{ top: '100%', opacity: 0 }}
                                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                                    className="absolute left-0 w-full h-1 bg-green-400/50 shadow-[0_0_40px_10px_rgba(74,222,128,0.2)] z-10 pointer-events-none"
                                />
                                
                                {/* Suppression Indicator */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="absolute top-4 right-4 bg-black/60 border border-green-500/50 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Tissue Suppressed
                                </motion.div>

                                {/* Signal Highlight Indicator */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute bottom-4 left-4 bg-black/60 border border-yellow-400/50 text-yellow-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <span className="text-lg">✨</span>
                                    Contrast Enhanced
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                    <h4 className="text-white/80 mb-1 text-center">Select Imaging Mode:</h4>
                    <ControlButton onClick={() => setMode('fundamental')} secondary={mode !== 'fundamental'}>
                        Fundamental
                    </ControlButton>
                     <ControlButton onClick={() => setMode('harmonic')} secondary={mode !== 'harmonic'}>
                        Contrast Harmonic
                    </ControlButton>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className={`text-xl font-bold ${mode === 'harmonic' ? 'text-green-400' : 'text-red-400'}`}>
                            {mode === 'harmonic' ? 'High SNR' : 'Low SNR'}
                        </p>
                         <p className="text-sm text-white/80 mt-1">
                            {mode === 'harmonic' ? 'Tissue is suppressed, contrast is bright.' : 'Weak blood signal, low tissue contrast.'}
                        </p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Clinical Simulation: Liver Lesion ---
type Phase = 'arterial' | 'venous' | 'late';
const ClinicalSimulationSection: React.FC = () => {
    const [injected, setInjected] = useState(false);
    const [phase, setPhase] = useState<Phase>('arterial');

    const lesionStyle = useMemo(() => {
        if (!injected) return { backgroundColor: '#4b5563' }; // Isoechoic
        switch (phase) {
            case 'arterial': return { backgroundColor: '#fef3c7', boxShadow: '0 0 15px 5px #fde047' }; // Hyper-enhancing
            case 'venous': return { backgroundColor: '#4b5563' }; // Iso-enhancing
            case 'late': return { backgroundColor: '#1f2937' }; // Washout
            default: return {};
        }
    }, [injected, phase]);

    const getPhaseDescription = () => {
        if (!injected) return "A lesion is present but difficult to delineate from the surrounding liver parenchyma.";
        switch (phase) {
            case 'arterial': return "The lesion shows strong, early enhancement, indicating a rich arterial supply (e.g., HCC).";
            case 'venous': return "The lesion's brightness now matches the surrounding liver tissue.";
            case 'late': return "The lesion now appears dark (hypoechoic) as the contrast has washed out faster than from normal tissue.";
        }
    };

    return (
        <DemoSection
            title="Clinical Simulation: Liver Lesion Characterization"
            description="Contrast-Enhanced Ultrasound (CEUS) is powerful for characterizing lesions. Observe how the enhancement pattern of a lesion changes over different phases after contrast injection."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-gray-600 rounded-xl relative overflow-hidden p-4">
                    {/* Liver Parenchyma */}
                    <div className="absolute inset-0 bg-gray-600"></div>
                    {/* Lesion */}
                    <div className="absolute w-24 h-24 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={lesionStyle}></div>
                    {/* Bubbles */}
                    {injected && Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 bg-yellow-300 rounded-full" style={{
                            top: `${Math.random() * 100}%`,
                            animation: `flow-bubbles ${2 + Math.random() * 3}s linear infinite`,
                            animationDelay: `${Math.random() * 3}s`
                        }}/>
                    ))}
                    <div className="absolute bottom-2 left-2 text-sm font-bold text-white bg-black/50 px-2 py-1 rounded">
                        {!injected ? 'Pre-Contrast' : `${phase.charAt(0).toUpperCase() + phase.slice(1)} Phase`}
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-between">
                    <div>
                        <h4 className="text-white/80 mb-2 text-center">Controls:</h4>
                        {!injected ? (
                            <ControlButton onClick={() => setInjected(true)} fullWidth>Inject Contrast</ControlButton>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <ControlButton onClick={() => setPhase('arterial')} secondary={phase !== 'arterial'}>Arterial Phase (20s)</ControlButton>
                                <ControlButton onClick={() => setPhase('venous')} secondary={phase !== 'venous'}>Venous Phase (60s)</ControlButton>
                                <ControlButton onClick={() => setPhase('late')} secondary={phase !== 'late'}>Late Phase (180s)</ControlButton>
                                <button onClick={() => setInjected(false)} className="text-xs text-white/50 hover:text-white mt-4">Reset Simulation</button>
                            </div>
                        )}
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4">
                        <h5 className="font-bold text-yellow-400 mb-2">Interpretation</h5>
                        <p className="text-sm text-white/80">{getPhaseDescription()}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
}


const ContrastAgentsDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <MicrobubblePhysicsSection />
            <HarmonicImagingSection />
            <ClinicalSimulationSection />
            <KnowledgeCheck
                question="What is most likely to happen to a microbubble at a high Mechanical Index (MI > 1.0)?"
                options={["It will oscillate symmetrically.", "It will shrink and disappear.", "It will be disrupted.", "It will produce a weak signal."]}
                correctAnswer="It will be disrupted."
                explanation="A high Mechanical Index corresponds to high acoustic pressure, which causes microbubbles to expand and contract violently, ultimately leading to their disruption or collapse. This creates a strong, transient signal."
            />
        </div>
    );
};

export default ContrastAgentsDemo;
