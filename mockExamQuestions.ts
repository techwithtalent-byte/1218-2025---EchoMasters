import { AIQuizQuestion } from './types';

export const MOCK_EXAM_QUESTIONS: AIQuizQuestion[] = [
  // --- Questions 1-39 from user ---
  {
    question: "Which of the following determines the propagation speed of sound?",
    options: ["Frequency", "The Medium", "Amplitude", "The Transducer"],
    correctAnswer: "The Medium",
    explanation: "Propagation speed is determined SOLELY by the properties of the medium it travels through, specifically its stiffness and density. It is not affected by the sound source."
  },
  {
    question: "The portion of the transducer that is in contact with the patient's skin and helps to reduce the acoustic impedance mismatch is called the:",
    options: ["Backing material", "Piezoelectric crystal", "Matching layer", "Housing"],
    correctAnswer: "Matching layer",
    explanation: "The matching layer has an impedance between that of the crystal and the skin, which reduces reflection at the transducer-skin interface and allows more sound energy to be transmitted into the body."
  },
  {
    question: "An increase in the number of cycles in a pulse results in:",
    options: ["Improved axial resolution", "Degraded axial resolution", "Improved lateral resolution", "Degraded lateral resolution"],
    correctAnswer: "Degraded axial resolution",
    explanation: "Axial resolution is determined by the Spatial Pulse Length (SPL). More cycles in a pulse create a longer SPL, which degrades the ability to distinguish two structures along the beam's axis (LARRD)."
  },
  {
    question: "Which Doppler angle would produce the most significant Doppler shift?",
    options: ["90 degrees", "60 degrees", "30 degrees", "0 degrees"],
    correctAnswer: "0 degrees",
    explanation: "The Doppler shift is proportional to the cosine of the angle. Cos(0°) = 1, which is the maximum value. As the angle approaches 90°, the cosine approaches 0, and the Doppler shift diminishes."
  },
  {
    question: "The artifact that results from the sound beam bouncing between two strong, parallel reflectors is known as:",
    options: ["Shadowing", "Enhancement", "Reverberation", "Mirror Image"],
    correctAnswer: "Reverberation",
    explanation: "Reverberation occurs when sound bounces back and forth between two strong reflectors, creating multiple, equally spaced echoes on the display."
  },
  {
    question: "The primary purpose of Time Gain Compensation (TGC) is to:",
    options: ["Increase overall image brightness", "Adjust the dynamic range", "Compensate for attenuation", "Improve lateral resolution"],
    correctAnswer: "Compensate for attenuation",
    explanation: "Ultrasound beams weaken (attenuate) as they travel deeper into the body. TGC selectively amplifies echoes from deeper structures to create an image with uniform brightness from the near field to the far field."
  },
  {
    question: "Which on-screen safety index is related to the potential for cavitation?",
    options: ["Thermal Index (TI)", "Mechanical Index (MI)", "Pulse Repetition Frequency (PRF)", "Dynamic Range (DR)"],
    correctAnswer: "Mechanical Index (MI)",
    explanation: "The Mechanical Index (MI) is a measure of the likelihood of cavitation (the formation and collapse of gas bubbles) due to the acoustic pressure of the sound wave."
  },
  {
    question: "Which of the following is considered a preprocessing function?",
    options: ["Adjusting zoom on a frozen image", "Changing the gray map", "Time Gain Compensation (TGC)", "Adding calipers for measurement"],
    correctAnswer: "Time Gain Compensation (TGC)",
    explanation: "TGC is a preprocessing function because it alters the raw echo data as it's being received, before it is stored in the scan converter. Zoom, gray maps, and measurements on a frozen image are all postprocessing."
  },
  {
    question: "Lateral resolution is primarily determined by:",
    options: ["Pulse duration", "Spatial pulse length", "Beam width", "The matching layer"],
    correctAnswer: "Beam width",
    explanation: "Lateral resolution (LATA - Lateral, Angular, Transverse, Azimuthal) is the ability to distinguish structures side-by-side and is determined by the width of the ultrasound beam. It is best at the focal zone."
  },
  {
    question: "The Nyquist limit is equal to:",
    options: ["PRF x 2", "PRF / 2", "The Doppler Shift", "The operating frequency"],
    correctAnswer: "PRF / 2",
    explanation: "The Nyquist limit is the highest Doppler frequency that can be measured without aliasing. It is equal to half of the Pulse Repetition Frequency (PRF)."
  },
  {
    question: "Which acoustic parameter is determined by both the sound source and the medium?",
    options: ["Frequency", "Period", "Wavelength", "Propagation Speed"],
    correctAnswer: "Wavelength",
    explanation: "Wavelength (λ) is the only parameter determined by both. It is calculated as propagation speed (c, a property of the medium) divided by frequency (f, a property of the source): λ = c/f."
  },
  {
    question: "A narrow dynamic range results in an image with:",
    options: ["Low contrast", "High contrast", "More shades of gray", "Poor temporal resolution"],
    correctAnswer: "High contrast",
    explanation: "A narrow dynamic range assigns fewer gray shades to the range of echo intensities, which makes the image appear more black-and-white, thereby increasing the contrast."
  },
  {
    question: "The ALARA principle stands for:",
    options: ["As Low As Reasonably Achievable", "Always Limit Acoustic Radiation Annually", "All Levels Are Regionally Averaged", "Acoustic Levels Are Rarely Additive"],
    correctAnswer: "As Low As Reasonably Achievable",
    explanation: "ALARA is the fundamental safety principle in diagnostic ultrasound, guiding sonographers to use the lowest output power and shortest scan time necessary to obtain diagnostic-quality images."
  },
  {
    question: "Refraction of the sound beam occurs under which two conditions?",
    options: ["Normal incidence and equal speeds", "Oblique incidence and different speeds", "Normal incidence and different speeds", "Oblique incidence and equal speeds"],
    correctAnswer: "Oblique incidence and different speeds",
    explanation: "Refraction, or bending of the sound beam, only occurs when the beam strikes a boundary at an oblique angle AND the propagation speeds of the two media are different."
  },
  {
    question: "What is the unit for acoustic impedance?",
    options: ["Watts", "Pascals", "Rayls", "Hertz"],
    correctAnswer: "Rayls",
    explanation: "Acoustic impedance (Z) is measured in Rayls. It is calculated as the density of the medium multiplied by its propagation speed (Z = ρc)."
  },
  {
    question: "In a phased array transducer, how is the beam steered?",
    options: ["By mechanically moving the crystals", "By firing the crystals in a specific sequence", "By using a curved crystal arrangement", "By applying a lens"],
    correctAnswer: "By firing the crystals in a specific sequence",
    explanation: "Phased array transducers steer the beam electronically by introducing tiny time delays in the firing sequence of the individual piezoelectric elements."
  },
  {
    question: "The ability to distinguish two structures that lie perpendicular to the sound beam is known as:",
    options: ["Axial resolution", "Temporal resolution", "Contrast resolution", "Lateral resolution"],
    correctAnswer: "Lateral resolution",
    explanation: "Lateral resolution is the ability to resolve two objects that are side-by-side, or perpendicular to the direction of the sound beam. It is determined by beam width."
  },
  {
    question: "Which Doppler modality is most susceptible to aliasing?",
    options: ["Continuous Wave (CW) Doppler", "Power Doppler", "Pulsed Wave (PW) Doppler", "B-Flow"],
    correctAnswer: "Pulsed Wave (PW) Doppler",
    explanation: "Pulsed Wave Doppler is subject to aliasing because it samples the returning signal at a specific rate (the PRF). If the Doppler shift exceeds half the PRF (the Nyquist limit), aliasing occurs. CW Doppler does not alias."
  },
  {
    question: "Posterior acoustic enhancement is typically seen deep to what kind of structure?",
    options: ["A highly attenuating structure like a bone", "A structure with a high acoustic impedance", "A fluid-filled structure like a cyst", "A gas-filled structure like bowel"],
    correctAnswer: "A fluid-filled structure like a cyst",
    explanation: "Fluid attenuates sound much less than soft tissue. Therefore, the sound beam is stronger after passing through a cyst, causing the tissues behind it to appear brighter (enhancement)."
  },
  {
    question: "The duty factor for continuous wave ultrasound is:",
    options: ["0%", "Less than 1%", "Between 1% and 50%", "100%"],
    correctAnswer: "100%",
    explanation: "Duty factor is the percentage of time the system is transmitting sound. Since Continuous Wave (CW) ultrasound transmits constantly, its duty factor is 100%."
  },
  {
    question: "Which of the following would improve temporal resolution?",
    options: ["Increasing the number of focal zones", "Increasing the scan line density", "Decreasing the imaging depth", "Using a wider sector width"],
    correctAnswer: "Decreasing the imaging depth",
    explanation: "Decreasing the imaging depth reduces the 'listening time' for each scan line, allowing the system to build frames faster. This results in a higher frame rate and improved temporal resolution."
  },
  {
    question: "The thickness of the piezoelectric crystal in a pulsed wave transducer determines the:",
    options: ["Beam width", "Frequency", "Amplitude", "Pulse duration"],
    correctAnswer: "Frequency",
    explanation: "The main or resonant frequency of a transducer is determined by the thickness of the PZT crystal. A thinner crystal produces a higher frequency."
  },
  {
    question: "In Color Doppler, the color red typically indicates:",
    options: ["High velocity flow", "Turbulent flow", "Flow towards the transducer", "Flow away from the transducer"],
    correctAnswer: "Flow towards the transducer",
    explanation: "By convention (BART: Blue Away, Red Towards), red on a standard color map indicates blood flow moving towards the transducer, representing a positive Doppler shift."
  },
  {
    question: "An artifact that places a structure on the wrong side of a strong reflector is called:",
    options: ["Side Lobe", "Reverberation", "Mirror Image", "Speed Error"],
    correctAnswer: "Mirror Image",
    explanation: "A mirror image artifact is created when the sound beam hits a strong, specular reflector (like the diaphragm) and is redirected. The machine assumes a straight path and places a duplicate image deeper than the reflector."
  },
  {
    question: "The thermal index (TI) is an estimate of the potential for:",
    options: ["Cavitation", "Tissue heating", "Electrical shock", "Image resolution"],
    correctAnswer: "Tissue heating",
    explanation: "The Thermal Index (TI) is a calculated value that estimates the potential for the ultrasound beam to raise the temperature of tissue. TIS (soft tissue), TIB (bone), and TIC (cranial bone) are different TI variations."
  },
  {
    question: "A quality assurance phantom is used to assess all of the following EXCEPT:",
    options: ["Axial resolution", "Patient comfort", "Distance accuracy", "Sensitivity"],
    correctAnswer: "Patient comfort",
    explanation: "QA phantoms are used to test the imaging performance of the ultrasound system, including resolution, caliper accuracy, sensitivity, and the dead zone. They do not measure subjective factors like patient comfort."
  },
  {
    question: "If the propagation speed in a medium is faster than 1540 m/s, a structure will be displayed:",
    options: ["Too shallow", "Too deep", "At the correct depth", "With a shadow"],
    correctAnswer: "Too shallow",
    explanation: "If the actual speed is faster than the assumed speed, the echo returns sooner than expected. The machine, using its 1540 m/s assumption, misinterprets this short travel time as a shallower depth."
  },
  {
    question: "The mnemonic LARRD refers to which type of resolution?",
    options: ["Lateral", "Temporal", "Axial", "Elevational"],
    correctAnswer: "Axial",
    explanation: "LARRD stands for Longitudinal, Axial, Range, Radial, Depth. These are all terms used to describe axial resolution, the ability to resolve objects along the beam's path."
  },
  {
    question: "What is the main advantage of Power Doppler over conventional Color Doppler?",
    options: ["It provides velocity information", "It is not subject to aliasing", "It is more sensitive to slow flow", "It has a higher frame rate"],
    correctAnswer: "It is more sensitive to slow flow",
    explanation: "Power Doppler displays the amplitude (or strength) of the Doppler signal, not its velocity or direction. This makes it more sensitive to weak signals, such as those from slow-moving blood, but at the cost of losing directional and velocity data."
  },
  {
    question: "Harmonic imaging improves image quality primarily by:",
    options: ["Increasing penetration", "Improving temporal resolution", "Reducing near-field artifacts", "Increasing the Doppler shift"],
    correctAnswer: "Reducing near-field artifacts",
    explanation: "Harmonics are generated deeper in the tissue, bypassing the superficial layers where many artifacts (like reverberation and clutter) are strongest. Processing only the cleaner harmonic signal results in a clearer image with better contrast resolution."
  },
  {
    question: "What is the relationship between frequency and period?",
    options: ["They are directly proportional", "They are inversely proportional", "They are unrelated", "They are equal"],
    correctAnswer: "They are inversely proportional",
    explanation: "Period is the time for one cycle, and frequency is the number of cycles per second. As one increases, the other must decrease. The formula is Period = 1 / Frequency."
  },
  {
    question: "Which of the following is NOT an acoustic variable?",
    options: ["Pressure", "Density", "Particle motion", "Impedance"],
    correctAnswer: "Impedance",
    explanation: "The three acoustic variables are pressure, density, and particle motion. Impedance is an acoustic parameter, a property of the medium, calculated from density and speed."
  },
  {
    question: "The intensity of the ultrasound beam is proportional to the amplitude _______.",
    options: ["cubed", "squared", "divided by two", "multiplied by the frequency"],
    correctAnswer: "squared",
    explanation: "Intensity is proportional to the amplitude squared (Intensity ∝ Amplitude²). A small increase in amplitude results in a much larger increase in intensity and power."
  },
  {
    question: "The bending of a sound beam as it crosses a boundary between two media is called:",
    options: ["Reflection", "Scatter", "Refraction", "Attenuation"],
    correctAnswer: "Refraction",
    explanation: "Refraction is the change in direction or bending of the wave path. It is described by Snell's Law."
  },
  {
    question: "For perpendicular incidence, if the impedances of two media are identical, what percentage of the sound is reflected?",
    options: ["100%", "50%", "1%", "0%"],
    correctAnswer: "0%",
    explanation: "Reflection is caused by an impedance mismatch. If there is no mismatch (Z1 = Z2), there is no reflection, and 100% of the sound is transmitted."
  },
  {
    question: "The Curie temperature is relevant to which component of the transducer?",
    options: ["Matching Layer", "Backing Material", "Piezoelectric Crystal", "Housing"],
    correctAnswer: "Piezoelectric Crystal",
    explanation: "The Curie temperature is the point at which a piezoelectric material will lose its piezoelectric properties if heated. This process is called depolarization."
  },
  {
    question: "Which type of resolution is improved by focusing?",
    options: ["Axial resolution", "Lateral resolution", "Temporal resolution", "Contrast resolution"],
    correctAnswer: "Lateral resolution",
    explanation: "Focusing narrows the beam width. Since lateral resolution is determined by beam width, focusing improves lateral resolution, especially in the focal zone."
  },
  {
    question: "The 'dead zone' on an ultrasound image refers to the region:",
    options: ["Deepest in the far field", "Where there are no reflectors", "Closest to the transducer where imaging is inaccurate", "Behind a strong reflector"],
    correctAnswer: "Closest to the transducer where imaging is inaccurate",
    explanation: "The dead zone is the region at the top of the image, close to the transducer face, where accurate imaging cannot be performed due to the time it takes for the system to switch from transmit to receive mode."
  },
  {
    question: "In B-mode imaging, the brightness of the dot corresponds to the echo's:",
    options: ["Frequency", "Phase", "Amplitude", "Arrival time"],
    correctAnswer: "Amplitude",
    explanation: "In Brightness-mode (B-mode), the brightness of each pixel on the screen is determined by the amplitude (or strength) of the returning echo. Stronger echoes create brighter dots."
  },
  {
    question: "Which receiver function is responsible for adjusting for attenuation?",
    options: ["Amplification", "Compensation (TGC)", "Compression", "Rejection"],
    correctAnswer: "Compensation (TGC)",
    explanation: "Compensation, also known as Time Gain Compensation (TGC) or Depth Gain Compensation (DGC), is the function that applies variable amplification to echoes based on their depth to correct for attenuation."
  },
  {
    question: "What is the primary advantage of using a 1 ½ D array transducer?",
    options: ["Wider field of view", "Higher frequency", "Improved elevational resolution", "Better penetration"],
    correctAnswer: "Improved elevational resolution",
    explanation: "A 1.5D array has multiple rows of elements, which allows for electronic focusing in the elevational (slice thickness) dimension, improving elevational resolution."
  },
  {
    question: "The phenomenon where a high-intensity sound beam distorts and generates multiples of its original frequency is called:",
    options: ["Linear propagation", "Non-linear propagation", "Rayleigh scattering", "Specular reflection"],
    correctAnswer: "Non-linear propagation",
    explanation: "Non-linear (or finite-amplitude) propagation describes how sound waves distort as they travel, with peaks moving faster than troughs. This distortion is the source of harmonic frequencies."
  },
  {
    question: "What unit is used to describe the power in a sound beam?",
    options: ["Pascals", "Watts", "Rayls", "Decibels"],
    correctAnswer: "Watts",
    explanation: "Power is the rate of energy transfer and is measured in Watts (W) or milliwatts (mW)."
  },
  {
    question: "If PRP is increased, what happens to the maximum imaging depth?",
    options: ["It increases", "It decreases", "It remains the same", "It is unrelated"],
    correctAnswer: "It increases",
    explanation: "A longer Pulse Repetition Period (PRP) means more 'listening time' between pulses. This allows the system to hear echoes from deeper structures, thus increasing the maximum imaging depth."
  },
  {
    question: "The range equation in ultrasound relates the round-trip time of an echo to the reflector's ______.",
    options: ["Size", "Depth", "Composition", "Motion"],
    correctAnswer: "Depth",
    explanation: "The range equation (Depth = (speed × time) / 2) uses the go-return time of a pulse to calculate the depth of the reflector that created the echo."
  },
  {
    question: "Which of the following is an example of a non-specular reflector?",
    options: ["Diaphragm", "Bladder wall", "Red blood cells", "Pericardium"],
    correctAnswer: "Red blood cells",
    explanation: "Non-specular reflectors are structures smaller than the ultrasound wavelength. They scatter sound in all directions. Red blood cells are classic examples of Rayleigh scatterers."
  },
  {
    question: "Which control would you adjust to reduce electronic noise in a very dark, low-signal area of the image?",
    options: ["Increase overall gain", "Decrease overall gain", "Increase TGC", "Decrease dynamic range"],
    correctAnswer: "Decrease overall gain",
    explanation: "Overall gain amplifies both signal and noise. In a low-signal area, high gain will primarily amplify the electronic noise, making it more visible. Decreasing gain will reduce this 'snow'."
  },
  {
    question: "What is the typical range of diagnostic ultrasound frequencies?",
    options: ["20 Hz - 20 kHz", "500 kHz - 1 MHz", "2 MHz - 15 MHz", "20 MHz - 50 MHz"],
    correctAnswer: "2 MHz - 15 MHz",
    explanation: "The vast majority of clinical diagnostic ultrasound imaging is performed with transducers operating in the 2 to 15 megahertz range."
  },
  {
    question: "The 'heel-toe' maneuver is used to overcome which artifact?",
    options: ["Shadowing", "Anisotropy", "Mirror Image", "Reverberation"],
    correctAnswer: "Anisotropy",
    explanation: "Anisotropy causes tendons to appear dark (hypoechoic) when the beam is not perfectly perpendicular. The 'heel-toe' maneuver involves rocking the transducer to achieve perpendicularity and make the tendon appear bright (hyperechoic)."
  },
  {
    question: "A triphasic waveform in a peripheral artery at rest is considered:",
    options: ["Normal (high resistance)", "Abnormal (low resistance)", "A sign of stenosis", "An artifact"],
    correctAnswer: "Normal (high resistance)",
    explanation: "Peripheral arteries supplying resting muscles are high-resistance vascular beds. A normal waveform is triphasic, showing forward systolic flow, brief early diastolic flow reversal, and minimal late diastolic flow."
  },
  {
    question: "Which of the following is NOT a mechanism of attenuation?",
    options: ["Absorption", "Reflection", "Scattering", "Amplification"],
    correctAnswer: "Amplification",
    explanation: "Attenuation is the weakening of sound. Its three components are absorption (conversion to heat), reflection (bouncing off a boundary), and scattering (redirection in many directions)."
  },
  {
    question: "The formula for Duty Factor is:",
    options: ["PRP / PD", "PD / PRP", "PRF / PD", "PD / PRF"],
    correctAnswer: "PD / PRP",
    explanation: "Duty Factor (DF) is the fraction of time the transducer is actively transmitting sound. It is calculated as the Pulse Duration (PD) divided by the Pulse Repetition Period (PRP)."
  },
  {
    question: "Which of the following would result in the POOREST temporal resolution?",
    options: ["Shallow imaging depth", "Narrow sector width", "Multiple focal zones", "Low line density"],
    correctAnswer: "Multiple focal zones",
    explanation: "Using multiple focal zones requires the system to send multiple pulses down each scan line, significantly increasing the time required to build a frame. This leads to a lower frame rate and poor temporal resolution."
  },
  {
    question: "What is the primary determinant of the degree of specular reflection at an interface?",
    options: ["The frequency of the beam", "The intensity of the beam", "The difference in acoustic impedances", "The angle of incidence"],
    correctAnswer: "The difference in acoustic impedances",
    explanation: "The amount of reflection at a boundary is determined by the impedance mismatch. A large difference in impedance between the two media will cause a strong reflection."
  },
  {
    question: "Which imaging mode uses the autocorrelation technique for processing?",
    options: ["A-mode", "M-mode", "Color Doppler", "CW Doppler"],
    correctAnswer: "Color Doppler",
    explanation: "Autocorrelation is the signal processing technique used in color Doppler to rapidly calculate the average Doppler shift and variance for each pixel in the color box."
  },
  {
    question: "The part of the sound beam between the transducer and the focal point is the:",
    options: ["Far zone", "Fraunhofer zone", "Focal zone", "Near zone"],
    correctAnswer: "Near zone",
    explanation: "The near zone, or Fresnel zone, is the region of the beam from the transducer face to the focus. The beam converges in this region."
  },
  {
    question: "Which of these artifacts is caused by the finite thickness of the ultrasound beam?",
    options: ["Refraction", "Partial volume artifact", "Speed error", "Side lobe"],
    correctAnswer: "Partial volume artifact",
    explanation: "The partial volume artifact occurs when the beam slice is thick and averages the signals from different tissues (e.g., an anechoic cyst and surrounding solid tissue), causing the cyst to appear filled with low-level echoes. It is an effect of poor elevational resolution."
  },
  {
    question: "In the Doppler equation, what does 'c' represent?",
    options: ["Contrast", "Cycles per pulse", "Propagation speed of sound", "Color map"],
    correctAnswer: "Propagation speed of sound",
    explanation: "In the Doppler shift equation (Δf = 2 * f₀ * v * cosθ / c), 'c' represents the propagation speed of sound in the medium (e.g., 1540 m/s in soft tissue)."
  },
  {
    question: "What is the typical value for the attenuation coefficient in soft tissue?",
    options: ["0.1 dB/cm/MHz", "0.5 dB/cm/MHz", "1.0 dB/cm/MHz", "5.0 dB/cm/MHz"],
    correctAnswer: "0.5 dB/cm/MHz",
    explanation: "A widely used rule of thumb is that soft tissue attenuates sound at a rate of approximately 0.5 decibels for every centimeter traveled, for every 1 megahertz of frequency."
  },
  {
    question: "Which transducer array type has the best lateral resolution over its entire image?",
    options: ["Linear sequential array", "Annular phased array", "Convex array", "Phased array"],
    correctAnswer: "Annular phased array",
    explanation: "Annular phased arrays consist of concentric rings that allow for dynamic focusing in both the scan plane and the elevational plane, providing excellent lateral resolution across the entire image depth."
  },
  {
    question: "Wall filter is used in Doppler to:",
    options: ["Remove high-velocity signals", "Remove low-velocity, high-amplitude signals from vessel walls", "Correct for aliasing", "Increase the frame rate"],
    correctAnswer: "Remove low-velocity, high-amplitude signals from vessel walls",
    explanation: "The wall filter (or high-pass filter) is used to eliminate the strong, low-frequency Doppler shifts caused by the movement of vessel walls or surrounding tissue, allowing for better visualization of blood flow."
  },
  {
    question: "A 'Tardus Parvus' waveform is indicative of:",
    options: ["Distal stenosis", "Proximal stenosis", "Normal high-resistance flow", "Venous flow"],
    correctAnswer: "Proximal stenosis",
    explanation: "A Tardus Parvus waveform has a slow, delayed systolic upstroke ('Tardus') and low amplitude ('Parvus'). It is a classic sign of a significant stenosis located upstream (proximal) to the point of measurement."
  },
  {
    question: "Which resolution type is NOT adjustable by the sonographer?",
    options: ["Axial resolution", "Lateral resolution", "Temporal resolution", "Elevational resolution"],
    correctAnswer: "Elevational resolution",
    explanation: "Elevational resolution (slice thickness) is determined by the fixed-focus lens on most 1D array transducers and cannot be adjusted by the operator. Axial, lateral, and temporal resolution can all be manipulated via various controls."
  },
  {
    question: "The Reynolds number is directly proportional to:",
    options: ["Viscosity", "Vessel radius", "Flow velocity", "Both B and C"],
    correctAnswer: "Both B and C",
    explanation: "The Reynolds number (Re = ρvd/μ) is directly proportional to flow velocity (v) and vessel diameter (d) and inversely proportional to viscosity (μ). Higher velocity and larger vessels increase the likelihood of turbulence."
  },
  {
    question: "The 'dead zone' of a transducer can be assessed using which QA device?",
    options: ["Doppler phantom", "Hydrophone", "AIUM 100mm test object", "Calorimeter"],
    correctAnswer: "AIUM 100mm test object",
    explanation: "The AIUM 100mm test object contains a series of pins at known locations. The dead zone is evaluated by measuring the distance from the top of the phantom to the first pin that is clearly visualized."
  },
  {
    question: "Which of the following will decrease the mechanical index (MI)?",
    options: ["Increasing output power", "Decreasing frequency", "Using a wider beam", "Increasing frequency"],
    correctAnswer: "Increasing frequency",
    explanation: "MI is calculated as the peak rarefactional pressure divided by the square root of the center frequency (MI = P / √f). Therefore, increasing the frequency will decrease the MI, assuming pressure remains constant."
  },
  {
    question: "What is demodulation?",
    options: ["A type of focusing", "A receiver function that converts the echo voltage into a more useful form", "A method for reducing artifacts", "A component of the transducer"],
    correctAnswer: "A receiver function that converts the echo voltage into a more useful form",
    explanation: "Demodulation is a two-part receiver process consisting of rectification (turning negative voltages positive) and smoothing (enveloping) to prepare the signal for the scan converter."
  },
  {
    question: "An image created with high line density will have:",
    options: ["Poor spatial resolution", "Excellent spatial resolution", "High frame rate", "Low acoustic power"],
    correctAnswer: "Excellent spatial resolution",
    explanation: "High line density means there are more scan lines packed into the image, which improves the detail, or spatial resolution. However, it takes longer to acquire, so it degrades temporal resolution."
  },
  {
    question: "What happens to beam diameter in the Fraunhofer zone?",
    options: ["It converges to the focus", "It remains constant", "It diverges", "It oscillates"],
    correctAnswer: "It diverges",
    explanation: "The Fraunhofer zone, or far zone, is the region of the beam beyond the focus. In this region, the beam diverges, or spreads out."
  },
  {
    question: "A hydrophone is used to measure:",
    options: ["Tissue stiffness", "Acoustic output and intensity", "Blood pressure", "Doppler frequency shifts"],
    correctAnswer: "Acoustic output and intensity",
    explanation: "A hydrophone is a small probe with a piezoelectric element that can be placed in the sound beam to measure acoustic pressure, which can then be used to calculate other output parameters like power and intensity."
  },
  {
    question: "Spatial compounding is a technique used to:",
    options: ["Improve temporal resolution", "Reduce speckle and clutter artifacts", "Increase penetration", "Measure high velocities"],
    correctAnswer: "Reduce speckle and clutter artifacts",
    explanation: "Spatial compounding involves acquiring multiple frames from different steering angles and averaging them together. This process smooths out speckle and reduces clutter, improving image quality at the cost of temporal resolution."
  },
  {
    question: "The conversion of sound energy into heat is the primary mechanism for:",
    options: ["Reflection", "Refraction", "Absorption", "Scattering"],
    correctAnswer: "Absorption",
    explanation: "Absorption is the primary component of attenuation. It is the process by which the mechanical energy of the ultrasound wave is converted into heat within the tissue."
  },
  {
    question: "In M-mode, what does the vertical axis represent?",
    options: ["Time", "Depth", "Motion amplitude", "Signal strength"],
    correctAnswer: "Depth",
    explanation: "In an M-mode display, the vertical (Y) axis represents the depth of the reflectors along the single scan line."
  },
  {
    question: "Which artifact causes a hypoechoic region to appear at the edges of a curved structure?",
    options: ["Mirror image", "Enhancement", "Edge shadowing", "Reverberation"],
    correctAnswer: "Edge shadowing",
    explanation: "Edge shadowing, or shadowing by refraction, occurs when the sound beam hits the curved edge of a structure. The beam is bent (refracted) and diverges, resulting in a drop in intensity and a shadow at the edges."
  },
  {
    question: "The ability of a system to display a wide range of echo strengths is termed:",
    options: ["Dynamic range", "Sensitivity", "Contrast resolution", "Both A and C"],
    correctAnswer: "Both A and C",
    explanation: "Dynamic range is the range of signal intensities the system can process. Contrast resolution is the ability to visually distinguish between echoes of slightly different amplitudes. A wide dynamic range allows for better contrast resolution."
  },
  {
    question: "The pulse duration is the time from the start of a pulse to the _____ of that pulse.",
    options: ["start of the next pulse", "end", "peak", "halfway point"],
    correctAnswer: "end",
    explanation: "Pulse duration is the actual time that the pulse is 'on'. It is determined by the number of cycles in the pulse multiplied by the period of each cycle (PD = n × T)."
  },
  {
    question: "Which component of the ultrasound system stores the digital image data?",
    options: ["Pulser", "Receiver", "Scan Converter", "Display"],
    correctAnswer: "Scan Converter",
    explanation: "The scan converter is the system's memory. It receives the processed echo signals and stores them in a digital matrix (pixels) that corresponds to the final image."
  },
  {
    question: "What is the primary factor that determines the frame rate of a B-mode image?",
    options: ["Transducer frequency", "Overall gain", "Imaging depth", "Dynamic range"],
    correctAnswer: "Imaging depth",
    explanation: "Imaging depth is the main determinant of frame rate. Deeper imaging requires a longer go-return time for each scan line, which means it takes longer to build each frame, resulting in a lower frame rate."
  },
  {
    question: "Which statement about Power Doppler is TRUE?",
    options: ["It is angle-dependent", "It is prone to aliasing", "It has better temporal resolution than color Doppler", "It does not provide information on flow direction"],
    correctAnswer: "It does not provide information on flow direction",
    explanation: "Power Doppler only displays the amplitude or strength of the Doppler signal, not the velocity or direction. Its main advantages are high sensitivity to slow flow and less angle dependence."
  },
  {
    question: "The process of assigning specific brightness levels to the stored echo data before display is called:",
    options: ["Write magnification", "Gray-scale mapping", "Read magnification", "Scan conversion"],
    correctAnswer: "Gray-scale mapping",
    explanation: "Gray-scale mapping is a post-processing function that assigns a specific shade of gray to each pixel value in the scan converter's memory, allowing the user to change the contrast characteristics of the frozen image."
  },
  {
    question: "Which of the following describes sound that is below the range of human hearing?",
    options: ["Supersonic", "Hypersonic", "Ultrasound", "Infrasound"],
    correctAnswer: "Infrasound",
    explanation: "Infrasound refers to frequencies below 20 Hz, which is the lower limit of human hearing. Ultrasound is above 20,000 Hz (20 kHz)."
  },
  {
    question: "If the number of bits per pixel in a scan converter increases, what improves?",
    options: ["Temporal resolution", "Contrast resolution", "Axial resolution", "Lateral resolution"],
    correctAnswer: "Contrast resolution",
    explanation: "More bits per pixel allow the system to store a larger number of gray shades for each pixel. This ability to display more subtle variations in brightness improves the contrast resolution."
  },
  {
    question: "What is the relationship between stiffness and propagation speed?",
    options: ["They are inversely related", "They are directly related", "They are unrelated", "Stiffness is the square of speed"],
    correctAnswer: "They are directly related",
    explanation: "Propagation speed is directly related to the stiffness (or bulk modulus) of a medium. The stiffer the medium, the faster sound will travel through it."
  },
  {
    question: "Which part of a transducer creates the ultrasound pulse?",
    options: ["Matching layer", "Wire", "Backing material", "PZT element"],
    correctAnswer: "PZT element",
    explanation: "The active element, made of a piezoelectric material like Lead Zirconate Titanate (PZT), is what vibrates to create the sound pulse when a voltage is applied."
  },
  {
    question: "The term for echoes that have a lower signal amplitude than surrounding tissue is:",
    options: ["Hyperechoic", "Hypoechoic", "Anechoic", "Isoechoic"],
    correctAnswer: "Hypoechoic",
    explanation: "Hypoechoic structures produce weaker echoes and appear darker than the surrounding tissue."
  },
  {
    question: "The main disadvantage of Continuous Wave (CW) Doppler is:",
    options: ["Aliasing", "Poor temporal resolution", "Range ambiguity", "Low sensitivity"],
    correctAnswer: "Range ambiguity",
    explanation: "CW Doppler continuously transmits and receives, so it detects flow from anywhere along the beam path. It cannot determine the specific depth of the returning signals, which is known as range ambiguity."
  },
  {
    question: "If a sonographer increases the output power, what happens to the patient's exposure?",
    options: ["It decreases", "It remains the same", "It increases", "It depends on the PRF"],
    correctAnswer: "It increases",
    explanation: "Output power controls the intensity of the transmitted sound beam. Increasing the output power directly increases the acoustic energy being delivered to the patient."
  },
  {
    question: "What does the term 'write magnification' refer to?",
    options: ["Enlarging a frozen image", "Acquiring new data from a smaller region of interest", "Increasing the overall gain", "Applying a different color map"],
    correctAnswer: "Acquiring new data from a smaller region of interest",
    explanation: "Write magnification is a preprocessing function. The system rescans a selected region of interest, but with a higher line density, resulting in a truly zoomed-in image with improved spatial resolution compared to read magnification (post-processing zoom)."
  },
  {
    question: "The vertical axis on a Doppler spectrum represents:",
    options: ["Time", "Depth", "Velocity or Frequency Shift", "Signal Amplitude"],
    correctAnswer: "Velocity or Frequency Shift",
    explanation: "The Y-axis of a spectral Doppler display represents the magnitude of the Doppler shift, which is calibrated to display as velocity (e.g., in cm/s)."
  },
  {
    question: "Which artifact is characterized by a grainy, salt-and-pepper texture in the image?",
    options: ["Clutter", "Noise", "Speckle", "Banding"],
    correctAnswer: "Speckle",
    explanation: "Speckle is an artifact resulting from the constructive and destructive interference of scattered sound waves from the small, unresolved structures within tissue. It gives the image its characteristic grainy texture."
  },
  // New questions start here (29 questions)
  {
    question: "According to Poiseuille's law, flow rate is most dramatically affected by changes in which factor?",
    options: ["Vessel length", "Fluid viscosity", "Pressure gradient", "Vessel radius"],
    correctAnswer: "Vessel radius",
    explanation: "Poiseuille's law states that flow is proportional to the radius raised to the fourth power (r⁴). This means even a small change in radius has a massive impact on flow."
  },
  {
    question: "The Bernoulli principle describes an inverse relationship between:",
    options: ["Flow and pressure", "Velocity and pressure", "Area and velocity", "Viscosity and flow"],
    correctAnswer: "Velocity and pressure",
    explanation: "The Bernoulli principle states that in a region of high velocity flow (like a stenosis), the pressure exerted on the vessel walls is lowest."
  },
  {
    question: "A transducer with a high Q-factor typically has:",
    options: ["Heavy damping and wide bandwidth", "Heavy damping and narrow bandwidth", "Light damping and wide bandwidth", "Light damping and narrow bandwidth"],
    correctAnswer: "Light damping and narrow bandwidth",
    explanation: "Quality factor (Q-factor) is inversely related to bandwidth. A high Q-factor means the transducer rings for a long time (light damping), producing a pure tone with a narrow bandwidth. This is typical for CW Doppler transducers."
  },
  {
    question: "The 13-microsecond rule is a rule of thumb that states for every 13 µs of go-return time, a reflector is how deep in soft tissue?",
    options: ["1 mm", "1 cm", "13 cm", "13 mm"],
    correctAnswer: "1 cm",
    explanation: "Since sound travels at 1.54 mm/µs in soft tissue, it takes approximately 13 microseconds for a pulse to travel to a reflector 1 cm deep and return."
  },
  {
    question: "A comet-tail artifact is a specific form of reverberation that is most likely to occur with:",
    options: ["Two large, parallel soft tissue layers", "The diaphragm and liver", "Small, highly reflective objects like surgical clips", "A simple cyst"],
    correctAnswer: "Small, highly reflective objects like surgical clips",
    explanation: "Comet-tail is a form of reverberation where the reflections are very closely spaced, creating a tapering, bright trail. It's often seen with small, high-impedance objects like surgical clips or calcifications."
  },
  {
    question: "The bright, momentary flash of color that can obscure the color Doppler image, often caused by patient or transducer motion, is called:",
    options: ["Aliasing", "Crosstalk", "Clutter or Flash artifact", "Twinkle artifact"],
    correctAnswer: "Clutter or Flash artifact",
    explanation: "Flash artifact or clutter is caused by motion of tissue, which generates high-amplitude, low-frequency Doppler shifts that can overwhelm the weaker signals from blood flow."
  },
  {
    question: "When scanning a first-trimester fetus, which Thermal Index should be primarily monitored?",
    options: ["TIS (Soft Tissue)", "TIB (Bone)", "TIC (Cranial Bone)", "It does not matter"],
    correctAnswer: "TIS (Soft Tissue)",
    explanation: "In early pregnancy (first trimester), before significant ossification of bone, the TIS is the most relevant thermal index as the fetus is primarily composed of soft tissue."
  },
  {
    question: "The phenomenon of fluid being pushed forward and swirling due to the force of the sound beam is known as:",
    options: ["Cavitation", "Absorption", "Streaming", "Refraction"],
    correctAnswer: "Streaming",
    explanation: "Acoustic streaming is the bulk movement of fluid in a circular motion, caused by the absorption and transfer of momentum from the sound wave. It is a known mechanical bioeffect."
  },
  {
    question: "Huygens' principle is a concept that helps explain:",
    options: ["The Doppler effect", "The shape of a sound beam and diffraction", "Attenuation in tissue", "The piezoelectric effect"],
    correctAnswer: "The shape of a sound beam and diffraction",
    explanation: "Huygens' principle states that a large wave front can be considered as many small point sources. The interference pattern of these small sources explains the complex shape of an ultrasound beam and the phenomenon of diffraction."
  },
  {
    question: "The image processing technique that averages consecutive frames to reduce noise and smooth the image is called:",
    options: ["Edge enhancement", "Dynamic range", "Persistence", "Write magnification"],
    correctAnswer: "Persistence",
    explanation: "Persistence, also known as frame averaging, combines data from previous frames with the current frame. This smooths the image and reduces random noise, but it also reduces the temporal resolution."
  },
  {
    question: "The matching layer of a transducer is designed to be what thickness relative to the wavelength of sound in the matching layer?",
    options: ["One-half wavelength", "One-quarter wavelength", "One full wavelength", "It is not related to wavelength"],
    correctAnswer: "One-quarter wavelength",
    explanation: "For optimal energy transfer, the matching layer has an impedance that is the geometric mean of the crystal and tissue, and its thickness is one-quarter of the wavelength of sound within the layer."
  },
  {
    question: "Grating lobes are artifacts specifically associated with which type of transducer?",
    options: ["Mechanical sector", "Annular phased array", "Array transducers (linear, convex, phased)", "Single-element transducers"],
    correctAnswer: "Array transducers (linear, convex, phased)",
    explanation: "Grating lobes are off-axis beams of energy created by the regular, periodic spacing of elements in array transducers. They are similar to side lobes but are specific to arrays."
  },
  {
    question: "Read magnification is a form of:",
    options: ["Preprocessing", "Post-processing", "Signal acquisition", "Beam forming"],
    correctAnswer: "Post-processing",
    explanation: "Read magnification occurs on a frozen image. The system simply enlarges the existing pixels without acquiring new data, so spatial resolution is not improved."
  },
  {
    question: "The clear, anechoic region underneath the systolic peak in a normal laminar flow spectral waveform is called the:",
    options: ["Diastolic component", "Spectral window", "Baseline", "Nyquist limit"],
    correctAnswer: "Spectral window",
    explanation: "The spectral window represents the absence of echoes between the baseline and the peak of the waveform. It indicates that most red blood cells are moving at a uniform speed, which is characteristic of laminar flow."
  },
  {
    question: "Compared to stable cavitation, transient (or inertial) cavitation is considered:",
    options: ["Less harmful", "To occur at a lower MI", "More violent and destructive", "To produce a continuous signal"],
    correctAnswer: "More violent and destructive",
    explanation: "Transient cavitation involves the violent collapse of microbubbles, which creates shock waves and extremely high localized temperatures. It is a destructive process that occurs at higher MI values than stable cavitation."
  },
  {
    question: "Which of the following operator controls directly improves an image's signal-to-noise ratio (SNR)?",
    options: ["Increasing receiver gain", "Decreasing dynamic range", "Increasing output power", "Applying post-processing"],
    correctAnswer: "Increasing output power",
    explanation: "Output power increases the strength of the transmitted signal. A stronger signal returning from the tissue will be higher relative to the inherent electronic noise of the system, thus improving the SNR."
  },
  {
    question: "The standard unit for reporting ultrasound intensity is:",
    options: ["Watts (W)", "Pascals (Pa)", "Watts per square centimeter (W/cm²)", "Decibels (dB)"],
    correctAnswer: "Watts per square centimeter (W/cm²)",
    explanation: "Intensity is the concentration of power in an area. It is calculated as Power (W) / Area (cm²) and reported in units of W/cm² or mW/cm²."
  },
  {
    question: "Apodization is a technique used during transmission and reception to reduce the strength of which artifact?",
    options: ["Reverberation", "Shadowing", "Side and grating lobes", "Aliasing"],
    correctAnswer: "Side and grating lobes",
    explanation: "Apodization involves varying the voltage applied to the elements across the transducer array, with lower voltages at the edges. This reduces the energy of off-axis beams like side and grating lobes."
  },
  {
    question: "Coded excitation is a sophisticated function of the pulser that primarily improves:",
    options: ["Temporal resolution", "Axial resolution", "Signal-to-noise ratio and penetration", "Lateral resolution"],
    correctAnswer: "Signal-to-noise ratio and penetration",
    explanation: "Coded excitation uses long, complex pulses that are digitally compressed upon reception. This technique increases the transmitted energy without increasing the peak intensity, leading to better penetration and improved SNR."
  },
  {
    question: "In spectral Doppler, the artifact that causes the waveform to be mirrored on the opposite side of the baseline, even with correct flow direction, is called:",
    options: ["Aliasing", "Blossoming", "Crosstalk", "Clutter"],
    correctAnswer: "Crosstalk",
    explanation: "Crosstalk, or mirror imaging in spectral Doppler, is an artifact where the Doppler spectrum is duplicated on the opposite side of the baseline. It is often caused by excessive receiver gain or a Doppler angle near 90 degrees."
  },
  {
    question: "The post-processing technique that sharpens boundaries between tissues of different echogenicities is called:",
    options: ["Persistence", "Smoothing", "Edge enhancement", "Dynamic range compression"],
    correctAnswer: "Edge enhancement",
    explanation: "Edge enhancement is a filter applied to the image data that increases the contrast at sharp boundaries, making edges appear more distinct."
  },
  {
    question: "A calorimeter is a device used in quality assurance to measure:",
    options: ["The beam profile", "The total power of the ultrasound beam", "The speed of sound in the phantom", "The frequency of the transducer"],
    correctAnswer: "The total power of the ultrasound beam",
    explanation: "A calorimeter measures the total power of the entire sound beam through the process of absorption and the resulting temperature change (heat)."
  },
  {
    question: "When performing a QA test for uniformity, the sonographer is primarily looking for:",
    options: ["Correct depth calibration", "Clear visualization of small pins", "Consistent image brightness across the entire field of view", "Accurate Doppler velocity"],
    correctAnswer: "Consistent image brightness across the entire field of view",
    explanation: "The uniformity test assesses the system's ability to display echoes of the same amplitude with the same brightness, regardless of their position on the screen. It checks for variations or banding caused by inconsistent element performance."
  },
  {
    question: "In color Doppler imaging, what does the 'variance' map typically indicate?",
    options: ["Flow direction", "The average velocity", "The signal strength", "The degree of turbulence"],
    correctAnswer: "The degree of turbulence",
    explanation: "A variance map adds a third color (often green or yellow) to the standard red/blue map. This color indicates the spread of velocities within each sample, which is a hallmark of turbulent flow."
  },
  {
    question: "What is the general relationship between a medium's density and its propagation speed?",
    options: ["They are directly related", "They are inversely related", "They are unrelated", "Density is the square of speed"],
    correctAnswer: "They are inversely related",
    explanation: "Propagation speed is determined by stiffness divided by density. Therefore, for a given stiffness, a denser medium will have a slower speed of sound because there is more mass to move."
  },
  {
    question: "Using a heavy damping material in a transducer has what effect on its sensitivity?",
    options: ["It increases sensitivity", "It decreases sensitivity", "It has no effect on sensitivity", "It makes sensitivity variable"],
    correctAnswer: "It decreases sensitivity",
    explanation: "Heavy damping restricts the ringing of the crystal, which creates a short pulse for good axial resolution. However, this restriction also reduces the total amount of sound energy produced, thereby decreasing the transducer's sensitivity."
  },
  {
    question: "What is the fundamental building block of a digital image stored in the scan converter?",
    options: ["A byte", "A bit", "A pixel", "A voxel"],
    correctAnswer: "A pixel",
    explanation: "A pixel (picture element) is the smallest element of a 2D digital image. The scan converter is essentially a grid of pixels, with each pixel storing a number that corresponds to a shade of gray."
  },
  {
    question: "Section thickness artifact, where echoes are averaged across the thickness of the beam, is another name for:",
    options: ["Side lobe artifact", "Partial volume artifact", "Speed error artifact", "Refraction artifact"],
    correctAnswer: "Partial volume artifact",
    explanation: "This artifact is caused by poor elevational resolution (a thick beam slice). The system averages the echogenicity of all tissues within the slice, which can fill in anechoic structures. This is also known as slice or section thickness artifact."
  },
  {
    question: "Increasing the PRF on a color Doppler image will have what effect on the Nyquist limit?",
    options: ["It will decrease the Nyquist limit", "It will have no effect on the Nyquist limit", "It will increase the Nyquist limit", "It will cause aliasing"],
    correctAnswer: "It will increase the Nyquist limit",
    explanation: "The Nyquist limit is equal to PRF/2. Therefore, increasing the Pulse Repetition Frequency (PRF) directly increases the Nyquist limit, allowing the system to display higher velocities without aliasing."
  }
];
