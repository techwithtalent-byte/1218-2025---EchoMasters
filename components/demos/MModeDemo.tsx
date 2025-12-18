import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
// FIX: Added useAnimation and AnimatePresence to framer-motion import.
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// FIX: Added missing KnowledgeCheck component definition.
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


// --- Section 1: The M-Mode Concept ---
const MModeConceptSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <DemoSection
            title="The M-Mode Concept: The 'Ice Pick' View"
            description="M-Mode (Motion Mode) repeatedly fires a single scan line and displays the motion of structures along that line over time. This provides excellent temporal resolution, perfect for analyzing fast-moving objects like heart valves."
        >
            <div className="flex flex-col lg:flex-row gap-8">
                {/* B-Mode + M-Mode Line */}
                <div className="w-full lg:w-1/2 h-80 bg-gray-800 rounded-xl relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-4 border-gray-500 rounded-lg flex flex-col justify-around p-2">
                        <motion.div
                            className="w-full h-4 bg-gray-400 rounded-sm"
                            animate={{ x: isPlaying ? [0, 10, 0] : 0 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                         <motion.div
                            className="w-full h-4 bg-gray-400 rounded-sm"
                            animate={{ x: isPlaying ? [0, -10, 0] : 0 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        />
                    </div>
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-yellow-400/80 border-x border-dashed border-black"></div>
                    <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">B-Mode View</div>
                </div>
                {/* M-Mode Trace */}
                <div className="w-full lg:w-1/2 h-80 graticule-bg rounded-xl relative overflow-hidden p-2">
                    <svg width="200%" height="100%" viewBox="0 0 600 200" className="absolute top-0 left-0" style={{ animation: isPlaying ? `m-mode-trace-draw 2.4s linear infinite` : 'none' }}>
                        <path d="M0 85 C 75 45, 150 45, 225 85 S 300 125, 375 125 S 450 85, 525 85 S 600 45, 600 45" stroke="#fff" strokeWidth="2" fill="none" />
                        <path d="M0 115 C 75 155, 150 155, 225 115 S 300 75, 375 75 S 450 115, 525 115 S 600 155, 600 155" stroke="#fff" strokeWidth="2" fill="none" />
                    </svg>
                    <div className="absolute bottom-1 right-2 text-xs text-white/50">Time →</div>
                    <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">M-Mode View</div>
                </div>
            </div>
            <div className="text-center mt-4">
                 <ControlButton onClick={() => setIsPlaying(!isPlaying)} secondary>
                    {isPlaying ? 'Pause' : 'Play'} Animation
                </ControlButton>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Interactive M-Mode Lab (Refined) ---
const MModeLab: React.FC = () => {
    const bModeRef = useRef<HTMLDivElement>(null);
    const mModeRef = useRef<SVGSVGElement>(null);
    const [cursorY, setCursorY] = useState(170); // in pixels
    const [isDraggingCursor, setIsDraggingCursor] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    const [measurementMode, setMeasurementMode] = useState(false);
    const [calipers, setCalipers] = useState<{ p1: { x: number, y: number } | null, p2: { x: number, y: number } | null }>({ p1: null, p2: null });
    const [draggingCaliper, setDraggingCaliper] = useState<'p1' | 'p2' | null>(null);

    const handleBModeMouseMove = useCallback((e: MouseEvent) => {
        if (!isDraggingCursor || !bModeRef.current) return;
        const rect = bModeRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        setCursorY(Math.max(0, Math.min(rect.height, y)));
    }, [isDraggingCursor]);

    const handleMouseUp = useCallback(() => { setIsDraggingCursor(false); setDraggingCaliper(null); }, []);
    
    useEffect(() => {
        window.addEventListener('mousemove', handleBModeMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleBModeMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleBModeMouseMove, handleMouseUp]);

    const handleMModeMouseEvent = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, type: 'down' | 'move') => {
        if (!mModeRef.current) return;
        const svg = mModeRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        
        if (type === 'down' && measurementMode) {
            if (!calipers.p1) setCalipers(c => ({ ...c, p1: { x: svgP.x, y: svgP.y } }));
            else if (!calipers.p2) setCalipers(c => ({ ...c, p2: { x: svgP.x, y: svgP.y } }));
        }
        if (type === 'move' && draggingCaliper) {
            setCalipers(c => ({...c, [draggingCaliper]: { x: svgP.x, y: svgP.y }}));
        }
    };

    type TraceType = 'aortic' | 'mitral' | 'lv' | 'none';
    const { activeTrace } = useMemo<{ activeTrace: TraceType }>(() => {
        // Cursor positions corresponding to lines 1, 2, 3 in the diagram
        const aoZone = { start: 80, end: 125 };   // Line 1
        const mvZone = { start: 140, end: 190 };  // Line 2
        const lvZone = { start: 190, end: 260 };  // Line 3

        if (cursorY > aoZone.start && cursorY < aoZone.end) return { activeTrace: 'aortic' };
        if (cursorY > mvZone.start && cursorY < mvZone.end) return { activeTrace: 'mitral' };
        if (cursorY > lvZone.start && cursorY < lvZone.end) return { activeTrace: 'lv' };
        
        return { activeTrace: 'none' };
    }, [cursorY]);

    const measurement = useMemo(() => {
        if (!calipers.p1 || !calipers.p2) return null;
        const verticalDist = Math.abs(calipers.p1.y - calipers.p2.y);
        const horizontalDist = Math.abs(calipers.p1.x - calipers.p2.x);
        const verticalMM = verticalDist / 2;
        const horizontalMS = horizontalDist * (1.2 / 300) * 1000;
        return { mm: verticalMM, ms: horizontalMS };
    }, [calipers]);

    const cardiacCycleTransition = { duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } as const;

    const MModeTrace: React.FC<{ trace: TraceType; isPlaying: boolean }> = ({ trace, isPlaying }) => {
        const transition = { duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } as const;
    
        const aorticLeafletVariants = {
            closed: { d: "M0 90 H600" },
            open: { d: "M0 90 L75 90 L85 75 L140 75 L150 90 L225 90 L235 75 L290 75 L300 90 L375 90 L385 75 L440 75 L450 90 L525 90 L535 75 L590 75 L600 90" },
        };
    
        switch(trace) {
            case 'aortic': return (
                <g>
                    {/* AO Root Walls */}
                    <motion.path d="M0 70 H600" stroke="#ccc" strokeWidth="2" fill="none" animate={{ y: isPlaying ? [0, -10, 0] : 0 }} transition={transition} />
                    <motion.path d="M0 110 H600" stroke="#ccc" strokeWidth="2" fill="none" animate={{ y: isPlaying ? [0, -10, 0] : 0 }} transition={transition} />
                    {/* Aortic Valve Cusps */}
                    <motion.path variants={aorticLeafletVariants} animate={isPlaying ? ["closed", "open"] : "closed"} transition={transition} stroke="#fff" strokeWidth="2" fill="none" />
                    {/* Surrounding Structures */}
                    <path d="M0 50 H600" stroke="#777" strokeWidth="1" fill="none" />
                    <path d="M0 150 H600" stroke="#777" strokeWidth="1" fill="none" />
                </g>
            );
            case 'mitral': return (
                <g>
                    <motion.path d="M0 60 H600" stroke="#ccc" strokeWidth="3" fill="none" animate={{ y: isPlaying ? [0, 5, 0] : 0 }} transition={transition} />
                    {/* AML (M-shape) */}
                    <path d="M0 80 L25 80 L50 40 L75 60 L100 30 L125 80 L150 80 L175 80 L200 40 L225 60 L250 30 L275 80 L300 80 L325 80 L350 40 L375 60 L400 30 L425 80 L450 80 L475 80 L500 40 L525 60 L550 30 L575 80 L600 80" stroke="#fff" strokeWidth="2.5" fill="none" />
                    {/* PML */}
                    <path d="M0 120 L50 120 L75 140 L100 130 L125 150 L150 120 L200 120 L225 140 L250 130 L275 150 L300 120 L350 120 L375 140 L400 130 L425 150 L450 120 L500 120 L525 140 L550 130 L575 150 L600 120" stroke="#ccc" strokeWidth="2" fill="none" />
                </g>
            );
            case 'lv': return (
                <g>
                    {/* Septal Wall */}
                    <motion.path d="M0 60 H600" stroke="#ccc" strokeWidth="2" fill="none" animate={{ y: isPlaying ? [0, 10, 0] : 0 }} transition={transition} />
                    {/* LV Posterior Wall */}
                    <motion.path d="M0 160 H600" stroke="#ccc" strokeWidth="2" fill="none" animate={{ y: isPlaying ? [0, -15, 0] : 0 }} transition={transition} />
                </g>
            );
            case 'none':
            default:
                return <path d="M0 100 H600" stroke="#555" strokeWidth="1" />;
        }
    };

    return (
        <DemoSection title="Interactive M-Mode Lab" description="Place the M-mode cursor over different parts of the heart to see the corresponding motion trace. Use the calipers to measure time and distance.">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* B-Mode + M-Mode Line */}
                <div ref={bModeRef} className="w-full lg:w-1/2 h-96 bg-gray-900 rounded-xl relative overflow-hidden" onMouseUp={handleMouseUp}>
                    <img src="https://i.imgur.com/uRj2g5g.png" alt="Parasternal Long Axis view" className="w-full h-full object-cover" />
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 border-x border-dashed border-black" style={{'--tw-border-opacity': '0.5', 'borderColor': 'rgba(250, 204, 21, var(--tw-border-opacity))'} as React.CSSProperties} />
                    <motion.div 
                        className="absolute left-0 right-0 h-0.5 bg-yellow-400 cursor-ns-resize"
                        style={{ top: cursorY }}
                        onMouseDown={() => setIsDraggingCursor(true)}
                    />
                    <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">B-Mode</div>
                </div>
                {/* M-Mode Trace */}
                <div className="w-full lg:w-1/2 h-96 graticule-bg rounded-xl relative overflow-hidden p-2">
                    <svg ref={mModeRef} width="200%" height="100%" viewBox="0 0 600 200" className="absolute top-0 left-0" 
                        style={{ animation: isPlaying ? `m-mode-trace-draw 2.4s linear infinite` : 'none' }}
                        onMouseDown={e => handleMModeMouseEvent(e, 'down')}
                        onMouseMove={e => handleMModeMouseEvent(e, 'move')}
                        onMouseUp={handleMouseUp}
                    >
                        <AnimatePresence>
                            <motion.g key={activeTrace} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <MModeTrace trace={activeTrace} isPlaying={isPlaying} />
                            </motion.g>
                        </AnimatePresence>
                        {calipers.p1 && <circle cx={calipers.p1.x} cy={calipers.p1.y} r="3" fill="cyan" className="cursor-move" onMouseDown={() => setDraggingCaliper('p1')} />}
                        {calipers.p2 && <circle cx={calipers.p2.x} cy={calipers.p2.y} r="3" fill="cyan" className="cursor-move" onMouseDown={() => setDraggingCaliper('p2')} />}
                        {calipers.p1 && calipers.p2 && <line x1={calipers.p1.x} y1={calipers.p1.y} x2={calipers.p2.x} y2={calipers.p2.y} stroke="cyan" strokeWidth="1" strokeDasharray="2" />}
                    </svg>
                    <div className="absolute bottom-1 right-2 text-xs text-white/50">Time →</div>
                    <div className="absolute top-2 left-2 text-sm font-bold text-white/70 bg-black/50 px-2 py-1 rounded">M-Mode View</div>
                    {measurement && (
                        <div className="absolute bottom-2 left-2 text-xs font-mono bg-black/50 p-1 rounded text-cyan-300">
                            <p>ΔY: {measurement.mm.toFixed(1)} mm</p>
                            <p>ΔX: {measurement.ms.toFixed(0)} ms</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center items-center gap-4">
                 <ControlButton onClick={() => setIsPlaying(!isPlaying)} secondary>
                    {isPlaying ? 'Pause Heart Cycle' : 'Play Heart Cycle'}
                </ControlButton>
                <ControlButton onClick={() => setMeasurementMode(!measurementMode)} secondary={!measurementMode}>
                    {measurementMode ? 'Calipers Active' : 'Activate Calipers'}
                </ControlButton>
                <ControlButton onClick={() => setCalipers({ p1: null, p2: null })} secondary>
                    Clear Calipers
                </ControlButton>
            </div>
        </DemoSection>
    );
};

const MModeDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <MModeConceptSection />
            <MModeLab />
            <KnowledgeCheck
                question="Which M-Mode pattern is characteristic of the anterior mitral valve leaflet?"
                options={["A box-like shape", "A single systolic peak", "An 'M-shaped' pattern", "A flat line"]}
                correctAnswer="An 'M-shaped' pattern"
                explanation="The anterior mitral valve leaflet shows a distinct 'M-shaped' pattern on M-Mode. The first peak (E-point) represents early diastolic opening, and the second peak (A-point) represents opening during atrial contraction."
            />
        </div>
    );
};

export default MModeDemo;
