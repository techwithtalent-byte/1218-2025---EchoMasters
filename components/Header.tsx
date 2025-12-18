
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Theme, DemoId } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { COURSE_MODULES } from '../constants';
import { useUser } from '../contexts/UserContext';
import SearchBar from './SearchBar';
import { useSound } from '../contexts/SoundContext';

interface HeaderProps {
    userProfile: UserProfile | null;
    onResetProgress: () => void;
    onDashboardClick: () => void;
    onModuleClick: (moduleId: DemoId) => void;
}

const GridIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

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

const WaveLogo = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--gold)]">
        <path d="M2 16C2 16 6 6 10 16C14 26 18 6 22 16C26 26 30 16 30 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Header: React.FC<HeaderProps> = ({ userProfile, onResetProgress, onDashboardClick, onModuleClick }) => {
  const { settings, setAnimationsEnabled, setSoundEnabled } = useSettings();
  const { setUserName, setTheme } = useUser();
  const { playClick, playHover } = useSound();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');

  const completedCount = userProfile?.completedModules.length ?? 0;
  const totalModules = COURSE_MODULES.length;
  const progress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  useEffect(() => {
      if (userProfile?.name) {
          setName(userProfile.name);
      }
  }, [userProfile?.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
  };

  const handleNameBlur = () => {
      if (name.trim() && name.trim() !== userProfile?.name) {
          setUserName(name.trim());
      } else {
          setName(userProfile?.name || '');
      }
      setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleNameBlur();
      }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
      playClick();
      setIsDropdownOpen(prev => !prev);
  }

  const handleDashboardClick = () => {
      playClick();
      onDashboardClick();
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Background with slight gradient for depth */}
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 shadow-sm supports-[backdrop-filter]:bg-[#050505]/60"></div>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center relative z-10">
        
        {/* Left: Dashboard Nav */}
        <div className="flex items-center flex-1">
            <button 
                onClick={handleDashboardClick} 
                onMouseEnter={playHover}
                className="group flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--gold)]/30 transition-all duration-300 active:scale-95 outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
                aria-label="Dashboard"
            >
                <GridIcon className="text-white/70 group-hover:text-[var(--gold)] transition-colors w-5 h-5" />
                <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-white/80 group-hover:text-white transition-colors">Command Center</span>
            </button>
        </div>
        
        {/* Center: Brand Logo */}
        <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex items-center justify-center z-20" 
            onClick={handleDashboardClick} 
            onMouseEnter={playHover}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-[var(--gold)]/20 flex items-center justify-center group-hover:border-[var(--gold)]/50 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-[var(--gold)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <WaveLogo />
                </div>
                <div className="hidden md:flex flex-col items-start leading-none select-none">
                    <span className="text-lg font-black tracking-tight text-white group-hover:text-[var(--gold)] transition-colors duration-300">
                        ECHO<span className="text-white/40 group-hover:text-white/60 transition-colors">MASTERS</span>
                    </span>
                    <span className="text-[0.6rem] font-mono text-[var(--gold)]/60 group-hover:text-[var(--gold)] uppercase tracking-[0.25em] transition-colors duration-300">
                        Physics Engine
                    </span>
                </div>
            </div>
        </div>
        
        {/* Right: Search & User Profile */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1">
             <div className="hidden lg:block w-full max-w-xs transition-all duration-300">
                <SearchBar onResultClick={onModuleClick} className="w-full" />
             </div>

             {/* User Menu */}
             <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={toggleDropdown}
                    onMouseEnter={playHover}
                    className={`flex items-center gap-3 pl-1 pr-1 sm:pr-3 py-1 rounded-full border transition-all duration-300 group ${isDropdownOpen ? 'bg-white/10 border-[var(--gold)]/30 ring-2 ring-[var(--gold)]/10' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'}`}
                    aria-label="User Menu"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-b from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-lg relative overflow-hidden">
                        <UserIcon className="text-white/60 w-4 h-4 relative z-10 group-hover:text-white transition-colors" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full z-20 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    {/* User Name & Level - Hidden on Mobile */}
                    <div className="hidden md:flex flex-col items-end text-right">
                        <p className="text-xs font-bold text-white/90 leading-none mb-0.5 max-w-[100px] truncate group-hover:text-[var(--gold)] transition-colors">
                            {userProfile?.name?.split(' ')[0] || 'Cadet'}
                        </p>
                        <p className="text-[9px] text-white/40 font-mono leading-none tracking-wider group-hover:text-white/60 transition-colors">
                            LVL {Math.floor(((userProfile?.completedModules.length || 0) / COURSE_MODULES.length) * 10) + 1}
                        </p>
                    </div>
                </button>

                <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-3 w-72 bg-[#0a0a0a] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/5"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex justify-center mb-3">
                                <div className="w-16 h-16 rounded-full bg-black border-2 border-[var(--gold)] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] relative group overflow-hidden">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
                                </div>
                            </div>
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    onBlur={handleNameBlur}
                                    onKeyDown={handleNameKeyDown}
                                    autoFocus
                                    className="w-full bg-black/50 text-white text-center font-bold p-1.5 rounded-lg border border-[var(--gold)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/50 text-sm"
                                />
                            ) : (
                                <p onClick={() => setIsEditingName(true)} className="font-bold text-center text-lg text-white cursor-pointer hover:text-[var(--gold)] transition-colors truncate flex items-center justify-center gap-2 group" title="Click to edit">
                                    {userProfile?.name || 'Guest User'}
                                    <span className="text-[10px] opacity-0 group-hover:opacity-100 text-white/50 transition-opacity">✎</span>
                                </p>
                            )}
                            <p className="text-[10px] text-center text-white/30 mt-1 font-mono tracking-widest">CADET ID: {userProfile ? userProfile.joinDate.toString().slice(-6) : '000000'}</p>
                        </div>

                        {/* Progress Section */}
                        <div className="p-5 border-b border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">System Mastery</span>
                                <span className="text-xs font-mono text-[var(--gold)]">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold)] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="p-2 space-y-1">
                            <div className="px-3 py-2">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Interface Theme</p>
                                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                                    {(['Classic', 'Neon'] as Theme[]).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => { playClick(); setTheme(t); }}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                                                userProfile?.theme === t 
                                                    ? 'bg-[var(--gold)] text-black shadow-sm' 
                                                    : 'text-white/60 hover:text-white'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group" onClick={() => { playClick(); setSoundEnabled(!settings.soundEnabled); }}>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors flex items-center gap-2">
                                    {settings.soundEnabled ? <SpeakerIcon className="w-4 h-4"/> : <MuteIcon className="w-4 h-4"/>}
                                    Sound FX
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 border border-white/10 ${settings.soundEnabled ? 'bg-[var(--gold)] border-[var(--gold)]' : 'bg-black'}`}>
                                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings.soundEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group" onClick={() => { playClick(); setAnimationsEnabled(!settings.animationsEnabled); }}>
                                <span className="text-sm text-white/70 group-hover:text-white transition-colors">Motion Effects</span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 border border-white/10 ${settings.animationsEnabled ? 'bg-[var(--gold)] border-[var(--gold)]' : 'bg-black'}`}>
                                    <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings.animationsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                </div>
                            </div>
                            
                            <button onClick={() => { playClick(); onResetProgress(); }} className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-3 rounded-xl transition-colors text-left flex items-center gap-3 group mt-2">
                                <span className="text-sm group-hover:scale-110 transition-transform">⚠️</span> Factory Reset
                            </button>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
