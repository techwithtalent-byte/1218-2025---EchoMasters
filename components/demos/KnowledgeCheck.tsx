
import React, { useState } from 'react';
import DemoSection from './DemoSection';
import { useUser } from '../../contexts/UserContext';
import { DemoId } from '../../types';

interface KnowledgeCheckProps {
  moduleId?: DemoId;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const KnowledgeCheck: React.FC<KnowledgeCheckProps> = ({ moduleId, question, options, correctAnswer, explanation }) => {
  const { markModuleAsCompleted, awardAchievement } = useUser();
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);

    if (option === correctAnswer && moduleId) {
        markModuleAsCompleted(moduleId);
        awardAchievement(moduleId);
    }
  };
  
  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  }

  return (
    <DemoSection title="🧠 Knowledge Check" description="Test your understanding of the concepts presented in this module. Correctly answering will complete the module.">
      <p className="font-semibold text-white/90 mb-4">{question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(option => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          let buttonClass = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
          if (showResult) {
            if (isCorrect) buttonClass = 'bg-green-500/20 border-green-500 text-green-300';
            else if (isSelected) buttonClass = 'bg-red-500/20 border-red-500 text-red-300';
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
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg animate-fade-in border border-white/10">
          <p className="font-bold text-[#d4af37]">Explanation:</p>
          <p className="text-white/80 mt-2 text-sm">{explanation}</p>
           <div className="text-right mt-2">
            <button onClick={handleReset} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">Try another question</button>
          </div>
        </div>
      )}
    </DemoSection>
  );
};

export default KnowledgeCheck;
