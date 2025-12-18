
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import ControlButton from './ControlButton';
import DemoSection from './DemoSection';

// --- Types ---
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Category = 'Basics' | 'Transducers' | 'Doppler' | 'Artifacts' | 'Safety';

interface Question {
    id: string;
    value: number;
    question: string;
    options: string[];
    answer: number; // Index of correct option
    explanation: string;
}

interface GameData {
    [key: string]: { // Difficulty
        [key: string]: Question[]; // Category -> Questions
    };
}

// --- Data ---
const GAME_DATA: GameData = {
    Beginner: {
        Basics: [
            { id: 'b-ba-100', value: 100, question: 'What is the frequency range of diagnostic ultrasound?', options: ['20-20,000 Hz', '> 20,000 Hz', '2-15 MHz', '< 20 Hz'], answer: 2, explanation: 'Diagnostic ultrasound typically uses frequencies between 2 MHz and 15 MHz.' },
            { id: 'b-ba-200', value: 200, question: 'What is the average speed of sound in soft tissue?', options: ['1,540 m/s', '1,450 m/s', '330 m/s', '4,080 m/s'], answer: 0, explanation: 'The ultrasound machine assumes a propagation speed of 1,540 m/s (1.54 mm/µs) for soft tissue.' },
            { id: 'b-ba-300', value: 300, question: 'Which parameter is determined by both the source and the medium?', options: ['Frequency', 'Period', 'Wavelength', 'Propagation Speed'], answer: 2, explanation: 'Wavelength (λ) is determined by both the source (frequency) and the medium (speed): λ = c/f.' },
            { id: 'b-ba-400', value: 400, question: 'As frequency increases, what happens to penetration?', options: ['Increases', 'Decreases', 'Stays the same', 'Doubles'], answer: 1, explanation: 'High frequency sound is attenuated more quickly, reducing penetration depth.' },
        ],
        Transducers: [
            { id: 'b-tr-100', value: 100, question: 'Which component converts electrical energy to sound energy?', options: ['Matching Layer', 'Backing Material', 'PZT Crystal', 'Lens'], answer: 2, explanation: 'The Piezoelectric (PZT) crystal converts electricity to sound (transmission) and sound to electricity (reception).' },
            { id: 'b-tr-200', value: 200, question: 'Which transducer produces a rectangular image?', options: ['Linear Sequential', 'Curvilinear', 'Phased Array', 'Mechanical Sector'], answer: 0, explanation: 'Linear sequential arrays fire elements in parallel groups, creating a rectangular field of view.' },
            { id: 'b-tr-300', value: 300, question: 'What is the purpose of gel?', options: ['Cool the patient', 'Remove air', 'Clean the probe', 'Anesthetize skin'], answer: 1, explanation: 'Gel removes the air between the transducer and skin, which would otherwise reflect almost all the sound.' },
            { id: 'b-tr-400', value: 400, question: 'Which part improves axial resolution by shortening the pulse?', options: ['Matching Layer', 'Backing Material', 'Lens', 'Case'], answer: 1, explanation: 'Backing (damping) material stops the crystal from ringing, creating short pulses needed for good axial resolution.' },
        ],
        Doppler: [
            { id: 'b-do-100', value: 100, question: 'What does BART stand for?', options: ['Blue Away Red Towards', 'Blood Artery Red Time', 'Blue Artery Red Towards', 'Base Above Red Top'], answer: 0, explanation: 'BART is the standard convention: Blue represents flow Away from the probe, Red represents flow Towards.' },
            { id: 'b-do-200', value: 200, question: 'A positive Doppler shift means blood is moving...', options: ['Away', 'Towards', 'Perpendicular', 'Turbulently'], answer: 1, explanation: 'A positive shift occurs when the received frequency is higher than transmitted, indicating motion towards the source.' },
            { id: 'b-do-300', value: 300, question: 'Which angle provides the most accurate velocity measurement?', options: ['90 degrees', '60 degrees', '45 degrees', '0 degrees'], answer: 3, explanation: 'The cosine of 0 degrees is 1, providing the full, true velocity. 90 degrees provides no shift.' },
            { id: 'b-do-400', value: 400, question: 'What artifact occurs when the Nyquist limit is exceeded?', options: ['Shadowing', 'Aliasing', 'Reverberation', 'Mirror Image'], answer: 1, explanation: 'Aliasing is the wrapping around of the spectral waveform when the Doppler shift exceeds PRF/2.' },
        ],
        Artifacts: [
            { id: 'b-ar-100', value: 100, question: 'What artifact is seen behind a gallstone?', options: ['Enhancement', 'Shadowing', 'Comet Tail', 'Mirror Image'], answer: 1, explanation: 'Stones are highly attenuating/reflecting, preventing sound from passing, creating a shadow.' },
            { id: 'b-ar-200', value: 200, question: 'What artifact is seen behind a simple cyst?', options: ['Enhancement', 'Shadowing', 'Reverberation', 'Side Lobe'], answer: 0, explanation: 'Fluid attenuates less than surrounding tissue, so echoes behind it are stronger (brighter).' },
            { id: 'b-ar-300', value: 300, question: 'Which artifact looks like a ladder?', options: ['Reverberation', 'Mirror Image', 'Shadowing', 'Speed Error'], answer: 0, explanation: 'Reverberation creates multiple, equally spaced echoes caused by bouncing between two reflectors.' },
            { id: 'b-ar-400', value: 400, question: 'Where is a mirror image artifact located?', options: ['Shallower', 'Deeper', 'Lateral', 'Medial'], answer: 1, explanation: 'The artifact is always placed deeper than the true reflector because of the extra time the pulse took to bounce.' },
        ],
        Safety: [
            { id: 'b-sa-100', value: 100, question: 'What does ALARA stand for?', options: ['As Low As Reasonably Achievable', 'Always Leave Area Radiation Absent', 'All Levels Are Right Always', 'Acoustic Level And Rate Average'], answer: 0, explanation: 'Use the lowest power and shortest time necessary to get a diagnostic image.' },
            { id: 'b-sa-200', value: 200, question: 'Which index relates to tissue heating?', options: ['MI', 'TI', 'PI', 'RI'], answer: 1, explanation: 'The Thermal Index (TI) estimates the potential for tissue temperature rise.' },
            { id: 'b-sa-300', value: 300, question: 'Which index relates to cavitation?', options: ['MI', 'TI', 'PI', 'RI'], answer: 0, explanation: 'The Mechanical Index (MI) estimates the potential for non-thermal bioeffects like cavitation.' },
            { id: 'b-sa-400', value: 400, question: 'Which control affects patient exposure?', options: ['Gain', 'TGC', 'Dynamic Range', 'Output Power'], answer: 3, explanation: 'Output Power determines the intensity of sound sent into the patient. Gain only amplifies the return signal.' },
        ],
    },
    Intermediate: {
        Basics: [
            { id: 'i-ba-100', value: 100, question: 'Attenuation is the sum of reflection, scattering, and...?', options: ['Refraction', 'Absorption', 'Transmission', 'Diffraction'], answer: 1, explanation: 'Absorption (conversion to heat) is the primary component of attenuation.' },
            { id: 'i-ba-200', value: 200, question: 'The attenuation coefficient in soft tissue is approximately?', options: ['0.5 dB/cm/MHz', '1.0 dB/cm/MHz', '2.0 dB/cm/MHz', '10 dB/cm/MHz'], answer: 0, explanation: 'Soft tissue attenuates approx. 0.5 dB for every cm of depth for every MHz of frequency.' },
            { id: 'i-ba-300', value: 300, question: 'Impedance (Z) is calculated as:', options: ['Density x Speed', 'Density / Speed', 'Frequency x Wavelength', 'Power / Area'], answer: 0, explanation: 'Acoustic Impedance (Rayls) = Density (kg/m³) × Propagation Speed (m/s).' },
            { id: 'i-ba-400', value: 400, question: 'Refraction requires oblique incidence and:', options: ['Different Densities', 'Different Impedances', 'Different Speeds', 'Different Temperatures'], answer: 2, explanation: 'Snell\'s Law dictates that refraction occurs only if propagation speeds of the two media differ.' },
        ],
        Transducers: [
            { id: 'i-tr-100', value: 100, question: 'The matching layer thickness is:', options: ['1/2 Wavelength', '1/4 Wavelength', '1 Wavelength', 'Variable'], answer: 1, explanation: '1/4 wavelength thickness causes destructive interference of wall echoes, enhancing transmission.' },
            { id: 'i-tr-200', value: 200, question: 'Which resolution is best in clinical imaging?', options: ['Axial', 'Lateral', 'Elevational', 'Temporal'], answer: 0, explanation: 'Axial resolution (LARRD) is usually the best spatial resolution because pulses are very short.' },
            { id: 'i-tr-300', value: 300, question: 'What improves lateral resolution?', options: ['Damping', 'Focusing', 'Lower Frequency', 'Thicker Crystal'], answer: 1, explanation: 'Focusing narrows the beam width. Lateral resolution is equal to the beam width.' },
            { id: 'i-tr-400', value: 400, question: 'Low Q-factor transducers have:', options: ['Long pulse, narrow bandwidth', 'Short pulse, wide bandwidth', 'High sensitivity', 'No backing material'], answer: 1, explanation: 'Imaging probes use backing material to create short pulses, which results in a wide bandwidth and low Q-factor.' },
        ],
        Doppler: [
            { id: 'i-do-100', value: 100, question: 'The Nyquist limit is equal to:', options: ['PRF', 'PRF / 2', 'PRF x 2', 'Frequency / 2'], answer: 1, explanation: 'Aliasing occurs when the Doppler shift exceeds half the Pulse Repetition Frequency.' },
            { id: 'i-do-200', value: 200, question: 'Which processing technique is used for Spectral Doppler?', options: ['Autocorrelation', 'FFT', 'Demodulation', 'Scan Conversion'], answer: 1, explanation: 'Fast Fourier Transform (FFT) is accurate enough to process the complex individual frequencies in spectral Doppler.' },
            { id: 'i-do-300', value: 300, question: 'Wall filters eliminate:', options: ['High velocity signals', 'Aliased signals', 'Low frequency, high amplitude signals', 'Turbulent flow'], answer: 2, explanation: 'Wall filters (high pass filters) remove the strong, low-shift signals caused by moving vessel walls.' },
            { id: 'i-do-400', value: 400, question: 'What is the advantage of Power Doppler?', options: ['Directional info', 'Velocity measurement', 'Increased sensitivity', 'No flash artifact'], answer: 2, explanation: 'Power Doppler detects amplitude, making it independent of angle and highly sensitive to slow flow.' },
        ],
        Artifacts: [
            { id: 'i-ar-100', value: 100, question: 'Propagation speed error places echoes:', options: ['Laterally displaced', 'At incorrect depths', 'With wrong brightness', 'As multiple lines'], answer: 1, explanation: 'If speed < 1540, echoes arrive late and are placed too deep. If speed > 1540, too shallow.' },
            { id: 'i-ar-200', value: 200, question: 'Which artifact is related to slice thickness?', options: ['Partial Volume', 'Mirror Image', 'Refraction', 'Comet Tail'], answer: 0, explanation: 'Partial volume (slice thickness) artifact fills in anechoic structures when the beam is wider than the structure.' },
            { id: 'i-ar-300', value: 300, question: 'Side lobes and grating lobes degrade:', options: ['Axial resolution', 'Lateral resolution', 'Temporal resolution', 'Contrast resolution'], answer: 1, explanation: 'Lobes send energy off-axis. If they hit a reflector, it is mapped to the main beam axis, widening the apparent structure.' },
            { id: 'i-ar-400', value: 400, question: 'Crosstalk in Doppler looks like:', options: ['Aliasing', 'Mirror Image spectrum', 'Spectral Broadening', 'Wall noise'], answer: 1, explanation: 'Crosstalk appears as an identical Doppler spectrum above and below the baseline, often due to high gain.' },
        ],
        Safety: [
            { id: 'i-sa-100', value: 100, question: 'Transient cavitation is also known as:', options: ['Stable', 'Inertial', 'Thermal', 'Mechanical'], answer: 1, explanation: 'Inertial (transient) cavitation describes the violent collapse of bubbles.' },
            { id: 'i-sa-200', value: 200, question: 'Which mode has the highest typical SPTA intensity?', options: ['B-Mode', 'M-Mode', 'Color Doppler', 'PW Doppler'], answer: 3, explanation: 'PW Doppler concentrates energy in a small gate with a high PRF, leading to the highest temporal average intensity.' },
            { id: 'i-sa-300', value: 300, question: 'A hydrophone measures:', options: ['Total power', 'Pressure amplitude', 'Tissue temp', 'Impedance'], answer: 1, explanation: 'A hydrophone is a small needle probe used to measure pressure at specific locations in the beam.' },
            { id: 'i-sa-400', value: 400, question: 'No bioeffects have been confirmed below an SPTA of:', options: ['1 mW/cm²', '100 mW/cm²', '1 W/cm²', '100 W/cm²'], answer: 1, explanation: 'For an unfocused beam, 100 mW/cm² is the AIUM limit for confirmed bioeffects. (1 W/cm² for focused).' },
        ],
    },
    Advanced: {
        Basics: [
            { id: 'a-ba-100', value: 100, question: 'Which intensity is most relevant to tissue heating?', options: ['SPTP', 'SATP', 'SPTA', 'SATA'], answer: 2, explanation: 'Spatial Peak Temporal Average (SPTA) correlates best with tissue heating effects.' },
            { id: 'a-ba-200', value: 200, question: 'The Duty Factor for continuous wave ultrasound is:', options: ['0.1%', '1%', '50%', '100%'], answer: 3, explanation: 'CW is always on, so the duty factor is 1.0 or 100%.' },
            { id: 'a-ba-300', value: 300, question: 'A 3 dB drop corresponds to a ratio of:', options: ['0.5', '0.25', '0.1', '0.75'], answer: 0, explanation: '-3 dB represents a halving of intensity (1/2 or 0.5).' },
            { id: 'a-ba-400', value: 400, question: 'Snell\'s Law describes:', options: ['Reflection', 'Refraction', 'Scattering', 'Absorption'], answer: 1, explanation: 'Sin(trans)/Sin(inc) = Speed2/Speed1. This governs the angle of refraction.' },
        ],
        Transducers: [
            { id: 'a-tr-100', value: 100, question: 'Apodization reduces:', options: ['Axial resolution', 'Grating lobes', 'Main beam width', 'Pulse length'], answer: 1, explanation: 'Varying the voltage across elements (stronger center, weaker outer) reduces lobe artifacts.' },
            { id: 'a-tr-200', value: 200, question: 'Dynamic Receive Focusing uses:', options: ['Lens', 'Curved Crystal', 'Variable Time Delays', 'Apodization'], answer: 2, explanation: 'The system adds time delays to received echoes based on depth to keep the beam focused at all depths.' },
            { id: 'a-tr-300', value: 300, question: 'Which probe uses 1.5D arrays?', options: ['3D probes', 'Slice thickness control', 'CW probes', 'Pedoff'], answer: 1, explanation: '1.5D arrays have multiple rows of crystals to allow electronic focusing in the elevational plane (slice thickness).' },
            { id: 'a-tr-400', value: 400, question: 'Subdicing helps reduce:', options: ['Reverberation', 'Grating Lobes', 'Side Lobes', 'Aliasing'], answer: 1, explanation: 'Cutting elements into smaller sub-elements (subdicing) reduces the center-to-center distance, mitigating grating lobes.' },
        ],
        Doppler: [
            { id: 'a-do-100', value: 100, question: 'The resistive index (RI) formula is:', options: ['(PSV-EDV)/PSV', '(PSV-EDV)/Mean', 'PSV/EDV', 'PSV-EDV'], answer: 0, explanation: 'Resistive Index = (Peak Systolic - End Diastolic) / Peak Systolic.' },
            { id: 'a-do-200', value: 200, question: 'Which provides the best range resolution?', options: ['HPRF Doppler', 'CW Doppler', 'PW Doppler', 'Color Doppler'], answer: 2, explanation: 'Standard PW Doppler has exact range resolution due to a single gate. HPRF introduces range ambiguity to measure high velocities.' },
            { id: 'a-do-300', value: 300, question: 'Color packets with more pulses have:', options: ['Better temporal res', 'Better velocity accuracy', 'Less energy', 'Worse sensitivity'], answer: 1, explanation: 'Larger packet size (ensemble length) gives more data for averaging, improving velocity accuracy but slowing frame rate.' },
            { id: 'a-do-400', value: 400, question: 'Bernoulli\'s principle relates:', options: ['Velocity and Pressure', 'Flow and Resistance', 'Voltage and Current', 'Frequency and Speed'], answer: 0, explanation: 'As velocity increases (e.g., in a stenosis), pressure decreases to conserve energy (ΔP = 4v²).' },
        ],
        Artifacts: [
            { id: 'a-ar-100', value: 100, question: 'Which artifact is reduced by spatial compounding?', options: ['Mirror Image', 'Speckle', 'Aliasing', 'Speed Error'], answer: 1, explanation: 'Averaging frames from different angles smooths out the constructive/destructive interference pattern known as speckle.' },
            { id: 'a-ar-200', value: 200, question: 'Range Ambiguity occurs when:', options: ['PRF is too high', 'PRF is too low', 'Gain is too high', 'Focus is too deep'], answer: 0, explanation: 'If PRF is too high, the next pulse is sent before the previous one returns from deep structures, confusing the depth.' },
            { id: 'a-ar-300', value: 300, question: 'Which artifact creates lateral displacement?', options: ['Reverberation', 'Refraction', 'Mirror Image', 'Enhancement'], answer: 1, explanation: 'Refraction bends the beam. The machine assumes a straight line, placing the echo laterally displaced from its true location.' },
            { id: 'a-ar-400', value: 400, question: 'Twinkle artifact is associated with:', options: ['Cysts', 'Calcifications/Stones', 'Lipomas', 'Hemangiomas'], answer: 1, explanation: 'Twinkle is a color Doppler artifact appearing as a mosaic of color behind a rough, high-impedance surface like a kidney stone.' },
        ],
        Safety: [
            { id: 'a-sa-100', value: 100, question: 'TIB stands for:', options: ['Thermal Index Bone', 'Thermal Index Brain', 'Thermal Index Body', 'Tissue Index Base'], answer: 0, explanation: 'TIB is the Thermal Index calculated assuming bone is at the beam focus (e.g., fetal ultrasound).' },
            { id: 'a-sa-200', value: 200, question: 'Which modality has the lowest duty factor?', options: ['CW Doppler', 'B-Mode', 'M-Mode', 'Color Doppler'], answer: 1, explanation: 'B-Mode has a very short pulse and long listening time, resulting in the lowest duty factor (<0.1%).' },
            { id: 'a-sa-300', value: 300, question: 'Mechanical Index is proportional to:', options: ['Peak Rarefactional Pressure', 'Peak Compressional Pressure', 'Frequency', 'Pulse Length'], answer: 0, explanation: 'MI = Peak Rarefactional Pressure / √Frequency.' },
            { id: 'a-sa-400', value: 400, question: 'A radiation force balance measures:', options: ['Intensity', 'Pressure', 'Power', 'Beam Width'], answer: 2, explanation: 'It measures the total power of the sound beam by detecting the force the beam exerts on a target.' },
        ],
    }
};

const CATEGORIES: Category[] = ['Basics', 'Transducers', 'Doppler', 'Artifacts', 'Safety'];

const JeopardyDemo: React.FC = () => {
    const { awardAchievement } = useUser();
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [score, setScore] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    // Filter questions based on selected difficulty
    const currentQuestions = useMemo(() => {
        if (!difficulty) return null;
        return GAME_DATA[difficulty];
    }, [difficulty]);

    const handleQuestionClick = (q: Question) => {
        if (answeredQuestions.includes(q.id)) return;
        setActiveQuestion(q);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
    };

    const handleAnswerSubmit = (optionIdx: number) => {
        if (isAnswerRevealed || !activeQuestion) return;
        setSelectedOption(optionIdx);
        setIsAnswerRevealed(true);

        const isCorrect = optionIdx === activeQuestion.answer;
        if (isCorrect) {
            setScore(s => s + activeQuestion.value);
        } else {
            setScore(s => s - activeQuestion.value);
        }
    };

    const handleCloseQuestion = () => {
        if (activeQuestion) {
            setAnsweredQuestions(prev => [...prev, activeQuestion.id]);
            setActiveQuestion(null);
        }
        
        // Check for game completion
        if (currentQuestions && answeredQuestions.length + 1 === Object.values(currentQuestions).flat().length) {
            // Game Over logic could go here
            if (score > 2000) awardAchievement('jeopardy');
        }
    };

    if (!difficulty) {
        return (
            <DemoSection title="SPI Jeopardy Challenge" description="Test your physics knowledge in a competitive format. Select your difficulty level to begin.">
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Select Difficulty</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(level => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className="px-8 py-6 rounded-2xl bg-gray-800 border-2 border-white/10 hover:border-[var(--gold)] hover:bg-gray-700 transition-all text-xl font-bold text-white w-64 shadow-lg hover:scale-105"
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </DemoSection>
        );
    }

    return (
        <DemoSection title={`SPI Jeopardy: ${difficulty}`} description="Select a category and point value. Correct answers add to your score, incorrect answers subtract.">
            <div className="relative">
                {/* Scoreboard */}
                <div className="flex justify-between items-center mb-6 bg-black/40 p-4 rounded-xl border border-white/10">
                    <button onClick={() => setDifficulty(null)} className="text-xs text-white/50 hover:text-white">← Change Difficulty</button>
                    <div className="text-center">
                        <p className="text-xs text-[var(--gold)] uppercase tracking-widest font-bold mb-1">Current Score</p>
                        <p className={`text-4xl font-mono font-black ${score >= 0 ? 'text-white' : 'text-red-500'}`}>${score}</p>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>

                {/* Game Board */}
                <div className="grid grid-cols-5 gap-2 sm:gap-4 overflow-x-auto">
                    {CATEGORIES.map(cat => (
                        <div key={cat} className="space-y-2 sm:space-y-4 min-w-[80px]">
                            {/* Category Header */}
                            <div className="bg-[var(--gold)] text-black font-bold text-xs sm:text-sm py-3 px-1 rounded text-center uppercase tracking-tighter truncate border-b-4 border-[#b08d2f]">
                                {cat}
                            </div>
                            
                            {/* Questions */}
                            {currentQuestions && currentQuestions[cat].map(q => {
                                const isAnswered = answeredQuestions.includes(q.id);
                                return (
                                    <motion.button
                                        key={q.id}
                                        onClick={() => handleQuestionClick(q)}
                                        disabled={isAnswered}
                                        className={`w-full aspect-video sm:aspect-[4/3] rounded-lg border-2 flex items-center justify-center font-mono font-bold text-lg sm:text-2xl transition-all shadow-md ${
                                            isAnswered 
                                                ? 'bg-gray-900 border-gray-800 text-gray-700 cursor-default' 
                                                : 'bg-blue-900 border-blue-700 text-[var(--gold)] hover:bg-blue-800 hover:border-[var(--gold)] hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                        }`}
                                    >
                                        {isAnswered ? '' : `$${q.value}`}
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Question Modal */}
                <AnimatePresence>
                    {activeQuestion && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-[#0f0f0f] border border-[var(--gold)] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative"
                            >
                                {/* Modal Header */}
                                <div className="bg-blue-900 p-6 text-center border-b border-blue-800">
                                    <h3 className="text-[var(--gold)] font-mono text-3xl font-black">${activeQuestion.value}</h3>
                                </div>

                                {/* Question Content */}
                                <div className="p-8">
                                    <p className="text-xl sm:text-2xl text-white text-center font-medium mb-8 leading-relaxed">
                                        {activeQuestion.question}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {activeQuestion.options.map((option, idx) => {
                                            let btnClass = "bg-white/10 hover:bg-white/20 border-white/10 text-white";
                                            
                                            if (isAnswerRevealed) {
                                                if (idx === activeQuestion.answer) {
                                                    btnClass = "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]";
                                                } else if (idx === selectedOption) {
                                                    btnClass = "bg-red-600 border-red-500 text-white opacity-50";
                                                } else {
                                                    btnClass = "bg-black/20 border-transparent text-white/30";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswerSubmit(idx)}
                                                    disabled={isAnswerRevealed}
                                                    className={`p-4 rounded-xl border-2 text-left font-semibold transition-all duration-300 text-sm sm:text-base ${btnClass}`}
                                                >
                                                    {option}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Explanation & Next */}
                                    {isAnswerRevealed && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 pt-6 border-t border-white/10"
                                        >
                                            <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl mb-6">
                                                <p className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">Explanation</p>
                                                <p className="text-white/90">{activeQuestion.explanation}</p>
                                            </div>
                                            <div className="flex justify-center">
                                                <ControlButton onClick={handleCloseQuestion}>Continue to Board</ControlButton>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DemoSection>
    );
};

export default JeopardyDemo;
