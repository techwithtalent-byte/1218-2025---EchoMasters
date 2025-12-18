
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingParticles from './components/FloatingParticles';
import SystemFrame from './components/SystemFrame';
import LearningDashboard from './components/LearningDashboard';
import ModuleView from './components/ModuleView';
import AIAssistant from './components/AIAssistant';
import CinematicIntro from './components/CinematicIntro';
import { DemoId } from './types';
import { useUser } from './contexts/UserContext';
import { COURSE_MODULES } from './constants';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotification } from './contexts/NotificationContext';
import AchievementToast from './components/AchievementToast';
import { useSettings } from './contexts/SettingsContext';
import { SoundProvider } from './contexts/SoundContext';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<DemoId | null>(null);
  const { userProfile, markModuleAsCompleted, awardAchievement, resetProgress, setLastActiveModule, markOnboardingAsCompleted } = useUser();
  const { notifications, removeNotification } = useNotification();
  const { settings } = useSettings();
  
  // Initialize Intro state from session storage to avoid flicker
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('hasSeenCinematicIntro'));
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Reactive Onboarding Logic: Syncs local state with User Profile
  useEffect(() => {
    if (userProfile && !showIntro) {
        // If profile is loaded and intro is done, show onboarding if not completed
        // We only set this if true to avoid re-opening it if we just closed it locally
        if (!userProfile.hasCompletedOnboarding) {
            setShowOnboarding(true);
        }
    }
  }, [userProfile, showIntro]);

  const handleIntroComplete = () => {
      sessionStorage.setItem('hasSeenCinematicIntro', 'true');
      setShowIntro(false);
  };

  const handleOnboardingComplete = useCallback(() => {
      // 1. Immediate UI update to close modal (makes button feel responsive)
      setShowOnboarding(false);
      // 2. Persist state to user profile
      markOnboardingAsCompleted();
  }, [markOnboardingAsCompleted]);

  useEffect(() => {
    const theme = userProfile?.theme || 'Classic';
    document.documentElement.setAttribute('data-theme', theme);
  }, [userProfile?.theme]);


  const handleModuleClick = useCallback((moduleId: DemoId) => {
    setActiveModuleId(moduleId);
    setLastActiveModule(moduleId);
  }, [setLastActiveModule]);

  const handleNavigate = (newModuleId: DemoId) => {
    setActiveModuleId(newModuleId);
    setLastActiveModule(newModuleId);
  };

  const handleCloseModule = useCallback(() => {
    if (activeModuleId) {
      setLastActiveModule(activeModuleId);
    }
    setActiveModuleId(null);
  }, [activeModuleId, setLastActiveModule]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModule();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseModule]);

  const activeModule = useMemo(() => {
    if (!activeModuleId) return null;
    return COURSE_MODULES.find(m => m.id === activeModuleId) || null;
  }, [activeModuleId]);

  return (
    <SoundProvider> 
      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {!showIntro && showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col relative overflow-hidden">
        {settings.animationsEnabled && <FloatingParticles />}
        
        {/* Global UI Frame */}
        <SystemFrame />
        
        <Header 
            onDashboardClick={() => setActiveModuleId(null)} 
            userProfile={userProfile} 
            onResetProgress={resetProgress} 
            onModuleClick={handleModuleClick}
        />

        <main className="flex-grow relative z-10">
            <AnimatePresence mode="wait">
                {activeModuleId ? (
                    <motion.div
                        key="module-view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="h-full"
                    >
                        <ModuleView 
                            moduleId={activeModuleId} 
                            onClose={handleCloseModule} 
                            onNavigate={handleNavigate}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="h-full"
                    >
                        <LearningDashboard 
                            onModuleClick={handleModuleClick} 
                            userProfile={userProfile} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>

        {!activeModuleId && <Footer />}
        
        <AIAssistant activeModule={activeModule} />

        {/* Notification Container */}
        <div className="fixed bottom-6 left-6 z-[200] space-y-4">
          <AnimatePresence>
            {notifications.map(notification => (
              <AchievementToast
                key={notification.id}
                achievement={notification.achievement}
                onRemove={() => removeNotification(notification.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </SoundProvider>
  );
};

export default App;
