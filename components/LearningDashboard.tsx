
import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { COURSE_MODULES } from '../constants';
import { DemoId, UserProfile, AIStudyPath, LearningStyle, StudyPlanWeek } from '../types';
import { ACHIEVEMENTS } from '../achievements';
import StudyPlanner from './StudyPlanner';
import FlashcardSummary from './FlashcardSummary';
import Hero from './Hero';
import CourseGrid, { FilterType } from './CourseGrid';
import SearchBar from './SearchBar';
import { TargetIcon, CardStackIcon, CheckCircleIcon, PlayIcon, TrophyIcon, BrainIcon } from './Icons';
import { useAIHistory } from '../contexts/AIHistoryContext';
import { useUser } from '../contexts/UserContext';
import { decode, decodeAudioData } from '../utils/audio';
import AIStudyPathAnimation from './demos/AIStudyPathAnimation';
import ControlButton from './demos/ControlButton';

const VARK_QUESTIONS = [
    { question: 'When learning something new, I prefer to…', options: ['See diagrams or images', 'Hear someone explain it', 'Read about it', 'Try it myself'] },
    { question: 'When studying for a test, I like to…', options: ['Use charts, colors, and diagrams', 'Record myself reading notes aloud', 'Rewrite notes or make lists', 'Build models or use physical examples'] },
    { question: 'When get directions, I prefer…', options: ['A map or visual', 'Spoken instructions', 'Written directions', 'Exploring the route myself'] },
    { question: 'I remember best when I…', options: ['See something', 'Hear it', 'Read or write it', 'Do it'] },
    { question: 'I find it easiest to pay attention when…', options: ['There are visuals', 'Someone is talking', 'I’m reading quietly', 'I’m moving or hands-on'] },
    { question: 'In a classroom, I like when teachers…', options: ['Show videos or diagrams', 'Explain verbally', 'Provide handouts', 'Let me practice'] },
    { question: 'When I have to recall information…', options: ['I visualize it', 'I hear the words in my mind', 'I read the notes mentally', 'I remember the action or process'] },
    { question: 'My notes usually have…', options: ['Sketches or colors', 'Minimal writing — I prefer listening', 'Lists or outlines', 'Step-by-step processes'] },
    { question: 'When learning ultrasound concepts, I prefer…', options: ['Watching labeled anatomy images', 'Listening to podcasts or lectures', 'Reading textbook explanations', 'Practicing on a simulator'] },
    { question: 'I usually learn best when…', options: ['I see it', 'I hear it', 'I read/write it', 'I do it'] },
];

const AudioVisualizer: React.FC<{ isPlaying?: boolean }> = ({ isPlaying = false }) => (
    <div className="flex items-end gap-1 h-6">
        {[0, 1, 2, 3, 4].map(i => (
            <motion.div 
                key={i}
                className="w-1 bg-[var(--gold)] rounded-t-sm opacity-80 shadow-[0_0_10px_var(--gold-dim)]"
                animate={isPlaying ? { height: ['20%', '100%', '50%', '80%', '30%'] } : { height: '20%' }}
                transition={isPlaying ? { 
                    duration: 0.6 + Math.random() * 0.4, 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    ease: "easeInOut",
                    delay: i * 0.1 
                } : { duration: 0.5 }}
            />
        ))}
    </div>
);

// --- PODCAST DATA & COMPONENT ---
// Simulating data structure from echomasters.podbean.com feed
const PODCAST_EPISODES = [
    { 
        id: '5', 
        title: 'Attenuation Situation', 
        duration: '12 min', 
        description: 'Analyze acoustic shadowing and enhancement artifacts to improve diagnostic accuracy.',
        link: 'https://www.podbean.com/ew/pb-tz5cj-1992170',
        isNew: true,
        embedSrc: 'https://www.podbean.com/player-v2/?from=embed&i=tz5cj-1992170-pb&share=1&download=1&fonts=Impact&skin=1b1b1b&font-color=ffffff&rtl=1&logo_link=episode_page&btn-skin=60a0c8&size=150'
    },
    { 
        id: '4', 
        title: 'Transducer Tango', 
        duration: '14 min', 
        description: 'Step into the rhythm of piezoelectricity. Explore crystal thickness, bandwidth, and the matching layer dance.',
        link: 'https://www.podbean.com/ew/pb-3qsj7-19342c3',
        isNew: false,
        embedSrc: 'https://www.podbean.com/player-v2/?i=3qsj7-19342c3-pb&from=pb6admin&share=1&download=1&rtl=1&fonts=Impact&skin=1b1b1b&font-color=ffffff&logo_link=episode_page&btn-skin=60a0c8&size=480'
    },
    { 
        id: '1', 
        title: 'Mastering the Doppler Effect', 
        duration: '15 min', 
        description: 'A comprehensive dive into the physics of Doppler, frequency shifts, and angle correction.',
        link: 'https://www.podbean.com/ew/pb-p2ieh-18c8abc',
        isNew: false,
        embedSrc: 'https://www.podbean.com/player-v2/?i=p2ieh-18c8abc-pb&from=pb6admin&share=1&download=1&rtl=1&fonts=Impact&skin=1b1b1b&font-color=ffffff&logo_link=episode_page&btn-skin=60a0c8&size=480'
    },
    { 
        id: '3', 
        title: 'Safety First: ALARA', 
        duration: '08 min', 
        description: 'Understanding TI, MI, and bioeffects to ensure patient safety during exams.',
        link: 'https://www.podbean.com/ew/pb-h5z9m-19342e4',
        isNew: false,
        embedSrc: 'https://www.podbean.com/player-v2/?i=h5z9m-19342e4-pb&from=pb6admin&share=1&download=1&rtl=1&fonts=Impact&skin=1b1b1b&font-color=ffffff&logo_link=episode_page&btn-skin=60a0c8&size=480'
    },
];

// Global audio element reference to prevent overlapping playback
let currentAudio: HTMLAudioElement | null = null;

const PodcastPlayer: React.FC = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
        };
    }, []);

    const handlePlay = (episode: typeof PODCAST_EPISODES[0]) => {
        // Toggle off if clicking same episode
        if (activeId === episode.id) {
            setActiveId(null);
            setIsPlaying(false);
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            return;
        }

        // Stop any currently playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        // Start new episode
        setActiveId(episode.id);
        setIsPlaying(true);

        if (episode.embedSrc) {
            // For embedded players, we just set the active state to reveal the iframe.
            // No need to auto-close or window.open.
        } else {
            // Simulating playback logic for UI feedback
            currentAudio = new Audio(); 
            // currentAudio.src = episode.audioUrl; 
            
            // For episodes without embed, open link
            window.open(episode.link, '_blank');
            
            // Reset state after a short delay since we opened external
            setTimeout(() => {
                setIsPlaying(false);
                setActiveId(null);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-3 px-1">
               <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">LATEST EPISODES</span>
               <a 
                 href="https://echomasters.podbean.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[10px] text-[var(--gold)] hover:underline flex items-center gap-1"
               >
                   echomasters.podbean.com
                   <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               </a>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-2">
                {PODCAST_EPISODES.map((ep) => {
                    const isActive = activeId === ep.id;
                    return (
                        <div 
                            key={ep.id} 
                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${isActive ? 'bg-[var(--gold)]/5 border-[var(--gold)]/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div 
                                className="p-4 flex items-center justify-between group cursor-pointer"
                                onClick={() => handlePlay(ep)}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <button 
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-[var(--gold)] text-black' : 'bg-black/50 text-white group-hover:bg-[var(--gold)] group-hover:text-black'}`}
                                    >
                                        {isActive ? (
                                            <div className="w-3 h-3 bg-current rounded-sm" />
                                        ) : (
                                            <PlayIcon className="w-4 h-4 ml-0.5" />
                                        )}
                                    </button>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[var(--gold)]' : 'text-white'}`}>{ep.title}</h4>
                                            {ep.isNew && !isActive && <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">New</span>}
                                        </div>
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest line-clamp-1">{ep.description}</p>
                                    </div>
                                </div>
                                {isActive && !ep.embedSrc && <div className="ml-2 flex-shrink-0"><AudioVisualizer isPlaying={true} /></div>}
                            </div>
                            
                            {/* Embedded Player */}
                            <AnimatePresence>
                                {isActive && ep.embedSrc && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-4"
                                    >
                                        <iframe 
                                            title={ep.title}
                                            allowTransparency={true}
                                            height="150" 
                                            width="100%" 
                                            style={{border: 'none', minWidth: 'min(100%, 430px)', height: '150px'}} 
                                            scrolling="no" 
                                            data-name="pb-iframe-player" 
                                            src={`${ep.embedSrc}&auto_play=1`}
                                            allow="autoplay"
                                            loading="lazy"
                                        ></iframe>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Smart Suggestion Text Component ---
const SmartSuggestionText: React.FC<{ text: string, onModuleClick: (id: DemoId) => void }> = ({ text, onModuleClick }) => {
    const sortedModules = useMemo(() => 
        [...COURSE_MODULES].sort((a, b) => b.title.length - a.title.length),
    []);

    const parts = useMemo(() => {
        if (!text) return null;
        let lastIndex = 0;
        const result: React.ReactNode[] = [];
        
        const patternString = sortedModules
            .map(m => m.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        const pattern = new RegExp(`(${patternString})`, 'gi');
        
        const matches = [...text.matchAll(pattern)];
        
        if (matches.length === 0) return [text];

        matches.forEach((match, i) => {
            const index = match.index!;
            if (index > lastIndex) {
                result.push(text.substring(lastIndex, index));
            }
            
            const matchedString = match[0];
            const module = sortedModules.find(m => m.title.toLowerCase() === matchedString.toLowerCase());
            
            if (module) {
                result.push(
                    <button
                        key={`${module.id}-${i}`}
                        onClick={(e) => { e.stopPropagation(); onModuleClick(module.id); }}
                        className="inline-flex items-center gap-1 text-[var(--gold)] hover:text-white hover:underline font-bold px-1.5 py-0.5 rounded-md bg-[var(--gold)]/10 border border-[var(--gold)]/20 hover:bg-[var(--gold)]/20 transition-all mx-0.5 align-middle group cursor-pointer shadow-[0_0_5px_var(--gold-dim)]"
                        title={`Open ${module.title}`}
                    >
                        {matchedString}
                        <svg className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                );
            } else {
                result.push(matchedString);
            }
            
            lastIndex = index + matchedString.length;
        });

        if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
        }

        return result;
    }, [text, sortedModules, onModuleClick]);

    return <p className="text-sm text-white/90 italic leading-relaxed">{parts}</p>;
};

// --- AI Study Path Intake Modal Component ---
interface StudyPlanIntakeProps {
    onGeneratePath: (path: AIStudyPath) => void;
    onCancel: () => void;
    userProfile: UserProfile | null;
}

const StudyPlanIntake: React.FC<StudyPlanIntakeProps> = ({ onGeneratePath, onCancel, userProfile }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addHistoryItem } = useAIHistory();

    // Form State
    const [background, setBackground] = useState('');
    const [availability, setAvailability] = useState('5-10');
    const [goalDate, setGoalDate] = useState('');
    const [varkAnswers, setVarkAnswers] = useState<(string | null)[]>(Array(10).fill(null));
    const [motivation, setMotivation] = useState(8);
    const [strengths, setStrengths] = useState<string[]>([]);
    const [weaknesses, setWeaknesses] = useState<string[]>([]);
    const [challenge, setChallenge] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);

        const varkScores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
        varkAnswers.forEach(ans => { if(ans) varkScores[ans]++; });
        const maxScore = Math.max(...Object.values(varkScores));
        const dominantStyles = Object.keys(varkScores).filter(key => varkScores[key] === maxScore);
        
        let learningStyle: LearningStyle = 'Multimodal';
        if (dominantStyles.length === 1) {
            if (dominantStyles[0] === 'A') learningStyle = 'Visual';
            if (dominantStyles[0] === 'B') learningStyle = 'Auditory';
            if (dominantStyles[0] === 'C') learningStyle = 'Reading/Writing';
            if (dominantStyles[0] === 'D') learningStyle = 'Kinesthetic';
        }

        const completedModules = userProfile?.completedModules.join(', ') || 'None';
        const quizScores = JSON.stringify(userProfile?.quizScores) || 'None';
        const moduleList = COURSE_MODULES.map(m => `- ${m.id}: ${m.title}`).join('\n');

        const prompt = `You are an expert curriculum designer for ultrasound physics. A student needs a personalized, weekly SPI study plan.

Their details:
- Background: ${background || 'Not specified'}
- Weekly Study Availability: ${availability} hours
- Target Exam Date: ${goalDate || 'Not specified'}
- Calculated Learning Style: ${learningStyle}
- Motivation Level: ${motivation}/10
- Stated Strengths: ${strengths.join(', ') || 'None'}
- Stated Weaknesses: ${weaknesses.join(', ') || 'None'}
- Biggest Challenge: ${challenge || 'Not specified'}
- Current Progress: Completed modules: ${completedModules}. Quiz scores: ${quizScores}.

Here is the list of available study modules:
${moduleList}

Based on this data, create a 4-week study plan. Your response MUST be in JSON format.

Instructions for the JSON response:
1. Provide a brief, encouraging 'summary' for the plan (2-3 sentences).
2. Include the calculated 'learningStyle'.
3. Create a 'weeklyPlan' array with exactly 4 week objects.
4. For each week object:
    - 'week': e.g., "Week 1"
    - 'title': A theme for the week, e.g., "Core Physics & Transducers"
    - 'keyConcepts': An array of 2-4 key concept strings to master this week.
    - 'recommendedModuleIds': An array of module 'id' strings from the provided list that correspond to the week's concepts. Make sure the IDs exist in the list.
    - 'milestone': A string describing a concrete goal for the week, e.g., "Score 80% or higher on the 'Waves and Sound' module quiz."
    - 'visualSuggestion': A concrete study tip for a Visual learner. 
    - 'auditorySuggestion': A concrete study tip for an Auditory learner.
    - 'readingWritingSuggestion': A concrete study tip for a Reading/Writing learner.
    - 'kinestheticSuggestion': A concrete study tip for a Kinesthetic learner.

IMPORTANT: Do not use markdown code blocks. Return only the raw JSON object.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            learningStyle: { type: Type.STRING },
                            weeklyPlan: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        week: { type: Type.STRING },
                                        title: { type: Type.STRING },
                                        keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        recommendedModuleIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        milestone: { type: Type.STRING },
                                        visualSuggestion: { type: Type.STRING },
                                        auditorySuggestion: { type: Type.STRING },
                                        readingWritingSuggestion: { type: Type.STRING },
                                        kinestheticSuggestion: { type: Type.STRING },
                                    },
                                    required: ['week', 'title', 'keyConcepts', 'recommendedModuleIds', 'milestone', 'visualSuggestion', 'auditorySuggestion', 'readingWritingSuggestion', 'kinestheticSuggestion']
                                }
                            }
                        },
                        required: ['summary', 'learningStyle', 'weeklyPlan']
                    }
                }
            });

            const jsonText = response.text.trim();
            const plan: AIStudyPath = JSON.parse(jsonText);
            
            addHistoryItem({
                type: 'studyPath',
                content: plan,
                context: `Study Plan Generated (${new Date().toLocaleDateString()})`
            });

            onGeneratePath(plan);
        } catch (e) {
            console.error(e);
            setError("Failed to generate plan. Please try again.");
            setIsLoading(false);
        }
    };

    // --- Intake UI ---
    return (
        <div className="fixed inset-0 bg-black/90 z-[120] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
                <header className="mb-6 border-b border-white/10 pb-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-[var(--gold)]">⚡</span> Study Path Generator
                        </h2>
                        <p className="text-sm text-white/50">Step {step} of 4</p>
                    </div>
                    <button onClick={onCancel} className="text-white/50 hover:text-white">&times;</button>
                </header>

                <div className="space-y-6">
                    {/* Step 1: Goals */}
                    {step === 1 && (
                        <div className="animate-fade-in space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Clinical Background</label>
                                <input type="text" value={background} onChange={e => setBackground(e.target.value)} placeholder="e.g. Sonography student, Nurse, Physician..." className="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[var(--gold)] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Target Exam Date</label>
                                <input type="date" value={goalDate} onChange={e => setGoalDate(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[var(--gold)] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Weekly Study Availability (Hours)</label>
                                <select value={availability} onChange={e => setAvailability(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[var(--gold)] outline-none">
                                    <option value="1-3">1-3 hours (Light)</option>
                                    <option value="5-10">5-10 hours (Moderate)</option>
                                    <option value="10-20">10-20 hours (Intensive)</option>
                                    <option value="20+">20+ hours (Full-time)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Learning Style (VARK) */}
                    {step === 2 && (
                        <div className="animate-fade-in space-y-4">
                            <p className="text-sm text-white/70 italic">Help us tailor the content to your brain.</p>
                            {VARK_QUESTIONS.slice(0, 5).map((q, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-white font-medium">{q.question}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, optIndex) => {
                                            const val = ['A', 'B', 'C', 'D'][optIndex];
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => {
                                                        const newAns = [...varkAnswers];
                                                        newAns[i] = val;
                                                        setVarkAnswers(newAns);
                                                    }}
                                                    className={`p-2 text-xs rounded border text-left transition-all ${
                                                        varkAnswers[i] === val 
                                                            ? 'bg-[var(--gold)]/20 border-[var(--gold)] text-white' 
                                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Self-Assessment */}
                    {step === 3 && (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Motivation Level (1-10)</label>
                                <input type="range" min="1" max="10" value={motivation} onChange={e => setMotivation(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--gold)]" />
                                <div className="text-right text-[var(--gold)] font-bold">{motivation}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Biggest Challenge</label>
                                <textarea value={challenge} onChange={e => setChallenge(e.target.value)} placeholder="e.g. Physics math, Doppler artifacts, staying focused..." className="w-full h-24 bg-black/40 border border-white/20 rounded p-2 text-white focus:border-[var(--gold)] outline-none resize-none" />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Loading / Generating */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
                            {isLoading ? (
                                <>
                                    <div className="w-16 h-16 border-4 border-white/10 border-t-[var(--gold)] rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Analyzing Profile...</h3>
                                    <p className="text-white/60">EchoBot is constructing your personalized curriculum.</p>
                                </>
                            ) : error ? (
                                <div className="text-red-400">
                                    <p className="mb-4">{error}</p>
                                    <ControlButton onClick={handleGenerate}>Try Again</ControlButton>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                <footer className="mt-8 flex justify-between">
                    {step > 1 && step < 4 && (
                        <button onClick={() => setStep(step - 1)} className="text-white/50 hover:text-white px-4 py-2">Back</button>
                    )}
                    <div className="flex-grow"></div>
                    {step < 3 && (
                        <ControlButton onClick={() => setStep(step + 1)}>Next</ControlButton>
                    )}
                    {step === 3 && (
                        <ControlButton onClick={() => { setStep(4); handleGenerate(); }}>Generate Plan</ControlButton>
                    )}
                </footer>
            </div>
        </div>
    );
};

interface LearningDashboardProps {
    onModuleClick: (moduleId: DemoId) => void;
    userProfile: UserProfile | null;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ onModuleClick, userProfile }) => {
    const { setStudyPath } = useUser();
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [showIntake, setShowIntake] = useState(false);
    const [pathAnimation, setPathAnimation] = useState(false);

    const handleGeneratePath = () => {
        setShowIntake(true);
    };

    const handlePathComplete = (path: AIStudyPath) => {
        setShowIntake(false);
        setPathAnimation(true);
        // Save path to user profile
        setStudyPath(path);
        
        // After animation, hide it
        setTimeout(() => setPathAnimation(false), 5000); 
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
            <Hero 
                userProfile={userProfile} 
                onGeneratePathClick={handleGeneratePath}
                studyPath={userProfile?.studyPath || null}
                onContinuePathClick={() => {
                    document.getElementById('study-planner')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            <AnimatePresence>
                {showIntake && (
                    <StudyPlanIntake 
                        onGeneratePath={handlePathComplete} 
                        onCancel={() => setShowIntake(false)}
                        userProfile={userProfile}
                    />
                )}
                {pathAnimation && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-8"
                    >
                        <div className="w-full max-w-4xl">
                            <AIStudyPathAnimation />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Left Column: Course Grid */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
                            {(['All', 'In Progress', 'Completed', 'Premium', 'Clinical', 'Advanced', 'New!', 'Professional', 'Resource', 'Game', 'Challenge'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f as FilterType)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeFilter === f ? 'bg-white text-black' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <SearchBar onResultClick={onModuleClick} />
                    </div>

                    <CourseGrid activeFilter={activeFilter} onModuleClick={onModuleClick} userProfile={userProfile} />
                </div>

                {/* Right Column: Widgets */}
                <div className="xl:col-span-1 space-y-6 flex flex-col">
                    {/* Audio Feed Replaces 'AI Briefings' and moved to top */}
                    <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                        {/* Background Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
                        
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                <span className="text-xl">🎙️</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Sonic Learning Feed</h3>
                                <p className="text-[9px] text-white/40 font-mono">SOURCE: PODBEAN</p>
                            </div>
                        </div>
                        <div className="relative z-10 min-h-[150px]">
                            <PodcastPlayer />
                        </div>
                    </div>

                    <div className="h-80" id="study-planner">
                        <StudyPlanner />
                    </div>
                    <div className="h-[500px]">
                        <FlashcardSummary userProfile={userProfile} onModuleClick={onModuleClick} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningDashboard;
