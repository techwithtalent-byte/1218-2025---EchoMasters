import React, { useState } from 'react';

interface ConceptCheckProps {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const ConceptCheck: React.FC<ConceptCheckProps> = ({ questionText, options, correctAnswer, explanation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);
  };

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-white/20 not-prose">
      <h5 className="font-semibold text-white/90 mb-2 text-sm">Concept Check:</h5>
      <p className="font-semibold text-white/80 mb-3 text-sm">{questionText}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          let buttonClass = 'bg-gray-700/50 border border-gray-600 text-white/80 hover:bg-gray-700';
          if (showResult) {
            if (isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
            else if (isSelected) buttonClass = 'bg-red-500/80 border-red-400 text-white';
            else buttonClass = 'bg-gray-700/50 border border-gray-600 text-white/60 opacity-60';
          }
          return (
            <button key={option} onClick={() => handleSelect(option)} disabled={showResult} className={`p-2 rounded-lg text-xs text-left transition-all duration-300 w-full ${buttonClass}`}>
              {option}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-3 p-2 bg-black/30 rounded-lg animate-fade-in text-xs">
          <p className="font-bold text-yellow-400">Explanation:</p>
          <p className="text-white/80 mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ConceptCheck;