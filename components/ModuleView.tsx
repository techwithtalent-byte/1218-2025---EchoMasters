
import React, { Suspense, lazy, useLayoutEffect, useState, useEffect } from 'react';
import { DemoId } from '../types';
import { COURSE_MODULES } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import ModuleIntroSequence from './ModuleIntroSequence';

// Lazily import all demo components
const WavesDemo = lazy(() => import('./demos/WavesDemo'));
const TransducersDemo = lazy(() => import('./demos/TransducersDemo'));
const DopplerDemo = lazy(() => import('./demos/DopplerDemo'));
const PulsedWaveDemo = lazy(() => import('./demos/PulsedWaveDemo'));
const ArtifactsDemo = lazy(() => import('./demos/ArtifactsDemo'));
const HemodynamicsDemo = lazy(() => import('./demos/HemodynamicsDemo'));
const QualityAssuranceDemo = lazy(() => import('./demos/QualityAssuranceDemo'));
const ResolutionDemo = lazy(() => import('./demos/ResolutionDemo'));
const HarmonicsDemo = lazy(() => import('./demos/HarmonicsDemo'));
const ContrastAgentsDemo = lazy(() => import('./demos/ContrastAgentsDemo'));
const SafetyDemo = lazy(() => import('./demos/SafetyDemo'));
const TgcDemo = lazy(() => import('./demos/TgcDemo'));
const DynamicRangeDemo = lazy(() => import('./demos/DynamicRangeDemo'));
const ProcessingDemo = lazy(() => import('./demos/ProcessingDemo'));
const StudyGuideDemo = lazy(() => import('./demos/StudyGuideDemo'));
const ElastographyDemo = lazy(() => import('./demos/ElastographyDemo'));
const ThreeDDemo = lazy(() => import('./demos/ThreeDDemo'));
const AdvancedArtifactsDemo = lazy(() => import('./demos/AdvancedArtifactsDemo'));
const KnobologyDemo = lazy(() => import('./demos/KnobologyDemo'));
const BiomedicalPhysicsDemo = lazy(() => import('./demos/BiomedicalPhysicsDemo'));
const AbdominalDemo = lazy(() => import('./demos/AbdominalDemo'));
const VascularDemo = lazy(() => import('./demos/VascularDemo'));
const MSKDemo = lazy(() => import('./demos/MSKDemo'));
const CardiacDemo = lazy(() => import('./demos/CardiacDemo'));
const ComingSoonDemo = lazy(() => import('./demos/ComingSoonDemo'));
const JeopardyDemo = lazy(() => import('./demos/JeopardyDemo'));
const SpiMockExamDemo = lazy(() => import('./demos/SpiMockExamDemo'));
const ClinicalCaseDemo = lazy(() => import('./demos/ClinicalCaseDemo'));
const AIHistoryDemo = lazy(() => import('./demos/AIHistoryDemo'));

interface ModuleViewProps {
  moduleId: DemoId;
  onClose: () => void;
  onNavigate: (newModuleId: DemoId) => void;
}

const ModuleNavigation: React.FC<{ currentModuleId: DemoId; onNavigate: (newModuleId: DemoId) => void; }> = ({ currentModuleId, onNavigate }) => {
    const currentIndex = COURSE_MODULES.findIndex(m => m.id === currentModuleId);
    
    if (currentIndex === -1) return null;

    const prevModule = currentIndex > 0 ? COURSE_MODULES[currentIndex - 1] : null;
    const nextModule = currentIndex < COURSE_MODULES.length - 1 ? COURSE_MODULES[currentIndex + 1] : null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/10"
        >
            {prevModule ? (
                <button 
                    onClick={() => onNavigate(prevModule.id)} 
                    className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-[#151515] hover:bg-[#1a1a1a] hover:border-[var(--gold)]/30 hover:shadow-lg hover:shadow-[var(--gold)]/5 transition-all group w-full text-left"
                >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-black transition-colors shrink-0 border border-white/5 group-hover:border-[var(--gold)]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1 group-hover:text-[var(--gold)] transition-colors">Previous Module</span>
                        <span className="block text-base font-bold text-white truncate">{prevModule.title}</span>
                    </div>
                </button>
            ) : <div />}
            
            {nextModule ? (
                 <button 
                    onClick={() => onNavigate(nextModule.id)} 
                    className="flex items-center justify-end gap-4 p-5 rounded-2xl border border-white/5 bg-[#151515] hover:bg-[#1a1a1a] hover:border-[var(--gold)]/30 hover:shadow-lg hover:shadow-[var(--gold)]/5 transition-all group w-full text-right"
                >
                    <div className="min-w-0">
                        <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-1 group-hover:text-[var(--gold)] transition-colors">Next Module</span>
                        <span className="block text-base font-bold text-white truncate">{nextModule.title}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--gold)] group-hover:text-black transition-colors shrink-0 border border-white/5 group-hover:border-[var(--gold)]/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                </button>
            ) : <div />}
        </motion.div>
    );
};

const getCategory = (status: string) => {
    if (['Clinical', 'New!'].includes(status)) return 'Clinical';
    if (['Game', 'Challenge', 'Resource', 'Professional'].includes(status)) return 'Practice';
    return 'Physics';
};

const ModuleView: React.FC<ModuleViewProps> = ({ moduleId, onClose, onNavigate }) => {
  const [showIntro, setShowIntro] = useState(true);

  // Reset intro when module changes
  useEffect(() => {
      setShowIntro(true);
  }, [moduleId]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  const moduleInfo = COURSE_MODULES.find(m => m.id === moduleId);

  if (!moduleInfo) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-screen">
        <h2 className="text-red-500 font-bold text-2xl mb-4">Module not found.</h2>
        <button onClick={onClose} className="text-sm bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const category = getCategory(moduleInfo.status);

  const renderDemoComponent = () => {
    switch (moduleId) {
        case 'waves': return <WavesDemo />;
        case 'transducers': return <TransducersDemo />;
        case 'doppler': return <DopplerDemo />;
        case 'pulsed': return <PulsedWaveDemo />;
        case 'tgc': return <TgcDemo />;
        case 'dynamic_range': return <DynamicRangeDemo />;
        case 'processing': return <ProcessingDemo />;
        case 'artifacts': return <ArtifactsDemo />;
        case 'safety': return <SafetyDemo />;
        case 'hemodynamics': return <HemodynamicsDemo />;
        case 'qa': return <QualityAssuranceDemo />;
        case 'resolution': return <ResolutionDemo />;
        case 'harmonics': return <HarmonicsDemo />;
        case 'contrast_agents': return <ContrastAgentsDemo />;
        case 'study_guide': return <StudyGuideDemo />;
        case 'elastography': return <ElastographyDemo />;
        case '3d_4d': return <ThreeDDemo />;
        case 'advanced_artifacts': return <AdvancedArtifactsDemo />;
        case 'knobology': return <KnobologyDemo />;
        case 'biomedical_physics': return <BiomedicalPhysicsDemo />;
        case 'abdominal': return <AbdominalDemo />;
        case 'vascular': return <VascularDemo />;
        case 'msk': return <MSKDemo />;
        case 'cardiac': return <CardiacDemo />;
        case 'jeopardy': return <JeopardyDemo />;
        case 'spi_mock_exam': return <SpiMockExamDemo onNavigate={onNavigate} />;
        case 'clinical_case_simulator': return <ClinicalCaseDemo />;
        case 'ai_history': return <AIHistoryDemo />;
        default: return <ComingSoonDemo moduleName={moduleInfo.title} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative">
        <AnimatePresence>
            {showIntro && (
                <ModuleIntroSequence 
                    key="intro" 
                    moduleId={moduleId} 
                    onComplete={() => setShowIntro(false)} 
                />
            )}
        </AnimatePresence>

        {/* Sticky Header Bar - Refined */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-40 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
        >
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 hover:border-[var(--gold)]/50 transition-all group shrink-0"
                        title="Back to Dashboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white/50 group-hover:text-[var(--gold)] transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <div className="h-6 w-[1px] bg-white/10"></div>
                    <div className="min-w-0 flex flex-col justify-center">
                        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-white/40 mb-0.5">
                            <span onClick={onClose} className="hover:text-[var(--gold)] cursor-pointer transition-colors">Dashboard</span>
                            <span className="text-white/20">/</span>
                            <span>{category}</span>
                        </div>
                        <h1 className="text-sm sm:text-base font-bold text-white leading-none truncate tracking-tight">
                            {moduleInfo.title}
                        </h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                     <span className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${moduleInfo.status === 'Premium' ? 'text-[var(--gold)] border-[var(--gold)]/30 bg-[var(--gold)]/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10'}`}>
                        {moduleInfo.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest hidden sm:inline-block">
                        ID: {moduleInfo.id.toUpperCase()}
                    </span>
                </div>
            </div>
        </motion.div>

        {/* Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-[#0f0f0f]/50 border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden min-h-[calc(100vh-140px)] flex flex-col"
            >
                 {/* Background noise texture for subtle depth */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                 
                 <div className="relative z-10 demo-content space-y-8 flex-grow">
                    <Suspense fallback={<LoadingSpinner />}>
                      {renderDemoComponent()}
                    </Suspense>
                </div>

                {/* Navigation Footer */}
                <ModuleNavigation currentModuleId={moduleId} onNavigate={onNavigate} />
            </motion.div>
        </main>
    </div>
  );
};

export default ModuleView;
