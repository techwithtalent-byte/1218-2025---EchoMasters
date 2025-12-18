
import React from 'react';
import { UserProfile, AIStudyPath } from '../types';
import { COURSE_MODULES } from '../constants';
import { ACHIEVEMENTS } from '../achievements';
import { TrophyIcon, SparklesIcon, ChevronRightIcon, BrainIcon, TargetIcon } from './Icons';
import { motion } from 'framer-motion';
import EchoBotMascot from './EchoBotMascot';

interface HeroProps {
    userProfile: UserProfile | null;
    onGeneratePathClick: () => void;
    studyPath: AIStudyPath | null;
    onContinuePathClick: () => void;
}

const StatWidget: React.FC<{ label: string, value: string | number, subtext?: string, icon: React.ReactNode, colorClass?: string }> = ({ label, value, subtext, icon, colorClass = "text-[var(--gold)]" }) => (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col justify-between h-full min-w-[140px] relative overflow-hidden group hover:border-white/20 transition-all duration-300 hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1">
        <div className={`absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 ${colorClass}`}>{icon}</div>
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3 border-b border-white/5 pb-2 w-fit">{label}</p>
        <div>
            <p className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tighter shadow-black drop-shadow-lg">{value}</p>
            {subtext && <p className={`text-[9px] mt-1.5 font-bold uppercase tracking-wide opacity-80 ${colorClass}`}>{subtext}</p>}
        </div>
        {/* Subtle sheen effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.02] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
);

const Hero: React.FC<HeroProps> = ({ userProfile, onGeneratePathClick, studyPath, onContinuePathClick }) => {
    const completedCount = userProfile?.completedModules.length ?? 0;
    const totalModules = COURSE_MODULES.length;
    const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
    const achievementsCount = userProfile?.achievements.length ?? 0;
    
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const pilotName = userProfile?.name?.split(' ')[0] || 'Cadet';

    return (
        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6 mb-8 lg:mb-10 relative">
            {/* Left Block: Greeting */}
            <div className="lg:w-1/3 flex flex-col justify-center py-2 relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-6 h-6">
                        <EchoBotMascot size={24} />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--gold)] uppercase tracking-[0.2em] opacity-80">System Online</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter neon-text-glow leading-[0.9] mb-4">
                    {greeting},<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
                        {pilotName}.
                    </span>
                </h1>
                <p className="text-white/50 text-sm max-w-md leading-relaxed font-light">
                    Welcome to Orbital Command. Your physics modules are primed. <br className="hidden sm:block"/>Current visibility: <span className="text-white/80 font-medium">Optimal</span>.
                </p>
            </div>

            {/* Middle Block: HUD Stats */}
            <div className="lg:w-1/3 grid grid-cols-2 gap-4">
                <StatWidget 
                    label="Pilot Level" 
                    value={Math.floor(progress/10) + 1} 
                    subtext={`${(10 - (progress % 10)).toFixed(0)}% XP TO NEXT LVL`}
                    icon={<TargetIcon className="w-6 h-6" />}
                    colorClass="text-cyan-400"
                />
                <StatWidget 
                    label="Awards" 
                    value={achievementsCount} 
                    subtext="UNLOCKED"
                    icon={<TrophyIcon className="w-6 h-6" />}
                    colorClass="text-[var(--gold)]"
                />
                <div className="col-span-2 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">System Mastery</p>
                        <p className="text-3xl font-black text-white tracking-tighter">{progress.toFixed(0)}<span className="text-lg align-top opacity-50">%</span></p>
                    </div>
                    <div className="w-32 sm:w-48 h-3 bg-black/40 rounded-full overflow-hidden relative z-10 border border-white/5">
                        {/* Striped Progress Bar Background */}
                        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_10px)]" />
                        <motion.div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 relative"
                            initial={{ width: 0 }} 
                            animate={{ width: `${progress}%` }} 
                            transition={{ duration: 1.2, ease: "circOut" }} 
                        >
                            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_white]" />
                        </motion.div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Right Block: Primary Action */}
            <div className="lg:w-1/3">
                <button 
                    onClick={studyPath ? onContinuePathClick : onGeneratePathClick}
                    className="w-full h-full min-h-[180px] group relative bg-[#e5e5e5] text-black rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.3)] ring-4 ring-black ring-opacity-20"
                >
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f0f0f0] to-[#d4d4d4] z-0" />
                    
                    <div className="h-full p-7 flex flex-col justify-between relative z-10">
                        {/* Decorative Grid */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start">
                            <span className={`text-[9px] font-bold font-mono uppercase tracking-[0.2em] px-2.5 py-1.5 rounded border backdrop-blur-sm ${studyPath ? 'bg-green-500/10 text-green-800 border-green-500/20' : 'bg-black/5 text-black/50 border-black/10'}`}>
                                {studyPath ? 'MISSION ACTIVE' : 'NO ORDERS'}
                            </span>
                            <div className="bg-black/5 p-2 rounded-lg group-hover:bg-black/10 transition-colors">
                                <SparklesIcon className="w-5 h-5 text-black/40 group-hover:text-black/80 transition-colors" />
                            </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-6">
                            <div className="text-left">
                                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1 pl-0.5">Next Objective</p>
                                <p className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-black group-hover:scale-105 origin-left transition-transform duration-300">
                                    {studyPath ? 'Resume Path' : 'Generate Plan'}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-black transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                                <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Hero;
