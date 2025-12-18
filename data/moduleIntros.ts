
import { DemoId } from '../types';

export interface ModuleIntroData {
    title: string;
    subtext: string;
    lines: string[];
}

export const MODULE_INTROS: Record<string, ModuleIntroData> = {
    'waves': {
        title: "Propagation",
        subtext: "System: Wave Physics",
        lines: [
            "Sound is energy in motion.",
            "Moving through the medium.",
            "Cycles of pressure.",
            "The foundation of the image."
        ]
    },
    'transducers': {
        title: "The Engine",
        subtext: "System: Piezoelectric",
        lines: [
            "Electricity becomes Sound.",
            "Crystals vibrating in sequence.",
            "The reverse effect listens.",
            "Generating the beam."
        ]
    },
    'pulsed': {
        title: "Pulse-Echo",
        subtext: "System: Range Resolution",
        lines: [
            "We shout into the void.",
            "And measure the silence.",
            "Time equals distance.",
            "Mapping the unknown."
        ]
    },
    'resolution': {
        title: "Clarity",
        subtext: "System: Spatial Detail",
        lines: [
            "Axial. Lateral. Elevational.",
            "Defining the limits.",
            "Separating the structures.",
            "Precision is the goal."
        ]
    },
    'doppler': {
        title: "Velocity",
        subtext: "System: Hemodynamics",
        lines: [
            "Motion shifts the frequency.",
            "Red approaches. Blue retreats.",
            "Measuring the flow of life.",
            "The physics of movement."
        ]
    },
    'artifacts': {
        title: "Illusions",
        subtext: "System: Error Analysis",
        lines: [
            "The machine assumes straight lines.",
            "Physics bends the truth.",
            "Shadows. Ghosts. Mirrors.",
            "Discern reality from artifact."
        ]
    },
    'safety': {
        title: "Bioeffects",
        subtext: "System: Patient Safety",
        lines: [
            "Power creates heat.",
            "Pressure creates cavitation.",
            "The invisible risk.",
            "Safety is paramount."
        ]
    },
    'hemodynamics': {
        title: "Fluid Dynamics",
        subtext: "System: Vascular Mechanics",
        lines: [
            "Pressure gradients drive the river.",
            "Resistance fights the flow.",
            "Laminar vs Turbulent.",
            "The physics of circulation."
        ]
    },
    'qa': {
        title: "Calibration",
        subtext: "System: Quality Assurance",
        lines: [
            "Trust, but verify.",
            "Testing the phantom.",
            "Measuring the limits.",
            "System integrity check."
        ]
    },
    'harmonics': {
        title: "Resonance",
        subtext: "System: Non-Linear",
        lines: [
            "Listen for the double frequency.",
            "Generated deep within tissue.",
            "Filtering out the noise.",
            "Crystal clear visualization."
        ]
    },
    'knobology': {
        title: "Optimization",
        subtext: "System: Control Interface",
        lines: [
            "The machine is raw potential.",
            "You are the architect.",
            "Gain. Focus. Depth.",
            "Craft the perfect image."
        ]
    },
    'advanced_artifacts': {
        title: "Anomalies",
        subtext: "System: Advanced Errors",
        lines: [
            "Refraction distorts position.",
            "Lobes deceive the eye.",
            "Speed errors warp depth.",
            "Advanced diagnostics required."
        ]
    },
    'elastography': {
        title: "Stiffness",
        subtext: "System: Tissue Mechanics",
        lines: [
            "Palpating with sound waves.",
            "Mapping the resistance.",
            "Hard vs Soft.",
            "Diagnosing the invisible."
        ]
    },
    'contrast_agents': {
        title: "Enhancement",
        subtext: "System: Microbubbles",
        lines: [
            "Gas-filled shells reflecting.",
            "Lighting up the vessels.",
            "Harmonic resonance detected.",
            "Seeing the perfusion."
        ]
    },
    '3d_4d': {
        title: "Volumetric",
        subtext: "System: Spatial Rendering",
        lines: [
            "The Z-axis revealed.",
            "Slicing through the volume.",
            "Reconstructing reality.",
            "Time is the fourth dimension."
        ]
    },
    'biomedical_physics': {
        title: "Interaction",
        subtext: "System: Bio-Physics",
        lines: [
            "Reflection. Refraction. Absorption.",
            "The fate of the beam.",
            "Impedance mismatch defines us.",
            "Physics at the cellular level."
        ]
    },
    'abdominal': {
        title: "Abdomen",
        subtext: "Clinical: Protocol",
        lines: [
            "Penetrating the depths.",
            "Liver. Kidney. Pancreas.",
            "Scanning the parenchyma.",
            "Diagnostic imaging active."
        ]
    },
    'vascular': {
        title: "Circulation",
        subtext: "Clinical: Protocol",
        lines: [
            "The highways of the body.",
            "Arteries pulsate. Veins compress.",
            "Flow profiles analyzed.",
            "Detecting the stenosis."
        ]
    },
    'msk': {
        title: "Structure",
        subtext: "Clinical: Protocol",
        lines: [
            "Tendons. Ligaments. Nerves.",
            "Anisotropy hides the truth.",
            "Dynamic movement required.",
            "High frequency precision."
        ]
    },
    'cardiac': {
        title: "The Pump",
        subtext: "Clinical: Echocardiography",
        lines: [
            "Rhythm and motion.",
            "Chambers filling. Valves opening.",
            "The engine of life.",
            "Real-time analysis."
        ]
    },
    'processing': {
        title: "Signal Chain",
        subtext: "System: Processing",
        lines: [
            "Analog becomes Digital.",
            "Preprocessing the raw.",
            "Postprocessing the frozen.",
            "Zoom. Map. Persist."
        ]
    },
    'tgc': {
        title: "Compensation",
        subtext: "System: Gain Control",
        lines: [
            "Depth steals energy.",
            "We must compensate.",
            "Equalizing the brightness.",
            "Uniformity achieved."
        ]
    },
    'dynamic_range': {
        title: "Contrast",
        subtext: "System: Compression",
        lines: [
            "Shades of gray.",
            "Mapping the signal.",
            "High contrast vs Low contrast.",
            "Optimizing the display."
        ]
    },
    'study_guide': {
        title: "Knowledge Base",
        subtext: "Resource: Archives",
        lines: [
            "Accessing data...",
            "Physics principles loaded.",
            "Definitions and formulas.",
            "Review mode engaged."
        ]
    },
    'jeopardy': {
        title: "Challenge",
        subtext: "Game: Simulation",
        lines: [
            "Test your reaction.",
            "Physics trivia loaded.",
            "High score required.",
            "Competition mode engaged."
        ]
    },
    'spi_mock_exam': {
        title: "Certification",
        subtext: "Exam: Simulation",
        lines: [
            "The final test.",
            "110 questions.",
            "Time is ticking.",
            "Prove your mastery."
        ]
    },
    'clinical_case_simulator': {
        title: "Diagnosis",
        subtext: "Simulation: AI Patient",
        lines: [
            "Patient data incoming...",
            "Symptoms presented.",
            "Scan. Analyze. Decide.",
            "The diagnosis is yours."
        ]
    },
    'ai_history': {
        title: "Logs",
        subtext: "Data: History",
        lines: [
            "Retrieving past sessions...",
            "Reviewing interactions.",
            "Saved content loaded.",
            "Memory access granted."
        ]
    }
};

export const getModuleIntro = (id: DemoId): ModuleIntroData => {
    return MODULE_INTROS[id] || {
        title: "Module Loading",
        subtext: `System: ${id.toUpperCase()}`,
        lines: [
            "Initializing...",
            "Loading assets...",
            "Preparing interface..."
        ]
    };
};
