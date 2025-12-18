
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, DemoId, AIFlashcard, SRSCard, Priority, StudyTask, AIStudyPath, Theme } from '../types';
import { ACHIEVEMENTS } from '../achievements';
import { useNotification } from './NotificationContext';

const USER_PROFILE_STORAGE_KEY = 'echoMastersUserProfile';

const defaultProfile: UserProfile = {
    name: 'Guest User',
    joinDate: Date.now(),
    lastActiveModule: null,
    completedModules: [],
    quizScores: {},
    achievements: [],
    flashcardDecks: {},
    studyTasks: [],
    notes: {},
    learningStyle: null,
    studyPath: null,
    hasCompletedOnboarding: false,
    theme: 'Classic',
};

interface UserContextType {
    userProfile: UserProfile | null;
    markModuleAsCompleted: (moduleId: DemoId) => void;
    awardAchievement: (achievementId: string) => void;
    setSpiQuizScore: (score: number) => void;
    setSpiMockExamScore: (score: number) => void;
    resetProgress: () => void;
    addFlashcardDeck: (deckId: string, cards: AIFlashcard[]) => void;
    updateCardPerformance: (deckId: string, cardId: string, isCorrect: boolean) => void;
    addStudyTask: (text: string, priority: Priority) => void;
    toggleStudyTask: (taskId: string) => void;
    deleteStudyTask: (taskId: string) => void;
    updateNote: (sectionId: string, content: string) => void;
    setUserName: (name: string) => void;
    setStudyPath: (path: AIStudyPath | null) => void;
    setLastActiveModule: (moduleId: DemoId | null) => void;
    markOnboardingAsCompleted: () => void;
    setTheme: (theme: Theme) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
            if (storedProfile) {
                const profile = JSON.parse(storedProfile);
                // Merge with default to ensure all keys are present for older profiles
                const fullProfile = { ...defaultProfile, ...profile };
                setUserProfile(fullProfile);
            } else {
                setUserProfile(defaultProfile);
            }
        } catch (error) {
            console.error("Failed to load user profile from localStorage", error);
            setUserProfile(defaultProfile);
        }
    }, []);

    useEffect(() => {
        if (userProfile) {
            try {
                localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
            } catch (error) {
                console.error("Failed to save user profile to localStorage", error);
            }
        }
    }, [userProfile]);

    const markModuleAsCompleted = useCallback((moduleId: DemoId) => {
        setUserProfile(prev => {
            if (!prev || prev.completedModules.includes(moduleId)) {
                return prev;
            }
            return {
                ...prev,
                completedModules: [...prev.completedModules, moduleId],
            };
        });
    }, []);

    const awardAchievement = useCallback((achievementId: string) => {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        setUserProfile(prev => {
            if (!prev || prev.achievements.includes(achievementId)) {
                return prev;
            }
            console.log(`Awarding achievement: ${achievementId}`);
            addNotification(achievement); // Trigger toast
            return {
                ...prev,
                achievements: [...prev.achievements, achievementId],
            };
        });
    }, [addNotification]);
    
    const setSpiQuizScore = useCallback((score: number) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            const currentBest = prev.quizScores.spi ?? -1;
            if (score > currentBest) {
                return {
                    ...prev,
                    quizScores: {
                        ...prev.quizScores,
                        spi: score,
                    },
                };
            }
            return prev;
        });
    }, []);

    const setSpiMockExamScore = useCallback((score: number) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            const currentBest = prev.quizScores.spiMockExam ?? -1;
            if (score > currentBest) {
                 const newProfile = {
                    ...prev,
                    quizScores: {
                        ...prev.quizScores,
                        spiMockExam: score,
                    },
                };
                if (score >= 90 && !newProfile.achievements.includes('exam_master')) {
                    const achievement = ACHIEVEMENTS.find(a => a.id === 'exam_master');
                    if (achievement) {
                        newProfile.achievements.push('exam_master');
                        addNotification(achievement);
                    }
                }
                return newProfile;
            }
            return prev;
        });
    }, [addNotification]);

    const resetProgress = useCallback(() => {
        if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            // Keep user name and join date on reset
            setUserProfile(prev => ({
                ...defaultProfile,
                name: prev?.name || 'Guest User',
                joinDate: prev?.joinDate || Date.now(),
                hasCompletedOnboarding: false,
            }));
        }
    }, []);
    
    const markOnboardingAsCompleted = useCallback(() => {
        setUserProfile(prev => prev ? { ...prev, hasCompletedOnboarding: true } : null);
    }, []);

    const addFlashcardDeck = useCallback((deckId: string, cards: AIFlashcard[]) => {
        const newCards: SRSCard[] = cards.map((card, index) => ({
            id: `${deckId}-${Date.now()}-${index}`,
            term: card.term,
            definition: card.definition,
            frontImage: card.frontImage,
            backImage: card.backImage,
            level: 0, // Start at level 0 (New)
            lastReviewed: null,
            nextReview: Date.now(),
        }));

        setUserProfile(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                flashcardDecks: {
                    ...prev.flashcardDecks,
                    [deckId]: [...(prev.flashcardDecks[deckId] || []), ...newCards],
                },
            };
        });
    }, []);

    const updateCardPerformance = useCallback((deckId: string, cardId: string, isCorrect: boolean) => {
        // SRS Intervals: 0: 10m, 1: 1d, 2: 3d, 3: 7d, 4: 14d, 5: 30d
        const SRS_INTERVALS = [
            10 * 60 * 1000,       // Level 0: 10 minutes
            24 * 60 * 60 * 1000,  // Level 1: 1 day
            3 * 24 * 60 * 60 * 1000, // Level 2: 3 days
            7 * 24 * 60 * 60 * 1000, // Level 3: 7 days
            14 * 24 * 60 * 60 * 1000, // Level 4: 14 days
            30 * 24 * 60 * 60 * 1000  // Level 5: 30 days
        ];
        const MAX_LEVEL = 5;

        setUserProfile(prev => {
            if (!prev || !prev.flashcardDecks[deckId]) return prev;

            const now = Date.now();
            const updatedCards = prev.flashcardDecks[deckId].map(card => {
                if (card.id === cardId) {
                    let newLevel;
                    if (isCorrect) {
                        newLevel = Math.min(MAX_LEVEL, card.level + 1);
                    } else {
                        newLevel = 0; // Reset to 0 (10 mins)
                    }
                    const nextReviewTime = now + (SRS_INTERVALS[newLevel] || SRS_INTERVALS[MAX_LEVEL]);
                    return { ...card, level: newLevel, lastReviewed: now, nextReview: nextReviewTime };
                }
                return card;
            });

            return { ...prev, flashcardDecks: { ...prev.flashcardDecks, [deckId]: updatedCards } };
        });
    }, []);

    const addStudyTask = useCallback((text: string, priority: Priority) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            // Generate a more unique ID using randomUUID if available, or a random string suffix
            const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID 
                ? crypto.randomUUID() 
                : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                
            const newTask: StudyTask = { id: uniqueId, text, isCompleted: false, priority };
            return { ...prev, studyTasks: [...(prev.studyTasks || []), newTask] };
        });
    }, []);

    const toggleStudyTask = useCallback((taskId: string) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            return { ...prev, studyTasks: (prev.studyTasks || []).map(task => task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task) };
        });
    }, []);

    const deleteStudyTask = useCallback((taskId: string) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            return { ...prev, studyTasks: (prev.studyTasks || []).filter(task => task.id !== taskId) };
        });
    }, []);
    
    const updateNote = useCallback((sectionId: string, content: string) => {
        setUserProfile(prev => {
            if (!prev) return prev;
            const newNotes = { ...prev.notes, [sectionId]: content };
            return { ...prev, notes: newNotes };
        });
    }, []);

    const setUserName = useCallback((name: string) => {
        setUserProfile(prev => (prev ? { ...prev, name } : null));
    }, []);

    const setTheme = useCallback((theme: Theme) => {
        setUserProfile(prev => (prev ? { ...prev, theme } : null));
    }, []);

    const setStudyPath = useCallback((path: AIStudyPath | null) => {
        setUserProfile(prev => {
            if (!prev) return null;
            return {
                ...prev,
                studyPath: path,
                learningStyle: path ? path.learningStyle : prev.learningStyle,
            };
        });
    }, []);

    const setLastActiveModule = useCallback((moduleId: DemoId | null) => {
        setUserProfile(prev => (prev ? { ...prev, lastActiveModule: moduleId } : null));
    }, []);

    return (
        <UserContext.Provider value={{ userProfile, markModuleAsCompleted, awardAchievement, setSpiQuizScore, setSpiMockExamScore, resetProgress, addFlashcardDeck, updateCardPerformance, addStudyTask, toggleStudyTask, deleteStudyTask, updateNote, setUserName, setStudyPath, setLastActiveModule, markOnboardingAsCompleted, setTheme }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
