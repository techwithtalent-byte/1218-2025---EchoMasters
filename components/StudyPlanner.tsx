
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Priority, StudyTask } from '../types';

const PRIORITY_CONFIG: Record<Priority, { color: string, border: string, label: string }> = {
    'High': { color: 'text-red-400', border: 'border-l-red-500', label: 'PRIORITY: ALPHA' },
    'Medium': { color: 'text-yellow-400', border: 'border-l-yellow-500', label: 'PRIORITY: BETA' },
    'Low': { color: 'text-blue-400', border: 'border-l-blue-500', label: 'PRIORITY: GAMMA' },
};

const TaskItem: React.FC<{ task: StudyTask }> = ({ task }) => {
    const { toggleStudyTask, deleteStudyTask } = useUser();
    const config = PRIORITY_CONFIG[task.priority];
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
            className={`group relative flex items-start p-3 mb-2 rounded border border-white/5 transition-all duration-300 ${
                task.isCompleted 
                    ? 'bg-black/20 opacity-50 grayscale' 
                    : 'bg-[#151515] hover:bg-[#1a1a1a] hover:border-white/10'
            }`}
        >
            {/* Custom Checkbox */}
            <button
                onClick={() => toggleStudyTask(task.id)}
                className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center transition-all duration-300 mr-3 ${
                    task.isCompleted 
                        ? 'bg-[var(--gold)] border-[var(--gold)]' 
                        : 'border-white/20 hover:border-white/60 bg-black/40'
                }`}
            >
                {task.isCompleted && (
                    <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            <div className="flex-grow min-w-0 mr-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${config.color}`}>
                        {config.label}
                    </span>
                    {task.isCompleted && <span className="text-[9px] text-green-500 font-mono font-bold uppercase tracking-wider">/ EXECUTED</span>}
                </div>
                <p className={`text-xs sm:text-sm font-medium leading-snug transition-all ${task.isCompleted ? 'text-white/30 line-through decoration-white/20' : 'text-white/90'}`}>
                    {task.text}
                </p>
            </div>

            <button 
                onClick={() => deleteStudyTask(task.id)} 
                className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all hover:bg-white/5 rounded"
                title="Abort Task"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
};

const StudyPlanner: React.FC = () => {
    const { userProfile, addStudyTask } = useUser();
    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Medium');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addStudyTask(newTaskText.trim(), newTaskPriority);
            setNewTaskText('');
        }
    };
    
    const { sortedTasks, progress } = useMemo(() => {
        const tasks = userProfile?.studyTasks || [];
        const total = tasks.length;
        const completed = tasks.filter(t => t.isCompleted).length;
        const progress = total === 0 ? 0 : (completed / total) * 100;

        const priorityOrder: Record<Priority, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
        const sorted = [...tasks].sort((a, b) => {
            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
            if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
            return 0;
        });

        return { sortedTasks: sorted, progress };
    }, [userProfile?.studyTasks]);

    return (
        <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden shadow-xl group">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide uppercase">
                        <span className="text-[var(--gold)] text-lg">⚡</span> Mission Log
                    </h2>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2 h-1 rounded-sm transition-colors duration-500 ${
                                    (progress / 20) > i ? 'bg-[var(--gold)] shadow-[0_0_5px_var(--gold)]' : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-[9px] font-mono text-white/40">{Math.round(progress)}% COMPLETE</span>
                </div>
            </div>

            {/* Command Line Input */}
            <form onSubmit={handleSubmit} className="mb-5 relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="relative group flex items-center bg-black/60 border border-white/10 rounded-lg focus-within:border-[var(--gold)]/50 transition-colors">
                        <div className="pl-3 flex-shrink-0 pointer-events-none">
                            <span className="text-[var(--gold)] font-mono text-sm font-bold">{'>'}</span>
                        </div>
                        <input 
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Input directive..."
                            className="flex-grow bg-transparent p-2.5 text-white text-xs sm:text-sm focus:outline-none font-mono placeholder-white/30"
                        />
                        <button 
                            type="submit" 
                            disabled={!newTaskText.trim()}
                            className="mr-1 px-3 py-1 bg-[var(--gold)] text-black rounded-md text-[10px] font-bold hover:bg-[#b08d2f] disabled:opacity-0 disabled:scale-95 transition-all uppercase tracking-wider shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                        >
                            Exec
                        </button>
                    </div>
                    
                    {/* Priority Toggles */}
                    <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                        {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setNewTaskPriority(p)}
                                className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all ${
                                    newTaskPriority === p
                                        ? `${PRIORITY_CONFIG[p].color} bg-white/10 shadow-inner`
                                        : 'text-white/20 hover:text-white/50'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </form>

            {/* Task Grid */}
            <div className="flex-grow overflow-y-auto pr-1 -mr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map(task => <TaskItem key={task.id} task={task} />)
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                            <div className="w-12 h-12 border border-dashed border-white/50 rounded flex items-center justify-center mb-2">
                                <span className="text-xl font-mono">+</span>
                            </div>
                            <p className="text-[10px] font-mono uppercase tracking-widest">Awaiting Directives</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudyPlanner;
