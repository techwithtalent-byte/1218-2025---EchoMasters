
import React from 'react';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';

const Corner: React.FC<{ className?: string, rotate?: number, delay?: number }> = ({ className, rotate = 0, delay = 0 }) => (
    <motion.svg 
        viewBox="0 0 40 40" 
        className={`absolute w-6 h-6 sm:w-12 sm:h-12 text-[var(--gold)] transition-colors duration-500 opacity-60 ${className}`}
        style={{ rotate: rotate }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
        <path d="M 1 40 L 1 10 L 10 1 H 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        <rect x="6" y="32" width="2" height="2" fill="currentColor" opacity="0.6" />
    </motion.svg>
);

const SystemFrame: React.FC = () => {
    const { userProfile } = useUser();
    const isNeon = userProfile?.theme === 'Neon';

    return (
        <div className="fixed inset-0 z-[60] pointer-events-none flex flex-col justify-between select-none p-2 sm:p-4">
            {/* Top Bar Area */}
            <div className="w-full h-8 relative">
                {/* Top Border Line with Scanning Effect */}
                <div className="absolute top-0 left-8 right-8 h-[1px] bg-white/10 overflow-hidden">
                    <motion.div 
                        className="w-full h-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                    />
                </div>
                
                <Corner className="top-0 left-0" rotate={0} delay={0.2} />
                <Corner className="top-0 right-0" rotate={90} delay={0.3} />
                
                {/* Center Badge */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="absolute -top-[1px] left-1/2 -translate-x-1/2 bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-0.5 text-[8px] sm:text-[9px] font-mono text-[var(--gold)]/60 tracking-[0.2em] uppercase border border-t-0 border-[var(--gold)]/10 rounded-b-lg"
                >
                    ECHO-OS v4.2
                </motion.div>
            </div>

            {/* Side Decoration - Ticks */}
            <div className="flex-grow relative w-full">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-12"
                >
                    <div className="w-0.5 h-1 bg-white" />
                    <div className="w-0.5 h-1 bg-white" />
                    <div className="w-0.5 h-1 bg-white" />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-12 items-end"
                >
                    <div className="w-0.5 h-1 bg-white" />
                    <div className="w-0.5 h-1 bg-white" />
                    <div className="w-0.5 h-1 bg-white" />
                </motion.div>
            </div>

            {/* Bottom Bar Area */}
            <div className="w-full h-8 relative">
                <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-white/10 overflow-hidden">
                     <motion.div 
                        className="w-full h-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-30"
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <Corner className="bottom-0 right-0" rotate={180} delay={0.4} />
                <Corner className="bottom-0 left-0" rotate={270} delay={0.5} />

                {/* Status Indicators */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-1 left-10 sm:left-12 text-[8px] sm:text-[9px] font-mono text-[var(--gold)]/40 tracking-wider flex items-center gap-2"
                >
                    <div className="w-1 h-1 bg-[var(--gold)] rounded-full animate-pulse shadow-[0_0_5px_var(--gold)]" />
                    SYS: ONLINE
                </motion.div>
                
                {isNeon && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="absolute bottom-1 right-10 sm:right-12 text-[8px] sm:text-[9px] font-mono text-[var(--accent)]/60 tracking-wider hidden sm:flex items-center gap-2"
                    >
                        <span className="animate-pulse">OVERDRIVE</span>
                    </motion.div>
                )}
            </div>
            
            {/* Vignette for depth perception */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
    );
};

export default SystemFrame;
