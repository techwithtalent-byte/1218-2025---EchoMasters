
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseModule from './CourseModule';
import { COURSE_MODULES } from '../constants';
import { DemoId, UserProfile } from '../types';

export type FilterType = 'All' | 'In Progress' | 'Completed' | 'Premium' | 'Clinical' | 'Advanced' | 'New!' | 'Professional' | 'Resource' | 'Game' | 'Challenge';

interface CourseGridProps {
    activeFilter: FilterType;
    onModuleClick: (moduleId: DemoId) => void;
    userProfile: UserProfile | null;
}

const CourseGrid: React.FC<CourseGridProps> = ({ activeFilter, onModuleClick, userProfile }) => {
    const filteredModules = useMemo(() => {
        const completed = userProfile?.completedModules || [];
        switch (activeFilter) {
            case 'In Progress':
                return COURSE_MODULES.filter(m => !completed.includes(m.id));
            case 'Completed':
                return COURSE_MODULES.filter(m => completed.includes(m.id));
            case 'Premium':
                return COURSE_MODULES.filter(m => ['Premium', 'Interactive'].includes(m.status));
            case 'Advanced':
            case 'Clinical':
            case 'New!':
            case 'Professional':
            case 'Resource':
            case 'Game':
            case 'Challenge':
                 return COURSE_MODULES.filter(m => m.status === activeFilter);
            case 'All':
            default:
                return COURSE_MODULES;
        }
    }, [activeFilter, userProfile]);

    return (
        <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pb-12 relative"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {filteredModules.map((module) => {
                    let score: number | undefined;
                    if (module.id === 'spi_mock_exam') {
                        score = userProfile?.quizScores.spiMockExam;
                    } else if (module.id === 'study_guide' || module.id === 'jeopardy') {
                        score = userProfile?.quizScores.spi;
                    }

                    return (
                        <motion.div
                            key={module.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            transition={{
                                layout: { duration: 0.3, ease: "easeInOut" },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 },
                                y: { duration: 0.2 }
                            }}
                            className="h-full"
                        >
                            <CourseModule
                                {...module}
                                isCompleted={userProfile?.completedModules.includes(module.id)}
                                score={score}
                                onClick={() => onModuleClick(module.id)}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
            
            {filteredModules.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="py-20 text-center col-span-full border border-dashed border-white/10 rounded-2xl bg-white/5"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <span className="text-4xl opacity-50 grayscale">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Modules Found</h3>
                    <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                        We couldn't find any modules matching the <span className="text-[var(--gold)]">"{activeFilter}"</span> filter. Try switching to "All" or a different category.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CourseGrid;
