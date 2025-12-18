
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import KnowledgeCheck from './KnowledgeCheck';
import { useMotionValue, useTransform } from 'framer-motion';

const GlowingOrb: React.FC = () => (
    <div
        className="w-5 h-5 rounded-full"
        style={{
            background: `radial-gradient(circle, white 20%, var(--orb-color, rgba(250, 204, 21, 1)) 80%)`,
            boxShadow: `0 0 15px 5px var(--glow-color, rgba(253, 224, 71, 0.7))`,
        }}
    />
);


// --- Pulse-Echo Cycle Component ---
const RangeEquationSection: React.FC = () => {
  const [targetDepthPercent, setTargetDepthPercent] = useState(60);
  const animationControls = useAnimation();
  const timelineControls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeOfFlight, setTimeOfFlight] = useState(0);

  const animationDuration = 3; // seconds for full round trip at 100% depth
  const speedOfSound = 1540; // m/s
  const maxDepthCm = 15; // Represents 100% depth

  const calculatedDepth = useMemo(() => {
    return (speedOfSound * (timeOfFlight / 1000) / 2) * 100; // cm
  }, [timeOfFlight]);
  
  const actualTimeOfFlightMs = useMemo(() => {
      return (2 * (targetDepthPercent/100 * maxDepthCm / 100) / speedOfSound) * 1000;
  }, [targetDepthPercent, maxDepthCm]);

  const handleSendPulse = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeOfFlight(0);
    // FIX: Cast object with CSS custom properties to 'any' to resolve TypeScript error.
    animationControls.set({ y: 0, opacity: 1, '--orb-color': 'rgba(250, 204, 21, 1)', '--glow-color': 'rgba(253, 224, 71, 0.7)' } as any);
    timelineControls.set({ width: '0%' });

    const totalTravelTime = animationDuration * (targetDepthPercent / 100);
    const oneWayTime = totalTravelTime / 2;

    // Animate pulse down
    await animationControls.start({
        y: (targetDepthPercent / 100) * 236, // 236 = 256 (h-64) - 20 (start pos)
        transition: { duration: oneWayTime, ease: 'linear' }
    });
    
    // Animate echo up
    // FIX: Cast object with CSS custom properties to 'any' to resolve TypeScript error.
    await animationControls.start({
        y: 0,
        '--orb-color': 'rgba(34, 211, 238, 1)',
        '--glow-color': 'rgba(103, 232, 249, 0.7)',
        transition: { duration: oneWayTime, ease: 'linear' }
    } as any);
    animationControls.start({ opacity: 0, transition: { delay: 0.1 } });

    // Animate timeline
    timelineControls.start({
        width: '100%',
        transition: { duration: totalTravelTime, ease: 'linear' }
    });

    setTimeOfFlight(actualTimeOfFlightMs);
    setIsAnimating(false);
  };

  return (
    <DemoSection
      title="The Range Equation"
      description="The time between transmitting a pulse and receiving its echo determines depth. The machine calculates this using the formula: Depth = (Speed of Sound × Time) / 2. The division by 2 accounts for the round-trip travel of the sound."
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 flex gap-4">
            <div className="relative h-64 w-full bg-gray-800/50 rounded-xl overflow-hidden p-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-400 rounded-b-md"></div>

                {[0, 25, 50, 75, 100].map(p => (
                <div key={p} className="absolute left-2 text-xs text-white/50" style={{ top: `${p}%`}}>
                    - {Math.round(p/100 * maxDepthCm)} cm
                </div>
                ))}
                
                <motion.div animate={animationControls} className="absolute left-1/2 -translate-x-1/2 top-5">
                    <GlowingOrb />
                </motion.div>
                
                <div
                className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full border-2 border-white"
                style={{ top: `${targetDepthPercent}%`, transform: 'translate(-50%, -50%)' }}
                ></div>
            </div>
             <div className="relative w-16 h-64 bg-gray-800/50 rounded-xl overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-white/50 transform -rotate-90 origin-center translate-y-8">Time</div>
                <motion.div className="w-full bg-yellow-400" style={{height: '100%', originY: 0}} initial={{scaleY: 0}} animate={timelineControls} />
            </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-between">
            <div>
                <label htmlFor="depth-slider" className="block text-white/80 mb-2">Target Depth</label>
                <input
                    id="depth-slider"
                    type="range"
                    min="10"
                    max="90"
                    value={targetDepthPercent}
                    onChange={(e) => setTargetDepthPercent(Number(e.target.value))}
                    disabled={isAnimating}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="text-center mt-2 text-lg font-mono">
                    {((targetDepthPercent/100) * maxDepthCm).toFixed(1)} cm
                </div>
            </div>

            <ControlButton onClick={handleSendPulse} disabled={isAnimating}>
                {isAnimating ? 'Pulsing...' : 'Send Pulse'}
            </ControlButton>

            {timeOfFlight > 0 && (
                 <div className="bg-white/10 p-4 rounded-lg mt-4 text-left animate-fade-in space-y-2 font-mono text-sm">
                    <p className="text-white/70">Time of Flight (t): <span className="font-bold text-yellow-400 float-right">{timeOfFlight.toFixed(2)} ms</span></p>
                    <p className="text-white/70">Total Distance = c × t</p>
                    <p className="text-white/70 pl-4">= 1540m/s × {timeOfFlight.toFixed(2)}ms = <span className="font-bold text-white float-right">{(calculatedDepth * 2).toFixed(1)} cm</span></p>
                    <p className="text-white/70">Depth = Total Distance / 2</p>
                    <p className="font-bold text-lg text-white/90 pl-4">= {(calculatedDepth * 2).toFixed(1)}cm / 2 = <span className="font-bold text-yellow-400 text-xl float-right">{calculatedDepth.toFixed(1)} cm</span></p>
                </div>
            )}
        </div>
      </div>
    </DemoSection>
  );
};

// --- PRF vs. Depth Component ---
const PrfVsDepthSection: React.FC = () => {
    const [prf, setPrf] = useState(4); // kHz
    const speedOfSound = 1540; // m/s
    const LINES_PER_FRAME = 100; // A typical assumption for demonstrating the principle
    
    // Calculate derived values
    const priMs = 1 / prf; // Pulse Repetition Interval in milliseconds
    const maxDepthCm = (speedOfSound / (2 * prf * 1000)) * 100;
    const maxPossibleDepthCm = (speedOfSound / (2 * 1 * 1000)) * 100; // Max depth at min PRF of 1kHz
    const frameRate = (prf * 1000) / LINES_PER_FRAME;
    const dutyFactor = 0.1 / priMs; // Assuming a 0.1ms pulse duration for visualization

    const animationDuration = 5 / prf;
    const depthInPixels = (maxDepthCm / maxPossibleDepthCm) * 256; // 256px = h-64
    const pulseColor = 'rgba(250, 204, 21, 1)';
    const pulseGlow = 'rgba(253, 224, 71, 0.7)';
    const echoColor = 'rgba(34, 211, 238, 1)';
    const echoGlow = 'rgba(103, 232, 249, 0.7)';


    return (
        <DemoSection
            title="PRF, Depth, & Frame Rate"
            description="The Pulse Repetition Frequency (PRF) creates a critical trade-off. A high PRF allows for a high frame rate for smooth real-time imaging, but it limits the maximum imaging depth. A low PRF is required to see deeper, but this reduces the frame rate."
        >
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                    {/* Main Visualization */}
                    <div className="relative h-64 bg-gray-800/50 rounded-xl overflow-hidden p-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-400 rounded-b-md"></div>
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/30 to-transparent transition-all duration-300"
                            style={{ height: `${(maxDepthCm / maxPossibleDepthCm) * 100}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400"></div>
                            <div className="absolute top-1 left-2 text-cyan-300 text-sm font-bold">Max Depth</div>
                        </div>
                        <motion.div
                            key={prf} // This will restart the animation when prf changes
                            className="absolute left-1/2 -translate-x-1/2"
                            style={{ top: 5 }}
                            initial={{ y: 0 }}
                            // FIX: Cast object with CSS custom properties to 'any' to resolve TypeScript error.
                            animate={{
                                y: [0, depthInPixels - 20, 0],
                                '--orb-color': [pulseColor, pulseColor, echoColor, echoColor],
                                '--glow-color': [pulseGlow, pulseGlow, echoGlow, echoGlow],
                                opacity: [1, 1, 1, 0]
                            } as any}
                            // FIX: Cast object with CSS custom properties to 'any' to resolve TypeScript error.
                            transition={{
                                duration: animationDuration,
                                repeat: Infinity,
                                ease: 'linear',
                                y: { duration: animationDuration, times: [0, 0.5, 1] },
                                '--orb-color': { duration: animationDuration, times: [0, 0.5, 0.501, 1] },
                                '--glow-color': { duration: animationDuration, times: [0, 0.5, 0.501, 1] },
                                opacity: { duration: animationDuration, times: [0, 0.95, 1, 1] }
                            } as any}
                        >
                            <GlowingOrb />
                        </motion.div>
                    </div>
                    {/* PRI Timeline Visualization */}
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-white/80 mb-2">PRI Timeline</h4>
                        <div className="relative w-full h-8 bg-gray-700/50 rounded-xl overflow-hidden">
                           <div className="h-full flex items-center transition-all duration-300 ease-in-out" style={{ width: `${(priMs / 1) * 100}%`}}>
                                <div className="h-full bg-orange-500 flex items-center justify-center text-xs font-bold text-black shrink-0 px-2" style={{width: `${dutyFactor*2}%`}}><span>Pulse</span></div>
                                <div className="h-full bg-cyan-500/50 flex items-center justify-center text-xs font-semibold text-cyan-200"><span>Listening Time</span></div>
                           </div>
                        </div>
                    </div>
                </div>
                {/* Controls and Readouts */}
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                    <label htmlFor="prf-slider" className="block text-white/80 mb-2">PRF</label>
                    <input
                        id="prf-slider"
                        type="range" min="1" max="15" step="0.5" value={prf}
                        onChange={(e) => setPrf(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                    />
                    <div className="text-center mt-2 text-lg font-mono text-yellow-400">{prf.toFixed(1)} kHz</div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">PRI:</p>
                        <p className="text-xl font-bold text-white mt-1">{priMs.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Resulting Max Depth:</p>
                        <p className="text-2xl font-bold text-white mt-1">{maxDepthCm.toFixed(1)} cm</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Resulting Frame Rate:</p>
                        <p className="text-2xl font-bold text-white mt-1">{frameRate.toFixed(0)} FPS</p>
                        <p className="text-xs text-white/50 mt-1">(for {LINES_PER_FRAME} lines/frame)</p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Pulse Length & Axial Resolution Component ---
const AxialResolutionSection: React.FC = () => {
  const [cycles, setCycles] = useState(3);
  const animationControls = useAnimation();
  const aModeControls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const WAVELENGTH_MM = 0.5;
  const spatialPulseLength = cycles * WAVELENGTH_MM;
  const axialResolution = spatialPulseLength / 2;
  const targetSeparation_mm = 0.8;
  const areTargetsResolved = axialResolution < targetSeparation_mm;

  const resolutionText = areTargetsResolved ? { text: "Resolved", color: "text-green-400" } : { text: "Unresolved", color: "text-red-400" };
  const pulseWidthPx = cycles * 15;

  const runAnimation = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    aModeControls.set({ pathLength: 1 });
    animationControls.set({ x: -pulseWidthPx });
    
    animationControls.start({ x: 300, transition: { duration: 2, ease: 'linear' } });
    
    if (areTargetsResolved) {
        await aModeControls.start({ pathLength: [1, 0.7, 0.7, 0.5, 0.5, 0], transition: { duration: 2, ease: 'linear', times: [0, 0.4, 0.45, 0.6, 0.65, 1] }});
    } else {
        await aModeControls.start({ pathLength: [1, 0.5, 0.5, 0], transition: { duration: 2, ease: 'linear', times: [0, 0.4, 0.65, 1] }});
    }

    setIsAnimating(false);
  }, [isAnimating, areTargetsResolved, pulseWidthPx, animationControls, aModeControls]);

  return (
    <DemoSection
      title="Interactive Axial Resolution Lab"
      description="Axial resolution is the ability to distinguish two structures along the beam path. It is determined by Spatial Pulse Length (SPL). A shorter pulse (fewer cycles) hits targets separately, creating two distinct peaks on the A-Mode display."
    >
        <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 grid grid-rows-2 gap-4">
                <div className="h-32 bg-gray-800/50 rounded-xl relative overflow-hidden flex items-center justify-center">
                    <motion.div animate={animationControls} className="absolute top-1/2 -translate-y-1/2" style={{ width: pulseWidthPx }}>
                        <GlowingOrb />
                    </motion.div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400" style={{ left: '45%' }}/>
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400" style={{ left: '65%' }}/>
                    <p className="absolute top-2 left-2 text-xs text-white/60">B-Mode Simulation</p>
                </div>
                 <div className="h-32 bg-black/80 rounded-xl p-4 relative flex items-center justify-center">
                    <svg viewBox="0 0 140 100" className="w-48 h-24">
                        <motion.path d="M 0 80 L 40 80 L 50 30 L 60 80 L 80 80 L 90 30 L 100 80 L 140 80" stroke="#fef08a" strokeWidth="2" fill="none"
                            animate={aModeControls}
                            style={{ strokeDasharray: 200, strokeDashoffset: 200, opacity: areTargetsResolved ? 1 : 0, transition: 'opacity 0.3s' }}/>
                         <motion.path d="M 0 80 L 40 80 C 50 10, 80 10, 90 80 L 140 80" stroke="#fef08a" strokeWidth="2" fill="none"
                            animate={aModeControls}
                            style={{ strokeDasharray: 200, strokeDashoffset: 200, opacity: areTargetsResolved ? 0 : 1, transition: 'opacity 0.3s' }}/>
                    </svg>
                     <p className="absolute top-2 left-2 text-xs text-white/60">A-Mode Display</p>
                </div>
            </div>
             <div className="w-full md:w-1/3 flex flex-col justify-center">
                 <label htmlFor="cycles-slider" className="block text-white/80 mb-2">Number of Cycles in Pulse</label>
                <input
                  id="cycles-slider" type="range" min={2} max={8} step="1" value={cycles}
                  onChange={(e) => setCycles(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="text-center mt-2 text-lg font-mono text-yellow-400">{cycles}</div>
                 <div className="mt-4 bg-white/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-white/70">Axial Resolution:</p>
                    <p className={`text-2xl font-bold mt-1 text-white`}>{axialResolution.toFixed(2)} mm</p>
                    <p className={`text-lg font-semibold mt-1 ${resolutionText.color}`}>{resolutionText.text}</p>
                </div>
                <ControlButton onClick={runAnimation} disabled={isAnimating} fullWidth>Run Sim</ControlButton>
            </div>
        </div>
    </DemoSection>
  );
};

// --- Acoustic Attenuation Component ---
const TISSUES = [
    { name: 'Fat', coefficient: 0.63, color: '#fde047' }, // yellow
    { name: 'Liver', coefficient: 0.75, color: '#fb923c' }, // orange
    { name: 'Muscle', coefficient: 1.09, color: '#f87171' }, // red
    { name: 'Bone', coefficient: 5.0, color: '#d1d5db' }, // gray
    { name: 'Air', coefficient: 12.0, color: '#93c5fd' }, // blue
];

const AcousticAttenuationSection: React.FC = () => {
  const [tissue, setTissue] = useState(TISSUES[1]);
  const animationControls = useAnimation();
  const pathControls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const oneWayAttenuation = tissue.coefficient * 5 * 10;
  const roundTripAttenuation = oneWayAttenuation * 2;
  const finalIntensityPercent = Math.pow(10, -roundTripAttenuation / 10) * 100;
  
  const runAnimation = async () => {
      if(isAnimating) return;
      setIsAnimating(true);
      pathControls.set({ pathLength: 1 });
      animationControls.set({ y: 0, opacity: 1, '--orb-color': 'rgba(250, 204, 21, 1)', '--glow-color': 'rgba(253, 224, 71, 0.7)' } as any);

      pathControls.start({ pathLength: 0.5, transition: { duration: 1.5, ease: 'linear' } });
      await animationControls.start({
          y: 230,
          opacity: 0.5,
          transition: { duration: 1.5, ease: 'linear' }
      });
      
      pathControls.start({ pathLength: 0, transition: { duration: 1.5, ease: 'linear' } });
      await animationControls.start({
          y: 0,
          opacity: Math.max(0.1, finalIntensityPercent / 100),
           '--orb-color': 'rgba(34, 211, 238, 1)',
           '--glow-color': 'rgba(103, 232, 249, 0.7)',
          transition: { duration: 1.5, ease: 'linear' }
      } as any);
      
      setIsAnimating(false);
  }

  const pathD = `M 0 0 C 25 50, 25 50, 50 ${100 - (finalIntensityPercent)}`;

  return (
    <DemoSection
      title="Real-Time Acoustic Attenuation"
      description="As the pulse travels and returns, its intensity weakens. This real-time graph shows how different tissues cause more or less attenuation."
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 flex gap-4">
          <div className="relative h-72 w-full bg-gray-800/50 rounded-xl overflow-hidden p-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-yellow-400 rounded-b-md"></div>
            <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-400 rounded-full" style={{ top: '250px' }}></div>
            <motion.div animate={animationControls} className="absolute left-1/2 -translate-x-1/2 top-5"><GlowingOrb /></motion.div>
          </div>
          <div className="relative h-72 w-32 bg-gray-900/50 rounded-xl p-2">
            <svg viewBox="0 0 50 100" className="w-full h-full">
              <motion.path d={pathD} stroke={tissue.color} strokeWidth="3" fill="none" animate={pathControls} style={{strokeDasharray: '100 100', strokeDashoffset: 100}} />
            </svg>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-white/50">Depth</span>
            <span className="absolute top-1/2 -left-3 text-xs text-white/50 transform -rotate-90">Intensity</span>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-center">
          <h4 className="text-white/80 mb-2 text-center">Select Tissue Type:</h4>
          <div className="flex flex-col gap-2">
            {TISSUES.map(t => (
              <ControlButton key={t.name} onClick={() => setTissue(t)} secondary={tissue.name !== t.name}>
                {t.name}
              </ControlButton>
            ))}
          </div>
          <ControlButton onClick={runAnimation} disabled={isAnimating} fullWidth>Run Sim</ControlButton>
        </div>
      </div>
    </DemoSection>
  );
};


// --- Range Ambiguity Component ---
const RangeAmbiguitySection: React.FC = () => {
  const [isAmbiguous, setIsAmbiguous] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const prf = isAmbiguous ? 8.0 : 3.5;
  const maxUnambiguousDepthCm = (1540 / (2 * prf * 1000)) * 100;
  const trueTargetDepthCm = 20;
  
  const prpSeconds = 1 / (prf * 1000);
  const timeOfFlight = (2 * trueTargetDepthCm / 100) / 1540;
  const ambiguousTime = timeOfFlight - prpSeconds;
  const perceivedDepthCm = (ambiguousTime * 1540 / 2) * 100;
  
  const pulse2Color = 'rgba(96, 165, 250, 1)';
  const pulse2Glow = 'rgba(147, 197, 253, 0.7)';

  return (
    <DemoSection
      title="Range Ambiguity Artifact"
      description="If PRF is too high for a deep target, the echo returns after the next pulse is sent. The PRP timeline visually explains this timing error."
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <div className="relative h-80 bg-gray-800/50 rounded-xl overflow-hidden p-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400 rounded-b-md"></div>
            <div className="absolute w-full h-1 bg-cyan-400/50" style={{top: `${(maxUnambiguousDepthCm / 30) * 100}%`}}><span className="text-xs text-cyan-300">Max Range</span></div>
            <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full" style={{ top: `${(trueTargetDepthCm / 30) * 100}%` }} />
            {isAmbiguous && <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500/80 border-2 border-dashed border-red-300 rounded-full" style={{ top: `${(perceivedDepthCm / 30) * 100}%` }} />}
            
            <AnimatePresence>
            {animationKey > 0 && (
                <>
                <motion.div key={`pulse1-${animationKey}`} className="absolute left-1/2 -translate-x-1/2 top-5" initial={{y: 0}} animate={{y: 266}} transition={{duration: timeOfFlight*1.5, ease:'linear'}}><GlowingOrb /></motion.div>
                <motion.div key={`echo1-${animationKey}`} className="absolute left-1/2 -translate-x-1/2 top-5" initial={{y: 266, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: timeOfFlight*1.5, delay: timeOfFlight*1.5, ease:'linear'}}>
                    <div style={{'--orb-color': 'rgba(34, 211, 238, 1)', '--glow-color': 'rgba(103, 232, 249, 0.7)'} as any}><GlowingOrb /></div>
                </motion.div>
                <motion.div key={`pulse2-${animationKey}`} className="absolute left-1/2 -translate-x-1/2 top-5" initial={{y: 0, opacity: 0}} animate={{y: 266, opacity: [0, 1, 1]}} transition={{duration: timeOfFlight*1.5, delay: prpSeconds, ease:'linear'}}>
                    <div style={{'--orb-color': pulse2Color, '--glow-color': pulse2Glow} as any}><GlowingOrb /></div>
                </motion.div>
                {isAmbiguous && (
                    <>
                        <motion.p key="text1" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.1}} className="absolute top-1/4 left-2 text-xs bg-black/50 p-1 rounded">1. Pulse 1 sent.</motion.p>
                        <motion.p key="text2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: prpSeconds * 0.5}} className="absolute top-1/2 left-2 text-xs bg-black/50 p-1 rounded">2. Echo 1 is returning...</motion.p>
                        <motion.p key="text3" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: prpSeconds}} className="absolute top-1/4 left-2 text-xs bg-black/50 p-1 rounded text-blue-300">3. PRP is too short! Pulse 2 sent.</motion.p>
                        <motion.p key="text4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: timeOfFlight*1.5}} className="absolute top-1/3 left-2 text-xs bg-black/50 p-1 rounded text-red-400">4. Echo 1 returns, but system thinks it's from Pulse 2.</motion.p>
                    </>
                )}
                </>
            )}
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-center">
            <div className="flex flex-col gap-2">
                <ControlButton onClick={() => {setIsAmbiguous(true); setAnimationKey(0);}} secondary={!isAmbiguous}>High PRF ({isAmbiguous ? prf.toFixed(1) : 8.0} kHz)</ControlButton>
                <ControlButton onClick={() => {setIsAmbiguous(false); setAnimationKey(0);}} secondary={isAmbiguous}>Safe PRF ({!isAmbiguous ? prf.toFixed(1) : 3.5} kHz)</ControlButton>
            </div>
             <div className="mt-4 h-20">
                <p className="text-sm text-white/70 mb-2">PRP Timeline</p>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    {animationKey > 0 && <motion.div className="h-full bg-yellow-400" initial={{width: '0%'}} animate={{width: '100%'}} transition={{duration: prpSeconds, repeat: Infinity, ease:'linear'}}/>}
                </div>
            </div>
            <ControlButton onClick={() => setAnimationKey(p => p + 1)} fullWidth>Run Sim</ControlButton>
        </div>
      </div>
    </DemoSection>
  )
}

const PulsedWaveDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <RangeEquationSection />
      <PrfVsDepthSection />
      <AxialResolutionSection />
      <AcousticAttenuationSection />
      <RangeAmbiguitySection />
      <KnowledgeCheck
        moduleId="pulsed"
        question="If you increase your imaging depth, what must happen to the PRF?"
        options={["PRF must increase.", "PRF must decrease.", "PRF stays the same.", "PRF is unrelated to depth."]}
        correctAnswer="PRF must decrease."
        explanation="Increasing depth means the pulse has to travel further, so the 'listening time' (PRP) must increase. Since PRF is the inverse of PRP, a longer listening time requires a lower PRF to avoid range ambiguity."
      />
    </div>
  );
};

export default PulsedWaveDemo;
