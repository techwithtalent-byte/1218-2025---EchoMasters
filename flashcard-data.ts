
import { AIFlashcard } from './types';

// Helper to create simple SVG data URIs for flashcard images
// We use a dark theme optimized palette (#000 background)
const svg = (content: string) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color:#000;">${content}</svg>`)}`;

export const PRE_GENERATED_FLASHCARDS: AIFlashcard[] = [
  // --- VISUAL IDENTIFICATION (PICTURE CARDS) - 20 Cards ---
  {
    term: 'Identify Transducer Type',
    definition: 'Linear Sequential Array. Features: Rectangular image shape, vertical scan lines. Used for: Vascular, Small Parts (Thyroid, Testicle), MSK.',
    frontImage: svg('<rect x="25" y="20" width="50" height="10" fill="#888" stroke="#fff"/><rect x="25" y="30" width="50" height="60" fill="none" stroke="#facc15" stroke-dasharray="2"/><text x="50" y="55" fill="#555" font-size="8" text-anchor="middle">RECTANGULAR</text>')
  },
  {
    term: 'Identify Transducer Type',
    definition: 'Curvilinear (Convex) Array. Features: Blunted sector shape, scan lines originate from a curved top. Used for: Abdomen, OB/GYN.',
    frontImage: svg('<path d="M 20 20 Q 50 10 80 20" stroke="#888" stroke-width="8" fill="none"/><path d="M 20 20 L 5 90 Q 50 80 95 90 L 80 20" fill="none" stroke="#facc15" stroke-dasharray="2"/><text x="50" y="60" fill="#555" font-size="8" text-anchor="middle">BLUNTED SECTOR</text>')
  },
  {
    term: 'Identify Transducer Type',
    definition: 'Phased Array. Features: Sector (pie) shape, scan lines originate from a single point/small footprint. Used for: Cardiac, Transcranial.',
    frontImage: svg('<rect x="40" y="10" width="20" height="5" fill="#888" stroke="#fff"/><path d="M 40 15 L 5 90 Q 50 100 95 90 L 60 15" fill="none" stroke="#facc15" stroke-dasharray="2"/><text x="50" y="50" fill="#555" font-size="8" text-anchor="middle">SECTOR</text>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Acoustic Shadowing. A dark (hypoechoic/anechoic) area extending deep to a highly reflecting or attenuating structure (like a stone or bone).',
    frontImage: svg('<circle cx="50" cy="30" r="15" fill="#fff"/><path d="M 38 35 L 38 100 L 62 100 L 62 35 Z" fill="#222" stroke="none"/><text x="50" y="70" fill="#666" font-size="8" text-anchor="middle">DARK SHADOW</text>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Posterior Enhancement. A bright (hyperechoic) area extending deep to a weakly attenuating structure (like a fluid-filled cyst).',
    frontImage: svg('<circle cx="50" cy="30" r="15" fill="#000" stroke="#fff"/><path d="M 38 45 L 35 100 L 65 100 L 62 45 Z" fill="#fff" fill-opacity="0.3"/><text x="50" y="70" fill="#fff" font-size="8" text-anchor="middle">BRIGHT</text>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Reverberation. Multiple, equally spaced, parallel echoes extending deep into the image. Caused by sound bouncing between two strong reflectors.',
    frontImage: svg('<rect x="0" y="20" width="100" height="2" fill="#fff"/><rect x="0" y="40" width="100" height="2" fill="#fff" opacity="0.8"/><rect x="0" y="60" width="100" height="2" fill="#fff" opacity="0.6"/><rect x="0" y="80" width="100" height="2" fill="#fff" opacity="0.4"/>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Comet Tail (Ring Down). A solid, hyperechoic line directed downward. A form of reverberation from small metal objects or gas.',
    frontImage: svg('<circle cx="50" cy="20" r="2" fill="#fff"/><path d="M 48 20 L 52 20 L 60 100 L 40 100 Z" fill="url(#grad1)"/><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" /><stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0" /></linearGradient></defs>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Mirror Image. A duplicate copy of a structure appears deep to a strong reflector (usually the diaphragm).',
    frontImage: svg('<path d="M 0 50 Q 50 40 100 50" stroke="#fff" stroke-width="2" fill="none"/><circle cx="50" cy="30" r="10" fill="#facc15"/><circle cx="50" cy="70" r="10" fill="#facc15" opacity="0.6"/><text x="80" y="45" fill="#fff" font-size="6">Reflector</text>')
  },
  {
    term: 'Identify Flow Profile',
    definition: 'Laminar Flow (Parabolic). Normal flow pattern with highest velocity in the center and slowest at walls. Clean spectral window.',
    frontImage: svg('<path d="M 0 40 Q 50 40 100 40" stroke="#f87171" stroke-width="2"/><path d="M 0 60 Q 50 60 100 60" stroke="#f87171" stroke-width="2"/><path d="M 10 50 L 30 50 L 25 45 M 30 50 L 25 55" stroke="#fff"/><path d="M 10 45 L 25 45 M 10 55 L 25 55" stroke="#aaa"/>')
  },
  {
    term: 'Identify Flow Profile',
    definition: 'Turbulent Flow. Chaotic flow with eddies and multiple velocities. Seen distal to stenosis. Results in spectral broadening.',
    frontImage: svg('<path d="M 0 30 Q 50 30 100 30" stroke="#f87171" stroke-width="2"/><path d="M 0 70 Q 50 70 100 70" stroke="#f87171" stroke-width="2"/><path d="M 20 50 Q 40 20 60 50 T 100 50" stroke="#fff" fill="none" /><circle cx="50" cy="50" r="10" stroke="#aaa" fill="none" stroke-dasharray="2" />')
  },
  {
    term: 'Identify Waveform Type',
    definition: 'High Resistance (Triphasic). Sharp systolic upstroke, early diastolic flow reversal, minimal late diastolic flow. Seen in: ECA, Extremities (resting), Aorta.',
    frontImage: svg('<path d="M 0 60 L 20 60 L 30 20 L 40 70 L 50 60 L 70 60 L 80 20 L 90 70 L 100 60" stroke="#facc15" stroke-width="2" fill="none"/><line x1="0" y1="60" x2="100" y2="60" stroke="#555" stroke-dasharray="2"/>')
  },
  {
    term: 'Identify Waveform Type',
    definition: 'Low Resistance (Monophasic). Broad systolic peak, continuous forward flow throughout diastole. Seen in: ICA, Renal, Hepatic, Testicular.',
    frontImage: svg('<path d="M 0 80 L 20 80 C 30 80, 30 30, 40 30 C 50 30, 60 50, 100 55" stroke="#facc15" stroke-width="2" fill="none"/><line x1="0" y1="80" x2="100" y2="80" stroke="#555" stroke-dasharray="2"/>')
  },
  {
    term: 'Identify Artifact',
    definition: 'Aliasing. The spectral waveform wraps around the baseline because the Nyquist Limit (PRF/2) was exceeded.',
    frontImage: svg('<path d="M 0 50 L 20 50 L 30 10 M 35 90 L 40 50 L 60 50" stroke="#facc15" stroke-width="2" fill="none"/><line x1="0" y1="50" x2="100" y2="50" stroke="#555"/><text x="50" y="90" fill="#fff" font-size="8">WRAP AROUND</text>')
  },
  {
    term: 'Identify Orientation',
    definition: 'Transverse (Axial) View. Standard orientation: Anterior up, Posterior down, Patient Right is Screen Left, Patient Left is Screen Right.',
    frontImage: svg('<circle cx="50" cy="50" r="30" stroke="#fff" stroke-width="2" fill="none"/><text x="50" y="15" fill="#fff" font-size="8" text-anchor="middle">ANT</text><text x="50" y="90" fill="#fff" font-size="8" text-anchor="middle">POST</text><text x="10" y="50" fill="#fff" font-size="8">RT</text><text x="90" y="50" fill="#fff" font-size="8">LT</text>')
  },
  {
    term: 'Identify Orientation',
    definition: 'Longitudinal (Sagittal) View. Standard orientation: Anterior up, Posterior down, Patient Head (Superior) is Screen Left, Patient Feet (Inferior) is Screen Right.',
    frontImage: svg('<rect x="20" y="40" width="60" height="20" stroke="#fff" stroke-width="2" fill="none"/><text x="50" y="30" fill="#fff" font-size="8" text-anchor="middle">ANT</text><text x="10" y="55" fill="#fff" font-size="8">SUP</text><text x="90" y="55" fill="#fff" font-size="8">INF</text>')
  },
  {
    term: 'Identify Structure',
    definition: 'Cyst. Characteristics: Anechoic (black), smooth thin walls, posterior enhancement.',
    frontImage: svg('<circle cx="50" cy="40" r="15" fill="#000" stroke="#fff"/><path d="M 40 60 L 35 90 L 65 90 L 60 60 Z" fill="#fff" fill-opacity="0.3"/><text x="50" y="80" fill="#fff" font-size="6" text-anchor="middle">Enhancement</text>')
  },
  {
    term: 'Identify Structure',
    definition: 'Stone (Calculus). Characteristics: Hyperechoic (bright) surface, posterior shadowing.',
    frontImage: svg('<circle cx="50" cy="30" r="10" fill="#fff"/><path d="M 40 40 L 40 90 L 60 90 L 60 40 Z" fill="#111"/><text x="50" y="70" fill="#555" font-size="6" text-anchor="middle">Shadow</text>')
  },
  {
    term: 'Identify Display Mode',
    definition: 'M-Mode (Motion Mode). Displays depth (Y-axis) vs. time (X-axis). Used for measuring heart rate and motion of cardiac structures.',
    frontImage: svg('<rect x="0" y="0" width="100" height="30" fill="#333"/><text x="50" y="20" fill="#fff" font-size="8" text-anchor="middle">B-Mode Line</text><path d="M 0 60 Q 25 40 50 60 T 100 60" stroke="#fff" fill="none"/><text x="50" y="90" fill="#fff" font-size="8" text-anchor="middle">M-Mode Trace</text>')
  },
  {
    term: 'Identify Control',
    definition: 'Focal Zone Position. The arrowhead indicates the depth of the best lateral resolution. It should be placed at or just below the region of interest.',
    frontImage: svg('<rect x="30" y="10" width="40" height="80" fill="#333"/><path d="M 75 50 L 85 45 L 85 55 Z" fill="#facc15"/><text x="88" y="53" fill="#facc15" font-size="8">Focus</text>')
  },
  {
    term: 'Identify Control',
    definition: 'TGC (Time Gain Compensation). The sliders adjust gain at specific depths to compensate for attenuation.',
    frontImage: svg('<line x1="20" y1="10" x2="60" y2="10" stroke="#555"/><circle cx="30" cy="10" r="3" fill="#fff"/><line x1="20" y1="30" x2="60" y2="30" stroke="#555"/><circle cx="40" cy="30" r="3" fill="#fff"/><line x1="20" y1="50" x2="60" y2="50" stroke="#555"/><circle cx="50" cy="50" r="3" fill="#fff"/><line x1="20" y1="70" x2="60" y2="70" stroke="#555"/><circle cx="60" cy="70" r="3" fill="#fff"/>')
  },

  // --- PHYSICS BASICS (15) ---
  { term: 'Sound Wave Type', definition: 'Mechanical, Longitudinal wave. Requires a medium to travel.' },
  { term: 'Compression', definition: 'Region of high pressure and high density in a sound wave.' },
  { term: 'Rarefaction', definition: 'Region of low pressure and low density in a sound wave.' },
  { term: 'Infrasound', definition: 'Frequency < 20 Hz (below human hearing).' },
  { term: 'Audible Sound', definition: 'Frequency 20 Hz - 20,000 Hz (20 kHz).' },
  { term: 'Ultrasound', definition: 'Frequency > 20,000 Hz (20 kHz).' },
  { term: 'Diagnostic Freq Range', definition: '2 MHz to 15 MHz (typical).' },
  { term: 'Period (T)', definition: 'Time for one cycle. T = 1/f. Determined by source only.' },
  { term: 'Frequency (f)', definition: 'Cycles per second. f = 1/T. Determined by source only.' },
  { term: 'Wavelength (λ)', definition: 'Distance of one cycle. λ = c/f. Determined by source AND medium.' },
  { term: 'Propagation Speed (c)', definition: 'Speed of sound in medium. c = fλ. Determined by medium ONLY.' },
  { term: 'Avg Speed in Soft Tissue', definition: '1,540 m/s or 1.54 mm/µs.' },
  { term: 'Stiffness vs Speed', definition: 'Directly related. Stiffer medium (Bulk Modulus) = Faster speed.' },
  { term: 'Density vs Speed', definition: 'Inversely related. Denser medium = Slower speed.' },
  { term: 'Speed Order', definition: 'Air (330) < Fat (1450) < Soft Tissue (1540) < Muscle (1600) < Bone (4080).' },

  // --- ATTENUATION & INTENSITY (15) ---
  { term: 'Amplitude', definition: 'Magnitude of the wave. Max value - baseline. Units: Pascals, dB.' },
  { term: 'Power', definition: 'Rate of energy transfer. Proportional to Amplitude². Unit: Watts.' },
  { term: 'Intensity', definition: 'Power / Area. Proportional to Amplitude². Unit: W/cm².' },
  { term: 'Attenuation', definition: 'Weakening of sound as it travels. Units: dB.' },
  { term: '3 Components of Attenuation', definition: 'Absorption (heat), Reflection, Scattering.' },
  { term: 'Primary Component of Attenuation', definition: 'Absorption (conversion to heat).' },
  { term: 'Attenuation Coefficient', definition: '0.5 dB/cm/MHz in soft tissue.' },
  { term: 'Total Attenuation Formula', definition: 'Total Atten (dB) = Atten Coeff × Freq × Path Length.' },
  { term: '3 dB Rule', definition: '-3 dB means intensity is halved. +3 dB means intensity doubled.' },
  { term: '10 dB Rule', definition: '-10 dB means intensity is 1/10th. +10 dB means intensity is 10x.' },
  { term: 'HVL (Half Value Layer)', definition: 'Depth where intensity is reduced to 50% (-3dB). Inversely related to frequency.' },
  { term: 'Acoustic Impedance (Z)', definition: 'Z = density × speed. Unit: Rayls. Determines reflection.' },
  { term: 'Incidence Angle', definition: 'Angle between beam and boundary normal. Normal = 90°.' },
  { term: 'IRC (Intensity Reflection Coeff)', definition: '% of intensity reflected. Depends on Z mismatch.' },
  { term: 'ITC (Intensity Transmission Coeff)', definition: '% of intensity transmitted. ITC = 1 - IRC.' },

  // --- TRANSDUCERS (15) ---
  { term: 'Piezoelectric Effect', definition: 'Conversion of pressure to electricity (reception).' },
  { term: 'Reverse Piezoelectric Effect', definition: 'Conversion of electricity to pressure/sound (transmission).' },
  { term: 'Curie Point', definition: 'Temp at which PZT loses properties (~300°C). Do not autoclave.' },
  { term: 'Matching Layer', definition: 'Reduces reflection at skin. Thickness = 1/4 wavelength. Z is between PZT and skin.' },
  { term: 'Backing Material', definition: 'Damping material. Shortens pulse (SPL) for better Axial Resolution. Lowers Q-factor.' },
  { term: 'Case/Housing', definition: 'Protects components and insulates patient from shock.' },
  { term: 'Bandwidth', definition: 'Range of frequencies in a pulse. Imaging probes are "Wide Bandwidth".' },
  { term: 'Q-Factor', definition: 'Main Freq / Bandwidth. Imaging probes are "Low Q".' },
  { term: 'Resonant Frequency', definition: 'Determined by crystal thickness (thinner=higher) and speed in PZT.' },
  { term: 'Focus', definition: 'Narrowest point of the beam. Best lateral resolution here.' },
  { term: 'Near Zone (Fresnel)', definition: 'Region from transducer to focus. Beam converges.' },
  { term: 'Far Zone (Fraunhofer)', definition: 'Region beyond focus. Beam diverges.' },
  { term: 'Beam Diameter at Focus', definition: '1/2 the transducer diameter.' },
  { term: 'Beam Diameter at 2 NZL', definition: 'Equals the transducer diameter.' },
  { term: 'Divergence', definition: 'More divergence with: Small diameter, Low frequency.' },

  // --- PULSED WAVE (15) ---
  { term: 'Pulse Duration (PD)', definition: 'Time the pulse is "on". PD = # cycles × Period.' },
  { term: 'Spatial Pulse Length (SPL)', definition: 'Length of pulse in space. SPL = # cycles × λ. Determines Axial Res.' },
  { term: 'Pulse Repetition Period (PRP)', definition: 'Time from start of one pulse to start of next. Determined by Depth.' },
  { term: 'Pulse Repetition Frequency (PRF)', definition: 'Pulses per second. Inversely related to Depth.' },
  { term: 'Duty Factor (DF)', definition: '% of time transmitting. DF = PD/PRP. <1% for imaging, 100% for CW.' },
  { term: 'Axial Resolution', definition: 'LARRD. Ability to distinguish reflectors along beam. Formula: SPL/2.' },
  { term: 'Improving Axial Res', definition: 'High Frequency (shorter λ), Damping (fewer cycles).' },
  { term: 'Lateral Resolution', definition: 'LATA. Ability to distinguish reflectors perpendicular to beam. Equals Beam Width.' },
  { term: 'Improving Lateral Res', definition: 'Focusing (narrows beam).' },
  { term: 'Elevational Resolution', definition: 'Slice thickness. Dependent on transducer element height or lens.' },
  { term: 'Frame Rate', definition: 'Images per second. Determined by Speed of sound & Depth.' },
  { term: 'Temporal Resolution', definition: 'Ability to locate moving structures. Determined by Frame Rate.' },
  { term: 'Line Density', definition: 'Lines per frame. High density = better spatial res, worse temporal res.' },
  { term: 'Multi-focus', definition: 'Improves lateral res, degrades temporal res (lower FR).' },
  { term: '13 Microsecond Rule', definition: 'In soft tissue, 13 µs per 1 cm depth (round trip).' },

  // --- INSTRUMENTATION (15) ---
  { term: 'Pulser', definition: 'Creates voltage spikes. Determines Amplitude, PRP, PRF.' },
  { term: 'Beam Former', definition: 'Controls timing for steering, focusing, apodization.' },
  { term: 'Receiver Functions Order', definition: '1. Amplification, 2. Compensation, 3. Compression, 4. Demodulation, 5. Reject.' },
  { term: 'Amplification', definition: 'Overall Gain. Makes entire image brighter/darker.' },
  { term: 'Compensation', definition: 'TGC (Time Gain Compensation). Corrects for attenuation with depth.' },
  { term: 'Compression', definition: 'Dynamic Range. Reduces range of signals for display.' },
  { term: 'Demodulation', definition: 'Rectification & Smoothing. Not adjustable.' },
  { term: 'Reject', definition: 'Threshold. Removes low-level noise.' },
  { term: 'ALARA', definition: 'As Low As Reasonably Achievable. Adjust Gain first, Power last.' },
  { term: 'Scan Converter', definition: 'Stores image data (Memory). Analog to Digital.' },
  { term: 'Pixel', definition: 'Picture Element. Spatial resolution.' },
  { term: 'Bit', definition: 'Binary Digit. Contrast resolution (gray shades). 2^n.' },
  { term: 'Read Magnification', definition: 'Post-processing zoom. Pixels enlarged.' },
  { term: 'Write Magnification', definition: 'Pre-processing zoom. Rescans ROI with more lines.' },
  { term: 'Persistence', definition: 'Frame averaging. Smooths image, reduces noise, lowers temporal res.' },

  // --- DOPPLER (20) ---
  { term: 'Doppler Shift', definition: 'Reflected Freq - Transmitted Freq.' },
  { term: 'Positive Shift', definition: 'Flow towards transducer. Reflected freq is higher.' },
  { term: 'Doppler Equation', definition: 'Shift = (2 × v × f × cosθ) / c.' },
  { term: 'Cosine 0°', definition: '1.0 (Max shift).' },
  { term: 'Cosine 90°', definition: '0 (No shift).' },
  { term: 'Cosine 60°', definition: '0.5 (Standard for vascular).' },
  { term: 'CW Doppler', definition: '2 crystals. No aliasing. Range ambiguity.' },
  { term: 'PW Doppler', definition: '1 crystal. Range resolution. Aliasing possible.' },
  { term: 'Aliasing', definition: 'Wrap-around. Occurs when Shift > Nyquist Limit.' },
  { term: 'Nyquist Limit', definition: 'PRF / 2.' },
  { term: 'Fixing Aliasing', definition: '1. Increase Scale (PRF). 2. Lower Baseline. 3. Lower Freq. 4. Shallower View. 5. Use CW.' },
  { term: 'Color Doppler', definition: 'Mean velocity. Angle dependent. Aliasing possible.' },
  { term: 'Power Doppler', definition: 'Energy mode. Presence of flow only. No velocity/direction. High sensitivity.' },
  { term: 'Variance Mode', definition: 'Adds Green. Indicates turbulence.' },
  { term: 'Spectral Broadening', definition: 'Fill-in of window. Indicates turbulence or large gate.' },
  { term: 'Wall Filter', definition: 'Removes low freq, high amplitude clutter (ghosting).' },
  { term: 'Crosstalk', definition: 'Mirror image of spectrum. Gain too high or 90° angle.' },
  { term: 'Resistive Index (RI)', definition: '(PSV - EDV) / PSV.' },
  { term: 'Pulsatility Index (PI)', definition: '(PSV - EDV) / Mean Velocity.' },
  { term: 'Reynolds Number', definition: 'Predicts turbulence. Re > 2000 = Turbulent.' },

  // --- HEMODYNAMICS (10) ---
  { term: 'Laminar Flow', definition: 'Layered flow. Plug (entrance) or Parabolic.' },
  { term: 'Turbulent Flow', definition: 'Chaotic, eddy currents. Post-stenotic.' },
  { term: 'Energy Gradient', definition: 'Blood moves from high energy to low energy.' },
  { term: 'Forms of Energy', definition: 'Kinetic (velocity), Pressure (stored), Gravitational.' },
  { term: 'Viscosity', definition: 'Fluid thickness. Units: Poise. Hematocrit affects it.' },
  { term: 'Poiseuille’s Law', definition: 'Flow relates to radius^4. Small radius change = huge flow change.' },
  { term: 'Bernoulli Principle', definition: 'At a stenosis: Velocity High, Pressure Low.' },
  { term: 'Hydrostatic Pressure', definition: 'Weight of blood column. 0 at heart level.' },
  { term: 'Inspiration (Venous)', definition: 'Diaphragm down. Abd press up -> Leg flow stops. Thorax press down -> Arm flow up.' },
  { term: 'Expiration (Venous)', definition: 'Diaphragm up. Abd press down -> Leg flow returns.' },

  // --- ARTIFACTS (15) ---
  { term: 'Reverberation', definition: 'Ladder-like reflections between strong reflectors.' },
  { term: 'Comet Tail', definition: 'Solid line down. Ring-down. Gas/Metal.' },
  { term: 'Shadowing', definition: 'Darkness behind high attenuator (stone/bone).' },
  { term: 'Edge Shadowing', definition: 'Shadow at edge of curve due to refraction.' },
  { term: 'Enhancement', definition: 'Brightness behind low attenuator (cyst).' },
  { term: 'Mirror Image', definition: 'Duplicate deep to strong reflector (diaphragm).' },
  { term: 'Speed Error', definition: 'Speed != 1540. Slower medium = object placed too deep.' },
  { term: 'Lobes (Side/Grating)', definition: 'Artifact side-by-side with true structure. Off-axis energy.' },
  { term: 'Refraction Artifact', definition: 'Lateral displacement of structure. "Ghost" side-by-side.' },
  { term: 'Slice Thickness', definition: 'Elevational resolution artifact. Fill-in of cysts.' },
  { term: 'Multipath', definition: 'Path length variability. Indeterminate depth.' },
  { term: 'Range Ambiguity', definition: 'Pulse sent before previous echo returns. Deep object placed shallow.' },
  { term: 'Speckle', definition: 'Grainy interference pattern. Not real tissue texture.' },
  { term: 'Clutter/Ghosting', definition: 'Doppler artifact from tissue motion.' },
  { term: 'Twinkle', definition: 'Color mosaic behind stone.' },

  // --- BIOEFFECTS & QA (10) ---
  { term: 'Hydrophone', definition: 'Micro-probe measures pressure/intensity.' },
  { term: 'SPTA', definition: 'Spatial Peak Temporal Average. Related to tissue heating.' },
  { term: 'Thermal Index (TI)', definition: 'Risk of temp rise. TIS (Soft), TIB (Bone), TIC (Cranial).' },
  { term: 'Mechanical Index (MI)', definition: 'Risk of cavitation. High MI = High Pressure, Low Freq.' },
  { term: 'Stable Cavitation', definition: 'Bubbles oscillate. Shear stress.' },
  { term: 'Transient Cavitation', definition: 'Inertial. Bubbles burst. Shock waves/temps.' },
  { term: 'AIUM Statement', definition: 'No confirmed bioeffects in focused beam < 1 W/cm² SPTA.' },
  { term: 'Phantom', definition: 'Tissue equivalent. Attenuates sound like soft tissue.' },
  { term: 'Dead Zone', definition: 'Area at top of image. Shallowest pins.' },
  { term: 'Registration Accuracy', definition: 'Ability to place pins in correct spatial location.' },

  // --- MISC / CLINICAL (12) ---
  { term: 'Harmonics', definition: 'Transmits f, Receives 2f. Reduces clutter, improves lateral res.' },
  { term: 'Contrast Agents', definition: 'Microbubbles. High reflectivity. Harmonic signal.' },
  { term: 'Elastography', definition: 'Measures tissue stiffness (Strain/Shear wave).' },
  { term: '3D/4D', definition: 'Volume imaging. 4D is real-time 3D.' },
  { term: 'Anisotropy', definition: 'Tendon looks dark when not 90°. Angle artifact.' },
  { term: 'Compound Imaging', definition: 'Multiple angles averaged. Reduces speckle/shadows.' },
  { term: 'Dynamic Range', definition: 'Ratio of largest to smallest signals. dB.' },
  { term: 'Pixel Interpolation', definition: 'Fills in missing data between scan lines.' },
  { term: 'Code Excitation', definition: 'Long pulses, coded. Improves SNR and Penetration.' },
  { term: 'Snell\'s Law', definition: 'Sin(t)/Sin(i) = c2/c1. Refraction physics.' },
  { term: 'Huygen\'s Principle', definition: 'Wavelets interfere to form beam shape.' },
  { term: 'Sensitivity', definition: 'Ability to detect low-level echoes.' }
];
