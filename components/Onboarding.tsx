
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from '../utils/audio';

interface OnboardingProps {
    onComplete: () => void;
}

const ONBOARDING_STEPS = [
    {
        icon: '💠',
        title: 'System Initialization',
        description: "Welcome to the EchoMasters Interface. We are calibrating your learning environment. Prepare for a high-fidelity deep dive into Ultrasound Physics.",
    },
    {
        icon: '🎛️',
        title: 'Interactive Physics Engine',
        description: "Static text is obsolete. Engage with our real-time simulations to manipulate waves, artifacts, and hemodynamics. Don't just read physics—control it.",
    },
    {
        icon: '🧠',
        title: 'AI Neural Link',
        description: "EchoBot is online. Your advanced AI copilot is ready to analyze concepts, answer queries, and generate custom practice scenarios on demand.",
    },
    {
        icon: '🎯',
        title: 'Tactical Study Path',
        description: "Don't guess what to study. Generate a strategic, AI-driven roadmap tailored specifically to your exam date, strengths, and learning style.",
    },
    {
        icon: '🚀',
        title: 'Mission: Mastery',
        description: "Your command center is ready. Track your stats, conquer the modules, and prepare to dominate the SPI exam.",
    }
];

// Global AudioContext and source ref to manage playback
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
const NARRATION_CACHE_KEY_PREFIX = 'echoMastersOnboardingCache_v6'; // Updated cache version

const SpeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const MuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 21.75l-3.75-3.75H4.5a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5h3.75l3.75-3.75M12.75 6.375v9.25" />
    </svg>
);

const RotatingRings = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div 
            className="w-[500px] h-[500px] border border-[var(--gold)]/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
            className="absolute w-[400px] h-[400px] border border-[var(--gold)]/10 rounded-full border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
            className="absolute w-[600px] h-[600px] border-2 border-white/5 rounded-full"
            animate={{ scale: [1, 1.02, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
    </div>
);

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const speed = 25; // ms per char
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed min-h-[5em] font-light tracking-wide">
            {displayedText}
            <span className="inline-block w-2 h-5 ml-1 bg-[var(--gold)] animate-pulse align-middle" />
        </p>
    );
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [isNarrating, setIsNarrating] = useState(true);
    const [isLoadingNarration, setIsLoadingNarration] = useState(true);
    const [narrationError, setNarrationError] = useState<string | null>(null);

    const originalThemeRef = useRef(document.documentElement.getAttribute('data-theme') || 'Classic');

    const stopNarration = () => {
        if (currentSource) {
            currentSource.stop();
            currentSource.onended = null;
        }
        currentSource = null;
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
        audioContext = null;
        setIsLoadingNarration(false);
    };

    const handleFinish = () => {
        stopNarration();
        document.documentElement.setAttribute('data-theme', originalThemeRef.current);
        onComplete();
    };

    const handleNext = () => {
        stopNarration();
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleFinish();
        }
    };
    
    const handleBack = () => {
        stopNarration();
        if (step > 0) {
            setStep(s => s - 1);
        }
    };

    // Auto-Advance Helper
    const autoAdvance = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleFinish();
        }
    };

    useEffect(() => {
        if (!isNarrating) {
            stopNarration();
            return;
        }

        const narrateStep = async () => {
            setIsLoadingNarration(true);
            setNarrationError(null);
            const currentStepContent = ONBOARDING_STEPS[step];
            const textToNarrate = `${currentStepContent.title}. ${currentStepContent.description}`;

            const playAudio = async (base64Audio: string) => {
                try {
                    if (!audioContext || audioContext.state === 'closed') {
                        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                    }
                    if (audioContext.state === 'suspended') await audioContext.resume();
                    if (currentSource) {
                        currentSource.stop();
                        currentSource.onended = null;
                    }
                    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    source.start();
                    currentSource = source;
                    setIsLoadingNarration(false);
                    
                    source.onended = () => { 
                        if (currentSource === source) {
                            currentSource = null;
                            autoAdvance(); 
                        } 
                    };
                } catch(e) { console.error("Audio playback failed", e); setIsLoadingNarration(false); }
            };
            
            try {
                const cacheKey = `${NARRATION_CACHE_KEY_PREFIX}_${step}`;
                const cachedAudio = localStorage.getItem(cacheKey);
                if (cachedAudio) {
                    await playAudio(cachedAudio);
                    return;
                }

                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: textToNarrate }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' }}}, 
                    },
                });

                const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    try { localStorage.setItem(cacheKey, base64Audio); } catch (e) { console.error("Failed to cache audio", e); }
                    await playAudio(base64Audio);
                } else { throw new Error("No audio data received."); }
            } catch (err: any) { 
                 console.error("Narration failed:", err);
                 const errString = String(err);
                 let msg = "Audio Unavailable";
                 
                 const isQuota = 
                    err.status === 429 || 
                    err.status === 'RESOURCE_EXHAUSTED' || 
                    errString.includes('429') || 
                    errString.includes('quota');

                 const isNetwork = errString.includes('Network') || errString.includes('fetch');

                 if (isQuota) {
                    msg = "Audio Quota Exceeded";
                 } else if (isNetwork) {
                    msg = "Connection Error";
                 }

                 setNarrationError(msg);
                 setTimeout(() => setNarrationError(null), 5000);
                 setIsLoadingNarration(false); 
            }
        };

        narrateStep();
    }, [step, isNarrating]);
    
    useEffect(() => () => {
        stopNarration();
        document.documentElement.setAttribute('data-theme', originalThemeRef.current);
    }, []);

    const currentStepData = ONBOARDING_STEPS[step];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[250] flex items-center justify-center p-4 overflow-hidden"
        >
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-90" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150" />
            
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-black/30 backdrop-blur-2xl border border-[var(--gold)]/20 rounded-[2.5rem] p-8 sm:p-12 w-full max-w-5xl min-h-[650px] flex flex-col items-center justify-between text-center relative overflow-hidden shadow-[0_0_120px_rgba(212,175,55,0.08)]"
            >
                {/* Holographic Background Elements */}
                <RotatingRings />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-40 shadow-[0_0_30px_var(--gold)]" />
                
                {/* Header Actions */}
                <div className="w-full flex justify-between items-center relative z-20">
                     <div className="flex items-center gap-2">
                         <button 
                            onClick={() => setIsNarrating(!isNarrating)} 
                            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isNarrating ? 'bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/50' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                            title={isNarrating ? "Mute Narration" : "Enable Narration"}
                        >
                            {isNarrating ? <SpeakerIcon className="w-5 h-5" /> : <MuteIcon className="w-5 h-5" />}
                        </button>
                        <AnimatePresence>
                            {narrationError && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-mono text-red-400 bg-red-900/30 px-2 py-1 rounded border border-red-500/30"
                                >
                                    {narrationError}
                                </motion.span>
                            )}
                        </AnimatePresence>
                     </div>
                     <button onClick={handleFinish} className="text-xs font-mono text-white/40 hover:text-[var(--gold)] transition-colors uppercase tracking-widest border-b border-transparent hover:border-[var(--gold)] pb-0.5">Skip Initialization</button>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-grow flex flex-col items-center justify-center relative z-10 w-full py-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col items-center max-w-3xl"
                        >
                            <motion.div 
                                className="text-8xl mb-8 p-8 relative"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="absolute inset-0 bg-[var(--gold)]/10 blur-3xl rounded-full" />
                                <span className="relative drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">{currentStepData.icon}</span>
                            </motion.div>
                            
                            <h3 className="text-4xl sm:text-6xl font-bold text-white mb-8 tracking-tight bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent drop-shadow-lg">
                                {currentStepData.title}
                            </h3>
                            
                            <TypewriterText text={currentStepData.description} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="w-full flex flex-col items-center gap-10 relative z-20">
                    {/* Progress Indicator */}
                    <div className="flex gap-4">
                        {ONBOARDING_STEPS.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                                    i === step 
                                        ? 'w-16 bg-[var(--gold)] shadow-[0_0_15px_var(--gold)]' 
                                        : i < step 
                                            ? 'w-3 bg-white/40' 
                                            : 'w-3 bg-white/10'
                                }`} 
                            />
                        ))}
                    </div>
                    
                     <div className="flex items-center gap-6 w-full justify-center">
                         <button 
                            onClick={handleBack} 
                            className={`text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-xl hover:bg-white/5 ${step === 0 ? 'invisible' : ''}`}
                         >
                             Back
                         </button>
                         
                         <button 
                            onClick={handleNext} 
                            className="group relative bg-white text-black font-bold text-lg px-12 py-4 rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] ring-1 ring-white"
                         >
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] via-[#fce9b5] to-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative flex items-center gap-3">
                                {step === ONBOARDING_STEPS.length - 1 ? 'ENGAGE SYSTEM' : 'NEXT STEP'}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        </button>
                     </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Onboarding;
