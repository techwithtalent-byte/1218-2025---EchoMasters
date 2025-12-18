import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { AIHistoryItem } from '../types';

const AI_HISTORY_STORAGE_KEY = 'echoMastersAIHistory';

interface AIHistoryContextType {
    history: AIHistoryItem[];
    addHistoryItem: (item: Omit<AIHistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
}

const AIHistoryContext = createContext<AIHistoryContextType | undefined>(undefined);

export const AIHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<AIHistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem(AI_HISTORY_STORAGE_KEY);
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load AI history from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(AI_HISTORY_STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save AI history to localStorage", error);
        }
    }, [history]);

    const addHistoryItem = useCallback((item: Omit<AIHistoryItem, 'id' | 'timestamp'>) => {
        const newItem: AIHistoryItem = {
            ...item,
            id: `ai-hist-${Date.now()}`,
            timestamp: Date.now(),
        };
        setHistory(prev => [newItem, ...prev]);
    }, []);

    const clearHistory = useCallback(() => {
        if (window.confirm("Are you sure you want to clear all saved AI content? This cannot be undone.")) {
            setHistory([]);
        }
    }, []);

    return (
        <AIHistoryContext.Provider value={{ history, addHistoryItem, clearHistory }}>
            {children}
        </AIHistoryContext.Provider>
    );
};

export const useAIHistory = (): AIHistoryContextType => {
    const context = useContext(AIHistoryContext);
    if (context === undefined) {
        throw new Error('useAIHistory must be used within an AIHistoryProvider');
    }
    return context;
};