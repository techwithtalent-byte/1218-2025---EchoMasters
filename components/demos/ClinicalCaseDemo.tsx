
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import { ClinicalCase } from '../../types';
import DemoSection from './DemoSection';
import ControlButton from './ControlButton';
import { useAIHistory } from '../../contexts/AIHistoryContext';
import { useUser } from '../../contexts/UserContext';

const GALLSTONE_CASE: ClinicalCase = {
  id: 'cholelithiasis_01',
  title: 'Right Upper Quadrant Pain',
  history: 'A 52-year-old female presents with a 3-month history of intermittent right upper quadrant (RUQ) pain, which she notes is worse after eating fatty meals. No fever or jaundice is reported.',
  scanAreas: [
    {
      id: 'gb',
      name: 'Scan Gallbladder',
      imagePrompt: 'A grayscale medical ultrasound image of a gallbladder. The gallbladder contains a large, distinct, hyperechoic gallstone which is casting a strong, dark posterior acoustic shadow. The gallbladder wall appears normal in thickness. The image is clear and high-quality.',
      correctFindings: ['Gallstone Present', 'Posterior Shadowing'],
    },
    {
      id: 'cbd',
      name: 'Scan Common Bile Duct',
      imagePrompt: 'A normal grayscale medical ultrasound image of the common bile duct (CBD). The CBD measures 3mm in diameter. No stones, dilation, or abnormalities are visible.',
      correctFindings: ['Normal CBD'],
    }
  ],
  allFindings: ['Gallstone Present', 'Posterior Shadowing', 'Thickened Gallbladder Wall', 'Normal CBD', 'Gallbladder Polyp', 'Sludge Present', 'Dilated CBD', 'Pericholecystic Fluid'],
  correctDiagnosis: 'Cholelithiasis (Gallstones)',
  feedbackPrompt: `The user diagnosed a patient with RUQ pain. 
    Correct findings were: Gallstone Present, Posterior Shadowing, Normal CBD.
    User's selected findings were: {USER_FINDINGS}.
    Provide concise, encouraging feedback on their diagnostic accuracy. If they missed something, explain why the missed finding (e.g., shadowing) is important. If they chose something incorrect, gently correct them. Link one of the findings back to a core ultrasound physics principle (e.g., "You correctly identified 'Posterior Shadowing,' which is a classic example of an acoustic artifact you can learn about in the Artifacts module.").`
};

type CaseStep = 'intro' | 'scan' | 'feedback';

const ClinicalCaseDemo: React.FC = () => {
    const { addHistoryItem } = useAIHistory();
    const { markModuleAsCompleted, awardAchievement } = useUser();
    const [step, setStep] = useState<CaseStep>('intro');
    const [currentScanAreaId, setCurrentScanAreaId] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleStartScan = () => {
        setStep('scan');
    };

    const handleScanArea = async (areaId: string) => {
        const area = GALLSTONE_CASE.scanAreas.find(a => a.id === areaId);
        if (!area) return;

        setCurrentScanAreaId(areaId);
        setGeneratedImage(null);
        setIsLoadingImage(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: area.imagePrompt,
                 config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg'
                },
            });

            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            addHistoryItem({
                type: 'clinicalImage',
                content: imageUrl,
                context: `Clinical Case: ${area.name}`
            });
            setGeneratedImage(imageUrl);
        } catch (error) {
            console.error("Image generation failed:", error);
            // In a real app, you'd show an error message.
        } finally {
            setIsLoadingImage(false);
        }
    };

    const handleToggleFinding = (finding: string) => {
        setSelectedFindings(prev => 
            prev.includes(finding) 
                ? prev.filter(f => f !== finding) 
                : [...prev, finding]
        );
    };

    const handleFinalizeReport = async () => {
        setStep('feedback');
        setIsLoadingFeedback(true);
        setFeedback(null);
        
        // Mark module complete on final report
        markModuleAsCompleted('clinical_case_simulator');
        awardAchievement('clinical_case_simulator');
        
        const prompt = GALLSTONE_CASE.feedbackPrompt.replace('{USER_FINDINGS}', selectedFindings.join(', ') || 'None');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            addHistoryItem({
                type: 'clinicalFeedback',
                content: response.text,
                context: `Feedback for '${GALLSTONE_CASE.title}'`
            });
            setFeedback(response.text);
        } catch (error) {
            console.error("Feedback generation failed:", error);
            setFeedback("There was an error generating your feedback. Based on your findings, please review the case details and compare them to the correct findings listed.");
        } finally {
            setIsLoadingFeedback(false);
        }
    };
    
    const resetSimulation = () => {
        setStep('intro');
        setCurrentScanAreaId(null);
        setGeneratedImage(null);
        setSelectedFindings([]);
        setFeedback(null);
    };

    const renderStep = () => {
        switch (step) {
            case 'intro':
                return (
                    <DemoSection title="Case Presentation" description="Review the patient's history and prepare for the ultrasound examination.">
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-white mb-2">{GALLSTONE_CASE.title}</h4>
                            <p className="text-white/80 max-w-xl mx-auto mb-8">{GALLSTONE_CASE.history}</p>
                            <ControlButton onClick={handleStartScan}>Begin Scan</ControlButton>
                        </div>
                    </DemoSection>
                );
            
            case 'scan':
                return (
                    <DemoSection title="Scan & Report" description="Select an area to scan to generate an AI image, then check off your findings in the report.">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Controls */}
                            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                                <div>
                                    <h4 className="font-semibold text-yellow-400 mb-2">1. Scan Controls</h4>
                                    <div className="flex flex-col gap-2">
                                        {GALLSTONE_CASE.scanAreas.map(area => (
                                            <ControlButton key={area.id} onClick={() => handleScanArea(area.id)} secondary={currentScanAreaId !== area.id}>
                                                {area.name}
                                            </ControlButton>
                                        ))}
                                    </div>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-yellow-400 mb-2">2. Diagnostic Report</h4>
                                    <div className="space-y-2">
                                        {GALLSTONE_CASE.allFindings.map(finding => (
                                            <label key={finding} className="flex items-center gap-3 p-2 bg-white/5 rounded-md cursor-pointer hover:bg-white/10">
                                                <input type="checkbox" checked={selectedFindings.includes(finding)} onChange={() => handleToggleFinding(finding)} className="w-5 h-5 accent-yellow-400" />
                                                <span className="text-sm">{finding}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <ControlButton onClick={handleFinalizeReport} disabled={selectedFindings.length === 0}>Finalize Report</ControlButton>
                            </div>
                            {/* Image */}
                            <div className="w-full lg:w-2/3 aspect-square bg-black rounded-xl flex items-center justify-center p-2">
                                {isLoadingImage && <div className="text-white">Generating Image with Gemini...</div>}
                                {!isLoadingImage && generatedImage && <img src={generatedImage} alt="AI Generated Ultrasound" className="w-full h-full object-contain rounded-lg" />}
                                {!isLoadingImage && !generatedImage && <div className="text-white/50">Select a scan area to begin.</div>}
                            </div>
                        </div>
                    </DemoSection>
                );

            case 'feedback':
                return (
                     <DemoSection title="Final Report & AI Feedback" description="Review your performance and read the personalized feedback generated by EchoBot.">
                        <div className="text-center">
                            <div className="max-w-2xl mx-auto">
                                <h4 className="text-lg font-bold text-white mb-2">Your Findings:</h4>
                                <p className="text-white/80 mb-6">{selectedFindings.length > 0 ? selectedFindings.join(', ') : 'None selected.'}</p>
                                <h4 className="text-lg font-bold text-white mb-2">Correct Diagnosis:</h4>
                                <p className="text-xl font-bold text-green-400 mb-8">{GALLSTONE_CASE.correctDiagnosis}</p>

                                {isLoadingFeedback && <p>Generating feedback...</p>}
                                {feedback && (
                                    <div className="bg-gray-800/50 p-6 rounded-lg border border-yellow-400/30">
                                        <h4 className="text-lg font-bold text-yellow-400 mb-2">EchoBot's Feedback</h4>
                                        <p className="text-white/90 whitespace-pre-wrap">{feedback}</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-8">
                                <ControlButton onClick={resetSimulation}>Start New Case</ControlButton>
                            </div>
                        </div>
                    </DemoSection>
                );
        }
    };
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
    );
};

export default ClinicalCaseDemo;
