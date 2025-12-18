export interface Achievement {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'waves', icon: '🌊', title: 'Wave Rider', description: 'Completed "Propagation Speed & Acoustic Variables".' },
    { id: 'transducers', icon: '⚡', title: 'Transducer Technician', description: 'Completed "Fundamentals of Ultrasound Transducers".' },
    { id: 'resolution', icon: '🔍', title: 'Resolution Ruler', description: 'Completed "Axial & Lateral Resolution".' },
    { id: 'pulsed', icon: '📡', title: 'Pulse Pro', description: 'Completed "Pulsed Wave Operation".' },
    { id: 'doppler', icon: '🎯', title: 'Doppler Dominator', description: 'Completed "Doppler Physics & Imaging Modes".' },
    { id: 'knobology', icon: '🎛️', title: 'Knobology King', description: 'Completed "System Optimization".' },
    { id: 'artifacts', icon: '🎨', title: 'Artifact Ace', description: 'Completed "Common Imaging Artifacts".' },
    { id: 'advanced_artifacts', icon: '🌌', title: 'Ghost Hunter', description: 'Completed "Advanced Artifacts".' },
    { id: 'harmonics', icon: '🎵', title: 'Harmonic Hero', description: 'Completed "Harmonic Imaging".' },
    { id: 'elastography', icon: '🧱', title: 'Stiffness Scholar', description: 'Completed "Elastography".' },
    { id: 'contrast_agents', icon: '✨', title: 'Bubble Boss', description: 'Completed "Contrast Agents".' },
    { id: '3d_4d', icon: '🧊', title: 'Dimension Drifter', description: 'Completed "3D/4D Imaging".' },
    { id: 'hemodynamics', icon: '❤️', title: 'Flow Fanatic', description: 'Completed "Hemodynamics".' },
    { id: 'safety', icon: '🛡️', title: 'Safety Steward', description: 'Completed "Bioeffects and Safety".' },
    { id: 'biomedical_physics', icon: '🔬', title: 'Physics Phenom', description: 'Completed "Biomedical Physics".' },
    { id: 'processing', icon: '⚙️', title: 'Processing Powerhouse', description: 'Completed "Preprocessing vs. Postprocessing".' },
    { id: 'tgc', icon: '🎚️', title: 'Gain Guru', description: 'Completed "Time Gain Compensation".' },
    { id: 'dynamic_range', icon: '📊', title: 'Contrast Champion', description: 'Completed "Dynamic Range".' },
    { id: 'qa', icon: '✅', title: 'QA Qualified', description: 'Completed "Quality Assurance".' },
    { id: 'study_guide', icon: '📖', title: 'Diligent Student', description: 'Completed the "SPI Study Guide".' },
    { id: 'jeopardy', icon: '🕹️', title: 'Jeopardy Champion', description: 'Completed the "SPI Jeopardy Challenge".' },
    { id: 'spi_mock_exam', icon: '⏱️', title: 'Exam Explorer', description: 'Completed the "SPI Mock Exam".' },
    { id: 'exam_master', icon: '🏆', title: 'Exam Master', description: 'Scored 90% or higher on the SPI Mock Exam.' },
];