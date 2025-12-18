
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';

// --- Section 1: The Nature of a Sound Wave ---
const NatureOfSoundWaveSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <DemoSection
      title="The Nature of a Sound Wave"
      description="Sound is a mechanical, longitudinal wave. A vibrating source creates propagating areas of high pressure (compressions) and low pressure (rarefactions) that travel through the medium."
    >
      <style>{`
        @keyframes compression-travel {
          from { left: -20%; }
          to { left: 120%; }
        }
        @keyframes pressure-wave-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); } 
        }
      `}</style>
      <div className="bg-gray-800/50 rounded-xl p-4 overflow-hidden">
        <div className="flex justify-end mb-2">
            <ControlButton onClick={() => setIsPlaying(!isPlaying)} secondary>
                {isPlaying ? 'Pause' : 'Play'} Animation
            </ControlButton>
        </div>
        
        <div className="h-40 relative flex items-center mb-4 border-y-2 border-dashed border-white/10 py-4 overflow-hidden bg-black/20">
            {/* Transducer Source */}
            <motion.div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-24 bg-[#d4af37] rounded-r-lg z-20 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                animate={isPlaying ? { x: [0, 2, 0] } : {}}
                transition={{ duration: 0.1, repeat: Infinity }}
            >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30" />
            </motion.div>

            <div className="absolute top-2 right-2 flex items-center text-xs text-white/70 z-30 bg-black/40 px-2 py-1 rounded">
                <span>Wave Propagation</span>
                <svg className="w-16 h-4 ml-2" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="0" y1="10" x2="90" y2="10" />
                    <polyline points="80 5 90 10 80 15" />
                </svg>
            </div>
            
            {/* Particle Field - Longitudinal Motion */}
            <div className="absolute inset-0 left-6 z-0 overflow-hidden">
                {Array.from({ length: 120 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/40 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={isPlaying ? { x: [0, 15, 0, -15, 0] } : {}}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 1.5 // Random phase to look organic
                        }}
                    />
                ))}
            </div>

            {/* Compression Wave Bands - Moving High Pressure Zones */}
            <div className="absolute inset-0 left-6 z-10 pointer-events-none">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent blur-md"
                        style={{
                            animation: `compression-travel 3s linear infinite`,
                            animationDelay: `${i * 1}s`,
                            animationPlayState: isPlaying ? 'running' : 'paused'
                        }}
                    />
                ))}
            </div>
        </div>
        
        {/* Pressure Graph Visualization */}
        <div className="h-24 relative overflow-hidden bg-black/20 rounded-lg border border-white/5">
             <div className="absolute inset-0 flex" style={{ 
                 width: '200%', 
                 animation: 'pressure-wave-scroll 3s linear infinite', 
                 animationPlayState: isPlaying ? 'running' : 'paused' 
             }}>
                {/* Two identical SVGs for seamless looping */}
                <svg width="50%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50" stroke="#d4af37" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                    <path d="M0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50" stroke="url(#fillGradient)" strokeWidth="0" fillOpacity="0.2"/>
                    <defs>
                        <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
                <svg width="50%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <path d="M0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50" stroke="#d4af37" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
                    <path d="M0 50 Q 50 0 100 50 T 200 50 T 300 50 T 400 50" stroke="url(#fillGradient)" strokeWidth="0" fillOpacity="0.2"/>
                </svg>
             </div>
            <div className="absolute top-1 left-2 text-xs text-white/70 font-semibold bg-black/50 px-1 rounded">Pressure</div>
            <div className="absolute top-1 right-2 text-xs font-semibold text-[#d4af37] bg-black/50 px-1 rounded">High (Compression)</div>
            <div className="absolute bottom-1 right-2 text-xs text-white/50 bg-black/50 px-1 rounded">Low (Rarefaction)</div>
        </div>
      </div>
    </DemoSection>
  );
};


// --- Section 2: Acoustic Variables Explained ---
type AcousticVariable = 'Pressure' | 'Density' | 'Particle Motion' | 'Temperature';

const VARIABLES_INFO = {
  'Pressure': {
    description: "The concentration of force. Sound waves create regions of high pressure (compressions) and low pressure (rarefactions).",
    animation: (
        <div className="w-32 h-32 rounded-full border-4 border-gray-500 flex items-center justify-center relative">
            <div className="w-1 h-16 bg-[#d4af37] rounded-full origin-bottom" style={{ animation: `pressure-wave-sync 3s ease-in-out infinite`, transform: 'rotate(-45deg)' }}/>
            <div className="w-4 h-4 bg-gray-500 rounded-full absolute"></div>
            <span className="absolute top-4 text-xs">High</span>
             <span className="absolute bottom-4 text-xs">Low</span>
        </div>
    )
  },
  'Density': {
    description: "The concentration of mass. Compressions are areas of high particle density, while rarefactions are areas of low density.",
    animation: (
        <div className="w-32 h-32 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="flex gap-1 animate-density-pulse" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}>
                 {Array.from({ length: 8 }).map((_, i) => <div key={i} className="w-1 h-12 bg-[#f4e4bc] rounded-full" />)}
            </div>
        </div>
    )
  },
  'Particle Motion': {
    description: "Individual particles oscillate back and forth around a fixed position, transferring energy to their neighbors.",
    animation: (
        <div className="w-48 h-32 flex items-center justify-center relative">
            <div className="w-full h-0.5 bg-gray-600 absolute"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full absolute left-1/2 -translate-x-1/2"></div>
            <div className="w-4 h-4 bg-[#f4e4bc] rounded-full absolute left-1/2 -translate-x-1/2 animate-particle-oscillation" style={{ animationDuration: '3s', animationIterationCount: 'infinite' }} />
        </div>
    )
  },
  'Temperature': {
      description: "As sound energy is absorbed, it can be converted to heat. The medium's temperature and stiffness are the primary determinants of propagation speed.",
      animation: (
          <div className="w-32 h-32 flex items-center justify-center relative">
            <div className="w-8 h-24 bg-gray-700 rounded-full p-1.5 flex items-end">
                <div className="w-full h-1/3 bg-gradient-to-t from-red-500 to-[#d4af37] rounded-full"></div>
            </div>
            <div className="absolute inset-0 bg-red-500/50 rounded-full blur-2xl animate-heat-shimmer" style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}></div>
          </div>
      )
  }
};

const AcousticVariablesSection: React.FC = () => {
    const [variable, setVariable] = useState<AcousticVariable>('Pressure');

    return (
        <DemoSection
            title="Acoustic Variables Explained"
            description="As sound propagates, it causes cyclical changes in the medium. These measurable changes define the sound wave."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex flex-col gap-2">
                     {(['Pressure', 'Density', 'Particle Motion', 'Temperature'] as AcousticVariable[]).map(v => (
                        <ControlButton key={v} onClick={() => setVariable(v)} secondary={variable !== v}>
                            {v}
                        </ControlButton>
                    ))}
                </div>
                <div className="w-full md:w-2/3 flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 min-h-[10rem]">
                    <div className="w-1/2 flex items-center justify-center">
                        {VARIABLES_INFO[variable].animation}
                    </div>
                    <div className="w-1/2">
                        <p className="text-white/80 text-sm">{VARIABLES_INFO[variable].description}</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    )
};

// --- Section 3: Propagation Speed ---
const MEDIA = [
    { name: 'Fat', speed: 1450 },
    { name: 'Soft Tissue', speed: 1540 },
    { name: 'Muscle', speed: 1600 },
    { name: 'Bone', speed: 4080 },
    { name: 'Air', speed: 330 },
];

const ClinicalSimulationVisualization: React.FC = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [currentMedium, setCurrentMedium] = useState('Starting...');
    const animationTotalDuration = 3000; // ms

    const handleRun = () => {
        if (isSimulating) return;
        
        setIsSimulating(true);
        setCurrentMedium('Fat (1450 m/s)');
        
        setTimeout(() => {
            setCurrentMedium('Muscle (1600 m/s)');
        }, animationTotalDuration * 0.318);

        setTimeout(() => {
            setCurrentMedium('Liver (1540 m/s)');
        }, animationTotalDuration * 0.701);

        setTimeout(() => {
            setIsSimulating(false);
            setCurrentMedium('Finished');
        }, animationTotalDuration);
    };

    const layers = [
        { name: 'Fat', height: '30%', speed: 1450, color: 'bg-yellow-200/20' },
        { name: 'Muscle', height: '40%', speed: 1600, color: 'bg-red-300/20' },
        { name: 'Liver', height: '30%', speed: 1540, color: 'bg-orange-400/20' },
    ];

    return (
        <div className="mt-8 bg-gray-800/50 p-6 rounded-lg">
            <h4 className="font-bold text-lg text-[#d4af37] mb-3">Interactive Clinical Simulation</h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-64 bg-black/50 rounded-lg relative overflow-hidden">
                    {/* Layers */}
                    <div className="absolute inset-0 flex flex-col">
                        {layers.map(layer => (
                            <div key={layer.name} style={{ height: layer.height }} className={`flex items-center justify-end pr-2 ${layer.color}`}>
                                <span className="text-xs font-semibold text-white/70">{layer.name}</span>
                            </div>
                        ))}
                    </div>
                    {/* Pulse Animation */}
                    {isSimulating && (
                        <div 
                            key={Date.now()}
                            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f4e4bc] rounded-full shadow-[0_0_15px_rgba(244,228,188,0.8)]"
                            style={{ animation: `clinical-sim-pulse-travel ${animationTotalDuration / 1000}s linear forwards` }}
                        />
                    )}
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center items-center gap-4">
                     <ControlButton onClick={handleRun} disabled={isSimulating}>
                        {isSimulating ? 'Running...' : 'Run Simulation'}
                    </ControlButton>
                     <div className="bg-white/10 p-4 rounded-lg text-center w-full">
                        <p className="text-sm text-white/70">Current Medium:</p>
                        <p className="text-lg font-bold text-[#f4e4bc] mt-1 h-12 flex items-center justify-center">
                            {isSimulating ? currentMedium : 'Press Run'}
                        </p>
                    </div>
                </div>
            </div>
            <p className="text-sm text-white/80 mt-4">
                <strong className="text-[#f4e4bc]">Observation:</strong> The pulse speed changes as it crosses each tissue boundary, determined solely by the properties of the new medium.
            </p>
        </div>
    );
};

const PropagationSpeedSection: React.FC = () => {
    const [medium, setMedium] = useState(MEDIA[1]);
    const animationDuration = 5000 / medium.speed;

    return (
        <DemoSection
            title="Propagation Speed"
            description="Propagation speed is determined ONLY by the medium's properties (stiffness & density). It is NOT affected by the sound source's frequency or power."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3">
                    <div className="h-48 bg-gray-800/50 rounded-xl p-4 relative overflow-hidden">
                        <div key={medium.name} className="absolute w-4 h-4 bg-[#f4e4bc] rounded-full top-1/2 -translate-y-1/2" style={{ animation: `pulse-race ${animationDuration}s linear infinite` }}></div>
                        <div className="absolute top-2 right-2 text-lg font-bold text-white/80">{medium.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-white/80 mb-2 text-sm">Frequency (Not a factor)</label>
                            <input type="range" min="2" max="15" step="1" defaultValue="5" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500" />
                        </div>
                        <div>
                            <label className="block text-white/80 mb-2 text-sm">Power (Not a factor)</label>
                            <input type="range" min="50" max="100" step="5" defaultValue="80" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500" />
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
                    <h4 className="text-white/80 mb-1 text-center">Select Medium:</h4>
                    {MEDIA.map(m => (
                        <ControlButton key={m.name} onClick={() => setMedium(m)} secondary={medium.name !== m.name}>
                            {m.name}
                        </ControlButton>
                    ))}
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Propagation Speed:</p>
                        <p className="text-2xl font-bold text-[#f4e4bc] mt-1">{medium.speed} m/s</p>
                    </div>
                </div>
            </div>
            <ClinicalSimulationVisualization />
        </DemoSection>
    );
};


const WavesDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <NatureOfSoundWaveSection />
      <AcousticVariablesSection />
      <PropagationSpeedSection />
      <KnowledgeCheck
        moduleId="waves"
        question="Which of the following determines the propagation speed of sound?"
        options={["Frequency", "The Medium", "Amplitude", "The Transducer"]}
        correctAnswer="The Medium"
        explanation="Propagation speed is determined SOLELY by the properties of the medium it travels through, specifically its stiffness and density. It is not affected by the sound source."
      />
    </div>
  );
};

export default WavesDemo;
