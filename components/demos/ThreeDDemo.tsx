
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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


// --- Section 1: 3D Data Acquisition ---
const DataAcquisitionSection: React.FC = () => {
    const [isSweeping, setIsSweeping] = useState(false);

    return (
        <DemoSection
            title="3D Data Acquisition: The Sweep"
            description="3D ultrasound is created by acquiring multiple 2D image slices in sequence. A specialized transducer can do this automatically, or it can be done with a free-hand sweep."
        >
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-2/3 h-64 rounded-xl flex items-center justify-center" style={{ perspective: '500px' }}>
                    <div className="relative w-48 h-48" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg) rotateZ(-30deg)' }}>
                        {/* Volume */}
                        <div className="absolute w-48 h-48 bg-cyan-500/10 border-2 border-dashed border-cyan-400/50 rounded-lg flex items-center justify-center">
                             <div className="w-20 h-20 bg-cyan-400 rounded-full" style={{ transform: 'translateZ(-10px)' }}></div>
                        </div>
                        {/* Sweeping Plane */}
                        {isSweeping && (
                            <div key={Date.now()} className="absolute w-48 h-48 bg-yellow-400/50 border border-yellow-300" style={{ animation: 'sweep-3d 3s ease-in-out forwards' }} onAnimationEnd={() => setIsSweeping(false)}/>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-center">
                    <ControlButton onClick={() => setIsSweeping(true)} disabled={isSweeping}>
                        {isSweeping ? 'Acquiring...' : 'Start Acquisition'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Volume Rendering ---
const VolumeRenderingSection: React.FC = () => {
    const [renderMode, setRenderMode] = useState<'surface' | 'mpr'>('surface');
    
    // State for Surface Render
    const [threshold, setThreshold] = useState(25);
    
    // State for MPR
    const [slices, setSlices] = useState({ x: 50, y: 50, z: 50 }); // in %

    const handleSliceChange = (axis: 'x' | 'y' | 'z', value: number) => {
        setSlices(prev => ({ ...prev, [axis]: value }));
    };

    // Sphere data for MPR
    const sphere = { cx: 50, cy: 50, cz: 50, r: 35 }; // center and radius in %

    const renderSliceContent = (axis: 'x' | 'y' | 'z') => {
        const slicePos = slices[axis];
        const center = sphere[axis === 'x' ? 'cx' : axis === 'y' ? 'cy' : 'cz'];
        const radius = sphere.r;
        
        const distFromCenter = Math.abs(slicePos - center);

        if (distFromCenter >= radius) {
            return null; // Slice is outside the sphere
        }

        const circleRadius = Math.sqrt(radius * radius - distFromCenter * distFromCenter);
        const diameterPercent = (circleRadius * 2);

        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/80"
                 style={{ width: `${diameterPercent}%`, height: `${diameterPercent}%` }} />
        );
    };

    return (
        <DemoSection
            title="Interactive Volume Rendering & MPR"
            description="Once the data volume is acquired, it can be visualized. Surface rendering shows the 'outside', while Multi-Planar Reconstruction (MPR) lets you slice through the volume."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visualization Pane */}
                <div className="lg:col-span-2 min-h-[400px] bg-gray-800/50 rounded-xl p-4 flex items-center justify-center">
                   {renderMode === 'surface' && (
                        <div className="w-full h-80 flex items-center justify-center" style={{ perspective: '600px' }}>
                            <motion.div
                                className="relative w-48 h-64"
                                style={{ transform: 'rotateX(20deg) rotateY(-30deg)', transformStyle: 'preserve-3d' }}
                                animate={{ scale: 1.1 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 4, ease: 'easeInOut' }}
                            >
                                {/* Layer 1: Hazy outer noise */}
                                <motion.svg viewBox="0 0 100 120" className="absolute inset-0"
                                    animate={{ opacity: threshold < 40 ? 0.4 : 0 }} transition={{ duration: 0.3 }}>
                                    <ellipse cx="50" cy="60" rx="50" ry="60" fill="#f4e4bc" filter="url(#hazyBlur)" />
                                </motion.svg>
                                {/* Layer 2: General head shape */}
                                <motion.svg viewBox="0 0 100 120" className="absolute inset-0"
                                     animate={{ opacity: threshold < 70 ? 1 : 0 }} transition={{ duration: 0.3 }}>
                                    <ellipse cx="50" cy="60" rx="45" ry="55" fill="#d4af37" />
                                </motion.svg>
                                 {/* Layer 3: Main facial features */}
                                <motion.svg viewBox="0 0 100 120" className="absolute inset-0"
                                     animate={{ opacity: threshold > 30 ? 1 : 0.1 }} transition={{ duration: 0.3 }}>
                                    <path d="M 50 50 A 15 20 0 0 1 50 80 A 15 20 0 0 1 50 50 Z" fill="#4a3f30" />
                                    <ellipse cx="40" cy="45" rx="8" ry="5" fill="#2c251e" />
                                    <ellipse cx="60" cy="45" rx="8" ry="5" fill="#2c251e" />
                                </motion.svg>
                                {/* Layer 4: High-contrast details */}
                                <motion.svg viewBox="0 0 100 120" className="absolute inset-0"
                                    animate={{ opacity: threshold > 60 && threshold < 95 ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                                    <path d="M 50 65 A 10 5 0 0 1 50 75 A 10 5 0 0 1 50 65 Z" fill="#f4e4bc" />
                                    <path d="M 48 58 L 52 58 L 50 64 Z" fill="#f4e4bc" />
                                </motion.svg>

                                <defs>
                                    <filter id="hazyBlur">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                                    </filter>
                                </defs>
                            </motion.div>
                        </div>
                    )}
                    {renderMode === 'mpr' && (
                        <div className="w-full flex flex-col md:flex-row gap-4 items-center">
                            <div className="w-full md:w-1/2 h-64 flex items-center justify-center" style={{ perspective: '600px' }}>
                                <div className="relative w-40 h-40" style={{ transform: 'rotateX(-20deg) rotateY(-30deg)', transformStyle: 'preserve-3d' }}>
                                    <div className="absolute w-full h-full border border-dashed border-gray-600"/>
                                    <div className="absolute w-28 h-28 rounded-full bg-yellow-400/10 top-6 left-6" style={{ transform: 'translateZ(6px)' }}/>
                                    <div className="absolute w-40 h-40 border-2 border-red-500/70" style={{ transform: `rotateY(90deg) translateZ(${slices.x / 100 * 40 - 20}px)` }} />
                                    <div className="absolute w-40 h-40 border-2 border-green-500/70" style={{ transform: `rotateX(90deg) translateZ(-${slices.y / 100 * 40 - 20}px)` }} />
                                    <div className="absolute w-40 h-40 border-2 border-blue-500/70" style={{ transform: `translateZ(${slices.z / 100 * 40 - 20}px)` }} />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 grid grid-cols-2 gap-2">
                                <div className="bg-black/50 aspect-square rounded relative"><div className="absolute inset-0">{renderSliceContent('x')}</div><span className="absolute top-1 left-1 text-xs text-red-400">Sagittal</span></div>
                                <div className="bg-black/50 aspect-square rounded relative"><div className="absolute inset-0">{renderSliceContent('y')}</div><span className="absolute top-1 left-1 text-xs text-green-400">Coronal</span></div>
                                <div className="bg-black/50 aspect-square rounded col-span-2 relative"><div className="absolute inset-0">{renderSliceContent('z')}</div><span className="absolute top-1 left-1 text-xs text-blue-400">Axial</span></div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Controls Pane */}
                <div className="lg:col-span-1 flex flex-col justify-center">
                    <div className="flex flex-col gap-2">
                        <ControlButton onClick={() => setRenderMode('surface')} secondary={renderMode !== 'surface'}>Surface Render</ControlButton>
                        <ControlButton onClick={() => setRenderMode('mpr')} secondary={renderMode !== 'mpr'}>Multi-Planar (MPR)</ControlButton>
                    </div>
                    
                    <div className="mt-4 bg-white/10 p-4 rounded-lg">
                        {renderMode === 'surface' && (
                            <div>
                                <label className="block text-white/80 mb-2">Opacity Threshold</label>
                                <input type="range" min="0" max="100" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                                <div className="text-center mt-2 font-mono text-lg text-yellow-400">{threshold}%</div>
                                <p className="text-xs text-center text-white/60 mt-2">Increase to "peel away" low-level noise and reveal the surface.</p>
                            </div>
                        )}
                        {renderMode === 'mpr' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-red-400 font-semibold">Sagittal Slice (X)</label>
                                    <input type="range" min="0" max="100" value={slices.x} onChange={e => handleSliceChange('x', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-400" />
                                </div>
                                <div>
                                    <label className="text-xs text-green-400 font-semibold">Coronal Slice (Y)</label>
                                    <input type="range" min="0" max="100" value={slices.y} onChange={e => handleSliceChange('y', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-400" />
                                </div>
                                 <div>
                                    <label className="text-xs text-blue-400 font-semibold">Axial Slice (Z)</label>
                                    <input type="range" min="0" max="100" value={slices.z} onChange={e => handleSliceChange('z', Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: 4D Imaging (Refined) ---
const FourDImagingSection: React.FC = () => {
    const [isFrozen, setIsFrozen] = useState(false);
    const [quality, setQuality] = useState(50); // 0 (Low/Fast) to 100 (High/Slow)
    const [rotationY, setRotationY] = useState(0);

    // Derived stats
    const frameRate = Math.max(5, 40 - (quality * 0.35)); // High quality = Low FPS
    const animationDuration = 1000 / frameRate / 1000; // seconds per frame
    
    // Aesthetic calculations
    const voxelSize = 2 + (100 - quality) / 10; // High quality = small voxels
    const imageBlur = (100 - quality) / 20; // High quality = sharp

    // Face SVG Parts
    const Face = () => (
        <g>
            {/* Head Base */}
            <ellipse cx="50" cy="50" rx="35" ry="45" fill="url(#fetalGradient)" stroke="#d4af37" strokeWidth="0.5" />
            
            {/* Features (Eye sockets, nose bridge) - Depth Simulation */}
            <path d="M 35 40 Q 40 45 45 40" stroke="#b4912f" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M 55 40 Q 60 45 65 40" stroke="#b4912f" strokeWidth="2" fill="none" opacity="0.6" />
            
            {/* Nose */}
            <path d="M 50 45 Q 45 55 50 60 Q 55 55 50 45" fill="#e5c56d" />
            
            {/* Moving Mouth */}
            <motion.ellipse 
                cx="50" cy="70" rx="6" ry="3" 
                fill="#8a6e3e"
                animate={isFrozen ? {} : { ry: [2, 5, 2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Hand Wave */}
            <motion.path 
                d="M 80 80 Q 90 60 85 50 Q 80 40 70 50" 
                fill="#f4e4bc" 
                opacity="0.8"
                animate={isFrozen ? {} : { d: ["M 80 80 Q 90 60 85 50 Q 80 40 70 50", "M 80 80 Q 95 65 90 55 Q 85 45 75 55", "M 80 80 Q 90 60 85 50 Q 80 40 70 50"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
        </g>
    );

    return (
        <DemoSection
            title="4D Real-Time Simulation: Volume Rate vs. Quality"
            description="4D is simply 3D over time. The critical physics trade-off is between spatial resolution (Image Quality) and temporal resolution (Volume Rate). Increasing scan line density improves the image but slows down the movement."
        >
            <div className="flex flex-col lg:flex-row gap-8">
                {/* 4D Monitor */}
                <div className="w-full lg:w-2/3 bg-black rounded-2xl border-4 border-gray-800 relative overflow-hidden shadow-2xl">
                    {/* Screen Glare/Scan Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[size:100%_4px,6px_100%]" />
                    
                    {/* Main Render View */}
                    <div className="h-[400px] flex items-center justify-center relative bg-[#1a1500]" style={{ perspective: '800px' }}>
                        {/* 3D Container */}
                        <motion.div 
                            className="relative w-64 h-64 preserve-3d"
                            animate={{ rotateY: rotationY }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            style={{ 
                                transformStyle: 'preserve-3d', 
                                filter: `blur(${imageBlur}px) contrast(1.2)`
                            }}
                        >
                            {/* Layered Pseudo-Volumetric Effect */}
                            <div className="absolute inset-0" style={{ transform: 'translateZ(-10px)', opacity: 0.5 }}><svg viewBox="0 0 100 100"><Face /></svg></div>
                            <div className="absolute inset-0" style={{ transform: 'translateZ(0px)' }}><svg viewBox="0 0 100 100"><Face /></svg></div>
                            <div className="absolute inset-0" style={{ transform: 'translateZ(10px)', opacity: 0.3, mixBlendMode: 'overlay' }}><svg viewBox="0 0 100 100"><Face /></svg></div>
                            
                            {/* Rendering "Swipe" to simulate Volume Acquisition Rate */}
                            {!isFrozen && (
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent z-10"
                                    animate={{ top: ['-100%', '100%'] }}
                                    transition={{ duration: 1/frameRate, repeat: Infinity, ease: 'linear' }}
                                />
                            )}
                        </motion.div>

                        {/* On-Screen Data Overlay */}
                        <div className="absolute top-4 left-4 font-mono text-yellow-500 text-xs space-y-1 z-30">
                            <p>GEN: 4.0</p>
                            <p>MI: 0.8  TI: 0.4</p>
                            <p>FR: <span className={frameRate < 10 ? 'text-red-500 font-bold' : 'text-green-400'}>{isFrozen ? 0 : frameRate.toFixed(1)} Hz</span></p>
                            <p>D: 12.0cm</p>
                        </div>
                        {isFrozen && <div className="absolute bottom-4 right-4 text-cyan-400 font-bold border border-cyan-400 px-2 rounded animate-pulse z-30">FROZEN</div>}
                    </div>
                    
                    <defs>
                        <radialGradient id="fetalGradient" cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25">
                            <stop offset="0%" stopColor="#fce9b5" />
                            <stop offset="40%" stopColor="#e5c56d" />
                            <stop offset="100%" stopColor="#8a6e3e" />
                        </radialGradient>
                    </defs>
                </div>

                {/* Controls */}
                <div className="w-full lg:w-1/3 flex flex-col justify-center gap-6">
                    <ControlButton onClick={() => setIsFrozen(!isFrozen)} fullWidth secondary={isFrozen}>
                        {isFrozen ? 'Unfreeze' : 'Freeze'}
                    </ControlButton>

                    <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-white/70">Line Density / Quality</span>
                                <span className={`font-bold ${quality > 70 ? 'text-red-400' : 'text-green-400'}`}>{quality > 70 ? 'High (Slow)' : 'Low (Fast)'}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={quality} 
                                onChange={e => setQuality(Number(e.target.value))} 
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--gold)]"
                            />
                            <p className="text-xs text-white/50 mt-2 italic">
                                Higher quality requires more scan lines, which takes more time, lowering the Volume Rate (Hz).
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-2">View Angle (Rotation)</label>
                            <div className="flex gap-2">
                                <button onClick={() => setRotationY(r => r - 45)} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white">↺</button>
                                <input 
                                    type="range" 
                                    min="-90" max="90" 
                                    value={rotationY} 
                                    onChange={e => setRotationY(Number(e.target.value))} 
                                    className="flex-grow h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 self-center"
                                />
                                <button onClick={() => setRotationY(r => r + 45)} className="p-2 bg-white/5 rounded hover:bg-white/10 text-white">↻</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};


const ThreeDDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <DataAcquisitionSection />
            <VolumeRenderingSection />
            <FourDImagingSection />
            <KnowledgeCheck
                question="The technique of displaying orthogonal Axial, Sagittal, and Coronal planes from a 3D volume is known as:"
                options={["Surface Rendering", "Maximum Intensity Projection (MIP)", "Multi-Planar Reconstruction (MPR)", "Volume Averaging"]}
                correctAnswer="Multi-Planar Reconstruction (MPR)"
                explanation="MPR is a fundamental technique in 3D/4D imaging that allows the user to slice through the acquired data volume in any plane, most commonly the three orthogonal planes (axial, sagittal, coronal)."
            />
        </div>
    );
};

export default ThreeDDemo;
