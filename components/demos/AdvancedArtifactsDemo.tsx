import React, { useState, useMemo } from 'react';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';

// --- Section 1: Mirror Image Artifact ---
const MirrorImageSection: React.FC = () => {
    const [animationKey, setAnimationKey] = useState(0);
    const reflectorPos = 60; // %
    const objectPosY = 40; // %
    const objectPosX = 25; // %
    const mirrorObjectPosY = reflectorPos + (reflectorPos - objectPosY);

    // FIX: Cast style object to `any` to allow for CSS custom properties, which are not in the default React.CSSProperties type.
    const pulseStyle: React.CSSProperties = {
        '--reflector-pos': `${reflectorPos}%`,
        '--object-pos-y': `${objectPosY}%`,
        '--object-pos-x': `${objectPosX}%`,
        animation: `mirror-path-animation 4s linear forwards`
    } as any;

    return (
        <DemoSection
            title="Mirror Image Artifact"
            description="When the sound beam hits a strong, curved reflector (like the diaphragm), it can be redirected to an object, reflect back to the diaphragm, and then back to the transducer. The machine incorrectly assumes a straight path and places a 'ghost' image deep to the reflector."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-96 bg-gray-800/50 rounded-xl p-4 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400 rounded-b-md"></div>
                    {/* Strong Reflector */}
                    <div className="absolute left-0 right-0 h-2 bg-cyan-400/80 rounded-full" style={{ top: `${reflectorPos}%` }} />
                    <p className="absolute text-xs text-cyan-300" style={{ top: `${reflectorPos - 5}%`, left: '5%' }}>Strong Reflector (e.g., Diaphragm)</p>
                    {/* True Object */}
                    <div className="absolute w-12 h-12 bg-green-500 rounded-full" style={{ top: `${objectPosY}%`, left: `${objectPosX}%` }} />
                     <p className="absolute text-xs text-green-300" style={{ top: `${objectPosY - 5}%`, left: `${objectPosX}%` }}>True Object</p>
                    {/* Mirror Artifact */}
                    <div className="absolute w-12 h-12 bg-red-500/70 border-2 border-dashed border-red-300 rounded-full" style={{ top: `${mirrorObjectPosY}%`, left: `${objectPosX}%` }} />
                    <p className="absolute text-xs text-red-300" style={{ top: `${mirrorObjectPosY - 5}%`, left: `${objectPosX}%` }}>Mirror Artifact</p>
                    {/* Sound Path */}
                    {animationKey > 0 && <div key={animationKey} className="absolute w-4 h-4 bg-orange-400 rounded-full -translate-x-1/2 -translate-y-1/2" style={pulseStyle}></div>}
                </div>
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <ControlButton onClick={() => setAnimationKey(p => p + 1)} disabled={animationKey > 0}>
                        Show Sound Path
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 2: Side Lobe / Grating Lobe Artifact ---
const SideLobeSection: React.FC = () => {
    const [animationKey, setAnimationKey] = useState(0);
    const targetTop = "70%";

    const mainPulseStyle: React.CSSProperties = { '--target-top': '90%', animation: 'side-lobe-pulse 2s linear forwards' } as React.CSSProperties;
    const sidePulseStyle: React.CSSProperties = { '--target-top': targetTop, animation: 'side-lobe-pulse 1.6s linear forwards' } as React.CSSProperties;

    return (
        <DemoSection
            title="Side Lobe / Grating Lobe Artifact"
            description="Lower-energy beams can be emitted off-axis from the main beam. If these side lobes hit a strong reflector, the echo returns and is incorrectly placed along the main beam's path."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-96 bg-gray-800/50 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400 rounded-b-md"></div>
                    {/* Beams */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-full bg-orange-500/20"></div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-full bg-orange-500/10" style={{ transform: 'translateX(-60px) rotate(-20deg)' }}></div>
                    {/* Reflector */}
                    <div className="absolute w-12 h-12 bg-green-500 rounded-full left-[15%]" style={{ top: targetTop }} />
                    <p className="absolute text-xs text-green-300" style={{ top: `calc(${targetTop} - 20px)`, left: '15%' }}>Strong Off-Axis Reflector</p>
                    {/* Artifact */}
                    <div className="absolute w-12 h-12 bg-red-500/70 border-2 border-dashed border-red-300 rounded-full left-1/2 -translate-x-1/2" style={{ top: targetTop }} />
                    <p className="absolute text-xs text-red-300" style={{ top: `calc(${targetTop} - 20px)`, left: '52%' }}>Side Lobe Artifact</p>
                    {/* Pulses */}
                    {animationKey > 0 && (
                        <>
                           <div key={`main-${animationKey}`} className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-400 rounded-full" style={mainPulseStyle}></div>
                           <div key={`side-${animationKey}`} className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-orange-400/70 rounded-full" style={{ ...sidePulseStyle, transform: 'translateX(-60px) rotate(-20deg)', transformOrigin: 'top center' }}></div>
                        </>
                    )}
                </div>
                 <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <ControlButton onClick={() => setAnimationKey(p => p + 1)} disabled={animationKey > 0}>
                        Send Pulse
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Speed Error Artifact ---
const SpeedErrorSection: React.FC = () => {
    const [mediumSpeed, setMediumSpeed] = useState(1200); // m/s
    const MACHINE_ASSUMED_SPEED = 1540;

    const timeToTarget = (0.05 / MACHINE_ASSUMED_SPEED) + (0.05 / mediumSpeed); // Assume 10cm total, 5cm in each zone
    const perceivedDepth = (timeToTarget * MACHINE_ASSUMED_SPEED / 2) * 100; // in cm
    
    const trueDepth = 10;
    const errorCm = perceivedDepth - trueDepth;
    const isSlower = mediumSpeed < MACHINE_ASSUMED_SPEED;
    
    const animationDuration = isSlower ? '3s' : '2s';

    return (
        <DemoSection
            title="Speed Error Artifact"
            description="The ultrasound machine assumes sound travels at 1540 m/s. If the actual speed in a medium is slower or faster, structures deep to that medium will be placed at an incorrect depth."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 h-96 bg-gray-800/50 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400 rounded-b-md"></div>
                    {/* Different Speed Zone */}
                    <div className="absolute left-0 right-0 h-[50%] bg-white/5" style={{ top: '40%' }}>
                        <p className="absolute top-2 left-2 text-xs text-white/70">Medium Speed: {mediumSpeed} m/s</p>
                    </div>
                    {/* True Target */}
                    <div className="absolute left-1/4 w-12 h-12 bg-green-500 rounded-lg" style={{ top: '80%' }} />
                    <p className="absolute text-xs text-green-300" style={{ top: '75%', left: '25%' }}>True Position</p>
                    {/* Perceived Target */}
                    <div className="absolute left-2/3 w-12 h-12 bg-red-500/70 border-2 border-dashed border-red-300 rounded-lg transition-all duration-300" style={{ top: `${40 + (perceivedDepth-5)*4}%` }} />
                    <p className="absolute text-xs text-red-300 transition-all duration-300" style={{ top: `${40 + (perceivedDepth-5)*4 - 5}%`, left: '66.66%' }}>Perceived Position</p>

                    {/* Sound Path Animation */}
                     <div key={mediumSpeed} className="absolute top-0 left-1/4 w-1 bg-orange-400" style={{ animation: `speed-error-path ${animationDuration} linear forwards` }}></div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center">
                     <label className="block text-white/80 mb-2">Medium's Actual Speed</label>
                    <input type="range" min="1000" max="2000" step="50" value={mediumSpeed} onChange={e => setMediumSpeed(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
                    <div className="text-center mt-2 font-mono text-lg text-yellow-400">{mediumSpeed} m/s</div>
                    <div className="bg-white/10 p-4 rounded-lg mt-4 text-center">
                        <p className="text-sm text-white/70">Object Misplaced By:</p>
                        <p className="text-2xl font-bold text-white mt-1">{errorCm.toFixed(2)} cm</p>
                        <p className={`text-md font-semibold mt-2 ${isSlower ? 'text-red-400' : 'text-cyan-400'}`}>
                            {isSlower ? 'Placed Too Deep' : 'Placed Too Shallow'}
                        </p>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const AdvancedArtifactsDemo: React.FC = () => {
    return (
        <div className="space-y-8">
            <MirrorImageSection />
            <SideLobeSection />
            <SpeedErrorSection />
        </div>
    );
};

export default AdvancedArtifactsDemo;
