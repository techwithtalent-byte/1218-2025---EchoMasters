import React, { useState } from 'react';
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

const KeyPurposes: React.FC = () => (
    <div className="mt-8 pt-6 border-t border-white/10">
      <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">Key Purposes of Time Gain Compensation (TGC)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold text-white mb-2">1. Compensate for Attenuation</h4>
          <p className="text-white/70">Sound waves lose energy (attenuate) with depth. TGC boosts the gain for deeper echoes to ensure they are displayed with appropriate brightness.</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold text-white mb-2">2. Ensure Uniform Brightness</h4>
          <p className="text-white/70">The primary goal is to create an image with consistent brightness from top to bottom, making both superficial and deep structures equally visible and easier to interpret.</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold text-white mb-2">3. Enhance Image Quality</h4>
          <p className="text-white/70">Proper TGC settings improve contrast resolution and help utilize the system's full dynamic range, allowing for better differentiation between tissues.</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
          <h4 className="font-semibold text-white mb-2">4. Improve Diagnostic Accuracy</h4>
          <p className="text-white/70">By enhancing the visibility of structures at all depths, TGC allows for a more detailed and accurate assessment of anatomy and pathology.</p>
        </div>
      </div>
    </div>
  );

const TgcDemo: React.FC = () => {
    const NUM_SLIDERS = 8;
    const initialGains = Array(NUM_SLIDERS).fill(0);
    const [gains, setGains] = useState<number[]>(initialGains);

    const handleGainChange = (index: number, value: number) => {
        const newGains = [...gains];
        newGains[index] = value;
        setGains(newGains);
    };

    const resetTgc = () => {
        setGains(initialGains);
    };

    const autoCompensate = () => {
        const compensatedGains = Array.from({ length: NUM_SLIDERS }, (_, i) =>
            Math.min(100, i * 14)
        );
        setGains(compensatedGains);
    };

    const reflectors = [10, 25, 40, 55, 70, 85];

    // Common base image component
    const BaseImage: React.FC = () => (
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}></div>
            {reflectors.map(depth => (
                <div key={depth} className="absolute w-1/3 h-1 bg-gray-400 rounded-full left-1/2 -translate-x-1/2" style={{ top: `${depth}%` }}></div>
            ))}
        </div>
    );

    return (
      <div className="space-y-8">
        <DemoSection
            title="Interactive Time Gain Compensation (TGC)"
            description="TGC adjusts amplification at different depths to compensate for sound attenuation. This ensures uniform image brightness and clear visibility of both superficial and deep structures."
        >
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Display */}
                <div className="w-full lg:w-2/3 h-[480px] bg-black rounded-xl relative overflow-hidden flex">
                    {/* Uncompensated Image */}
                    <div className="w-1/2 h-full relative border-r-2 border-dashed border-gray-500">
                        <BaseImage />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 pointer-events-none"></div>
                        <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">UNCOMPENSATED</div>
                    </div>
                    {/* Compensated Image */}
                    <div className="w-1/2 h-full relative">
                        <BaseImage />
                        {/* TGC Gain Layers */}
                        {Array.from({ length: NUM_SLIDERS }).map((_, i) => (
                             <div
                                key={i}
                                className="absolute left-0 w-full transition-opacity duration-100"
                                style={{
                                    top: `${i * (100 / NUM_SLIDERS)}%`,
                                    height: `${100 / NUM_SLIDERS}%`,
                                    backgroundColor: 'white',
                                    opacity: gains[i] / 400, // Small opacity factor for additive brightness
                                    mixBlendMode: 'plus-lighter',
                                }}
                            ></div>
                        ))}
                        <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">TGC COMPENSATED</div>
                    </div>
                </div>

                {/* TGC Sliders and Controls */}
                <div className="w-full lg:w-1/3 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-yellow-400 text-center mb-4">TGC Sliders</h4>
                        <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
                            {gains.map((gain, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-xs text-white/70 w-8 text-right font-mono">{index === 0 ? 'Near' : index === NUM_SLIDERS - 1 ? 'Far' : ''}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={gain}
                                        onChange={e => handleGainChange(index, Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <ControlButton onClick={autoCompensate} fullWidth>Auto-compensate</ControlButton>
                        <ControlButton onClick={resetTgc} secondary fullWidth>Reset TGC</ControlButton>
                    </div>
                </div>
            </div>
            <KeyPurposes />
        </DemoSection>
        <KnowledgeCheck
            question="The primary purpose of Time Gain Compensation (TGC) is to:"
            options={["Increase overall image brightness", "Adjust the dynamic range", "Compensate for attenuation", "Improve lateral resolution"]}
            correctAnswer="Compensate for attenuation"
            explanation="Ultrasound beams weaken (attenuate) as they travel deeper into the body. TGC selectively amplifies echoes from deeper structures to create an image with uniform brightness from the near field to the far field."
        />
      </div>
    );
};

export default TgcDemo;
