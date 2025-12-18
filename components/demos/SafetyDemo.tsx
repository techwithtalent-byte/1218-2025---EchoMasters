import React, { useState, useMemo } from 'react';
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

// --- Section 1: Bioeffect Mechanisms ---
const BioeffectMechanismsSection: React.FC = () => {
    const [effect, setEffect] = useState<'thermal' | 'mechanical'>('thermal');

    return (
        <DemoSection
            title="Bioeffect Mechanisms Explained"
            description="Ultrasound energy can interact with tissue in two primary ways: thermal (heating) and mechanical (cavitation). Understanding these is key to patient safety."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-gray-800/50 rounded-xl p-4 relative flex items-center justify-center overflow-hidden">
                    {/* Thermal Animation */}
                    {effect === 'thermal' && (
                        <div key="thermal" className="animate-fade-in w-full h-full flex flex-col items-center justify-center">
                            <p className="text-sm font-semibold text-yellow-400 mb-4">Energy absorption causes particle vibration, generating heat.</p>
                            <div className="relative w-48 h-32">
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div key={i} className="absolute w-1.5 h-1.5 bg-red-400 rounded-full" style={{
                                        top: `${Math.random() * 90 + 5}%`,
                                        left: `${Math.random() * 90 + 5}%`,
                                        animation: `particle-heat-vibration 1s ease-in-out infinite alternate`,
                                        animationDelay: `${Math.random() * 0.5}s`
                                    }} />
                                ))}
                            </div>
                            <p className="text-lg font-bold text-red-500 mt-4">Tissue Temperature Rises</p>
                        </div>
                    )}
                    {/* Mechanical Animation */}
                    {effect === 'mechanical' && (
                        <div key="mechanical" className="animate-fade-in w-full h-full flex flex-col items-center justify-center">
                             <p className="text-sm font-semibold text-cyan-300 mb-4">Pressure changes cause gas bubbles to form and violently collapse.</p>
                            <div className="relative w-48 h-32 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full border-4 border-cyan-400" style={{ animation: `bubble-cavitation 1.5s ease-in-out infinite` }}></div>
                            </div>
                            <p className="text-lg font-bold text-cyan-400 mt-4">Cavitation Occurs</p>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                    <ControlButton onClick={() => setEffect('thermal')} secondary={effect !== 'thermal'}>
                        Thermal Effect (Heat)
                    </ControlButton>
                    <ControlButton onClick={() => setEffect('mechanical')} secondary={effect !== 'mechanical'}>
                        Mechanical Effect (Cavitation)
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};


// --- Section 2: ALARA Principle in Practice ---
type PatientType = 'Adult Abdomen' | 'Obstetric';
type ImagingMode = 'B-Mode' | 'Color Doppler' | 'PW Doppler';

const AlaraPrincipleSection: React.FC = () => {
    const [patient, setPatient] = useState<PatientType>('Obstetric');
    const [mode, setMode] = useState<ImagingMode>('B-Mode');
    const [power, setPower] = useState(30); // %

    const { ti, mi, tiLabel, guidance } = useMemo(() => {
        let baseMI = 0.1;
        let baseTI = 0.1;

        if (mode === 'Color Doppler') {
            baseMI = 0.4;
            baseTI = 0.5;
        } else if (mode === 'PW Doppler') {
            baseMI = 0.7;
            baseTI = 1.0;
        }

        const calculatedMI = baseMI * (1 + (power / 100) * 2);
        const calculatedTI = baseTI * (1 + (power / 100) * 3);

        const tiLabel = patient === 'Obstetric' ? 'TIB' : 'TIS';
        
        let guidanceText = "✅ Optimal Settings";
        let guidanceColor = "bg-green-500/30 text-green-300";

        if (calculatedTI > 1.5 || calculatedMI > 1.2) {
             guidanceText = "❌ High Risk: Reduce power immediately.";
             guidanceColor = "bg-red-500/30 text-red-300";
        } else if (calculatedTI > 1.0 && patient === 'Obstetric') {
            guidanceText = "⚠️ Caution: High TI for OB. Minimize time.";
            guidanceColor = "bg-yellow-500/30 text-yellow-300";
        } else if (calculatedMI > 0.7) {
             guidanceText = "⚠️ Caution: Monitor Mechanical Index.";
             guidanceColor = "bg-yellow-500/30 text-yellow-300";
        }

        return {
            ti: calculatedTI,
            mi: calculatedMI,
            tiLabel,
            guidance: { text: guidanceText, color: guidanceColor }
        };
    }, [patient, mode, power]);

    return (
        <DemoSection
            title="The ALARA Principle in Practice"
            description="As Low As Reasonably Achievable. Use this interactive dashboard to see how your choices affect the safety indices (TI and MI) in real-time."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h4 className="font-semibold text-white/80 mb-2">1. Select Patient Type</h4>
                        <div className="flex flex-col gap-2">
                             <ControlButton onClick={() => setPatient('Obstetric')} secondary={patient !== 'Obstetric'}>Obstetric</ControlButton>
                             <ControlButton onClick={() => setPatient('Adult Abdomen')} secondary={patient !== 'Adult Abdomen'}>Adult Abdomen</ControlButton>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-white/80 mb-2">2. Select Imaging Mode</h4>
                        <div className="flex flex-col gap-2">
                             <ControlButton onClick={() => setMode('B-Mode')} secondary={mode !== 'B-Mode'}>B-Mode</ControlButton>
                             <ControlButton onClick={() => setMode('Color Doppler')} secondary={mode !== 'Color Doppler'}>Color Doppler</ControlButton>
                             <ControlButton onClick={() => setMode('PW Doppler')} secondary={mode !== 'PW Doppler'}>PW Doppler</ControlButton>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white/80 mb-2">3. Adjust Output Power</h4>
                         <input type="range" min="10" max="100" value={power} onChange={e => setPower(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                        <div className="text-center mt-2 font-mono text-lg text-yellow-400">{power}%</div>
                    </div>
                </div>

                {/* Display & Guidance */}
                <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg flex flex-col justify-center items-center">
                    <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
                        <div className="text-center">
                            <p className="text-lg text-white/70">Thermal Index</p>
                            <p className="text-sm font-mono text-yellow-300">({tiLabel})</p>
                            <p className="text-5xl font-bold text-white mt-2">{ti.toFixed(1)}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-lg text-white/70">Mechanical Index</p>
                             <p className="text-sm font-mono text-cyan-300">(MI)</p>
                            <p className="text-5xl font-bold text-white mt-2">{mi.toFixed(1)}</p>
                        </div>
                    </div>
                    <div className={`mt-8 p-4 rounded-lg w-full max-w-md text-center font-bold transition-colors duration-300 ${guidance.color}`}>
                        {guidance.text}
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};


const SafetyDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <BioeffectMechanismsSection />
      <AlaraPrincipleSection />
      <KnowledgeCheck
        question="Which safety index is most associated with the risk of tissue heating?"
        options={["Mechanical Index (MI)", "Pulse Repetition Frequency (PRF)", "Thermal Index (TI)", "Dynamic Range (DR)"]}
        correctAnswer="Thermal Index (TI)"
        explanation="The Thermal Index (TI) is a standardized metric that estimates the potential for the ultrasound beam to raise the temperature of tissue. It is the primary indicator for thermal bioeffects."
      />
    </div>
  );
};

export default SafetyDemo;
