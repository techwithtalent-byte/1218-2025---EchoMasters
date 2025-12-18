import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../achievements';

interface AchievementToastProps {
  achievement: Achievement;
  onRemove: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="relative w-full max-w-sm bg-gray-800/80 backdrop-blur-lg border border-[var(--gold)]/50 rounded-xl shadow-2xl p-4 flex items-center gap-4 overflow-hidden"
    >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold)]"></div>
        <div className="flex-shrink-0 text-4xl [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.7))]">{achievement.icon}</div>
        <div>
            <p className="font-bold text-[var(--gold)]">Achievement Unlocked!</p>
            <p className="text-white font-semibold">{achievement.title}</p>
        </div>
        <button onClick={onRemove} className="absolute top-2 right-2 text-white/50 hover:text-white">&times;</button>
    </motion.div>
  );
};

export default AchievementToast;