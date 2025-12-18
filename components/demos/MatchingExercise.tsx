
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '../Icons';

interface MatchingPair {
    id: string;
    leftContent: string;
    rightContent: string;
}

interface MatchingExerciseProps {
    title?: string;
    pairs: MatchingPair[];
    onComplete?: () => void;
}

const MatchingExercise: React.FC<MatchingExerciseProps> = ({ title = "Knowledge Match", pairs, onComplete }) => {
    const [leftItems, setLeftItems] = useState<MatchingPair[]>([]);
    const [rightItems, setRightItems] = useState<MatchingPair[]>([]);
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matchedIds, setMatchedIds] = useState<string[]>([]);
    const [errorId, setErrorId] = useState<string | null>(null);

    useEffect(() => {
        // Shuffle items on mount
        setLeftItems([...pairs].sort(() => Math.random() - 0.5));
        setRightItems([...pairs].sort(() => Math.random() - 0.5));
    }, [pairs]);

    useEffect(() => {
        if (matchedIds.length === pairs.length && onComplete) {
            onComplete();
        }
    }, [matchedIds, pairs.length, onComplete]);

    const handleLeftClick = (id: string) => {
        if (matchedIds.includes(id)) return;
        setSelectedLeft(id);
        setErrorId(null);
    };

    const handleRightClick = (id: string) => {
        if (matchedIds.includes(id)) return;
        
        if (selectedLeft) {
            if (selectedLeft === id) {
                // Match!
                setMatchedIds(prev => [...prev, id]);
                setSelectedLeft(null);
            } else {
                // Mismatch
                setErrorId(id);
                setTimeout(() => setErrorId(null), 500);
                setSelectedLeft(null);
            }
        }
    };

    return (
        <div className="bg-gray-800/50 border border-white/10 rounded-xl p-6 my-6 not-prose">
            <h3 className="text-lg font-bold text-[var(--gold)] mb-4 flex items-center gap-2">
                🧩 {title}
            </h3>
            
            <div className="flex flex-col md:flex-row gap-8 justify-between">
                {/* Left Column (Terms) */}
                <div className="flex-1 space-y-3">
                    {leftItems.map(item => {
                        const isMatched = matchedIds.includes(item.id);
                        const isSelected = selectedLeft === item.id;
                        
                        return (
                            <motion.button
                                key={item.id}
                                layout
                                onClick={() => handleLeftClick(item.id)}
                                disabled={isMatched}
                                className={`w-full p-4 rounded-xl text-left text-sm font-semibold transition-all border-2 relative overflow-hidden ${
                                    isMatched 
                                        ? 'bg-green-500/20 border-green-500 text-green-400 opacity-50' 
                                        : isSelected 
                                            ? 'bg-[var(--gold)]/20 border-[var(--gold)] text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                                            : 'bg-black/40 border-white/10 text-white/80 hover:bg-white/5 hover:border-white/30'
                                }`}
                            >
                                {item.leftContent}
                                {isMatched && <CheckCircleIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Column (Definitions/Images) */}
                <div className="flex-1 space-y-3">
                    {rightItems.map(item => {
                        const isMatched = matchedIds.includes(item.id);
                        const isError = errorId === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                layout
                                onClick={() => handleRightClick(item.id)}
                                disabled={isMatched}
                                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                className={`w-full p-4 rounded-xl text-left text-sm transition-all border-2 relative ${
                                    isMatched 
                                        ? 'bg-green-500/20 border-green-500 text-green-400 opacity-50' 
                                        : isError
                                            ? 'bg-red-500/20 border-red-500 text-red-400'
                                            : 'bg-black/40 border-white/10 text-white/70 hover:bg-white/5 hover:border-white/30'
                                }`}
                            >
                                {item.rightContent}
                                {isMatched && <CheckCircleIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {matchedIds.length === pairs.length && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 font-bold"
                >
                    🎉 All Matched! Great job.
                </motion.div>
            )}
        </div>
    );
};

export default MatchingExercise;
