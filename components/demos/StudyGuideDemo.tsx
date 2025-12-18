
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { spiCoursesExpanded } from '../../spi-course-data';
import { ChevronRightIcon, BrainIcon, CheckCircleIcon, SparklesIcon, CardStackIcon, ListBulletIcon } from '../Icons';
import ControlButton from './ControlButton';
import { AIStudyPlan, AIQuizQuestion, AIFlashcard } from '../../types';
import ConceptCheck from './ConceptCheck';
import { useAIHistory } from '../../contexts/AIHistoryContext';
import { useUser } from '../../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PRE_GENERATED_FLASHCARDS } from '../../flashcard-data';
import DemoSection from './DemoSection';

type Tab = 'Guide' | 'Quiz' | 'Flashcards' | 'Glossary';

// --- Guide Tab Component ---
const GuideContent: React.FC = () => {
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {spiCoursesExpanded.courses[0].modules.map((module) => (
                <div key={module.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-4 bg-white/5 border-b border-white/10">
                        <h3 className="text-lg font-bold text-white">{module.title}</h3>
                        <p className="text-sm text-white/60">{module.description}</p>
                    </div>
                    <div>
                        {module.topics.map((topic) => (
                            <div key={topic.id} className="border-b border-white/5 last:border-0">
                                <button
                                    onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                                    className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-white/80 text-sm">{topic.title}</span>
                                    <ChevronRightIcon className={`w-4 h-4 text-white/50 transition-transform ${expandedTopic === topic.id ? 'rotate-90' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {expandedTopic === topic.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-black/20"
                                        >
                                            <div className="p-4 space-y-4">
                                                <div className="text-sm text-white/70 space-y-2">
                                                    {topic.content}
                                                </div>
                                                <div className="bg-[var(--gold)]/10 p-3 rounded-lg border border-[var(--gold)]/20">
                                                    <p className="text-xs font-bold text-[var(--gold)] uppercase mb-1">Key Points</p>
                                                    <ul className="list-disc list-inside text-xs text-white/80">
                                                        {topic.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
                                                    </ul>
                                                </div>
                                                {topic.conceptCheck && <ConceptCheck {...topic.conceptCheck} />}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Quiz Tab Component ---
const StudyQuiz: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    // Flatten all quiz questions from all modules
    const allQuestions = useMemo(() => {
        return spiCoursesExpanded.courses[0].modules.flatMap(m => m.quiz?.questions || []);
    }, []);

    // Randomize 10 questions for a session
    const sessionQuestions = useMemo(() => {
        return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    }, [allQuestions]);

    const handleAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        if (answer === sessionQuestions[currentQuestionIndex].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < sessionQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            // End of session logic could go here
            alert(`Quiz Complete! Score: ${score + (selectedAnswer === sessionQuestions[currentQuestionIndex].correctAnswer ? 0 : 0)}/${sessionQuestions.length}`);
            // Reset
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const currentQuestion = sessionQuestions[currentQuestionIndex];

    if (!currentQuestion) return <div>No questions available.</div>;

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Mixed Review Quiz</h3>
                <span className="text-sm text-white/50">{currentQuestionIndex + 1} / {sessionQuestions.length}</span>
            </div>
            
            <p className="text-lg text-white mb-6">{currentQuestion.questionText}</p>
            
            <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    let bgClass = "bg-white/5 hover:bg-white/10";
                    
                    if (showResult) {
                        if (isCorrect) bgClass = "bg-green-500/20 border-green-500 text-green-300";
                        else if (isSelected) bgClass = "bg-red-500/20 border-red-500 text-red-300";
                        else bgClass = "bg-white/5 opacity-50";
                    } else if (isSelected) {
                        bgClass = "bg-[var(--gold)]/20 border-[var(--gold)] text-white";
                    }

                    return (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-lg text-left border border-white/10 transition-all ${bgClass}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {showResult && (
                <div className="mt-6 pt-4 border-t border-white/10 animate-fade-in">
                    <p className="font-bold text-[var(--gold)] mb-1">Explanation:</p>
                    <p className="text-white/80 text-sm mb-4">{currentQuestion.explanation}</p>
                    <ControlButton onClick={handleNext} fullWidth>
                        {currentQuestionIndex < sessionQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </ControlButton>
                </div>
            )}
        </div>
    );
};

// --- Glossary Component with AI ---
const GlossaryTerm: React.FC<{ term: AIFlashcard }> = ({ term }) => {
    return (
        <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
            <h4 className="font-bold text-[var(--gold)] text-sm">{term.term}</h4>
            <p className="text-xs text-white/70 mt-1">{term.definition}</p>
        </div>
    );
};

const Glossary: React.FC = () => {
    const [filter, setFilter] = useState('');
    const [aiDefinition, setAiDefinition] = useState<{term: string, def: string} | null>(null);
    const [loading, setLoading] = useState(false);
    const { addHistoryItem } = useAIHistory();

    const filteredTerms = useMemo(() => {
        return PRE_GENERATED_FLASHCARDS
            .filter(card => 
                card.term.toLowerCase().includes(filter.toLowerCase()) || 
                card.definition.toLowerCase().includes(filter.toLowerCase())
            )
            .sort((a, b) => a.term.localeCompare(b.term));
    }, [filter]);

    const handleAILookup = async () => {
        if (!filter.trim()) return;
        setLoading(true);
        setAiDefinition(null);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Define the ultrasound physics term "${filter}" concisely for a sonography student.`,
            });
            const def = response.text;
            setAiDefinition({ term: filter, def });
            addHistoryItem({
                type: 'definition',
                content: { term: filter, definition: def },
                context: 'Glossary Lookup'
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    placeholder="Search terms..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="flex-grow bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[var(--gold)] focus:outline-none"
                />
                <ControlButton onClick={handleAILookup} disabled={!filter || loading}>
                    {loading ? 'Searching...' : 'AI Define'}
                </ControlButton>
            </div>

            {aiDefinition && (
                <div className="mb-6 p-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-4 h-4 text-[var(--gold)]" />
                        <h4 className="font-bold text-white capitalize">{aiDefinition.term}</h4>
                    </div>
                    <p className="text-sm text-white/90">{aiDefinition.def}</p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredTerms.map((term, i) => (
                    <GlossaryTerm key={i} term={term} />
                ))}
                {filteredTerms.length === 0 && !aiDefinition && (
                    <div className="col-span-full text-center text-white/40 py-8">
                        No terms found. Try the AI definition button.
                    </div>
                )}
            </div>
        </div>
    );
};

const StudyGuideDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Guide');

    const renderTab = () => {
        switch (activeTab) {
            case 'Guide': return <GuideContent />;
            case 'Quiz': return <StudyQuiz />;
            case 'Glossary': return <Glossary />;
            case 'Flashcards': return (
                <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-white/60 mb-4">Flashcards are available in the main Dashboard widget for spaced repetition learning.</p>
                    <div className="flex justify-center">
                        <div className="bg-black/30 p-4 rounded-lg">
                            <CardStackIcon className="w-12 h-12 text-[var(--gold)] mx-auto mb-2" />
                            <span className="text-sm font-bold text-white">Go to Dashboard</span>
                        </div>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    return (
        <DemoSection 
            title="SPI Study Guide & Glossary" 
            description="Your comprehensive resource for Ultrasound Physics. Review structured notes, test your knowledge with quizzes, or lookup terms in the glossary."
        >
            <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
                {(['Guide', 'Quiz', 'Glossary', 'Flashcards'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === tab 
                                ? 'bg-[var(--gold)] text-black shadow-lg shadow-[var(--gold)]/20' 
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {tab === 'Guide' && <ListBulletIcon className="w-4 h-4" />}
                        {tab === 'Quiz' && <BrainIcon className="w-4 h-4" />}
                        {tab === 'Glossary' && <SparklesIcon className="w-4 h-4" />}
                        {tab === 'Flashcards' && <CardStackIcon className="w-4 h-4" />}
                        {tab}
                    </button>
                ))}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderTab()}
            </motion.div>
        </DemoSection>
    );
};

export default StudyGuideDemo;
