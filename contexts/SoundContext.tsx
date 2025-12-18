
import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

interface SoundContextType {
    playHover: () => void;
    playClick: () => void;
    playTypewriter: () => void;
    playSuccess: () => void;
    playError: () => void;
    playScan: () => void;
    playStartup: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { settings } = useSettings();
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current) {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioCtx) {
                    audioContextRef.current = new AudioCtx();
                    masterGainRef.current = audioContextRef.current.createGain();
                    masterGainRef.current.connect(audioContextRef.current.destination);
                    masterGainRef.current.gain.value = settings.volume;
                }
            } else if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        const handleInteraction = () => {
            initAudio();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    useEffect(() => {
        if (masterGainRef.current) {
            masterGainRef.current.gain.value = settings.soundEnabled ? settings.volume : 0;
        }
    }, [settings.volume, settings.soundEnabled]);

    const createOscillator = (type: OscillatorType, freq: number, duration: number, gain: number = 0.1) => {
        if (!audioContextRef.current || !masterGainRef.current || !settings.soundEnabled) return;
        
        // Ensure context is running (sometimes needed if suspended)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        oscGain.gain.setValueAtTime(gain, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(oscGain);
        oscGain.connect(masterGainRef.current);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playHover = () => {
        // High pitched tech blip
        if (!audioContextRef.current || !settings.soundEnabled) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current!);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    };

    const playClick = () => {
        // Mechanical thud
        if (!audioContextRef.current || !settings.soundEnabled) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current!);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    };

    const playTypewriter = () => {
        // Short noise burst/click for text typing
        createOscillator('square', 800, 0.03, 0.02);
    };

    const playSuccess = () => {
        // Ascending major triad
        if (!audioContextRef.current || !settings.soundEnabled) return;
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.1, now + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
            
            osc.connect(gain);
            gain.connect(masterGainRef.current!);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.5);
        });
    };

    const playError = () => {
        // Low buzzing saw
        createOscillator('sawtooth', 100, 0.3, 0.1);
    };

    const playScan = () => {
        // Sci-fi scanner sweep
        if (!audioContextRef.current || !settings.soundEnabled) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 1.0);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
        
        osc.connect(gain);
        gain.connect(masterGainRef.current!);
        osc.start();
        osc.stop(ctx.currentTime + 1.0);
    };

    const playStartup = () => {
        // Deep bass swell for intro
        if (!audioContextRef.current || !settings.soundEnabled) return;
        const ctx = audioContextRef.current;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(50, ctx.currentTime);
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(51, ctx.currentTime); // Slight detune for phasing
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGainRef.current!);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 4);
        osc2.stop(ctx.currentTime + 4);
    };

    return (
        <SoundContext.Provider value={{ playHover, playClick, playTypewriter, playSuccess, playError, playScan, playStartup }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = (): SoundContextType => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
