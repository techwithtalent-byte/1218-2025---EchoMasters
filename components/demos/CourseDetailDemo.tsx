import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { spiCoursesExpanded } from '../../spi-course-data';
import { ChevronRightIcon, BrainIcon } from '../Icons';
import ControlButton from './ControlButton';
import { AIStudyPlan } from '../../types';
import ConceptCheck from './ConceptCheck';
import { useAIHistory } from '../../contexts/AIHistoryContext';
import { useUser } from '../../contexts/UserContext';
import { useDebounce } from '../../hooks/useDebounce';

// --- Types ---
type BaseTopic = typeof spiCoursesExpanded.courses[0]['modules'][0]['topics'][0];
type Topic = Omit<BaseTopic, 'content'> & { content: React.ReactNode, conceptCheck?: any };
type ModuleType = typeof spiCoursesExpanded.courses[0]['modules'][0];
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';


// Helper function to extract plain text from JSX/React Elements for the AI prompt
function extractTextFromContent(content: React.ReactNode): string {
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return String(content);
    if (Array.isArray(content)) return content.map(extractTextFromContent).join(' ');

    if (React.isValidElement(content)) {
        const props = content.props as { children?: React.ReactNode, [key: string]: any };
        if (props.children) {
            return extractTextFromContent(props.children);
        }
    }
    return '';
}

const AIReviewDisplay: React.FC<{ review: AIStudyPlan, moduleTitle: string }> = ({ review, moduleTitle }) => (
    <div className="mt-6 text-left w-full bg-black/40 p-4 rounded-lg border border-yellow-400/30 animate-fade-in">
        <h3 className="text-lg font-bold text-yellow-400 mb-2 text-center">✨ Personalized Review for {moduleTitle}</h3>
        <p className="text-center italic text-white/80 mb-4 text-sm">{review.summary}</p>
        {review.weakAreas.map((area, index) => (
            <div key={index} className="mb-4 pb-2 border-b border-white/10 last:border-b-0">
                <h4 className="font-bold text-white">{index + 1}. Focus On: {area.concept}</h4>
                <p className="text-xs text-white/70 mt-1">{area.explanation}</p>
                <div className="mt-2 bg-yellow-400/10 p-2 rounded-md border border-yellow-400/20">
                    <p className="font-semibold text-yellow-300 text-xs">Key Takeaway:</p>
                    <p className="text-xs text-yellow-200/90">{area.keyTakeaway}</p>
                </div>
            </div>
        ))}
        <p className="text-xs text-white/40 text-right mt-2 font-sans">Powered by Gemini</p>
    </div>
);


// --- Quiz Modal Component ---
const ModuleQuiz: React.FC<{ module: ModuleType; onClose: () => void }> = ({ module, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(module.quiz?.questions.length ?? 0).fill(null));

    // AI Review State
    const [aiReview, setAiReview] = useState<AIStudyPlan | null>(null);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const questions = module.quiz?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (answer: string) => {
        if (showExplanation) return;
        setSelectedAnswer(answer);
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);

        if (answer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setQuizFinished(false);
        setUserAnswers(Array(questions.length).fill(null));
        setAiReview(null);
        setReviewError(null);
    };

    const handleGetAiReview = async () => {
        setIsReviewLoading(true);
        setReviewError(null);
        setAiReview(null);

        const incorrectAnswers = questions
            .map((q, i) => ({ ...q, userAnswer: userAnswers[i] }))
            .filter((q) => q.userAnswer !== null && q.userAnswer !== q.correctAnswer);

        if (incorrectAnswers.length === 0) {
            setAiReview({ summary: "Excellent! You answered all questions for this module correctly.", weakAreas: [] });
            setIsReviewLoading(false);
            return;
        }

        const prompt = `You are an expert ultrasound physics tutor. A student just finished a quiz for the module "${module.title}" and answered some questions incorrectly. Based on their errors, provide a concise, personalized study plan in JSON format.

The plan should:
1.  Provide a brief, encouraging summary (1-2 sentences).
2.  Identify 1-2 core "weak areas" based on their errors.
3.  For each weak area:
    - State the concept.
    - Briefly explain its importance.
    - Provide one key takeaway to help them remember.

Do NOT recommend other modules. Focus only on the concepts within this module.

Here are the questions they answered incorrectly:
${JSON.stringify(incorrectAnswers.map(q => ({ question: q.questionText, userAnswer: q.userAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation })))}

Provide only the JSON object in your response.`;

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
                            weakAreas: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        concept: { type: Type.STRING },
                                        explanation: { type: Type.STRING },
                                        keyTakeaway: { type: Type.STRING },
                                        // Keeping recommendedModules in schema for type consistency, but prompt asks to omit.
                                        recommendedModules: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    },
                                    required: ['concept', 'explanation', 'keyTakeaway']
                                }
                            }
                        },
                        required: ['summary', 'weakAreas']
                    }
                }
            });
            
            const jsonText = response.text.trim();
            const parsedReview: AIStudyPlan = JSON.parse(jsonText);
            setAiReview(parsedReview);
        } catch (e) {
            console.error(e);
            setReviewError("Failed to generate your review. Please try again.");
        } finally {
            setIsReviewLoading(false);
        }
    };


    const QuizContent = () => {
        if (quizFinished) {
            const finalScore = (score / questions.length) * 100;
            return (
                <div className="text-center flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-yellow-400">Quiz Complete!</h3>
                    <p className="text-lg mt-4">Your score: <span className="font-bold">{score} / {questions.length}</span> ({(finalScore).toFixed(0)}%)</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <ControlButton onClick={restartQuiz} secondary>Try Again</ControlButton>
                        <ControlButton onClick={onClose}>Close</ControlButton>
                    </div>
                    <div className="mt-6 w-full max-w-lg">
                        <ControlButton onClick={handleGetAiReview} disabled={isReviewLoading}>
                            {isReviewLoading ? "Analyzing..." : "Get AI-Powered Review ✨"}
                        </ControlButton>
                         {reviewError && <p className="text-red-400 mt-2 text-sm">{reviewError}</p>}
                         {aiReview && <AIReviewDisplay review={aiReview} moduleTitle={module.title} />}
                    </div>
                </div>
            );
        }

        if (!currentQuestion) {
            return <div className="text-center">No questions available for this module.</div>;
        }

        return (
            <>
                <h3 className="text-xl font-bold mb-4">Question {currentQuestionIndex + 1} of {questions.length}</h3>
                <p className="mb-6 text-white/90">{currentQuestion.questionText}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedAnswer;
                        let buttonClass = 'bg-white/10 border border-white/20 text-white hover:bg-white/20';
                        if (showExplanation) {
                            if (isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
                            else if (isSelected) buttonClass = 'bg-red-500/80 border-red-400 text-white';
                            else buttonClass = 'bg-white/10 border border-white/20 text-white opacity-60';
                        }
                        return (
                            <button key={index} onClick={() => handleAnswer(option)} disabled={showExplanation} className={`p-4 rounded-lg text-left transition-all duration-300 w-full font-semibold ${buttonClass}`}>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {showExplanation && (
                    <div className="mt-6 p-4 bg-black/30 rounded-lg animate-fade-in">
                        <p className="font-bold text-yellow-400">Explanation:</p>
                        <p className="text-white/80 mt-2">{currentQuestion.explanation}</p>
                        <div className="text-right mt-4">
                            <ControlButton onClick={handleNext}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </ControlButton>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] flex flex-col border border-white/20">
                <header className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-yellow-400">Module {module.id} Quiz</h2>
                    <button onClick={onClose} className="text-2xl text-white/70 hover:text-white">&times;</button>
                </header>
                <div className="overflow-y-auto">
                    <QuizContent />
                </div>
            </div>
        </div>
    );
};


// --- Topic Accordion Component ---
const TopicAccordion: React.FC<{ topic: Topic, setRef: (el: HTMLElement | null) => void }> = ({ topic, setRef }) => {
    const [simplifiedContent, setSimplifiedContent] = useState<Record<string, { loading: boolean; content: string | null; error: string | null }>>({});
    const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
    const { addHistoryItem } = useAIHistory();

    const handleSimplify = async (sectionId: string) => {
        const textToSimplify = extractTextFromContent(topic.content);

        if (!textToSimplify) {
            setSimplifiedContent(prev => ({ ...prev, [sectionId]: { loading: false, content: null, error: 'Could not read content.' } }));
            return;
        }

        setSimplifiedContent(prev => ({ ...prev, [sectionId]: { loading: true, content: null, error: null } }));

        let promptInstruction = '';
        switch (difficulty) {
            case 'Beginner':
                promptInstruction = "Explain the following text like I'm a high school student. Use a simple analogy. Keep it to 2-3 sentences."; break;
            case 'Intermediate':
                promptInstruction = "Explain the following text clearly for a sonography student. Define key technical terms simply."; break;
            case 'Advanced':
                promptInstruction = "Provide a detailed, technical explanation of the following text for a colleague preparing for a board exam. Elaborate on the physics and clinical implications."; break;
        }

        const fullPrompt = `${promptInstruction} Do not use markdown.\n\nTEXT TO SIMPLIFY:\n---\n${textToSimplify}`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: fullPrompt });
            const text = response.text;
            addHistoryItem({ type: 'simplification', content: { originalText: textToSimplify, simplifiedText: text, level: difficulty }, context: `Simplification for '${topic.title}'` });
            setSimplifiedContent(prev => ({ ...prev, [sectionId]: { loading: false, content: text, error: null } }));
        } catch (error) {
            console.error("Error simplifying content:", error);
            setSimplifiedContent(prev => ({ ...prev, [sectionId]: { loading: false, content: null, error: 'Failed to generate explanation.' } }));
        }
    };

    return (
        <details ref={setRef} id={`topic-${topic.id}`} className="scroll-mt-24 border-b border-white/20 last:border-b-0">
            <summary className="w-full flex justify-between items-center p-4 text-left hover:bg-white/10 transition-colors cursor-pointer">
                <h4 className="font-semibold text-white">{topic.title}</h4>
                <ChevronRightIcon className={`w-5 h-5 text-white/50 transition-transform`} />
            </summary>
            <div className="p-4 bg-black/20 animate-fade-in space-y-4">
                 <div className="text-white/70 whitespace-pre-wrap prose prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                    {topic.content}
                </div>
                
                <div>
                    <h5 className="font-semibold text-white/90 mb-2">Key Points:</h5>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                        {topic.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                </div>

                <div className="bg-yellow-400/10 p-3 rounded-md border border-yellow-400/20">
                    <p className="font-semibold text-yellow-300 text-sm">Exam Focus:</p>
                    <p className="text-sm text-yellow-200/90">{topic.examFocus}</p>
                </div>
                 {topic.conceptCheck && <ConceptCheck {...topic.conceptCheck} />}
                 
                 <div className="mt-4 pt-4 border-t border-dashed border-white/20 not-prose">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-white/90">Need help with this topic?</h5>
                         <div className="flex gap-1">
                            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(d => (
                                <button key={d} onClick={() => setDifficulty(d)} className={`px-2 py-0.5 text-xs rounded-full ${difficulty === d ? 'bg-yellow-400/80 text-black' : 'bg-gray-600 text-white/70'}`}>{d}</button>
                            ))}
                        </div>
                    </div>
                     <ControlButton onClick={() => handleSimplify(topic.id)} secondary fullWidth disabled={simplifiedContent[topic.id]?.loading}>
                        {simplifiedContent[topic.id]?.loading ? 'Simplifying...' : '✨ Simplify with AI'}
                     </ControlButton>
                     {simplifiedContent[topic.id] && (
                        <div className="mt-3">
                            {simplifiedContent[topic.id].error && <p className="text-red-400 text-xs text-center">{simplifiedContent[topic.id].error}</p>}
                            {simplifiedContent[topic.id].content && (
                                <div className="bg-gray-900/50 p-3 rounded-lg border border-yellow-400/30 text-sm text-white/90 whitespace-pre-wrap">{simplifiedContent[topic.id].content}</div>
                            )}
                        </div>
                    )}
                 </div>
                 <TopicNotes sectionId={topic.id} />
            </div>
        </details>
    );
};

const TopicNotes: React.FC<{ sectionId: string }> = ({ sectionId }) => {
    const { userProfile, updateNote } = useUser();
    const savedNote = userProfile?.notes?.[sectionId] || '';
    const [note, setNote] = useState(savedNote);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const debouncedNote = useDebounce(note, 1000);

    useEffect(() => { setNote(savedNote); }, [savedNote]);
    useEffect(() => {
        if (debouncedNote !== savedNote) {
            setSaveStatus('saving');
            updateNote(sectionId, debouncedNote);
            setTimeout(() => setSaveStatus('saved'), 500);
        }
    }, [debouncedNote, sectionId, updateNote, savedNote]);
    useEffect(() => {
        if (saveStatus === 'saved') {
            const timer = setTimeout(() => setSaveStatus('idle'), 2000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    return (
        <div className="mt-6 pt-4 border-t border-dashed border-white/20 not-prose">
            <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold text-white/90">My Notes</h5>
                <div className="text-xs text-white/50 transition-opacity duration-300">
                    {saveStatus === 'saving' && 'Saving...'}
                    {saveStatus === 'saved' && '✓ Saved'}
                </div>
            </div>
            <textarea value={note} onChange={e => { setNote(e.target.value); setSaveStatus('idle'); }} placeholder="Type your notes here..." className="w-full h-24 bg-gray-800/50 p-3 rounded-lg text-white border border-gray-700 focus:ring-2 focus:ring-[#d4af37] focus:outline-none text-sm resize-y" />
        </div>
    );
};


// --- Table of Contents Component ---
const ModuleTableOfContents: React.FC<{
    topics: Topic[];
    activeTopicId: string | null;
}> = ({ topics, activeTopicId }) => {
    const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, topicId: string) => {
        event.preventDefault();
        document.getElementById(`topic-${topicId}`)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="flex flex-col gap-1">
            {topics.map(topic => (
                <a
                    key={topic.id}
                    href={`#topic-${topic.id}`}
                    onClick={(e) => handleNavClick(e, topic.id)}
                    className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTopicId === topic.id
                            ? 'bg-yellow-400/10 text-yellow-300'
                            : 'text-white/70 hover:bg-white/10'
                    }`}
                >
                    {topic.title}
                </a>
            ))}
        </nav>
    );
};


// --- Main Course Detail Component ---
const CourseDetailDemo: React.FC = () => {
    const { courseId } = { courseId: 'spi-main' }; // Mock useParams
    const course = useMemo(() => spiCoursesExpanded.courses.find(c => c.id === courseId), [courseId]);
    
    const [selectedModule, setSelectedModule] = useState(course?.modules[0]);
    const [activeQuizModule, setActiveQuizModule] = useState<ModuleType | null>(null);
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
    const topicRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveTopicId(entry.target.id.replace('topic-', ''));
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px', threshold: 0 }
        );

        const currentRefs = topicRefs.current;
        Object.values(currentRefs).forEach(el => {
            if (el instanceof Element) observer.observe(el);
        });

        return () => {
             Object.values(currentRefs).forEach(el => {
                if (el instanceof Element) observer.unobserve(el);
            });
        };
    }, [selectedModule]);

    if (!course || !selectedModule) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-500">Course Not Found</h2>
                <p className="text-white/70">The requested course could not be found.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-7xl mx-auto px-4">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">{course.title}</h2>
                <p className="text-white/70 max-w-2xl mx-auto">{course.description}</p>
            </header>
            
             <div className="flex justify-center flex-wrap gap-2 mb-8">
                {course.modules.map(module => (
                    <button
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                            selectedModule.id === module.id
                                ? 'bg-yellow-400 text-black'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                    >
                        Module {module.id}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-24 bg-white/5 p-4 rounded-lg border border-white/10 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 px-2 text-white">Topics</h3>
                        <ModuleTableOfContents topics={selectedModule.topics as Topic[]} activeTopicId={activeTopicId} />
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <div className="bg-white/5 rounded-lg border border-white/10 shadow-sm animate-fade-in">
                        <div className="p-6 border-b border-white/20">
                            <h3 className="text-2xl font-bold text-yellow-400">Module {selectedModule.id}: {selectedModule.title}</h3>
                            <p className="text-white/70 mt-1">{selectedModule.description}</p>
                        </div>
                        <div className="bg-black/20">
                            {selectedModule.topics.map(topic => (
                                <TopicAccordion
                                    key={topic.id}
                                    topic={topic as Topic}
                                    setRef={(el) => (topicRefs.current[topic.id] = el)}
                                />
                            ))}
                        </div>
                        {selectedModule.quiz?.questions && selectedModule.quiz.questions.length > 0 && (
                            <div className="p-6 bg-white/5 flex justify-center">
                                <ControlButton onClick={() => setActiveQuizModule(selectedModule)}>
                                    <div className="flex items-center gap-2">
                                        <BrainIcon className="w-5 h-5" />
                                        <span>Take Module {selectedModule.id} Quiz</span>
                                    </div>
                                </ControlButton>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {activeQuizModule && <ModuleQuiz module={activeQuizModule} onClose={() => setActiveQuizModule(null)} />}
        </div>
    );
}

export default CourseDetailDemo;