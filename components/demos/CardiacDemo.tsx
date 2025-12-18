
import React, { useState } from 'react';
import DemoSection from './DemoSection';

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

const CardiacDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-800/50 p-8 rounded-xl text-center border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">Cardiac Module Updates</h3>
          <p className="text-white/60">The anatomy and ejection fraction labs have been deprecated for this version. Please proceed to the knowledge check.</p>
      </div>
      <KnowledgeCheck
        question="Which M-Mode pattern is characteristic of the anterior mitral valve leaflet?"
        options={["A box-like shape", "A single systolic peak", "An 'M-shaped' pattern", "A flat line"]}
        correctAnswer="An 'M-shaped' pattern"
        explanation="The anterior mitral valve leaflet shows a distinct 'M-shaped' pattern on M-Mode. The first peak (E-point) represents early diastolic opening, and the second peak (A-point) represents opening during atrial contraction."
      />
    </div>
  );
};

export default CardiacDemo;
