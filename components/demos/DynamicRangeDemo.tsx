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
            if (isCorrect) buttonClass = 'bg-green-800/50 border-green-500 text-green-200';
            else if (isSelected) buttonClass = 'bg-red-800/50 border-red-500 text-red-200';
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

// Helper function to calculate the remapped grayscale value
const getRemappedGray = (baseGray: number, dynamicRange: number): number => {
    // Normalize dynamic range (e.g., 20-100dB) to a compression factor (e.g., 0.5-4)
    // Low DR (20dB) -> High Compression (e.g., factor 4) -> High Contrast
    // High DR (100dB) -> Low Compression (e.g., factor 0.5) -> Low Contrast
    const maxDr = 100;
    const minDr = 20;
    const maxComp = 4;
    const minComp = 0.5;
    const compressionFactor = maxComp - ((dynamicRange - minDr) / (maxDr - minDr)) * (maxComp - minComp);

    const normalizedGray = baseGray / 255;
    const compressedGray = Math.pow(normalizedGray, compressionFactor);
    return Math.round(compressedGray * 255);
};

const CompressionCurve: React.FC<{ dynamicRange: number }> = ({ dynamicRange }) => {
    // Re-use the compression factor logic from getRemappedGray
    const maxDr = 100;
    const minDr = 20;
    const maxComp = 4;
    const minComp = 0.5;
    const compressionFactor = maxComp - ((dynamicRange - minDr) / (maxDr - minDr)) * (maxComp - minComp);

    // Generate path data for the curve
    let pathData = "M 0 100";
    for (let i = 0; i <= 100; i++) {
        const x = i;
        const normalizedX = x / 100;
        const y = 100 - (Math.pow(normalizedX, compressionFactor) * 100);
        pathData += ` L ${x} ${y}`;
    }

    return (
        <div className="w-full h-40 bg-gray-900 rounded-lg p-4 relative">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Axes */}
                <path d="M 5 100 L 5 0 L 100 0" fill="none" stroke="#666" strokeWidth="0.5" />
                {/* Curve */}
                <path d={pathData} transform="translate(5, 0)" fill="none" stroke="#facc15" strokeWidth="2" style={{ transition: 'd 0.2s ease-in-out' }}/>
            </svg>
            <span className="absolute bottom-1 left-8 text-xs text-white/50">Input Echo Range</span>
            <span className="absolute top-1/2 -left-5 text-xs text-white/50 transform -rotate-90 origin-center">Output Brightness</span>
        </div>
    );
};


const DynamicRangeDemo: React.FC = () => {
    const [dynamicRange, setDynamicRange] = useState(60); // dB

    const baseGrays = [40, 80, 120, 160, 200];

    const imagePatches = useMemo(() => {
        return baseGrays.map(base => {
            const remappedGray = getRemappedGray(base, dynamicRange);
            return (
                <div
                    key={base}
                    className="w-16 h-16 transition-colors duration-200"
                    style={{ backgroundColor: `rgb(${remappedGray}, ${remappedGray}, ${remappedGray})` }}
                />
            );
        });
    }, [dynamicRange]);

    const contrastLevel = useMemo(() => {
        if (dynamicRange < 45) return { text: "High Contrast", color: "text-red-300", bgColor: "bg-red-500/20", borderColor: "border-red-500/50" };
        if (dynamicRange > 75) return { text: "Low Contrast", color: "text-green-300", bgColor: "bg-green-500/20", borderColor: "border-green-500/50" };
        return { text: "Balanced Contrast", color: "text-yellow-300", bgColor: "bg-yellow-500/20", borderColor: "border-yellow-500/50" };
    }, [dynamicRange]);
    
    return (
        <div className="space-y-8">
            <DemoSection
                title="Dynamic Range & Compression"
                description="Dynamic range controls the number of gray shades in an image, affecting contrast resolution. Adjust the slider to see how a wider range (more grays) creates a softer image, while a narrower range creates a higher-contrast, more black-and-white image."
            >
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Image Display */}
                    <div className="w-full lg:w-2/3 bg-black rounded-xl p-6 flex flex-col items-center justify-center gap-6">
                        <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
                            {imagePatches}
                        </div>
                        <CompressionCurve dynamicRange={dynamicRange} />
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-1/3 flex flex-col justify-center">
                        <h4 className="font-bold text-yellow-400 text-center mb-4">Dynamic Range Control</h4>
                        <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
                            <label className="block text-white/80 mb-2">Dynamic Range</label>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={dynamicRange}
                                onChange={e => setDynamicRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <div className="text-center mt-2 font-mono text-xl text-yellow-400">{dynamicRange} dB</div>
                        </div>
                         <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                            <p className="text-sm text-white/70">Resulting Image:</p>
                             <div className={`p-2 rounded-lg mt-1 border ${contrastLevel.bgColor} ${contrastLevel.borderColor}`}>
                                <p className={`text-lg font-bold ${contrastLevel.color}`}>{contrastLevel.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">How Dynamic Range Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">1. Dynamic Range Control</h4>
                            <p className="text-white/70">Adjusting this control allows you to display more or fewer gray shades. Increasing dynamic range improves contrast resolution by showing more subtle differences in tissue echogenicity.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">2. Compression Settings</h4>
                            <p className="text-white/70">Compression reduces the range of echo intensities to fit the display's capabilities. Adjusting compression modifies the dynamic range to visualize varying echogenicities more clearly.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">3. Enhancing Contrast Resolution</h4>
                            <p className="text-white/70">Dynamic range is closely related to contrast resolution. Proper settings ensure echoes from different depths are visible, utilizing the full gray scale and improving tissue differentiation.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-white/10">
                            <h4 className="font-semibold text-white mb-2">4. Advanced Techniques</h4>
                            <p className="text-white/70">Techniques like Spatial and Frequency Compounding combine multiple images or frequencies to create a single, higher-quality image with reduced noise and improved dynamic range.</p>
                        </div>
                    </div>
                </div>
            </DemoSection>
             <KnowledgeCheck
                question="A narrow (low) dynamic range results in an image with:"
                options={["Low contrast", "High contrast", "More shades of gray", "Poor temporal resolution"]}
                correctAnswer="High contrast"
                explanation="A narrow dynamic range assigns fewer gray shades to the range of echo intensities, which makes the image appear more black-and-white, thereby increasing the contrast."
            />
        </div>
    );
};

export default DynamicRangeDemo;