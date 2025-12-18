
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { MOCK_EXAM_QUESTIONS } from '../../mockExamQuestions';
import { COURSE_MODULES } from '../../constants';
import { useUser } from '../../contexts/UserContext';
import ControlButton from './ControlButton';
import { AIQuizQuestion, AIStudyPlan, DemoId } from '../../types';
import { useAIHistory } from '../../contexts/AIHistoryContext';

type ExamState = 'start' | 'running' | 'paused' | 'finished';
type ViewMode = 'exam' | 'review';

const shuffleArray = (array: AIQuizQuestion[]): AIQuizQuestion[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const AIReviewDisplay: React.FC<{ review: AIStudyPlan; onNavigate?: (id: DemoId) => void }> = ({ review, onNavigate }) => (
    <div className="mt-8 text-left max-w-3xl w-full bg-gray-800/50 p-6 rounded-lg border border-yellow-400/30 animate-fade-in">
        <h3 className="text-2xl font-bold text-yellow-400 mb-4 text-center">✨ Your Personalized Study Plan</h3>
        <p className="text-center italic text-white/80 mb-6">{review.summary}</p>
        {review.weakAreas.map((area, index) => (
            <div key={index} className="mb-6 pb-4 border-b border-white/10 last:border-b-0">
                <h4 className="text-lg font-bold text-white">{index + 1}. Focus Area: {area.concept}</h4>
                <p className="text-sm text-white/70 mt-1">{area.explanation}</p>
                {area.recommendedModules && area.recommendedModules.length > 0 && (
                    <div className="mt-3">
                        <strong className="text-sm text-cyan-300">Recommended Modules:</strong>
                        <ul className="list-disc list-inside text-sm text-white/80 mt-1">
                            {area.recommendedModules.map((modTitle, i) => {
                                // Attempt to match AI text to actual module
                                const module = COURSE_MODULES.find(m => 
                                    m.title === modTitle || 
                                    m.title.includes(modTitle) || 
                                    modTitle.includes(m.title)
                                );
                                
                                return (
                                    <li key={i} className="mt-1">
                                        {module && onNavigate ? (
                                            <button
                                                onClick={() => onNavigate(module.id)}
                                                className="text-cyan-400 hover:text-cyan-200 hover:underline text-left inline-flex items-center gap-1 transition-colors group"
                                            >
                                                <span>{module.title}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                                                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        ) : (
                                            modTitle
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <div className="mt-3 bg-yellow-400/10 p-3 rounded-md border border-yellow-400/20">
                    <p className="font-semibold text-yellow-300 text-sm">Key Takeaway:</p>
                    <p className="text-sm text-yellow-200/90">{area.keyTakeaway}</p>
                </div>
            </div>
        ))}
         <p className="text-xs text-white/40 text-right mt-4 font-sans">Powered by Gemini</p>
    </div>
);

interface SpiMockExamDemoProps {
    onNavigate?: (moduleId: DemoId) => void;
}

const SpiMockExamDemo: React.FC<SpiMockExamDemoProps> = ({ onNavigate }) => {
    const { setSpiMockExamScore, markModuleAsCompleted, awardAchievement } = useUser();
    const { addHistoryItem } = useAIHistory();
    const [examState, setExamState] = useState<ExamState>('start');
    const [questions, setQuestions] = useState<AIQuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds
    const [viewMode, setViewMode] = useState<ViewMode>('exam');
    const [showGrid, setShowGrid] = useState(false);
    
    // State for AI Review
    const [aiReview, setAiReview] = useState<AIStudyPlan | null>(null);
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);


    const startExam = () => {
        const shuffledQuestions = shuffleArray(MOCK_EXAM_QUESTIONS);
        setQuestions(shuffledQuestions);
        setUserAnswers(Array(shuffledQuestions.length).fill(null));
        setFlaggedQuestions([]);
        setCurrentQuestionIndex(0);
        setTimeLeft(2 * 60 * 60); // 2 hours
        setExamState('running');
        setViewMode('exam');
        setAiReview(null);
        setReviewError(null);
    };

    const finishExam = useCallback(() => {
        setExamState('finished');
        let score = 0;
        questions.forEach((q, index) => {
            if (q.correctAnswer === userAnswers[index]) {
                score++;
            }
        });
        const percentage = (score / questions.length) * 100;
        setSpiMockExamScore(percentage);
        
        // Mark module as completed upon finishing the exam
        markModuleAsCompleted('spi_mock_exam');
        awardAchievement('spi_mock_exam');
        
    }, [questions, userAnswers, setSpiMockExamScore, markModuleAsCompleted, awardAchievement]);
    
    const handleGetAiReview = async () => {
        setIsReviewLoading(true);
        setReviewError(null);
        setAiReview(null);

        const incorrectAnswers = questions.map((q, i) => ({ ...q, userAnswer: userAnswers[i] })).filter((q, i) => userAnswers[i] !== null && userAnswers[i] !== q.correctAnswer);

        if (incorrectAnswers.length === 0) {
            const perfectScoreReview = { summary: "Congratulations! You answered all questions correctly. Keep up the great work!", weakAreas: [] };
            setAiReview(perfectScoreReview);
            addHistoryItem({
                type: 'examReview',
                content: perfectScoreReview,
                context: 'SPI Mock Exam Review'
            });
            setIsReviewLoading(false);
            return;
        }

        const moduleTitles = COURSE_MODULES.map(m => m.title).join(', ');

        const prompt = `You are an expert ultrasound physics tutor named EchoBot. A student has just completed a mock SPI exam and answered some questions incorrectly. Based on the list of questions they got wrong, their incorrect answer, and the correct answer with its explanation, please provide a personalized study plan.

The study plan should be in JSON format.

Your analysis should:
1. Provide a brief, encouraging overall summary (1-2 sentences).
2. Identify the top 2-3 core conceptual "weak areas" based on the errors.
3. For each weak area:
    - State the concept clearly (e.g., "Doppler Physics").
    - Briefly explain why it's a critical concept.
    - Recommend specific modules from the provided list that the user should review.
    - Provide one key takeaway or a simple mnemonic.

Here is the list of available study modules: ${moduleTitles}

Here is the list of incorrectly answered questions:
${JSON.stringify(incorrectAnswers.map(q => ({ question: q.question, userAnswer: q.userAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation })))}

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
                                        recommendedModules: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        keyTakeaway: { type: Type.STRING }
                                    },
                                    required: ['concept', 'explanation', 'recommendedModules', 'keyTakeaway']
                                }
                            }
                        },
                        required: ['summary', 'weakAreas']
                    }
                }
            });

            const jsonText = response.text.trim();
            const parsedReview: AIStudyPlan = JSON.parse(jsonText);
            addHistoryItem({
                type: 'examReview',
                content: parsedReview,
                context: 'SPI Mock Exam Review'
            });
            setAiReview(parsedReview);
        } catch (e) {
            console.error(e);
            setReviewError("Sorry, there was an error generating your personalized review. Please try again.");
        } finally {
            setIsReviewLoading(false);
        }
    };


    useEffect(() => {
        if (examState === 'running' && viewMode === 'exam') {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        finishExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [examState, viewMode, finishExam]);

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const toggleFlag = () => {
        setFlaggedQuestions(prev =>
            prev.includes(currentQuestionIndex)
                ? prev.filter(qIndex => qIndex !== currentQuestionIndex)
                : [...prev, currentQuestionIndex]
        );
    };
    
    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index);
            setShowGrid(false);
        }
    };
    
    const currentQuestion = questions[currentQuestionIndex];
    const score = useMemo(() => {
        return userAnswers.reduce((acc, answer, index) => {
            if (questions[index]?.correctAnswer === answer) {
                return acc + 1;
            }
            return acc;
        }, 0);
    }, [userAnswers, questions]);

    if (examState === 'start') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 rounded-2xl">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">SPI Mock Exam Simulation</h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                    This is a full-length mock exam designed to simulate the official Sonography Principles & Instrumentation (SPI) test environment.
                </p>
                <div className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-left space-y-3 mb-8">
                    <p><strong><span className="text-yellow-300">Questions:</span></strong> {MOCK_EXAM_QUESTIONS.length} multiple-choice questions</p>
                    <p><strong><span className="text-yellow-300">Time Limit:</span></strong> 2 hours</p>
                    <p><strong><span className="text-yellow-300">Instructions:</span></strong> Answer each question to the best of your ability. You can flag questions to review later. Your score will be calculated upon completion.</p>
                </div>
                <ControlButton onClick={startExam}>Begin Exam</ControlButton>
            </div>
        );
    }
    
     if (examState === 'finished') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 bg-white/5 rounded-2xl overflow-y-auto">
                <h2 className="text-3xl font-bold text-yellow-400 mb-4">Exam Complete!</h2>
                <p className="text-lg text-white/80 mb-6">Here are your results:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white max-w-3xl w-full mb-8">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-4xl font-bold text-green-400">{score}</p><p className="text-white/70 mt-1">Correct</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-4xl font-bold text-red-400">{questions.length - score}</p><p className="text-white/70 mt-1">Incorrect</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-4xl font-bold text-yellow-400">{((score / questions.length) * 100).toFixed(1)}%</p><p className="text-white/70 mt-1">Final Score</p></div>
                </div>
                <p className="text-sm text-white/60 mb-8">Your highest score is saved. Feel free to try again anytime to improve!</p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <ControlButton onClick={() => { setViewMode('review'); setCurrentQuestionIndex(0); setExamState('running'); }}>Review Answers</ControlButton>
                    <ControlButton onClick={startExam} secondary>Take Again</ControlButton>
                </div>

                <div className="mt-8 w-full flex flex-col items-center">
                    <ControlButton onClick={handleGetAiReview} disabled={isReviewLoading}>
                        {isReviewLoading ? "Analyzing your results..." : "Get AI-Powered Review ✨"}
                    </ControlButton>
                    {reviewError && <p className="text-red-400 mt-2 text-sm">{reviewError}</p>}
                    {aiReview && <AIReviewDisplay review={aiReview} onNavigate={onNavigate} />}
                </div>
            </div>
        );
    }

    // Main Exam/Review View
    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex-shrink-0 flex justify-between items-center p-4 bg-gray-900/50 rounded-t-2xl border-b border-white/10">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-yellow-400">SPI Mock Exam</h2>
                    <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                    <ControlButton onClick={() => setExamState('paused')} secondary>Pause</ControlButton>
                </div>
            </div>
            
            {/* Question Grid */}
            {showGrid && (
                 <div className="absolute inset-0 bg-black/80 z-20 flex justify-center items-center" onClick={() => setShowGrid(false)}>
                    <div className="bg-gray-800 p-6 rounded-lg grid grid-cols-10 gap-2 max-w-2xl" onClick={e => e.stopPropagation()}>
                        {questions.map((_, index) => {
                            const isAnswered = userAnswers[index] !== null;
                            const isFlagged = flaggedQuestions.includes(index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToQuestion(index)}
                                    className={`w-10 h-10 rounded-md flex items-center justify-center font-bold ${
                                        currentQuestionIndex === index ? 'bg-yellow-500 text-black' : 
                                        isFlagged ? 'bg-cyan-500/50' : 
                                        isAnswered ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
            
             {/* Paused Modal */}
            {examState === 'paused' && (
                 <div className="absolute inset-0 bg-black/80 z-20 flex flex-col justify-center items-center gap-6">
                    <h2 className="text-4xl font-bold text-yellow-400">Exam Paused</h2>
                    <div className="flex gap-4">
                        <ControlButton onClick={() => setExamState('running')}>Resume Exam</ControlButton>
                        <ControlButton onClick={() => {if(window.confirm('Are you sure you want to end the exam? Your score will be calculated based on your current answers.')) finishExam()}} secondary>End Exam</ControlButton>
                    </div>
                </div>
            )}

            {/* Question Body */}
            <div className="flex-grow p-6 bg-white/5 overflow-y-auto">
                {currentQuestion && (
                    <>
                        <p className="mb-6 text-white/90 text-lg leading-relaxed">{currentQuestion.question}</p>
                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = userAnswers[currentQuestionIndex] === option;
                                const isCorrect = currentQuestion.correctAnswer === option;
                                
                                let buttonClass = 'bg-white/10 border border-white/20 hover:bg-white/20';
                                if (viewMode === 'review') {
                                     if(isCorrect) buttonClass = 'bg-green-500/80 border-green-400 text-white';
                                     else if(isSelected && !isCorrect) buttonClass = 'bg-red-500/80 border-red-400 text-white';
                                     else buttonClass = 'bg-white/10 border border-white/20 text-white opacity-60';
                                } else if(isSelected) {
                                    buttonClass = 'bg-yellow-400/20 border-yellow-400 text-yellow-300';
                                }

                                return (
                                    <button 
                                        key={index}
                                        onClick={() => viewMode === 'exam' && handleAnswerSelect(option)}
                                        className={`p-4 rounded-lg text-left transition-all duration-300 w-full font-semibold ${buttonClass}`}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                         {viewMode === 'review' && (
                             <div className="mt-6 p-4 bg-gray-800/50 rounded-lg animate-fade-in">
                                <p className="font-bold text-yellow-400">Explanation:</p>
                                <p className="text-white/80 mt-2">{currentQuestion.explanation}</p>
                            </div>
                         )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex justify-between items-center p-4 bg-gray-900/50 rounded-b-2xl border-t border-white/10">
                <div className="flex gap-2">
                    <ControlButton onClick={toggleFlag} secondary>
                        <span className={flaggedQuestions.includes(currentQuestionIndex) ? 'text-cyan-400' : ''}>
                           🚩 {flaggedQuestions.includes(currentQuestionIndex) ? 'Flagged' : 'Flag'}
                        </span>
                    </ControlButton>
                    <ControlButton onClick={() => setShowGrid(true)} secondary>Grid</ControlButton>
                </div>
                <div className="flex gap-2">
                    <ControlButton onClick={() => goToQuestion(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0} secondary>
                        Previous
                    </ControlButton>
                    {viewMode === 'exam' && currentQuestionIndex === questions.length - 1 ? (
                        <ControlButton onClick={() => {if(window.confirm('Are you sure you want to finish the exam?')) finishExam()}}>
                            Finish Exam
                        </ControlButton>
                    ) : (
                        <ControlButton onClick={() => goToQuestion(currentQuestionIndex + 1)} disabled={currentQuestionIndex === questions.length - 1}>
                            Next
                        </ControlButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpiMockExamDemo;
