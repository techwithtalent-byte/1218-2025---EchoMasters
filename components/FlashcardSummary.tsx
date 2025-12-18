
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, DemoId, SRSCard, AIFlashcard } from '../types';
import ControlButton from './demos/ControlButton';
import { PRE_GENERATED_FLASHCARDS } from '../flashcard-data';
import { BrainIcon, ChevronRightIcon, CardStackIcon, SparklesIcon } from './Icons';

interface FlashcardSummaryProps {
    userProfile: UserProfile | null;
    onModuleClick: (moduleId: DemoId) => void;
}

const isUserCard = (card: any): card is SRSCard => {
    return (card as SRSCard).level !== undefined;
};

const MasteryDots: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md" title={`Mastery Level: ${level}/5`}>
        {[1, 2, 3, 4, 5].map(i => (
            <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i <= level 
                        ? 'bg-[var(--gold)] shadow-[0_0_6px_var(--gold)] scale-110' 
                        : 'bg-white/10 scale-90'
                }`} 
            />
        ))}
    </div>
);

const FlashcardSummary: React.FC<FlashcardSummaryProps> = ({ userProfile, onModuleClick }) => {
    const DECK_ID = 'spi_study_guide';
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardIndex, setCardIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const { displayQueue, dueCount, totalCount, hasUserDeck } = useMemo(() => {
        const userDeck = userProfile?.flashcardDecks?.[DECK_ID] || [];
        const now = Date.now();
        const dueCards = userDeck.filter(card => card.nextReview <= now);
        
        let queue: (SRSCard | AIFlashcard)[] = [];

        if (userDeck.length > 0) {
            const sortedDue = [...dueCards].sort((a, b) => a.nextReview - b.nextReview);
            queue = [...sortedDue];
            if (queue.length < 5) {
                const others = userDeck.filter(c => !dueCards.includes(c));
                const shuffled = [...others].sort(() => 0.5 - Math.random());
                queue = [...queue, ...shuffled.slice(0, 5 - queue.length)];
            }
        } else {
            const shuffled = [...PRE_GENERATED_FLASHCARDS].sort(() => 0.5 - Math.random());
            queue = shuffled.slice(0, 10);
        }

        return {
            displayQueue: queue,
            dueCount: dueCards.length,
            totalCount: userDeck.length,
            hasUserDeck: userDeck.length > 0
        };
    }, [userProfile]);

    const activeCard = displayQueue[cardIndex % displayQueue.length];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => setCardIndex(prev => (prev + 1) % displayQueue.length), 150);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => setCardIndex(prev => (prev - 1 + displayQueue.length) % displayQueue.length), 150);
    };

    if (!isClient || !activeCard) return null;

    return (
        <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden group shadow-2xl">
            {/* Ambient Background Glow based on status */}
            <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] transition-colors duration-1000 pointer-events-none ${dueCount > 0 ? 'bg-red-500/10' : 'bg-green-500/5'}`}></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-[var(--gold)] shadow-inner">
                        <CardStackIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Memory Bank</h2>
                        <span className="text-[10px] text-white/40 font-mono block mt-0.5 tracking-wider">
                            {hasUserDeck ? 'PERSONAL DATABASE' : 'PREVIEW MODE'}
                        </span>
                    </div>
                </div>
                {dueCount > 0 ? (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="text-right">
                            <span className="block text-xs font-bold text-red-400 leading-none">{dueCount} DUE</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">Synced</span>
                    </div>
                )}
            </div>

            {/* Card Area */}
            <div className="flex-grow relative z-10 perspective-[1200px] group/card-area mb-4 flex flex-col justify-center items-center px-2">
                
                {/* Refined Background "Stack" Effect */}
                <div className="absolute top-3 left-7 right-7 bottom-[-10px] bg-[#1a1a1a] rounded-2xl transform scale-[0.94] translate-y-2 z-0 border border-white/5 shadow-lg" />
                <div className="absolute top-5 left-10 right-10 bottom-[-18px] bg-[#151515] rounded-2xl transform scale-[0.88] translate-y-4 z-[-1] border border-white/5 shadow-lg opacity-60" />
                
                {/* Main Card */}
                <div 
                    className="w-full h-80 relative cursor-pointer z-20 transition-transform duration-300 hover:scale-[1.01]"
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ perspective: '1200px' }}
                >
                    <motion.div
                        className="w-full h-full relative preserve-3d"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* FRONT FACE */}
                        <div 
                            className="absolute inset-0 rounded-2xl flex flex-col items-center justify-between text-center shadow-2xl backface-hidden bg-[#121212] border border-white/10 overflow-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            {/* Card Decoration */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_var(--gold-dim),_transparent_70%)] opacity-20 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

                            {/* Top Bar */}
                            <div className="w-full p-4 flex justify-between items-center relative z-10">
                                {isUserCard(activeCard) ? <MasteryDots level={activeCard.level} /> : <div className="w-10"/>}
                                <div className="text-[9px] font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-1 rounded border border-[var(--gold)]/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                                    CARD {String(cardIndex + 1).padStart(2, '0')} / {String(displayQueue.length).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Center Content */}
                            <div className="flex-grow flex flex-col items-center justify-center w-full px-6 relative z-10">
                                {activeCard.frontImage ? (
                                    <div className="mb-4 relative group/img w-full max-w-[200px]">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)]/20 to-purple-500/20 rounded-xl blur opacity-30 group-hover/img:opacity-50 transition duration-500"></div>
                                        <div className="h-28 w-full flex justify-center items-center bg-black/60 rounded-lg p-3 border border-white/10 relative">
                                            <img src={activeCard.frontImage} alt="Visual" className="h-full object-contain max-w-full drop-shadow-md" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 mb-4 text-[var(--gold)] opacity-50">
                                        <SparklesIcon />
                                    </div>
                                )}
                                
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mb-3">Recall Subject</p>
                                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug line-clamp-4 max-w-[90%]">
                                    {activeCard.term}
                                </h3>
                            </div>
                            
                            {/* Bottom Hint */}
                            <div className="w-full p-4 relative z-10">
                                <div className="text-[9px] text-white/30 font-mono uppercase tracking-widest flex items-center justify-center gap-2 group-hover:text-white/50 transition-colors">
                                    <span>Tap to Reveal</span>
                                    <div className="w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
                                </div>
                            </div>
                        </div>

                        {/* BACK FACE */}
                        <div 
                            className="absolute inset-0 rounded-2xl flex flex-col items-center shadow-2xl backface-hidden bg-[#0a0a0a] border border-[var(--gold)]/30 overflow-hidden"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                            
                            <div className="w-full p-4 border-b border-white/5 bg-white/[0.02] flex justify-center">
                                <p className="text-[9px] text-[var(--gold)] uppercase tracking-[0.3em] font-bold">Analysis Data</p>
                            </div>
                            
                            <div className="flex-grow w-full overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-white/20 p-6 flex flex-col items-center">
                                <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium text-center">
                                    {activeCard.definition}
                                </p>
                                {activeCard.backImage && (
                                     <div className="mt-4 w-full flex justify-center bg-black/40 p-2 rounded-lg border border-white/10">
                                        <img src={activeCard.backImage} alt="Visual" className="h-28 object-contain max-w-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Navigation Controls */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-between px-0 z-30 pointer-events-none">
                    <button 
                        onClick={handlePrev}
                        className="pointer-events-auto w-10 h-10 -ml-3 rounded-full bg-[#1a1a1a] border border-white/10 text-white/50 hover:text-[var(--gold)] hover:border-[var(--gold)] flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:scale-110 group/btn"
                    >
                        <ChevronRightIcon className="w-5 h-5 rotate-180 transition-transform" />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="pointer-events-auto w-10 h-10 -mr-3 rounded-full bg-[#1a1a1a] border border-white/10 text-white/50 hover:text-[var(--gold)] hover:border-[var(--gold)] flex items-center justify-center transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:scale-110 group/btn"
                    >
                        <ChevronRightIcon className="w-5 h-5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Footer Action */}
            <div className="relative z-10 mt-auto flex-shrink-0">
                <ControlButton 
                    onClick={() => onModuleClick('study_guide')} 
                    fullWidth
                    secondary
                    className={dueCount > 0 
                        ? "border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50" 
                        : "border-white/10 hover:border-[var(--gold)]/30 hover:text-[var(--gold)]"}
                >
                    <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold">
                        <span>{hasUserDeck ? "Start Review Session" : "Initialize Deck"}</span>
                        <BrainIcon className="w-4 h-4" />
                    </div>
                </ControlButton>
            </div>
        </div>
    );
};

export default FlashcardSummary;
