
import React from 'react';

interface ComingSoonDemoProps {
  moduleName: string;
}

const ComingSoonDemo: React.FC<ComingSoonDemoProps> = ({ moduleName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-black/20 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-[#d4af37] mb-4">Coming Soon!</h2>
      <p className="text-lg text-white/80 mb-2">The interactive demo for "{moduleName}" is under construction.</p>
      <p className="text-white/60">This module will include:</p>
      <ul className="list-disc list-inside mt-2 text-white/60">
        <li>Interactive animations</li>
        <li>Step-by-step explanations</li>
        <li>Practice exercises & assessments</li>
      </ul>
    </div>
  );
};

export default ComingSoonDemo;