
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { CourseModuleData } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { spiCoursesExpanded } from '../spi-course-data';
import EchoBotMascot from './EchoBotMascot';

interface AIAssistantProps {
  activeModule: CourseModuleData | null;
}

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

// Helper to extract text from React Elements
function extractTextFromContent(content: any): string {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content === 'number') return String(content);
    if (Array.isArray(content)) return content.map(extractTextFromContent).join(' ');
    
    if (React.isValidElement(content)) {
        const props = content.props as any;
        if (props.children) {
            return extractTextFromContent(props.children);
        }
    }
    return '';
}

const ID_MAPPING: Record<string, string> = {
    'waves': '1', 'transducers': '2', 'pulsed': '3', 'doppler': '4', 'artifacts': '5', 'safety': '6',
    'hemodynamics': '7', 'qa': '8', 'resolution': '9', 'harmonics': '10', 'processing': '11',
};

const getModuleContent = (activeModule: CourseModuleData | null): string => {
    if (!activeModule) return "The user is on the main learning dashboard. They have access to all modules but are not currently viewing specific content.";
    
    const moduleId = activeModule.id;
    const mappedId = ID_MAPPING[moduleId];
    let richContent = '';

    if (mappedId) {
        const module = spiCoursesExpanded.courses[0].modules.find(m => m.id === mappedId);
        if (module) {
            richContent += `CURRENT MODULE: ${module.title}\nSUMMARY: ${module.description}\n\nCONTENT DETAIL:\n`;
            module.topics.forEach(topic => {
                const textContent = extractTextFromContent(topic.content);
                richContent += `[Topic: ${topic.title}]\nKey Points: ${topic.keyPoints.join('; ')}\nExam Focus: ${topic.examFocus}\nDetails: ${textContent}\n\n`;
            });
        }
    }

    if (!richContent) {
        // Fallback for modules not in the detailed data structure
        richContent += `CURRENT MODULE: ${activeModule.title}\nDESCRIPTION: ${activeModule.description}\n`;
        if (activeModule.features && activeModule.features.length > 0) {
            richContent += `FEATURES: ${activeModule.features.join(', ')}\n`;
        }
    }
    return richContent;
};

const BotIcon = ({ isThinking }: { isThinking?: boolean }) => (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[var(--gold)]/30 text-[var(--gold)] flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.1)] relative overflow-hidden`}>
        {isThinking && (
            <div className="absolute inset-0 bg-[var(--gold)]/20 animate-pulse rounded-full" />
        )}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.684-2.684l-1.938-.648 1.938-.648a3.375 3.375 0 002.684-2.684l.648-1.938.648 1.938a3.375 3.375 0 00-2.684 2.684z" />
        </svg>
    </div>
);

const UserIcon = () => (
     <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const AIAssistant: React.FC<AIAssistantProps> = ({ activeModule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  // Initialize Chat Session
  useEffect(() => {
    const moduleContent = getModuleContent(activeModule);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const systemInstruction = `You are EchoBot, an elite AI tutor specializing in diagnostic ultrasound physics and instrumentation for the SPI exam.

    ROLE & TONE:
    - You are professional, encouraging, and precise.
    - Explain complex physics concepts using simple analogies (e.g., comparing blood flow to a river, voltage to water pressure).
    - If the user asks about a specific topic available in the CONTEXT below, strictly use that information to ensure consistency.
    - If the user asks a general ultrasound question not in the context, use your general expert knowledge.
    - Keep responses concise (under 3-4 sentences) unless the user specifically asks for a detailed explanation.
    
    CURRENT CONTEXT (The user is viewing this content):
    ${moduleContent}
    `;

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
    });
    
    // Optional: Reset history when switching modules to keep context fresh? 
    // For now, we keep history so they can refer back, but the system instruction updates.
  }, [activeModule]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;
    
    const userMsg = input;
    const newUserMessage: ChatMessage = { role: 'user', content: userMsg };
    
    setHistory(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // Stream the response for faster feedback
        const result = await chatRef.current.sendMessageStream({ message: userMsg });
        
        let fullResponse = "";
        
        // Add a placeholder message for the model
        setHistory(prev => [...prev, { role: 'model', content: '' }]);

        for await (const chunk of result) {
            const chunkText = chunk.text;
            if (chunkText) {
                fullResponse += chunkText;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMsg = newHistory[newHistory.length - 1];
                    if (lastMsg.role === 'model') {
                        lastMsg.content = fullResponse;
                    }
                    return newHistory;
                });
            }
        }
    } catch (e) {
      console.error(e);
      setHistory(prev => [...prev, { role: 'model', content: 'Signal interference detected. Please re-transmit your query.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
      setHistory([]);
  };

  return (
    <>
      {/* Floating Trigger Button with Mascot */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-16 h-16 rounded-full flex items-center justify-center z-[100] transition-all duration-300 drop-shadow-2xl"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        <div className={`relative w-full h-full rounded-full flex items-center justify-center transition-all ${
            isOpen 
            ? 'bg-[#0f0f0f] border-2 border-[var(--gold)]' 
            : 'bg-gradient-to-b from-[#1a1a1a] to-black border border-white/10'
        }`}>
            {/* If open, show close icon, else show the mascot */}
            {isOpen ? (
                <span className="text-xl sm:text-2xl text-[var(--gold)]">✕</span>
            ) : (
                <EchoBotMascot size={48} isThinking={isLoading} />
            )}
            
            {/* Notification Badge if bot has message/thinking? (Optional) */}
            {!isOpen && isLoading && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-4 sm:bottom-28 sm:right-8 w-[95vw] sm:w-[90vw] max-w-[400px] h-[60vh] sm:h-[600px] sm:max-h-[75vh] bg-[#0a0a0a]/95 backdrop-blur-xl border border-[var(--gold)]/20 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.7)] flex flex-col z-[99] overflow-hidden ring-1 ring-white/10"
          >
            {/* Header */}
            <header className="flex-shrink-0 p-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="scale-75 origin-left">
                    <EchoBotMascot size={40} isThinking={isLoading} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white tracking-wide">EchoBot <span className="text-[var(--gold)]/80 text-[10px] ml-1 align-top">Active</span></h3>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider truncate max-w-[150px]">
                    Ctx: {activeModule?.title.substring(0, 15) || 'DASHBOARD'}...
                  </p>
                </div>
              </div>
              {history.length > 0 && (
                  <button onClick={handleClearChat} className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest px-2 py-1 hover:bg-white/10 rounded">
                      Clear
                  </button>
              )}
            </header>
            
            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {history.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/30 p-4">
                      <div className="opacity-50 grayscale mb-4">
                          <EchoBotMascot size={80} />
                      </div>
                      <p className="text-sm font-medium text-white/60">Neural Link Established</p>
                      <p className="text-xs mt-2 max-w-[220px] leading-relaxed">
                          I can explain physics concepts, analyze specific modules, or quiz you on key terms.
                      </p>
                  </div>
              )}
              {history.map((msg, index) => (
                <div key={index} className={`flex gap-3 items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && <div className="mb-1 scale-75 origin-bottom-left"><EchoBotMascot size={32} /></div>}
                  <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-[var(--gold)] text-black font-medium rounded-br-none' 
                      : 'bg-white/10 border border-white/5 text-white/90 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                   {msg.role === 'user' && <div className="mb-1"><UserIcon /></div>}
                </div>
              ))}
              {isLoading && (
                   <div className="flex gap-3 items-end justify-start">
                      <div className="mb-1 scale-75 origin-bottom-left"><EchoBotMascot size={32} isThinking={true} /></div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 flex gap-1 items-center h-[44px]">
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                  </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <footer className="flex-shrink-0 p-3 bg-[#0a0a0a]/80 border-t border-white/10 backdrop-blur-md">
              <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 focus-within:border-[var(--gold)]/50 focus-within:bg-black/40 transition-all shadow-inner">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a physics question..."
                  className="flex-grow bg-transparent px-3 text-white placeholder-white/30 focus:outline-none text-sm"
                  disabled={isLoading}
                  autoFocus
                />
                <button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()} 
                    className="w-9 h-9 flex items-center justify-center bg-[var(--gold)] text-black rounded-xl hover:bg-[#b08d2f] transition-colors disabled:opacity-50 disabled:bg-white/10 disabled:text-white/20 shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform rotate-90">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
