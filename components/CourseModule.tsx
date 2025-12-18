
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CourseModuleData } from '../types';
import { useSound } from '../contexts/SoundContext';
import {
    SparklesIcon,
    BeakerIcon,
    QuestionMarkCircleIcon,
    ListBulletIcon,
    CheckBadgeIcon,
} from './Icons';

interface CourseModuleProps extends CourseModuleData {
  onClick: () => void;
  isCompleted?: boolean;
  score?: number;
}

const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('ai') || lowerFeature.includes('powered')) return <SparklesIcon className="w-3 h-3" />;
    if (lowerFeature.includes('lab') || lowerFeature.includes('simulation') || lowerFeature.includes('interactive')) return <BeakerIcon className="w-3 h-3" />;
    if (lowerFeature.includes('quiz') || lowerFeature.includes('questions')) return <QuestionMarkCircleIcon className="w-3 h-3" />;
    return <ListBulletIcon className="w-3 h-3" />;
};

const CourseModule: React.FC<CourseModuleProps> = ({
  id,
  status,
  icon,
  title,
  description,
  features,
  onClick,
  isCompleted,
  score,
  hasWaveAnimation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useSound();

  const handleMouseEnter = () => {
      setIsHovered(true);
      playHover();
  };

  const handleClick = () => {
      playClick();
      onClick();
  };

  // Status-based color accents
  const getStatusColorClasses = (status: string) => {
      if (['Premium', 'Interactive'].includes(status)) return 'text-[var(--gold)] border-[var(--gold)]/40 bg-[var(--gold)]/10 shadow-[0_0_10px_rgba(212,175,55,0.15)]';
      if (status === 'Clinical') return 'text-blue-400 border-blue-400/40 bg-blue-400/10 shadow-[0_0_10px_rgba(96,165,250,0.15)]';
      if (status === 'Advanced') return 'text-purple-400 border-purple-400/40 bg-purple-400/10 shadow-[0_0_10px_rgba(192,132,252,0.15)]';
      if (status === 'Challenge' || status === 'Game') return 'text-red-400 border-red-400/40 bg-red-400/10 shadow-[0_0_10px_rgba(248,113,113,0.15)]';
      if (status === 'New!') return 'text-green-400 border-green-400/40 bg-green-400/10 shadow-[0_0_10px_rgba(74,222,128,0.15)]';
      return 'text-gray-400 border-gray-400/40 bg-gray-400/10';
  };
  
  const statusClasses = getStatusColorClasses(status);
  const accentColorHex = status === 'Clinical' ? '#60a5fa' : status === 'Challenge' ? '#f87171' : 'var(--gold)';

  return (
    <motion.div
        layout
        onClick={handleClick}
        onHoverStart={handleMouseEnter}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative h-full flex flex-col bg-[#0a0a0a] border border-white/10 hover:border-[var(--gold)]/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
        {/* Subtle Background Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" />
        
        {/* Wave Animation Background */}
        <AnimatePresence>
            {hasWaveAnimation && !isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05, transition: { delay: 0.2 } }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
                >
                     <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                        <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke={accentColorHex} strokeWidth="0.5" className="animate-pulse" />
                     </svg>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="px-5 pt-5 flex justify-between items-start relative z-10 min-h-[32px]">
             <motion.span 
                initial={{ opacity: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md select-none transition-shadow duration-300 ${statusClasses}`}
             >
                {status}
            </motion.span>
            {isCompleted ? (
                <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                    <CheckBadgeIcon className="w-3 h-3" />
                    <span>Complete</span>
                </div>
            ) : score !== undefined ? (
                 <div className="flex items-center gap-1.5 text-[var(--gold)] bg-[var(--gold)]/5 border border-[var(--gold)]/20 px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-wider">
                    <span>Best: {score}%</span>
                </div>
            ) : null}
        </div>

        {/* Main Content */}
        <div className="p-5 flex flex-col h-full relative z-10 pb-8">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-all duration-300 group-hover:border-[var(--gold)]/30 group-hover:text-[var(--gold)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex-shrink-0">
                    {icon}
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-[9px] font-mono text-white/30 mt-1.5 uppercase tracking-wider">
                        MOD-ID: {id.toUpperCase().substring(0, 4)}
                    </p>
                </div>
            </div>

            <p className="text-sm text-white/60 line-clamp-3 leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300 font-light">
                {description}
            </p>

            {/* Features Tags - Pill Style */}
            <div className="mt-auto flex flex-wrap gap-2 transition-all duration-300 group-hover:opacity-10 group-hover:blur-[1px]">
                {features.slice(0, 3).map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] text-white/50 font-bold tracking-wide">
                        <span className="opacity-50">{getFeatureIcon(f)}</span>
                        <span className="truncate max-w-[100px]">{f}</span>
                    </span>
                ))}
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-3 z-20">
                <span className="text-xs font-bold font-mono uppercase tracking-widest text-[var(--gold)] drop-shadow-md">
                    {isCompleted ? 'Review Module' : 'Initialize'}
                </span>
                <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center text-black shadow-[0_0_20px_var(--gold-dim)] transform group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Progress Bar Container - Glow Effect */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-20 overflow-hidden">
             <motion.div 
                className={`h-full relative ${isCompleted ? 'bg-green-500' : 'bg-[var(--gold)]'}`}
                initial={{ width: 0 }}
                animate={{ width: isCompleted ? '100%' : '0%' }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
                <div className={`absolute top-0 right-0 bottom-0 w-[20px] bg-white blur-[5px] opacity-50`} />
                <div className={`absolute inset-0 ${isCompleted ? 'shadow-[0_0_10px_#22c55e]' : 'shadow-[0_0_10px_var(--gold)]'}`} />
            </motion.div>
        </div>
    </motion.div>
  );
};

export default CourseModule;
