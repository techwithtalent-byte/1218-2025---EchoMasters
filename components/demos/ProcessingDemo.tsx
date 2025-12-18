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

const ProcessingDemo: React.FC = () => {
    const [isFrozen, setIsFrozen] = useState(false);
    
    // Preprocessing states
    const [gain, setGain] = useState(50);
    const [dynamicRange, setDynamicRange] = useState(60);

    // Postprocessing states
    const [zoom, setZoom] = useState(1);
    const [grayMap, setGrayMap] = useState<'normal' | 'invert'>('normal');

    const imageStyle: React.CSSProperties = {
        opacity: gain / 100,
        filter: `contrast(${dynamicRange / 50}) ${grayMap === 'invert' ? 'invert(1)' : ''}`,
        transform: `scale(${zoom})`,
        transition: 'all 0.2s ease-in-out',
    };
    
    const SummaryTable: React.FC = () => (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">Summary of Differences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-center">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Timing</h4>
              <p className="text-white/70"><span className="text-cyan-300">Pre</span> occurs before data storage (live).</p>
              <p className="text-white/70"><span className="text-orange-300">Post</span> occurs after data storage (frozen).</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Reversibility</h4>
              <p className="text-white/70"><span className="text-cyan-300">Pre</span> changes are permanent to the raw data.</p>
              <p className="text-white/70"><span className="text-orange-300">Post</span> changes are reversible and non-destructive.</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Purpose</h4>
              <p className="text-white/70"><span className="text-cyan-300">Pre</span> optimizes raw data quality for image formation.</p>
              <p className="text-white/70"><span className="text-orange-300">Post</span> enhances visual presentation for interpretation.</p>
            </div>
          </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <DemoSection
                title="Interactive Console: Preprocessing vs. Postprocessing"
                description="Experience the difference firsthand. Preprocessing controls are only active on a 'live' image. Once you 'freeze' the image, only postprocessing controls can be adjusted."
            >
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Image Display */}
                    <div className="w-full lg:w-2/3 h-[480px] bg-black rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="w-[300px] h-[400px] graticule-bg overflow-hidden relative">
                             <div className="w-full h-full bg-cover bg-center" style={{ ...imageStyle, backgroundImage: `url('https://images.unsplash.com/photo-1581092917382-17c482684803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')`}}></div>
                             <div className={`absolute top-2 left-2 text-sm font-bold px-2 py-1 rounded ${isFrozen ? 'bg-cyan-500 text-black' : 'bg-red-500 text-white animate-pulse'}`}>
                                {isFrozen ? 'FROZEN' : 'LIVE'}
                             </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        <ControlButton onClick={() => setIsFrozen(!isFrozen)} fullWidth>
                            {isFrozen ? 'Unfreeze Image' : 'Freeze Image'}
                        </ControlButton>

                        {/* Preprocessing Controls */}
                        <div className={`mt-6 p-4 rounded-lg border-2 transition-all duration-300 ${isFrozen ? 'border-gray-700 text-gray-500' : 'border-cyan-400 text-white'}`}>
                            <h4 className="font-bold text-lg mb-4 text-center">Preprocessing</h4>
                            <div className={`space-y-4 ${isFrozen ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div>
                                    <label className="block text-sm mb-1">Gain ({gain})</label>
                                    <input type="range" min="20" max="100" value={gain} onChange={e => setGain(Number(e.target.value))} disabled={isFrozen} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:accent-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Dynamic Range ({dynamicRange}dB)</label>
                                    <input type="range" min="30" max="90" value={dynamicRange} onChange={e => setDynamicRange(Number(e.target.value))} disabled={isFrozen} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:accent-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* Postprocessing Controls */}
                        <div className={`mt-4 p-4 rounded-lg border-2 transition-all duration-300 ${!isFrozen ? 'border-gray-700 text-gray-500' : 'border-orange-400 text-white'}`}>
                            <h4 className="font-bold text-lg mb-4 text-center">Postprocessing</h4>
                            <div className={`space-y-4 ${!isFrozen ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div>
                                    <label className="block text-sm mb-1">Zoom ({zoom.toFixed(1)}x)</label>
                                    <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={e => setZoom(Number(e.target.value))} disabled={!isFrozen} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-400 disabled:accent-gray-500" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Gray Map</label>
                                    <ControlButton onClick={() => setGrayMap(p => p === 'normal' ? 'invert' : 'normal')} secondary fullWidth disabled={!isFrozen}>
                                        {grayMap === 'normal' ? 'Normal' : 'Inverted'}
                                    </ControlButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SummaryTable />
            </DemoSection>

            <KnowledgeCheck
                question="Which of the following is a preprocessing function?"
                options={["Adjusting zoom on a frozen image", "Changing the gray map", "Time Gain Compensation (TGC)", "Adding calipers for measurement"]}
                correctAnswer="Time Gain Compensation (TGC)"
                explanation="TGC is a preprocessing function because it alters the raw echo data as it's being received, before it is stored in the scan converter. Zoom, gray maps, and measurements on a frozen image are all postprocessing."
            />
        </div>
    );
};

// FIX: Add missing default export.
export default ProcessingDemo;
