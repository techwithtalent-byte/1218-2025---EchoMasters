

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

// --- Section 1: Nonlinear Wave Propagation ---
const NonlinearWaveSection: React.FC = () => {
    const [mi, setMi] = useState(0.4); // Mechanical Index

    const { wavePath, harmonicAmplitude } = useMemo(() => {
        const distortion = (mi - 0.2) / 1.6; // Normalize MI from 0.2-1.8 to 0-1
        
        let path = "M 0 50";
        const amplitude = 40;
        const sections = 4;
        const sectionWidth = 400 / sections;

        for (let i = 0; i < sections; i++) {
            const startX = i * sectionWidth;
            const peakSkew = distortion * (sectionWidth / 4);
            path += ` C ${startX + sectionWidth / 4 + peakSkew} ${50 - amplitude}, ${startX + sectionWidth / 4 + peakSkew} ${50 - amplitude}, ${startX + sectionWidth / 2} 50`;
            path += ` C ${startX + sectionWidth * 3/4 - peakSkew} ${50 + amplitude}, ${startX + sectionWidth * 3/4 - peakSkew} ${50 + amplitude}, ${startX + sectionWidth} 50`;
        }
        
        const harmonicAmp = Math.max(0, distortion * 80);

        return { wavePath: path, harmonicAmplitude: harmonicAmp };
    }, [mi]);

    return (
        <DemoSection
            title="Nonlinear Wave Propagation: The Source of Harmonics"
            description="As a high-power sound wave (high MI) travels through tissue, its shape distorts. This distortion creates new frequencies at multiples of the original, known as harmonics."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <div className="h-48 bg-gray-800/50 rounded-xl overflow-hidden relative">
                        <svg width="200%" height="100%" className="absolute top-0 left-0" style={{ animation: `pressure-wave-sync 4s linear infinite` }}>
                            <path d={wavePath} stroke="#f97316" strokeWidth="3" fill="none" style={{ transition: 'd 0.3s ease-in-out' }} />
                        </svg>
                    </div>
                    <div className="mt-4">
                        <label className="block text-white/80 mb-2">Acoustic Power (MI)</label>
                        <input type="range" min="0.2" max="1.8" step="0.1" value={mi} onChange={e => setMi(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                        <div className="text-center mt-2 font-mono text-lg text-yellow-400">{mi.toFixed(1)}</div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 h-64 bg-black/50 rounded-xl p-4 flex flex-col justify-end">
                     <h4 className="text-sm font-semibold text-white/80 mb-2 text-center">Frequency Spectrum</h4>
                    <div className="w-full h-full flex items-end justify-center gap-12 border-b-2 border-gray-600">
                        <div className="flex flex-col items-center">
                            <div className="w-8 bg-cyan-400 transition-all duration-300" style={{ height: '80px' }}></div>
                            <p className="text-xs font-bold mt-2 text-cyan-300">f₀ (Fundamental)</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <div className="w-8 bg-orange-500 transition-all duration-300" style={{ height: `${harmonicAmplitude}px` }}></div>
                            <p className="text-xs font-bold mt-2 text-orange-400">2f₀ (Harmonic)</p>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};


// --- Section 2: The Harmonic Imaging Advantage ---
const HarmonicAdvantageSection: React.FC = () => {
    const [mode, setMode] = useState<'fundamental' | 'harmonic'>('fundamental');

    return (
        <DemoSection
            title="The Harmonic Imaging Advantage"
            description="By filtering out the fundamental frequency and only processing the cleaner harmonic echoes, systems create images with better resolution and fewer near-field artifacts."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-80 bg-black rounded-xl relative overflow-hidden">
                    {/* Near-field clutter for fundamental */}
                    <div className={`absolute top-0 left-0 w-full h-1/4 bg-gray-500/20 backdrop-blur-sm transition-opacity duration-500 z-10 ${mode === 'fundamental' ? 'opacity-100' : 'opacity-0'}`}
                         style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }}>
                    </div>
                     {/* Image structures */}
                    <div className="absolute w-16 h-16 rounded-full border-4 border-gray-400 top-1/3 left-1/4 transition-all duration-500" style={{ borderColor: mode === 'harmonic' ? '#fff' : '#aaa' }}></div>
                    <div className="absolute w-20 h-20 rounded-lg bg-gray-800 top-1/2 left-1/2 transition-all duration-500" style={{ backgroundColor: mode === 'harmonic' ? '#222' : '#444' }}>
                        <div className="w-4 h-4 rounded-full bg-gray-400 absolute top-4 left-4" style={{ backgroundColor: mode === 'harmonic' ? '#eee' : '#999' }}></div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                     <h4 className="text-white/80 mb-1 text-center">Select Imaging Mode:</h4>
                    <ControlButton onClick={() => setMode('fundamental')} secondary={mode !== 'fundamental'}>
                        Fundamental Imaging
                    </ControlButton>
                     <ControlButton onClick={() => setMode('harmonic')} secondary={mode !== 'harmonic'}>
                        Tissue Harmonic Imaging (THI)
                    </ControlButton>
                     <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className={`text-xl font-bold ${mode === 'harmonic' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {mode === 'harmonic' ? '✅ Cleaner Image' : 'Clutter & Artifacts'}
                        </p>
                        <p className="text-sm text-white/80 mt-1">
                            {mode === 'harmonic' ? 'Harmonics reduce near-field noise and improve contrast.' : 'Fundamental can suffer from reverberation and clutter.'}
                        </p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const HarmonicsDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <NonlinearWaveSection />
            <HarmonicAdvantageSection />
            <KnowledgeCheck
                question="Tissue Harmonic Imaging primarily improves image quality by..."
                options={["Increasing penetration depth.", "Reducing near-field artifacts and clutter.", "Improving temporal resolution.", "Increasing the Doppler shift."]}
                correctAnswer="Reducing near-field artifacts and clutter."
                explanation="Harmonics are generated deeper in the tissue, bypassing the most cluttered near-field region. This results in a cleaner image with significantly reduced artifacts like reverberation."
            />
        </div>
    );
};

export default HarmonicsDemo;
