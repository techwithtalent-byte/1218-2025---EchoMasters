
import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from '../../utils/audio';

// Global AudioContext and source ref to manage playback and ensure only one narration plays at a time.
let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

const NARRATION_CACHE_KEY_PREFIX = 'echoMastersNarrationCache_v4'; // Updated for new teacher format

const SpeakerIcon: React.FC<React.SVGProps<SVGSVGElement> & { isNarrating: boolean }> = ({ isNarrating, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        {isNarrating ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 21.75l-3.75-3.75H4.5a1.5 1.5 0 01-1.5-1.5V7.5a1.5 1.5 0 011.5-1.5h3.75l3.75-3.75M12.75 6.375v9.25" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        )}
    </svg>
);


interface DemoSectionProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, description, children }) => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [status, setStatus] = useState<string | null>(null); // 'generating_script' | 'synthesizing_audio' | null
  const [error, setError] = useState<string | null>(null);

  const handleNarration = async () => {
      if (isNarrating) {
          if (currentSource) {
              currentSource.stop();
              currentSource.onended = null; // Prevent onended from firing on manual stop
          }
          currentSource = null;
          setIsNarrating(false);
          setStatus(null);
          return;
      }

      setIsNarrating(true);
      setError(null);

      const playAudio = async (base64Audio: string) => {
          if (!audioContext || audioContext.state === 'closed') {
              audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          if(audioContext.state === 'suspended') {
              await audioContext.resume();
          }

          const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
          
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();

          currentSource = source;
          source.onended = () => {
              if (currentSource === source) {
                  setIsNarrating(false);
                  currentSource = null;
                  setStatus(null);
              }
          };
      };
      
      try {
          if (currentSource) {
              currentSource.stop();
              currentSource.onended = null;
          }
          
          const sanitizeKey = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '_');
          const cacheKey = `${NARRATION_CACHE_KEY_PREFIX}_${sanitizeKey(title)}`;
          const cachedAudio = localStorage.getItem(cacheKey);

          if (cachedAudio) {
              await playAudio(cachedAudio);
              return;
          }

          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

          // --- STAGE 1: Generate the Teacher Script ---
          setStatus("Drafting Lesson...");
          
          const teacherPrompt = `
            You are an expert Ultrasound Physics Professor teaching a class. 
            Topic: "${title}"
            Context: "${description}"

            Generate a spoken-word lecture script (for Text-to-Speech) that is educational, engaging, and structured. 
            Do NOT simply repeat the description. 
            
            Follow this EXACT 9-step structure for the script:
            1. The "Time-Saver" Hook: Quantify the effort you saved them (e.g., "I read the 500-page physics textbook so you don't have to, here is the cliffnotes version...").
            2. The "Active Learning" Promise: Tell them there is a quiz/assessment at the end of this audio.
            3. The Structured Roadmap: Briefly list the 3 modules we will cover (Definitions, Concepts, Application).
            4. Definition via Negation: Define the topic by explaining what it is NOT first.
            5. The Mnemonic Device: Create a clever, funny, or memorable acronym/phrase to remember the core concept.
            6. The Analogy: Use a "Human-in-the-loop" or pop-culture analogy to explain the technical physics.
            7. Practical Implementation: Explain how to use this on the machine/knobology (No code, just practical machine use).
            8. Mindset Shift: A quick sentence on discipline/systems (e.g., "Consistency beats intensity").
            9. The Assessment: Ask 1 specific question to test them (do not give the answer, ask them to think about it).

            Tone: Energetic, authoritative but accessible, like a favorite professor.
            Format: Plain text only. No markdown, no bullet points, no headers. Just the spoken words.
            Length: Keep it concise (approx 200-250 words).
          `;

          const scriptResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: [{ parts: [{ text: teacherPrompt }] }],
          });

          const generatedScript = scriptResponse.text;
          
          if (!generatedScript) throw new Error("Failed to generate script");

          // --- STAGE 2: Synthesize Audio ---
          setStatus("Synthesizing Voice...");

          const audioResponse = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: [{ parts: [{ text: generatedScript }] }],
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                      voiceConfig: {
                          prebuiltVoiceConfig: { voiceName: 'Charon' }, // Deep, authoritative voice matches the persona
                      },
                  },
              },
          });

          const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio) {
              try {
                  localStorage.setItem(cacheKey, base64Audio);
              } catch (e) {
                  console.error("Failed to save narration to localStorage. It may be full.", e);
              }
              setStatus("Playing...");
              await playAudio(base64Audio);
          } else {
              throw new Error("No audio data received from API.");
          }
      } catch (err: any) {
          console.error("Narration error:", err);
          setIsNarrating(false);
          currentSource = null;
          setStatus(null);

          let errorMessage = "Narration unavailable.";
          
          const errString = String(err);
          const isQuota = 
            err.status === 429 || 
            err.status === 'RESOURCE_EXHAUSTED' || 
            err.error?.code === 429 || 
            err.error?.status === 'RESOURCE_EXHAUSTED' ||
            errString.includes('429') || 
            errString.includes('RESOURCE_EXHAUSTED') || 
            errString.includes('quota');

          const isNetwork = 
            errString.includes('NetworkError') || 
            errString.includes('Failed to fetch') ||
            errString.includes('connection');

          if (isQuota) {
              errorMessage = "Daily audio limit reached. Please check your API plan or try again later.";
          } else if (isNetwork) {
              errorMessage = "Network issue detected. Please check your connection.";
          } else {
              errorMessage = "Audio generation failed. Please try again.";
          }

          setError(errorMessage);
          setTimeout(() => setError(null), 5000); // Clear error message after 5s
      }
  };


  const emojiRegex = /^\p{Emoji_Presentation}/u;
  const match = title.match(emojiRegex);
  const icon = match ? match[0] : null;
  const restOfTitle = icon ? title.substring(icon.length).trim() : title;

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--gold)]/30 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]">
      {/* Tech Decoration: Corner Accents */}
      <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none opacity-50">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--gold)]/50 to-transparent"></div>
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[var(--gold)]/50 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-50 rotate-180">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--gold)]/50 to-transparent"></div>
          <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-[var(--gold)]/50 to-transparent"></div>
      </div>

      <div className="p-6 relative z-10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-xl font-bold flex items-center gap-3">
                {icon && <span className="text-2xl [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.5))]">{icon}</span>}
                <span className="text-white group-hover:text-[var(--gold)] transition-colors text-shadow-sm">{restOfTitle}</span>
            </h3>
            <div className="flex flex-col items-end gap-1">
                <button 
                    onClick={handleNarration} 
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
                        isNarrating 
                            ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse-narrate' 
                            : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                    aria-label={isNarrating ? "Stop Lesson" : "Start Audio Lesson"}
                >
                    <SpeakerIcon isNarrating={isNarrating} className="w-4 h-4" />
                    <span className="hidden sm:inline">{isNarrating ? 'End Class' : 'Start Lesson'}</span>
                </button>
                {status && isNarrating && (
                    <span className="text-[9px] text-[var(--gold)] font-mono animate-pulse uppercase tracking-wide">
                        {status}
                    </span>
                )}
            </div>
          </div>
           {error && <p className="text-xs text-red-400 text-right font-medium animate-pulse">{error}</p>}
          <p className="text-white/70 text-sm leading-relaxed max-w-4xl">{description}</p>
      </div>
      
      {children && (
          <div className="p-6 pt-0">
              <div className="bg-[#151515] rounded-xl border border-white/5 p-6 shadow-inner relative overflow-hidden group/simulation">
                  {/* Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  {/* Subtle Status Indicator */}
                  <div className="absolute top-3 right-4 text-[10px] font-mono text-[var(--gold)]/20 uppercase tracking-widest pointer-events-none group-hover/simulation:text-[var(--gold)]/40 transition-colors">
                      Simulation Active
                  </div>

                  <div className="relative z-10">
                    {children}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DemoSection;
