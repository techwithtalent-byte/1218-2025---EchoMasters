import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

type Scenario = 'deep_liver' | 'superficial_thyroid';
type Compounding = 'off' | 'low' | 'high';
type GrayMap = 'linear' | 's-curve';

// A more realistic SVG-based image component
const UltrasoundImageDisplay: React.FC<{ style: React.CSSProperties, scenario: Scenario, harmonics: boolean }> = ({ style, scenario, harmonics }) => (
    <div className="w-full h-full bg-black relative overflow-hidden graticule-bg">
        <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
                <filter id="speckle">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                 <linearGradient id="tgc-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
                    {/* These stops will be dynamically overridden by inline styles */}
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.4" />
                </linearGradient>
            </defs>
            {/* Base Tissue Texture */}
            <rect width="100%" height="100%" fill="#555" filter="url(#speckle)" style={{ opacity: 0.15, ...style }} />
            
            {/* Anatomical Structures */}
            <g style={{...style}}>
                {scenario === 'deep_liver' ? (
                    <>
                        <ellipse cx="50%" cy="75%" rx="20%" ry="10%" fill="#333" />
                        <circle cx="65%" cy="80%" r="8%" fill="#111" />
                    </>
                ) : (
                    <>
                         <ellipse cx="50%" cy="30%" rx="30%" ry="12%" fill="#444" />
                         <circle cx="45%" cy="32%" r="5%" fill="#222" />
                    </>
                )}
            </g>
             {/* TGC Brightness Overlay */}
             <rect width="100%" height="100%" fill="url(#tgc-gradient)" style={{ mixBlendMode: 'plus-lighter', ...style }} />

            {/* Harmonics Clutter Overlay */}
            {!harmonics && (
                <rect width="100%" height="25%" fill="#ccc" filter="url(#speckle)" style={{ opacity: 0.1, mixBlendMode: 'screen' }} />
            )}
        </svg>
    </div>
);

const ControlPanel: React.FC<{ title: string, colorClass: string, children: React.ReactNode }> = ({ title, colorClass, children }) => (
    <div className="bg-gray-900/70 p-4 rounded-lg space-y-3 ring-1 ring-black/50 shadow-inner">
        <h4 className={`font-bold text-center ${colorClass} font-mono tracking-wider`}>{title.toUpperCase()}</h4>
        <div className="space-y-3">{children}</div>
    </div>
);

const KnobologyDemo: React.FC = () => {
    // --- State for Controls ---
    const [scenario, setScenario] = useState<Scenario>('deep_liver');
    
    // Transmit Controls
    const [power, setPower] = useState(70);
    const [frequency, setFrequency] = useState(3.5); // MHz
    const [depth, setDepth] = useState(16); // cm
    const [focusPos, setFocusPos] = useState(50); // % depth
    
    // Receiver & Processing Controls
    const [gain, setGain] = useState(50);
    const [dynamicRange, setDynamicRange] = useState(60);
    const [tgc, setTgc] = useState([40, 60, 80]); // Near, Mid, Far %
    const [harmonics, setHarmonics] = useState(true);
    const [compounding, setCompounding] = useState<Compounding>('low');
    const [persistence, setPersistence] = useState(2); // 0-4
    const [speckleReduction, setSpeckleReduction] = useState(true);
    const [grayMap, setGrayMap] = useState<GrayMap>('s-curve');

    const resetControls = (scen: Scenario) => {
        setScenario(scen);
        if (scen === 'deep_liver') {
            setPower(80); setGain(45); setDynamicRange(65);
            setFrequency(3.5); setDepth(16); setFocusPos(75);
            setTgc([30, 50, 80]); setHarmonics(true); setCompounding('low');
            setPersistence(2); setSpeckleReduction(true); setGrayMap('s-curve');
        } else if (scen === 'superficial_thyroid') {
            setPower(60); setGain(55); setDynamicRange(50);
            setFrequency(12); setDepth(5); setFocusPos(30);
            setTgc([70, 40, 20]); setHarmonics(true); setCompounding('high');
            setPersistence(1); setSpeckleReduction(true); setGrayMap('s-curve');
        }
    };

    const autoOptimize = () => {
        if (scenario === 'deep_liver') {
            setGain(60); setTgc([40, 65, 85]); setDynamicRange(60); setFocusPos(70);
        } else {
            setGain(65); setTgc([75, 50, 30]); setDynamicRange(55); setFocusPos(40);
        }
    };
    
    // --- Image Style Calculation ---
    const { 
        imageStyle, 
        focusBlurTopStyle,
        focusBlurBottomStyle,
        tgcGradientStops,
        scores, 
        guidance,
        frameRate,
        mi,
        ti
    } = useMemo(() => {
        const guidanceMessages: string[] = [];

        let resolutionScore = 100, penetrationScore = 100, contrastScore = 100, safetyScore = 100;

        if (scenario === 'deep_liver') {
            if (frequency > 5) { resolutionScore -= (frequency - 5) * 6; guidanceMessages.push("❌ High Freq: Poor penetration for a deep target. Lower frequency."); }
            if (focusPos < 60) { resolutionScore -= (60 - focusPos) * 1.5; guidanceMessages.push("🎯 Focus is too shallow for a deep lesion."); }
            if (tgc[2] < 70) { contrastScore -= (70 - tgc[2]) * 1; guidanceMessages.push("💡 Far-field is too dark. Increase far TGC."); }
            if (depth < 14) { penetrationScore = 0; guidanceMessages.push(" Depth is too shallow to see the lesion.");}
            if (power < 80) { penetrationScore -= (80 - power) * 1; guidanceMessages.push("⚡ Power is low for a deep target. Increase power for better SNR.");}
            if (!harmonics) { resolutionScore -= 15; contrastScore -= 10; guidanceMessages.push("🎵 Harmonics are off. Turn them on to reduce clutter."); }
            if (compounding === 'off') { contrastScore -= 10; guidanceMessages.push("🧱 Compounding is off. Turn it on to smooth texture."); }
        } else if (scenario === 'superficial_thyroid') {
            if (frequency < 10) { resolutionScore -= (10 - frequency) * 7; guidanceMessages.push("❌ Low Freq: Lacks detail for a superficial target. Increase frequency."); }
            if (focusPos > 40) { resolutionScore -= (focusPos - 40) * 1.5; guidanceMessages.push("🎯 Focus is too deep for a superficial lesion."); }
            if (tgc[0] < 60) { contrastScore -= (60-tgc[0]); guidanceMessages.push("💡 Near-field is dark. Increase near TGC."); }
            if (depth > 8) { penetrationScore -= (depth - 8) * 5; guidanceMessages.push(" Depths is too deep, wasting screen space and lowering frame rate."); }
            if (!harmonics) { resolutionScore -= 25; contrastScore -= 20; guidanceMessages.push("🎵 Harmonics are essential for near-field clarity. Turn them on."); }
            if (compounding === 'off') { contrastScore -= 15; } else if (compounding === 'low') { contrastScore -= 5; }
        }
        
        if (dynamicRange < 45 || dynamicRange > 75) { contrastScore -= 20; guidanceMessages.push("🌗 Adjust Dynamic Range for better tissue contrast."); }
        if (gain < 30 || gain > 85) { contrastScore -= 15; guidanceMessages.push("🔆 Overall gain seems too low or high."); }
        if (power > 95) { safetyScore -= (power - 95) * 5; guidanceMessages.push("🛡️ ALARA: Power is very high. Can you get a diagnostic image with less?");}

        let calculatedFrameRate = Math.max(10, 80 - depth * 2 - persistence * 5);
        if (compounding === 'low') calculatedFrameRate *= 0.85;
        if (compounding === 'high') calculatedFrameRate *= 0.7;

        const calculatedMI = (power / 100) * (1 / Math.sqrt(frequency)) * 1.8;
        const calculatedTI = (power / 100) * frequency * 0.15 * (scenario === 'superficial_thyroid' ? 0.8 : 1.2);

        let contrastValue = 0.8 + dynamicRange/120;
        if (grayMap === 's-curve') contrastValue *= 1.2;
        
        let blurValue = 1.5; // Base focus blur
        blurValue += (speckleReduction ? 0.2 : 1.0);
        if (compounding === 'low') blurValue += 0.3;
        if (compounding === 'high') blurValue += 0.6;
        
        const baseImageStyle: React.CSSProperties = {
            filter: `brightness(${0.7 + gain / 120}) contrast(${contrastValue})`,
            transform: `scale(${20 / depth})`,
            transformOrigin: 'top center',
        };
        
        const focusBlurSize = 15;
        const focusTopStyle = { height: `${Math.max(0, focusPos - focusBlurSize)}%`, backdropFilter: `blur(${blurValue}px)` };
        const focusBottomStyle = { top: `${focusPos + focusBlurSize}%`, backdropFilter: `blur(${blurValue}px)` };

        const TgcGradientStops = () => (
            <>
                <stop offset="0%" stopColor="white" stopOpacity={tgc[0] / 300} />
                <stop offset="50%" stopColor="white" stopOpacity={tgc[1] / 300} />
                <stop offset="100%" stopColor="white" stopOpacity={tgc[2] / 300} />
            </>
        );

        return { 
            imageStyle: baseImageStyle,
            focusBlurTopStyle: focusTopStyle,
            focusBlurBottomStyle: focusBottomStyle,
            tgcGradientStops: <TgcGradientStops />,
            scores: { resolution: Math.max(0, resolutionScore), penetration: Math.max(0, penetrationScore), contrast: Math.max(0, contrastScore), safety: Math.max(0, safetyScore) },
            guidance: guidanceMessages.length > 0 ? guidanceMessages : ["✅ Looks well-optimized for this scenario!"],
            frameRate: calculatedFrameRate, mi: calculatedMI, ti: calculatedTI
        };
    }, [gain, dynamicRange, frequency, focusPos, tgc, scenario, depth, power, harmonics, compounding, persistence, speckleReduction, grayMap]);

    const overallScore = useMemo(() => (scores.resolution + scores.penetration + scores.contrast + scores.safety) / 4, [scores]);

    return (
        <DemoSection title="System Optimization (Knobology)" description="An unoptimized image is on screen. Use your knowledge to adjust the controls and achieve a diagnostic-quality image.">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="w-full xl:w-[45%] flex flex-col">
                    <p className="text-center text-sm text-yellow-300 italic mb-2">
                        CHALLENGE: Optimize for a {scenario === 'deep_liver' ? 'deep liver lesion' : 'superficial thyroid nodule'}.
                    </p>
                    <div className="flex-grow aspect-[4/5] bg-black rounded-xl p-1 relative overflow-hidden ring-2 ring-gray-700">
                        <UltrasoundImageDisplay style={imageStyle} scenario={scenario} harmonics={harmonics} />
                        <div className="absolute inset-0 pointer-events-none" style={focusBlurTopStyle} />
                        <div className="absolute inset-0 pointer-events-none" style={focusBlurBottomStyle} />
                        <svg width="0" height="0" style={{position: 'absolute'}}><defs><linearGradient id="tgc-gradient" x1="0.5" y1="0" x2="0.5" y2="1">{tgcGradientStops}</linearGradient></defs></svg>
                        <div className="absolute top-2 right-2 text-right text-xs font-mono bg-black/50 p-2 rounded">
                            <p>Depth: {depth.toFixed(1)} cm</p><p>FR: {frameRate.toFixed(0)} Hz</p>
                            <p>MI: {mi.toFixed(2)}</p><p>TI: {ti.toFixed(2)}</p>
                        </div>
                    </div>
                     <div className="flex gap-2 mt-4">
                        <ControlButton onClick={() => resetControls('deep_liver')} secondary={scenario !== 'deep_liver'} fullWidth>Deep Scenario</ControlButton>
                        <ControlButton onClick={() => resetControls('superficial_thyroid')} secondary={scenario !== 'superficial_thyroid'} fullWidth>Superficial Scenario</ControlButton>
                    </div>
                </div>

                <div className="w-full xl:w-[55%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ControlPanel title="Transmit" colorClass="text-cyan-300">
                         <div><label className="text-sm font-mono">Power ({power}%)</label><input type="range" min="10" max="100" value={power} onChange={e => setPower(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
                         <div><label className="text-sm font-mono">Frequency ({frequency.toFixed(1)} MHz)</label><input type="range" min="2" max="15" step="0.5" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
                        <div><label className="text-sm font-mono">Depth ({depth.toFixed(1)} cm)</label><input type="range" min="4" max="24" step="1" value={depth} onChange={e => setDepth(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
                        <div><label className="text-sm font-mono">Focus Depth ({focusPos}%)</label><input type="range" min="10" max="90" value={focusPos} onChange={e => setFocusPos(Number(e.target.value))} className="w-full accent-cyan-400" /></div>
                        <ControlButton onClick={autoOptimize} fullWidth>Auto Optimize</ControlButton>
                    </ControlPanel>
                    <ControlPanel title="Receiver" colorClass="text-orange-300">
                         <div><label className="text-sm font-mono">Gain ({gain})</label><input type="range" min="20" max="100" value={gain} onChange={e => setGain(Number(e.target.value))} className="w-full accent-orange-400" /></div>
                        <div><label className="text-sm font-mono">Dyn. Range ({dynamicRange}dB)</label><input type="range" min="30" max="90" value={dynamicRange} onChange={e => setDynamicRange(Number(e.target.value))} className="w-full accent-orange-400" /></div>
                         <div className="mt-2"><h4 className="text-center mb-1 text-sm font-mono">TGC</h4>
                             <div className="space-y-2"><input type="range" value={tgc[0]} onChange={e => setTgc(p => [Number(e.target.value), p[1], p[2]])} className="w-full accent-orange-400" title="Near"/><input type="range" value={tgc[1]} onChange={e => setTgc(p => [p[0], Number(e.target.value), p[2]])} className="w-full accent-orange-400" title="Mid"/><input type="range" value={tgc[2]} onChange={e => setTgc(p => [p[0], p[1], Number(e.target.value)])} className="w-full accent-orange-400" title="Far"/></div>
                         </div>
                    </ControlPanel>
                    <div className="md:col-span-2 lg:col-span-1">
                        <ControlPanel title="Processing" colorClass="text-yellow-300">
                            <div className="flex flex-col gap-3">
                                <div><label className="text-sm font-mono">Harmonics</label><ControlButton onClick={() => setHarmonics(!harmonics)} secondary={!harmonics} fullWidth>{harmonics ? 'On' : 'Off'}</ControlButton></div>
                                <div><label className="text-sm font-mono">Compounding</label><div className="flex gap-1 text-xs"><ControlButton onClick={() => setCompounding('off')} secondary={compounding !== 'off'} fullWidth>Off</ControlButton><ControlButton onClick={() => setCompounding('low')} secondary={compounding !== 'low'} fullWidth>Low</ControlButton><ControlButton onClick={() => setCompounding('high')} secondary={compounding !== 'high'} fullWidth>High</ControlButton></div></div>
                                <div><label className="text-sm font-mono">Persistence ({persistence})</label><input type="range" min="0" max="4" value={persistence} onChange={e => setPersistence(Number(e.target.value))} className="w-full accent-yellow-400" /></div>
                                <div><label className="text-sm font-mono">Speckle Reduction</label><ControlButton onClick={() => setSpeckleReduction(!speckleReduction)} secondary={!speckleReduction} fullWidth>{speckleReduction ? 'On' : 'Off'}</ControlButton></div>
                                <div><label className="text-sm font-mono">Gray Map</label><ControlButton onClick={() => setGrayMap(p => p === 'linear' ? 's-curve' : 'linear')} secondary fullWidth>{grayMap}</ControlButton></div>
                                
                                <div className="bg-white/10 p-2 rounded-lg mt-auto text-center">
                                    <p className="text-xs text-white/70">Optimization Score:</p>
                                    <p className={`text-2xl font-bold mt-1 ${overallScore > 80 ? 'text-green-400' : overallScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{overallScore.toFixed(0)}%</p>
                                    <div className="text-xs text-white/80 mt-1 h-12 overflow-y-auto">{guidance[0]}</div>
                                </div>
                            </div>
                        </ControlPanel>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

export default KnobologyDemo;