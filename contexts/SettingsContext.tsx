
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const SETTINGS_STORAGE_KEY = 'echoMastersSettings';

interface Settings {
    animationsEnabled: boolean;
    soundEnabled: boolean;
    volume: number; // 0.0 to 1.0
}

const defaultSettings: Settings = {
    animationsEnabled: true,
    soundEnabled: true,
    volume: 0.5,
};

interface SettingsContextType {
    settings: Settings;
    setAnimationsEnabled: (enabled: boolean) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setVolume: (volume: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                // Merge with defaults to ensure new properties exist
                setSettings({ ...defaultSettings, ...parsedSettings });
            } else {
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
            setSettings(defaultSettings);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }

        if (settings.animationsEnabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }, [settings]);

    const setAnimationsEnabled = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, animationsEnabled: enabled }));
    };

    const setSoundEnabled = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, soundEnabled: enabled }));
    };

    const setVolume = (volume: number) => {
        setSettings(prev => ({ ...prev, volume }));
    };

    return (
        <SettingsContext.Provider value={{ settings, setAnimationsEnabled, setSoundEnabled, setVolume }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
