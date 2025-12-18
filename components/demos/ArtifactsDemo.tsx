
import React, { useState, useMemo, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import MatchingExercise from './MatchingExercise';
import KnowledgeCheck from './KnowledgeCheck';

// --- Section 1: Reverberation & Comet Tail ---
const ReverberationSection: React.FC = () => {
  const [distance, setDistance] = useState(40); // a percentage
  const [isComet, setIsComet] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'running'>('idle');
  const pulseControls = useAnimation();
  const echoControls = useAnimation();

  const handleSendPulse = async () => {
    if (animationState === 'running') return;
    setAnimationState('running');
    
    pulseControls.set({ y: 0, opacity: 1 });
    echoControls.set({ opacity: 0 });
    
    const duration = isComet ? 0.2 : 0.6;
    const reflector1Y = 80;
    const reflector2Y = reflector1Y + (isComet ? 10 : distance * 2.5);

    // 1st Echo (True)
    await pulseControls.start({ y: reflector2Y, transition: { duration, ease: 'linear' } });
    await pulseControls.start({ y: 0, transition: { duration, ease: 'linear' } });
    echoControls.start(i => i === 0 ? { opacity: 1, transition: { delay: duration * 2 } } : {});

    // 1st Artifact
    await pulseControls.start({ y: reflector2Y, transition: { duration, ease: 'linear' } });
    await pulseControls.start({ y: 0, transition: { duration, ease: 'linear' } });
    echoControls.start(i => i === 1 ? { opacity: 0.7, transition: { delay: duration * 4 } } : {});

    // 2nd Artifact
    await pulseControls.start({ y: reflector2Y, transition: { duration, ease: 'linear' } });
    await pulseControls.start({ y: 0, transition: { duration, ease: 'linear' } });
    echoControls.start(i => i === 2 ? { opacity: 0.4, transition: { delay: duration * 6 } } : {});
    
    await pulseControls.start({ opacity: 0 });

    setTimeout(() => setAnimationState('idle'), 1000);
  };
  
  const handlePreset = (dist: number, comet: boolean) => {
      setDistance(dist);
      setIsComet(comet);
      setAnimationState('idle'); // Allow re-running animation
  }

  const reflector1Pos = 25;
  const reflector2Pos = reflector1Pos + (isComet ? 3 : distance);
  const artifactSpacing = isComet ? 3 : distance;

  return (
    <DemoSection
      title="Reverberation Artifacts"
      description="The pulse bounces multiple times between strong reflectors. Each round trip is misinterpreted by the machine as a new, deeper structure."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 flex gap-4">
            <div className="relative h-96 w-2/3 bg-gray-800/50 rounded-xl overflow-hidden p-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-400 rounded-b-md"></div>
                <div className="absolute left-0 right-0 h-1 bg-white/40 rounded-full" style={{ top: `${reflector1Pos}%` }}></div>
                <div className="absolute left-0 right-0 h-1 bg-white/40 rounded-full transition-all duration-300" style={{ top: `${reflector2Pos}%` }}></div>

                <motion.div 
                  className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full" 
                  initial={{ y: 0, opacity: 0 }}
                  animate={pulseControls}
                />
            </div>
            <div className="relative h-96 w-1/3 bg-black/50 rounded-xl overflow-hidden p-2 border-l-2 border-gray-500">
                <div className="absolute top-0 left-2 text-xs text-white/50">Depth</div>
                 {/* True Echoes */}
                 <motion.div custom={0} animate={echoControls} initial={{ opacity: 0 }} className="absolute w-full h-1 bg-green-400" style={{ top: `${reflector1Pos}%` }}></motion.div>
                 <motion.div custom={0} animate={echoControls} initial={{ opacity: 0 }} className="absolute w-full h-1 bg-green-400 transition-all duration-300" style={{ top: `${reflector2Pos}%` }}></motion.div>
                 {/* Artifact Echoes */}
                <motion.div custom={1} animate={echoControls} initial={{ opacity: 0 }} className={`absolute w-full h-1 ${isComet ? 'h-16 bg-gradient-to-b from-red-500 to-transparent' : 'bg-red-500'}`} style={{ top: `${reflector2Pos + artifactSpacing}%` }}></motion.div>
                {!isComet && <motion.div custom={2} animate={echoControls} initial={{ opacity: 0 }} className="absolute w-full h-1 bg-red-500" style={{ top: `${reflector2Pos + artifactSpacing * 2}%` }}></motion.div>}
            </div>
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
            <div>
              <label className="block text-white/80 mb-2">Reflector Spacing</label>
              <input type="range" min="5" max="45" value={distance} onChange={(e) => handlePreset(Number(e.target.value), false)} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400" />
            </div>
            <div className="flex flex-col gap-2">
                <ControlButton onClick={() => handlePreset(40, false)}>Wide Spacing</ControlButton>
                <ControlButton onClick={() => handlePreset(5, true)} secondary>Comet-Tail Artifact</ControlButton>
            </div>
            <ControlButton onClick={handleSendPulse} disabled={animationState === 'running'}>
              {animationState === 'running' ? 'Animating...' : 'Send Pulse'}
            </ControlButton>
        </div>
      </div>
    </DemoSection>
  );
};

// --- Section 2: Shadowing & Enhancement ---
type TissueType = 'stone' | 'cyst' | 'curved';
const ShadowEnhancementSection: React.FC = () => {
    const [tissue, setTissue] = useState<TissueType>('stone');
    const [isScanning, setIsScanning] = useState(false);
    const scanLineControls = useAnimation();
    const bModeControls = useAnimation();

    const handleScan = async () => {
        if (isScanning) return;
        setIsScanning(true);
        scanLineControls.set({ x: '0%' });
        bModeControls.set({ pathLength: 1 }); // Hide path
        
        scanLineControls.start({ x: '100%', transition: { duration: 2, ease: 'linear' } });
        await bModeControls.start({ pathLength: 0, transition: { duration: 2, ease: 'linear' } });
        
        setIsScanning(false);
    };
    
    const { objectPath, bModePath } = useMemo(() => {
        let objPath = '', bModeP = '';
        switch(tissue) {
            case 'stone':
                objPath = "M 100 150 a 40 30 0 1 0 80 0 a 40 30 0 1 0 -80 0";
                bModeP = "M 100 140 h 80 v -120 h -80 v 120"; // Shadow
                break;
            case 'cyst':
                objPath = "M 100 150 a 40 30 0 1 0 80 0 a 40 30 0 1 0 -80 0";
                bModeP = "M 100 180 h 80 v 120 h -80 v -120"; // Enhancement
                break;
            case 'curved':
                objPath = "M 100 150 a 40 30 0 1 0 80 0 a 40 30 0 1 0 -80 0";
                bModeP = "M 100 140 h 10 v -120 h -10 v 120 M 170 140 h 10 v -120 h -10 v 120 M 115 180 h 50 v 120 h -50 v -120"; // Edge shadows + enhancement
                break;
        }
        return { objectPath: objPath, bModePath: bModeP };
    }, [tissue]);

    return (
        <DemoSection
            title="Shadowing & Enhancement: Real-Time Scan Simulation"
            description="As the scan line sweeps across, the B-Mode image is drawn in real-time. Observe how attenuating objects create shadows, while fluid-filled objects create enhancement."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                    <div className="h-96 bg-gray-800/50 rounded-xl relative p-4 overflow-hidden">
                        <p className="absolute top-2 left-2 text-xs text-white/60">Anatomy</p>
                        <svg viewBox="0 0 280 320" className="w-full h-full">
                           <path d={objectPath} fill="#aaa" stroke="#ccc" strokeWidth="2" />
                        </svg>
                        <motion.div className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/80" animate={scanLineControls} />
                    </div>
                     <div className="h-96 bg-black/80 rounded-xl relative p-4">
                         <p className="absolute top-2 left-2 text-xs text-white/60">Resulting B-Mode Image</p>
                          <svg viewBox="0 0 280 320" className="w-full h-full">
                            <motion.path 
                                d={bModePath} 
                                stroke="#eee" 
                                strokeWidth="80" 
                                strokeLinecap="round"
                                initial={{ pathLength: 1 }}
                                animate={bModeControls}
                                style={{ strokeDasharray: 1, strokeDashoffset: 0 }}
                            />
                        </svg>
                    </div>
                </div>
                <div className="w-full md:w-1/3 flex flex-col justify-center gap-4">
                    <h4 className="text-white/80 mb-1 text-center">Select Object:</h4>
                    <ControlButton onClick={() => setTissue('stone')} secondary={tissue !== 'stone'}>Gallstone (Shadowing)</ControlButton>
                    <ControlButton onClick={() => setTissue('cyst')} secondary={tissue !== 'cyst'}>Cyst (Enhancement)</ControlButton>
                    <ControlButton onClick={() => setTissue('curved')} secondary={tissue !== 'curved'}>Curved Structure (Edge Shadow)</ControlButton>
                     <ControlButton onClick={handleScan} disabled={isScanning}>
                        {isScanning ? 'Scanning...' : 'Perform Scan'}
                    </ControlButton>
                </div>
            </div>
        </DemoSection>
    );
};

// --- Section 3: Clinical Simulation ---
const SCENARIOS = {
    A: {
        description: "Patient A (Liver): During a liver scan, deep to a small gas bubble in the bowel, a series of closely spaced, bright, tapering echoes are observed extending posteriorly.",
        artifact: "Comet-tail artifact",
        principle: "The closely spaced, bright, tapering echoes are created by the ultrasound beam repeatedly reflecting between the transducer and the highly reflective, small gas bubble. Because the reflectors are so close, the individual reverberations merge into a continuous, streaky appearance."
    },
    B: {
        description: "Patient B (Kidney): Imaging the kidney reveals an anechoic (fluid-filled) simple cyst. Directly posterior to this cyst, the renal parenchyma appears notably brighter than the adjacent kidney tissue.",
        artifact: "Posterior Enhancement",
        principle: "The anechoic simple cyst is fluid-filled and therefore attenuates the ultrasound beam very little. As a result, the sound beam reaches the tissues posterior to the cyst with more energy than sound that traveled through the surrounding, more attenuating renal parenchyma. This excess energy causes the tissues behind the cyst to appear brighter (hyperechoic)."
    },
    C: {
        description: "Patient C (Gallbladder): A large, highly echogenic gallstone is identified within the gallbladder lumen. Extending immediately posterior to this gallstone is a distinct, anechoic cone-shaped area.",
        artifact: "Acoustic Shadowing",
        principle: "The large, highly echogenic gallstone is a strong attenuator; it either reflects nearly all of the ultrasound beam or absorbs a significant amount of its energy. This prevents the sound from penetrating effectively to the tissues posterior to the stone. Consequently, no echoes are generated from that region, creating a distinct anechoic (dark) shadow behind the gallstone."
    }
};
type ScenarioKey = 'A' | 'B' | 'C';

const ClinicalSimulationSection: React.FC = () => {
    const [selected, setSelected] = useState<ScenarioKey | null>(null);

    return (
        <DemoSection
            title="Clinical Simulation Quiz"
            description="Read the clinical scenarios and identify the most likely artifact. Click a scenario to reveal the answer and physical principle."
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex flex-col gap-2">
                    {Object.keys(SCENARIOS).map(key => (
                        <ControlButton key={key} onClick={() => setSelected(key as ScenarioKey)} secondary={selected !== key}>
                            Patient {key}
                        </ControlButton>
                    ))}
                </div>
                <div className="w-full md:w-2/3">
                    {selected ? (
                        <div className="bg-gray-800/50 p-6 rounded-lg animate-fade-in">
                            <p className="text-sm text-white/80 mb-4">{SCENARIOS[selected].description}</p>
                            <div className="bg-black/30 p-4 rounded">
                                <p className="text-sm text-yellow-400 font-bold">Artifact Identified:</p>
                                <p className="text-lg font-semibold text-white mb-3">{SCENARIOS[selected].artifact}</p>
                                <p className="text-sm text-yellow-400 font-bold">Physical Principle:</p>
                                <p className="text-sm text-white/90">{SCENARIOS[selected].principle}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-800/50 p-6 rounded-lg text-white/50">
                            Select a patient scenario to begin.
                        </div>
                    )}
                </div>
            </div>
        </DemoSection>
    );
}


const ArtifactsDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <ReverberationSection />
      <ShadowEnhancementSection />
      <ClinicalSimulationSection />
      
      {/* New Interactive Matching Exercise */}
      <MatchingExercise 
        title="Artifact Identification Challenge"
        pairs={[
            { id: '1', leftContent: 'Reverberation', rightContent: 'Multiple, equally spaced parallel echoes (Ladder-like)' },
            { id: '2', leftContent: 'Shadowing', rightContent: 'Dark anechoic band behind a high-attenuation object' },
            { id: '3', leftContent: 'Enhancement', rightContent: 'Hyperechoic region behind a low-attenuation object' },
            { id: '4', leftContent: 'Mirror Image', rightContent: 'Duplicate structure appearing deeper than a strong reflector' },
            { id: '5', leftContent: 'Comet Tail', rightContent: 'Solid, bright hyperechoic line directed downward' },
        ]}
      />
      <KnowledgeCheck
        moduleId="artifacts"
        question="Which artifact is most likely to cause a 'step-off' appearance or lateral displacement of a structure?"
        options={["Refraction", "Reverberation", "Side lobe", "Mirror image"]}
        correctAnswer="Refraction"
        explanation="Refraction artifact occurs when the sound beam bends at an interface with oblique incidence and different propagation speeds. This can cause a structure to be displayed laterally displaced from its true position."
      />
    </div>
  );
};

export default ArtifactsDemo;
