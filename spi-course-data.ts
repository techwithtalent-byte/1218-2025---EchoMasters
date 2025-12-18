
import React from 'react';
import {
    LongitudinalWaveVisual,
    WaveParametersVisual,
    TissueInteractionVisual
} from './components/demos/FundamentalVisuals';
import {
    TransducerAnatomyVisual,
    ArrayTypesVisual,
    BeamFocusingVisual
} from './components/demos/TransducerVisuals';
import {
    DopplerPrincipleVisual,
    DopplerModesVisual,
    AliasingCorrectionVisual,
    SpectralWaveformVisual,
    TissueDopplerVisual
} from './components/demos/DopplerVisuals';
import { PulseEchoPrincipleVisual } from './components/demos/PulsedWaveVisuals';
import {
    PropagationArtifactsVisual,
    AttenuationArtifactsVisual
} from './components/demos/ArtifactVisuals';
import {
    BioeffectMechanismsVisual,
    SafetyIndicesVisual
} from './components/demos/SafetyVisuals';
import {
    FlowPatternsVisual,
    PhysicalPrinciplesVisual
} from './components/demos/HemodynamicsVisuals';
import { QaPhantomVisual } from './components/demos/QaVisuals';
import {
    AxialResolutionVisual,
    LateralResolutionVisual
} from './components/demos/ResolutionVisuals';
import {
    NonLinearPropagationVisual,
    HarmonicImagingVisual,
    ElastographyVisual,
    ThreeDVisual
} from './components/demos/HarmonicsVisuals';
import {
    ReceiverFunctionsVisual,
    DisplayModesVisual
} from './components/demos/InstrumentationVisuals';

export const spiCoursesExpanded = {
  courses: [
    {
      id: 'spi-main',
      title: 'Sonography Principles & Instrumentation',
      description: 'A comprehensive review of the core physics principles and instrumentation concepts required for the SPI board exam, organized by key topics.',
      modules: [
        {
          id: '1',
          title: 'Waves and Sound',
          description: 'Understanding the fundamental nature of sound, how it travels, and the parameters used to describe it.',
          learningObjectives: [
            'Define sound and its characteristics as a mechanical, longitudinal wave.',
            'Explain acoustic variables and the key parameters that describe a wave.',
            'Describe how sound interacts with different media through reflection and refraction.'
          ],
          topics: [
            {
              id: '1-1',
              title: 'Introduction to Waves: Types and Properties',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "Sound is a mechanical, longitudinal wave. Particles in the medium oscillate back and forth parallel to the direction of wave travel, creating areas of high pressure (compression) and low pressure (rarefaction). This interactive visual shows the particle motion and the corresponding pressure wave."),
                React.createElement(LongitudinalWaveVisual, null)
              ),
              keyPoints: [
                'Waves transfer energy, not matter. Sound is a longitudinal wave.',
                'Propagation speed (c) is determined only by the medium (stiffness and density).',
                'Frequency (f) is determined only by the sound source.',
                'Wavelength (λ) depends on both speed and frequency (λ = c/f).'
              ],
              examFocus: "Propagation speed (c) is medium-dependent. Frequency (f) is source-dependent. Wavelength (λ) is determined by both the frequency and the medium's propagation speed.",
              conceptCheck: { questionText: 'Which property of a medium has the greatest influence on propagation speed?', options: ['Temperature', 'Density', 'Stiffness', 'Viscosity'], correctAnswer: 'Stiffness', explanation: 'Propagation speed is directly related to stiffness. A stiffer medium allows sound to travel much faster.' }
            },
            {
              id: '1-2',
              title: 'Essential Wave Parameters',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "These parameters describe various aspects of a sound wave and directly impact image quality. Use the controls to see how frequency and amplitude affect the wave's shape and its calculated properties."),
                React.createElement(WaveParametersVisual, null)
              ),
              keyPoints: [
                'Wavelength (λ) is inversely proportional to frequency (f) and determines axial resolution.',
                'Period (T) is the reciprocal of frequency (T = 1/f).',
                'Amplitude (A) represents the wave\'s strength and corresponds to image brightness.',
                'Power is proportional to amplitude squared.'
              ],
              examFocus: 'Be able to calculate Period (T = 1/f) and Wavelength (λ = c/f) from given values. Understand that increasing output power increases wave amplitude and image brightness.',
              conceptCheck: { questionText: 'If you double the frequency of a transducer, what happens to the wavelength?', options: ['It doubles', 'It is halved', 'It stays the same', 'It quadruples'], correctAnswer: 'It is halved', explanation: 'Wavelength and frequency are inversely proportional (λ = c/f). If frequency doubles, the wavelength is cut in half.' }
            },
            {
              id: '1-3',
              title: 'Interaction with Media: Impedance, Reflection & Refraction',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "As sound travels, it interacts with tissue. The two most important interactions at a boundary are reflection (bouncing back) and refraction (bending). Use this simulation to see how different tissue boundaries affect the sound beam."),
                React.createElement(TissueInteractionVisual, null)
              ),
              keyPoints: ['Attenuation is the weakening of sound through absorption, scattering, and reflection.', 'Acoustic impedance mismatch between two tissues is required for reflection to occur.', 'Refraction (bending of the beam) requires both oblique incidence and a change in propagation speed.'],
              examFocus: 'Understand that impedance mismatch is the key to creating an image. Know the two conditions for refraction (oblique incidence & speed change).',
              conceptCheck: { questionText: 'For refraction to occur, you need oblique incidence and a difference in what between the two media?', options: ['Density', 'Impedance', 'Attenuation', 'Propagation speed'], correctAnswer: 'Propagation speed', explanation: 'Refraction is the bending of the beam, which only happens if the beam strikes a boundary at an angle and the propagation speeds of the two media are different.' }
            }
          ],
          quiz: { 
            questions: [
              { id: 'q1-1', questionText: 'The propagation speed of an ultrasound wave is determined by the:', options: ['Frequency of the transducer', 'Properties of the medium', 'Amplitude of the wave', 'Pulse Repetition Frequency (PRF)'], correctAnswer: 'Properties of the medium', explanation: 'Propagation speed is determined solely by the stiffness and density of the medium.' },
              { id: 'q1-2', questionText: 'Which acoustic parameter is determined by both the sound source and the medium?', options: ['Frequency', 'Period', 'Wavelength', 'Propagation Speed'], correctAnswer: 'Wavelength', explanation: 'Wavelength (λ) is calculated as propagation speed (c, a property of the medium) divided by frequency (f, a property of the source): λ = c/f.' },
              { id: 'q1-3', questionText: 'Sound travels fastest in which of the following media?', options: ['Air', 'Water', 'Soft Tissue', 'Bone'], correctAnswer: 'Bone', explanation: 'Sound travels fastest in solids with high stiffness and lowest in gases. The speed in bone is approx 4080 m/s, compared to 1540 m/s in soft tissue and 330 m/s in air.' },
              { id: 'q1-4', questionText: 'If the power of a wave is doubled, the intensity:', options: ['Doubles', 'Quadruples', 'Is halved', 'Remains the same'], correctAnswer: 'Doubles', explanation: 'Intensity is proportional to Power. If Power doubles, Intensity doubles. (Note: Intensity is proportional to Amplitude squared).' },
              { id: 'q1-5', questionText: 'A -3dB change in intensity means the intensity has:', options: ['Doubled', 'Tripled', 'Reduced to half', 'Reduced to one-tenth'], correctAnswer: 'Reduced to half', explanation: 'In the decibel scale, -3dB corresponds to a reduction of intensity by 50% (half).' }
            ] 
          }
        },
        {
          id: '2',
          title: 'Transducers',
          description: 'Exploring the heart of the ultrasound machine: how sound is generated and received.',
          learningObjectives: [
            'Explain the piezoelectric effect.',
            'Identify components of a transducer and their functions.',
            'Compare different types of transducer arrays and their clinical applications.',
            'Understand beam focusing and steering.'
          ],
          topics: [
            {
              id: '2-1',
              title: 'Transducer Components and the Piezoelectric Effect',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "The transducer is the key component that generates and receives sound waves. Its function relies on the piezoelectric effect, which converts electrical energy to sound and vice-versa."),
                React.createElement(TransducerAnatomyVisual, null)
              ),
              keyPoints: [
                'The PZT crystal\'s thickness determines the transducer\'s frequency (thinner = higher).',
                'Backing material shortens the pulse, improving axial resolution but decreasing sensitivity.',
                'The matching layer reduces impedance mismatch to improve sound transmission into the patient.'
              ],
              examFocus: 'Know the function of each transducer component, especially the trade-offs of the backing material (better axial resolution vs. lower sensitivity).',
              conceptCheck: { questionText: 'What is the primary trade-off when using a heavy backing material?', options: ['Better penetration for worse temporal resolution', 'Better axial resolution for worse sensitivity', 'Better lateral resolution for worse axial resolution', 'Higher frequency for worse penetration'], correctAnswer: 'Better axial resolution for worse sensitivity', explanation: 'The backing material shortens the pulse, improving axial resolution. However, it also dampens the crystal\'s vibration, reducing the overall output and thus decreasing sensitivity.' }
            },
            {
              id: '2-2',
              title: 'Array Types and Beam Formation',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "Modern transducers are arrays of many small PZT elements. The arrangement of these elements and how they are activated determines the image shape and application."),
                React.createElement(ArrayTypesVisual, null)
              ),
              keyPoints: [
                'Linear Array: Sequential firing, rectangular image (vascular).',
                'Curvilinear (Convex) Array: Sequential firing, blunted sector image (abdomen).',
                'Phased Array: Firing all elements with time delays for steering/focusing, sector image (cardiac).'
              ],
              examFocus: 'Know the key differences between array types: their beam formation method, image shape, and primary clinical applications.',
              conceptCheck: { questionText: 'Which transducer type uses time delays to steer and focus the beam from a small footprint?', options: ['Linear Array', 'Curvilinear Array', 'Phased Array', 'Annular Array'], correctAnswer: 'Phased Array', explanation: 'Phased arrays use minuscule time delays between the firing of each element to electronically steer and focus the beam, creating a sector image from a small starting point.' }
            },
            {
              id: '2-3',
              title: 'Beam Focusing',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "Focusing narrows the ultrasound beam, which is crucial for improving lateral resolution. Modern arrays use electronic focusing by applying a curved pattern of time delays to the array elements."),
                React.createElement(BeamFocusingVisual, null)
              ),
              keyPoints: [
                'Focusing improves lateral resolution by narrowing the beam width.',
                'The focus is the narrowest point of the beam.',
                'The near zone (Fresnel) is where the beam converges; the far zone (Fraunhofer) is where it diverges.'
              ],
              examFocus: 'Understand that focusing improves lateral resolution and that electronic focusing is accomplished with phased time delays.',
              conceptCheck: { questionText: 'Focusing the ultrasound beam has the greatest effect on which type of resolution?', options: ['Axial', 'Temporal', 'Contrast', 'Lateral'], correctAnswer: 'Lateral', explanation: 'Lateral resolution is determined by the beam width. Focusing narrows the beam, which directly improves lateral resolution, especially at the focal zone.' }
            }
          ],
          quiz: { 
            questions: [
              { id: 'q2-1', questionText: 'The function of the backing material in a transducer is to:', options: ['Increase sensitivity', 'Shorten the pulse to improve axial resolution', 'Focus the beam electronically', 'Match impedance with the skin'], correctAnswer: 'Shorten the pulse to improve axial resolution', explanation: 'The backing/damping material absorbs backward energy, shortening the pulse (SPL) which directly improves axial resolution. This comes at the cost of sensitivity.' },
              { id: 'q2-2', questionText: 'Which transducer is best suited for cardiac imaging through the ribs?', options: ['Linear Array', 'Curvilinear Array', 'Phased Array', 'Annular Array'], correctAnswer: 'Phased Array', explanation: 'The Phased Array has a small footprint to fit between the ribs and uses electronic steering to create a wide, sector-shaped field of view, ideal for cardiac imaging.' },
              { id: 'q2-3', questionText: 'What determines the operating frequency of a pulsed wave transducer?', options: ['Thickness of the matching layer', 'Propagation speed in the tissue', 'Thickness of the PZT element', 'Diameter of the transducer'], correctAnswer: 'Thickness of the PZT element', explanation: 'The resonant frequency is determined by the thickness of the piezoelectric element and the speed of sound within it. Thinner elements produce higher frequencies.' },
              { id: 'q2-4', questionText: 'The thickness of the matching layer is typically:', options: ['One wavelength', 'One-half wavelength', 'One-quarter wavelength', 'Two wavelengths'], correctAnswer: 'One-quarter wavelength', explanation: 'The optimal thickness for the matching layer is one-quarter of the wavelength of sound in the matching layer material.' },
              { id: 'q2-5', questionText: 'Electronic steering of the sound beam is accomplished by:', options: ['Mechanically moving the elements', 'Applying time delays to the electrical spikes', 'Using a curved lens', 'Curving the PZT elements'], correctAnswer: 'Applying time delays to the electrical spikes', explanation: 'Beam steering in array transducers is achieved by phasing, or applying small time delays to the excitation signals of the individual elements.' }
            ] 
          }
        },
        {
          id: '3',
          title: 'Pulsed Wave Operation',
          description: 'Understanding how pulsed ultrasound is used to create an image and the critical timing parameters involved.',
          learningObjectives: ['Explain the pulse-echo technique.', 'Define key pulsed sound parameters.', 'Understand the relationship between PRF, PRP, and imaging depth.'],
          topics: [
            {
              id: '3-1',
              title: 'The Pulse-Echo Principle',
              content: React.createElement(React.Fragment, null,
                React.createElement("p", null, "Diagnostic ultrasound works by sending out short pulses of sound and listening for the echoes that return. The time it takes for an echo to return is used to determine the depth of the structure that created it. Drag the target in this simulation to see how depth directly affects the time-of-flight."),
                React.createElement(PulseEchoPrincipleVisual, null)
              ),
              keyPoints: [
                'The range equation (Depth = speed × time / 2) is fundamental to B-mode imaging.',
                'A deeper target results in a longer time-of-flight for the echo.',
                'The machine assumes a constant speed of 1.54 mm/µs in soft tissue (the 13µs rule).'
              ],
              examFocus: 'Know the range equation and understand the direct relationship between reflector depth and the echo\'s go-return time.',
              conceptCheck: { questionText: 'Why is the time-of-flight divided by 2 in the range equation?', options: ['To account for attenuation', 'To correct for frequency', 'To account for the round-trip travel time', 'To simplify the math'], correctAnswer: 'To account for the round-trip travel time', explanation: 'The time measured is for the pulse to travel to the reflector AND back. We only want the distance one way, so we divide the total travel time by two.' }
            }
          ],
          quiz: { 
            questions: [
              { id: 'q3-1', questionText: 'If you increase the imaging depth, what must happen to the Pulse Repetition Period (PRP)?', options: ['It must increase', 'It must decrease', 'It remains the same', 'It is unrelated to depth'], correctAnswer: 'It must increase', explanation: 'Deeper imaging requires a longer "listening time" for the echo to return, so the time between pulses (PRP) must increase.' },
              { id: 'q3-2', questionText: 'The fraction of time that the ultrasound system is transmitting a pulse is called the:', options: ['Pulse Repetition Frequency', 'Duty Factor', 'Spatial Pulse Length', 'Period'], correctAnswer: 'Duty Factor', explanation: 'Duty Factor is the percentage of time the system is transmitting. For clinical imaging, it is very low (<1%), meaning the system spends most time listening.' },
              { id: 'q3-3', questionText: 'Which of the following parameters is determined by both the sound source and the medium?', options: ['Period', 'Frequency', 'Spatial Pulse Length', 'Pulse Duration'], correctAnswer: 'Spatial Pulse Length', explanation: 'SPL depends on the number of cycles (source) and the wavelength (which depends on the medium\'s propagation speed).' },
              { id: 'q3-4', questionText: 'If the PRF increases, the PRP:', options: ['Increases', 'Decreases', 'Remains the same', 'Doubles'], correctAnswer: 'Decreases', explanation: 'PRF and PRP are reciprocals. If the frequency of pulses increases, the time between them (period) must decrease.' },
              { id: 'q3-5', questionText: 'Using the 13-microsecond rule, how long does it take for a pulse to travel to a reflector 2 cm deep and return?', options: ['13 µs', '26 µs', '39 µs', '52 µs'], correctAnswer: '26 µs', explanation: 'It takes 13 µs for every 1 cm of depth (round trip). For 2 cm, it is 13 µs * 2 = 26 µs.' }
            ] 
          }
        },
        {
          id: '4',
          title: 'Doppler Effect',
          description: 'Measuring motion and blood flow using the principles of the Doppler effect.',
          learningObjectives: ['Explain the Doppler effect and its equation.', 'Differentiate between CW, PW, Color, and Power Doppler.', 'Define aliasing and the Nyquist limit.'],
          topics: [
            {
              id: '4-1',
              title: 'The Doppler Principle',
              content: React.createElement(DopplerPrincipleVisual, null),
              keyPoints: ['Doppler shift is the difference between transmitted and received frequencies.', 'Positive shift = toward transducer; Negative shift = away.', 'Doppler shift is proportional to velocity and the cosine of the angle.'],
              examFocus: 'Know the Doppler equation: Δf = (2 * f₀ * v * cosθ) / c. Understand that the most accurate velocity is at 0 degrees, and no shift is detected at 90 degrees.',
              conceptCheck: { questionText: 'At what Doppler angle will you measure a zero Doppler shift, regardless of flow velocity?', options: ['0°', '45°', '60°', '90°'], correctAnswer: '90°', explanation: 'The Doppler shift is multiplied by the cosine of the angle. The cosine of 90° is 0, so the entire equation becomes zero, meaning no Doppler shift can be detected.' }
            },
            {
              id: '4-2',
              title: 'Doppler Modalities',
              content: React.createElement(DopplerModesVisual, null),
              keyPoints: ['CW: No aliasing, but range ambiguity.', 'PW: Range resolution, but aliasing occurs when Doppler shift > PRF/2 (Nyquist Limit).', 'Color Doppler: Shows mean velocity and direction (BART).', 'Power Doppler: Most sensitive, shows presence of flow, no direction/velocity info.'],
              examFocus: 'Know the main advantages and disadvantages of CW vs. PW. Understand the cause of aliasing and how to correct it (increase PRF, lower frequency, etc.).',
              conceptCheck: { questionText: 'Which Doppler mode is best for detecting very slow flow in small vessels but provides no directional info?', options: ['CW Doppler', 'PW Doppler', 'Color Doppler', 'Power Doppler'], correctAnswer: 'Power Doppler', explanation: 'Power Doppler is the most sensitive mode for detecting the presence of flow, even if it is very slow. Its main trade-off is that it does not provide velocity or direction information.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q4-1', questionText: 'Aliasing is an artifact unique to which Doppler modality?', options: ['Continuous Wave (CW)', 'Pulsed Wave (PW)', 'Power Doppler', 'All of the above'], correctAnswer: 'Pulsed Wave (PW)', explanation: 'Aliasing occurs in PW Doppler when the measured velocity exceeds the Nyquist Limit (PRF/2). CW Doppler does not have a PRF and therefore does not alias.' },
              { id: 'q4-2', questionText: 'What is the relationship between the Doppler shift and the cosine of the insonation angle?', options: ['Inversely related', 'Directly related', 'Unrelated', 'Exponentially related'], correctAnswer: 'Directly related', explanation: 'According to the Doppler equation, the shift is directly proportional to the cosine of the angle. A larger cosine (closer to 0 degrees) yields a larger shift.' },
              { id: 'q4-3', questionText: 'Which of the following will eliminate aliasing?', options: ['Increasing the frequency', 'Decreasing the PRF', 'Moving the baseline down', 'Using Continuous Wave Doppler'], correctAnswer: 'Using Continuous Wave Doppler', explanation: 'CW Doppler continuously samples and has no Nyquist limit, thus it cannot alias. Adjusting baseline is a cosmetic fix, not elimination.' },
              { id: 'q4-4', questionText: 'Color Doppler reports ____________ velocities, while Spectral Doppler reports ____________ velocities.', options: ['Mean; Peak', 'Peak; Mean', 'Peak; Peak', 'Mean; Mean'], correctAnswer: 'Mean; Peak', explanation: 'Color Doppler estimates the average (mean) velocity in a region, whereas spectral Doppler traces the peak velocities over time.' },
              { id: 'q4-5', questionText: 'A "variance mode" color map adds which color to indicate turbulence?', options: ['Yellow', 'Green', 'Black', 'White'], correctAnswer: 'Green', explanation: 'Variance mode maps add a third color (usually green or yellow) to the standard red/blue to indicate the variance or spread of velocities, which is a sign of turbulence.' }
            ]
          }
        },
        {
          id: '5',
          title: 'Imaging Artifacts',
          description: 'Recognizing and understanding common imaging artifacts that are a result of physics principles.',
          learningObjectives: ['Identify common artifacts like reverberation, shadowing, enhancement, and mirror image.', 'Explain the physical principles that cause these artifacts.'],
          topics: [
             {
              id: '5-1',
              title: 'Propagation Group Artifacts',
              content: React.createElement(PropagationArtifactsVisual, null),
              keyPoints: ['Reverberation: Sound bounces between two strong parallel reflectors.', 'Mirror Image: Sound bounces off a strong specular reflector (like the diaphragm), creating a duplicate image.'],
              examFocus: 'Be able to identify these artifacts visually and know their underlying cause related to the sound path.',
              conceptCheck: { questionText: 'The mirror image artifact places a duplicate structure where?', options: ['Shallower than the true object', 'Deeper than the true object', 'Beside the true object', 'On top of the true object'], correctAnswer: 'Deeper than the true object', explanation: 'The machine assumes the longer travel time of the reflected path is due to depth, so it places the artifactual image deeper than the mirror.' }
            },
            {
              id: '5-2',
              title: 'Attenuation Group Artifacts',
              content: React.createElement(AttenuationArtifactsVisual, null),
              keyPoints: ['Shadowing: Caused by a highly attenuating or reflecting object.', 'Enhancement: Caused by a weakly attenuating object.'],
              examFocus: 'Understand the opposing principles of shadowing and enhancement and be able to identify which structures cause them.',
              conceptCheck: { questionText: 'A simple renal cyst will most likely cause which artifact?', options: ['Shadowing', 'Enhancement', 'Reverberation', 'Mirror Image'], correctAnswer: 'Enhancement', explanation: 'Fluid-filled structures like cysts attenuate sound less than surrounding tissue. This makes the tissue deep to the cyst appear artifactually bright, which is called enhancement.' }
            }
          ],
          quiz: { 
            questions: [
              { id: 'q5-1', questionText: 'Posterior acoustic enhancement is typically seen deep to what kind of structure?', options: ['A highly attenuating structure like a bone', 'A structure with a high acoustic impedance', 'A fluid-filled structure like a cyst', 'A gas-filled structure like bowel'], correctAnswer: 'A fluid-filled structure like a cyst', explanation: 'Fluid attenuates sound much less than soft tissue. Therefore, the sound beam is stronger after passing through a cyst, causing the tissues behind it to appear brighter (enhancement).' },
              { id: 'q5-2', questionText: 'Reverberation artifact appears as:', options: ['A solid hyperechoic line', 'Multiple, equally spaced parallel lines', 'A black shadow', 'A duplicate image'], correctAnswer: 'Multiple, equally spaced parallel lines', explanation: 'Reverberation is caused by sound bouncing back and forth between two strong reflectors, creating echoes that arrive at equal time intervals.' },
              { id: 'q5-3', questionText: 'Edge shadowing is caused by:', options: ['Reflection', 'Absorption', 'Refraction', 'Scattering'], correctAnswer: 'Refraction', explanation: 'When the sound beam strikes a curved surface at an oblique angle, it refracts (bends) and diverges, causing a loss of intensity (shadow) extending from the edge.' },
              { id: 'q5-4', questionText: 'If the speed of sound in a mass is slower than 1540 m/s, the structures behind it will appear:', options: ['Too shallow', 'Too deep', 'At the correct depth', 'To be moving'], correctAnswer: 'Too deep', explanation: 'Slower speed means longer travel time. The machine assumes 1540 m/s, so it interprets the extra time as extra depth.' },
              { id: 'q5-5', questionText: 'Which artifact involves the averaging of intensities from adjacent tissues within the beam thickness?', options: ['Side lobe artifact', 'Slice thickness artifact', 'Mirror image artifact', 'Speed error artifact'], correctAnswer: 'Slice thickness artifact', explanation: 'Slice thickness (partial volume) artifact occurs when the beam is wider than the structure being imaged (in the elevational plane), causing echoes from surrounding tissue to be averaged into the image, often filling in cystic structures.' }
            ] 
          }
        },
        {
          id: '6',
          title: 'Bioeffects and Safety',
          description: 'Ensuring the safe and effective use of diagnostic ultrasound.',
          learningObjectives: ['Define the ALARA principle.', 'Explain the two primary mechanisms for bioeffects: thermal and mechanical.', 'Understand the meaning of the on-screen safety indices, TI and MI.'],
          topics: [
             {
              id: '6-1',
              title: 'The ALARA Principle & Bioeffect Mechanisms',
              content: React.createElement(BioeffectMechanismsVisual, null),
              keyPoints: ['ALARA: Use the lowest power and shortest time to get a diagnostic image.', 'Output power is the primary control that affects patient exposure.', 'Receiver gain does NOT affect patient exposure.'],
              examFocus: 'Memorize the ALARA principle and differentiate between controls that affect patient exposure (output power, scan time) and those that do not (gain, TGC).',
              conceptCheck: { questionText: 'Which control adjustment does NOT change the patient\'s acoustic exposure?', options: ['Increasing output power', 'Increasing receiver gain', 'Increasing scan time', 'Switching from B-Mode to PW Doppler'], correctAnswer: 'Increasing receiver gain', explanation: 'Receiver gain only amplifies the echoes that have already returned from the patient. It does not change the intensity of the sound sent into the patient.' }
            },
            {
              id: '6-2',
              title: 'Safety Indices (TI and MI)',
              content: React.createElement(SafetyIndicesVisual, null),
              keyPoints: ['Thermal (TI): Relates to tissue heating. Most significant with focused, stationary beams like Spectral Doppler.', 'Mechanical (MI): Relates to cavitation (bubble interaction). More likely with low frequency and high pressure.', 'Spectral Doppler has the highest acoustic output, followed by Color Doppler, then B-Mode.'],
              examFocus: 'Know what TI and MI stand for and which bioeffect each represents. Understand which imaging modes carry the highest potential risk.',
              conceptCheck: { questionText: 'Which imaging mode generally has the highest acoustic output and poses the greatest risk for thermal effects?', options: ['B-Mode', 'M-Mode', 'Color Doppler', 'Spectral Doppler'], correctAnswer: 'Spectral Doppler', explanation: 'Spectral Doppler holds the beam stationary over a single line for an extended period, concentrating acoustic energy and leading to the highest temporal average intensity and TI values.' }
            }
          ],
          quiz: { 
            questions: [
              { id: 'q6-1', questionText: 'Which machine control has the most direct impact on patient exposure?', options: ['Gain', 'TGC', 'Dynamic Range', 'Output Power'], correctAnswer: 'Output Power', explanation: 'Output Power controls the intensity of the sound beam entering the patient, directly affecting exposure. Gain only amplifies the returning echoes.' },
              { id: 'q6-2', questionText: 'The Mechanical Index (MI) is a predictor of:', options: ['Tissue heating', 'Cavitation', 'Electrical shock', 'Image resolution'], correctAnswer: 'Cavitation', explanation: 'MI estimates the likelihood of non-thermal bioeffects, specifically cavitation (the formation and behavior of gas bubbles).' },
              { id: 'q6-3', questionText: 'Stable cavitation refers to bubbles that:', options: ['Burst immediately', 'Oscillate in size but do not burst', 'Dissolve in the tissue', 'Travel through the bloodstream'], correctAnswer: 'Oscillate in size but do not burst', explanation: 'Stable cavitation involves the rhythmic expansion and contraction of microbubbles in the sound field without violent collapse.' },
              { id: 'q6-4', questionText: 'Which device is used to measure the acoustic pressure and intensity of the ultrasound beam?', options: ['Thermocouple', 'Hydrophone', 'Calorimeter', 'Phantom'], correctAnswer: 'Hydrophone', explanation: 'A hydrophone is a specialized micro-probe used in QA labs to measure pressure variations and calculate beam intensity.' },
              { id: 'q6-5', questionText: 'According to AIUM guidelines, a focused beam intensity (SPTA) below what level is considered safe?', options: ['1 mW/cm²', '100 mW/cm²', '1 W/cm²', '10 W/cm²'], correctAnswer: '1 W/cm²', explanation: 'There have been no confirmed biological effects in mammalian tissues exposed to unfocused ultrasound with intensities below 100 mW/cm², or focused ultrasound below 1 W/cm².' }
            ] 
          }
        },
        {
          id: '7',
          title: 'Hemodynamics',
          description: 'The physics of blood flow and the factors that influence it.',
          learningObjectives: ['Understand the relationship between flow, pressure, and resistance (Poiseuille\'s Law).', 'Differentiate laminar vs. turbulent flow.', 'Explain the Bernoulli principle in relation to stenosis.'],
          topics: [
            {
              id: '7-1',
              title: 'Flow Dynamics',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Blood flows due to an energy gradient. Laminar flow is the normal, layered pattern found in straight vessels. Turbulence occurs when flow becomes chaotic, often due to high velocity or a stenosis."), React.createElement(FlowPatternsVisual, null)),
              keyPoints: ['Blood moves from high energy to low energy.', 'Laminar flow has a parabolic profile (fastest in center).', 'Turbulence is predicted by a Reynolds number > 2000.'],
              examFocus: 'Reynolds number > 2000 predicts turbulence. Laminar flow is the normal state.',
              conceptCheck: { questionText: 'What is the primary predictor of turbulent flow?', options: ['Bernoulli Principle', 'Reynolds Number', 'Poiseuille\'s Law', 'Doppler Shift'], correctAnswer: 'Reynolds Number', explanation: 'The Reynolds number is a dimensionless unit that predicts whether flow is laminar or turbulent. Values over 2000 indicate turbulence.' }
            },
            {
              id: '7-2',
              title: 'Poiseuille\'s Law and Stenosis',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Poiseuille's law describes the relationship between flow, pressure, and resistance. The radius of the vessel has a massive impact on flow."), React.createElement(PhysicalPrinciplesVisual, null)),
              keyPoints: ['Flow is proportional to the radius to the 4th power.', 'At a stenosis, velocity increases and pressure decreases (Bernoulli).'],
              examFocus: 'Know that radius has the biggest impact on flow. Understand the velocity/pressure trade-off at a stenosis.',
              conceptCheck: { questionText: 'According to the Bernoulli principle, where is the pressure lowest in a vessel with a stenosis?', options: ['Proximal to the stenosis', 'Inside the stenosis', 'Distal to the stenosis', 'Pressure is constant'], correctAnswer: 'Inside the stenosis', explanation: 'To maintain flow, velocity must increase through the narrow stenosis. As kinetic energy (velocity) increases, potential energy (pressure) must decrease to satisfy conservation of energy.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q7-1', questionText: 'Which factor has the greatest effect on flow resistance?', options: ['Vessel length', 'Viscosity', 'Vessel radius', 'Pressure gradient'], correctAnswer: 'Vessel radius', explanation: 'Resistance is inversely proportional to the radius to the 4th power. A small change in radius causes a huge change in resistance.' },
              { id: 'q7-2', questionText: 'Turbulent flow is likely to occur when the Reynolds number exceeds:', options: ['100', '1000', '2000', '1,000,000'], correctAnswer: '2000', explanation: 'A Reynolds number above 2000 is the threshold for predicting turbulent flow.' },
              { id: 'q7-3', questionText: 'In a stenosis, velocity __________ and pressure __________.', options: ['increases; increases', 'decreases; decreases', 'increases; decreases', 'decreases; increases'], correctAnswer: 'increases; decreases', explanation: 'Bernoulli\'s principle: As velocity increases at the stenosis, pressure drops.' },
              { id: 'q7-4', questionText: 'Normally, blood flows in layers with the fastest velocity in the center. This is called:', options: ['Plug flow', 'Laminar flow', 'Turbulent flow', 'Disturbed flow'], correctAnswer: 'Laminar flow', explanation: 'Laminar (parabolic) flow is the normal pattern where layers of blood slide over each other.' },
              { id: 'q7-5', questionText: 'Hydrostatic pressure in a standing patient is highest at the:', options: ['Head', 'Heart', 'Fingertips', 'Ankles'], correctAnswer: 'Ankles', explanation: 'Hydrostatic pressure is the weight of the blood column. It is highest at the lowest point (ankles) due to gravity.' }
            ]
          }
        },
        {
          id: '8',
          title: 'Quality Assurance',
          description: 'Protocols for maintaining system performance and diagnostic accuracy.',
          learningObjectives: ['Identify QA devices.', 'Understand performance measures like sensitivity and dead zone.', 'Interpret QA results.'],
          topics: [
            {
              id: '8-1',
              title: 'QA Phantoms and Tests',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Regular testing with tissue-equivalent phantoms ensures the machine measures distance correctly and resolves structures."), React.createElement(QaPhantomVisual, null)),
              keyPoints: ['Tissue equivalent phantoms mimic soft tissue speed (1540 m/s) and attenuation.', 'Dead zone is the area at the top of the image where data is unreliable.', 'Registration accuracy checks if pins are placed in the correct location.'],
              examFocus: 'Know what a tissue-equivalent phantom tests (everything) vs. a Doppler phantom (flow). Dead zone is the shallowest depth of visualization.',
              conceptCheck: { questionText: 'Which phantom is used to evaluate gray scale and tissue texture?', options: ['Doppler phantom', 'Slice thickness phantom', 'Tissue equivalent phantom', 'Beam profile slice'], correctAnswer: 'Tissue equivalent phantom', explanation: 'Tissue equivalent phantoms have attenuation properties similar to soft tissue and contain structures to test gray scale and texture.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q8-1', questionText: 'The region closest to the transducer where images are inaccurate is called the:', options: ['Focal zone', 'Dead zone', 'Fraunhofer zone', 'Sensitivity zone'], correctAnswer: 'Dead zone', explanation: 'The dead zone is the superficial area where the system cannot process echoes due to the transducer ringing time.' },
              { id: 'q8-2', questionText: 'A tissue equivalent phantom mimics soft tissue in terms of:', options: ['Speed of sound and density', 'Speed of sound and attenuation', 'Density and impedance', 'Temperature and stiffness'], correctAnswer: 'Speed of sound and attenuation', explanation: 'Phantoms are designed to have the same speed (1540 m/s) and attenuation rate as soft tissue.' },
              { id: 'q8-3', questionText: 'The ability of a system to display low-level echoes is called:', options: ['Dynamic range', 'Sensitivity', 'Uniformity', 'Registration'], correctAnswer: 'Sensitivity', explanation: 'Sensitivity measures the system\'s ability to detect weak echoes from deep structures.' },
              { id: 'q8-4', questionText: 'Vertical depth calibration accuracy is assessed by measuring:', options: ['Pins parallel to the beam', 'Pins perpendicular to the beam', 'The width of a pin', 'The brightness of a pin'], correctAnswer: 'Pins parallel to the beam', explanation: 'Vertical accuracy is checked by measuring the distance between pins positioned along the beam\'s axis.' },
              { id: 'q8-5', questionText: 'Which device is used to test the accuracy of Doppler velocities?', options: ['AIUM 100mm test object', 'Tissue equivalent phantom', 'Flow phantom', 'Hydrophone'], correctAnswer: 'Flow phantom', explanation: 'A flow phantom (string or fluid) moves at a known velocity to calibrate Doppler measurements.' }
            ]
          }
        },
        {
          id: '9',
          title: 'Resolution',
          description: 'Deep dive into the three spatial dimensions of resolution: Axial, Lateral, and Elevational.',
          learningObjectives: ['Define LARRD and LATA resolution.', 'Explain how frequency and focusing affect resolution.', 'Understand slice thickness.'],
          topics: [
            {
              id: '9-1',
              title: 'Axial Resolution',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Axial resolution is the ability to separate structures parallel to the beam. It is determined by the Spatial Pulse Length."), React.createElement(AxialResolutionVisual, null)),
              keyPoints: ['LARRD: Longitudinal, Axial, Range, Radial, Depth.', 'Formula: SPL / 2.', 'Improved by: Higher frequency (shorter wavelength) and Damping (fewer cycles).'],
              examFocus: 'Axial resolution = SPL/2. Higher frequency = Better axial resolution.',
              conceptCheck: { questionText: 'Which factor does NOT affect axial resolution?', options: ['Frequency', 'Damping', 'Beam Width', 'Pulse Length'], correctAnswer: 'Beam Width', explanation: 'Beam width affects lateral resolution, not axial.' }
            },
            {
              id: '9-2',
              title: 'Lateral Resolution',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Lateral resolution is the ability to separate structures perpendicular to the beam. It is determined by the beam width."), React.createElement(LateralResolutionVisual, null)),
              keyPoints: ['LATA: Lateral, Angular, Transverse, Azimuthal.', 'Best at the focus where the beam is narrowest.', 'Improved by focusing.'],
              examFocus: 'Lateral resolution = Beam Width. Focusing improves it.',
              conceptCheck: { questionText: 'Lateral resolution is best at the:', options: ['Near zone', 'Focus', 'Far zone', 'Face of transducer'], correctAnswer: 'Focus', explanation: 'The beam is narrowest at the focus, providing the best lateral resolution.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q9-1', questionText: 'Axial resolution is determined by:', options: ['Beam width', 'Pulse duration', 'Spatial Pulse Length', 'Frame rate'], correctAnswer: 'Spatial Pulse Length', explanation: 'Axial resolution is equal to half the Spatial Pulse Length (SPL/2).' },
              { id: 'q9-2', questionText: 'Lateral resolution is best:', options: ['In the far field', 'At the focus', 'At the transducer face', 'It is constant'], correctAnswer: 'At the focus', explanation: 'Lateral resolution equals beam width. The beam is narrowest at the focus.' },
              { id: 'q9-3', questionText: 'Which resolution is typically the poorest in 1D array transducers?', options: ['Axial', 'Lateral', 'Elevational (Slice Thickness)', 'Temporal'], correctAnswer: 'Elevational (Slice Thickness)', explanation: 'Elevational resolution is determined by the thickness of the beam perpendicular to the scan plane. In 1D arrays, it is fixed by a lens and usually the thickest dimension.' },
              { id: 'q9-4', questionText: 'Higher frequency improves:', options: ['Only axial resolution', 'Only lateral resolution', 'Both axial and lateral resolution', 'Neither'], correctAnswer: 'Both axial and lateral resolution', explanation: 'Higher frequency shortens the pulse (better axial) and creates a narrower beam with less divergence (better lateral).' },
              { id: 'q9-5', questionText: 'Using multiple focal zones improves ______ but degrades ______.', options: ['Lateral resolution; Temporal resolution', 'Axial resolution; Lateral resolution', 'Temporal resolution; Contrast resolution', 'Lateral resolution; Axial resolution'], correctAnswer: 'Lateral resolution; Temporal resolution', explanation: 'Multi-focus creates a narrower effective beam over a longer depth (better lateral), but requires more pulses per line, slowing the frame rate (worse temporal).' }
            ]
          }
        },
        {
          id: '10',
          title: 'Harmonics & Contrast',
          description: 'Advanced imaging techniques utilizing non-linear propagation and microbubbles.',
          learningObjectives: ['Explain tissue harmonic imaging.', 'Understand contrast agents.', 'Define MI implications.'],
          topics: [
            {
              id: '10-1',
              title: 'Tissue Harmonic Imaging',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Harmonics are created by non-linear sound propagation in tissue. Processing the harmonic frequency (2x fundamental) creates a cleaner image."), React.createElement(NonLinearPropagationVisual, null), React.createElement(HarmonicImagingVisual, null)),
              keyPoints: ['Harmonics are created in the tissue, not the transducer.', 'Reduces near-field clutter (reverberation).', 'Narrows the beam (better lateral resolution).'],
              examFocus: 'Harmonics = 2x Fundamental Frequency. Created during transmission in tissue. Primary benefit: Reduced artifact/clutter.',
              conceptCheck: { questionText: 'Where are tissue harmonics created?', options: ['In the pulser', 'In the transducer crystal', 'In the tissues', 'In the receiver'], correctAnswer: 'In the tissues', explanation: 'Harmonics are generated by the non-linear behavior of the sound wave as it travels through tissue.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q10-1', questionText: 'If the fundamental frequency is 2 MHz, the harmonic frequency is:', options: ['1 MHz', '2 MHz', '4 MHz', '8 MHz'], correctAnswer: '4 MHz', explanation: 'The harmonic frequency is twice the fundamental frequency.' },
              { id: 'q10-2', questionText: 'Harmonic imaging improves image quality primarily by:', options: ['Increasing penetration', 'Reducing near-field clutter and artifacts', 'Improving temporal resolution', 'Widening the beam'], correctAnswer: 'Reducing near-field clutter and artifacts', explanation: 'Harmonics bypass the superficial distorting layers, reducing reverberation and haze.' },
              { id: 'q10-3', questionText: 'Contrast agents are typically composed of:', options: ['Saline bubbles', 'Gas-filled microbubbles', 'Radioactive isotopes', 'Iodine dye'], correctAnswer: 'Gas-filled microbubbles', explanation: 'Ultrasound contrast agents are engineered microbubbles containing gas (like perfluorocarbon) stabilized by a shell.' },
              { id: 'q10-4', questionText: 'Which Mechanical Index (MI) setting is best for contrast imaging to avoid bubble destruction?', options: ['High MI (> 1.0)', 'Low MI (< 0.3)', 'Medium MI (0.5)', 'MI does not matter'], correctAnswer: 'Low MI (< 0.3)', explanation: 'Low MI causes non-linear oscillation (resonance) without destroying the bubbles, which is ideal for real-time imaging.' },
              { id: 'q10-5', questionText: 'Harmonics are produced by:', options: ['Linear propagation', 'Non-linear propagation', 'Reflection', 'Absorption'], correctAnswer: 'Non-linear propagation', explanation: 'Sound travels faster in compressions and slower in rarefactions, distorting the wave shape and creating harmonics.' }
            ]
          }
        },
        {
          id: '11',
          title: 'Instrumentation',
          description: 'The components of the ultrasound system and how they process signals.',
          learningObjectives: ['List the receiver functions.', 'Understand scan conversion.', 'Differentiate pre- and post-processing.'],
          topics: [
            {
              id: '11-1',
              title: 'Receiver Functions',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "The receiver processes the tiny electrical signals from the transducer. There are 5 mandatory functions."), React.createElement(ReceiverFunctionsVisual, null)),
              keyPoints: ['Amplification (Gain): Increases all signals.', 'Compensation (TGC): Corrects for attenuation.', 'Compression (Dynamic Range): Grayscale mapping.', 'Demodulation: Rectification/Smoothing (not adjustable).', 'Reject: Removes low-level noise.'],
              examFocus: 'Memorize the order: Amplification, Compensation, Compression, Demodulation, Reject. Know which are adjustable.',
              conceptCheck: { questionText: 'Which receiver function is NOT adjustable by the sonographer?', options: ['Amplification', 'Compensation', 'Demodulation', 'Rejection'], correctAnswer: 'Demodulation', explanation: 'Demodulation is an automatic internal process to prepare the signal for display and has no user control.' }
            },
            {
              id: '11-2',
              title: 'Scan Converter & Display',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "The scan converter stores the image data. It allows for the image to be frozen and manipulated."), React.createElement(DisplayModesVisual, null)),
              keyPoints: ['Analog-to-Digital (A/D) conversion happens before storage.', 'Pre-processing: Write zoom, persistence. Cannot be undone.', 'Post-processing: Read zoom, gray map, B-color. Can be changed on frozen image.'],
              examFocus: 'Distinguish Pre-processing (live) vs Post-processing (frozen). Write zoom is Pre (better res), Read zoom is Post (pixelated).',
              conceptCheck: { questionText: 'Read magnification is performed on:', options: ['Live data', 'Frozen data', 'Analog data', 'Raw RF data'], correctAnswer: 'Frozen data', explanation: 'Read magnification reads old data from the memory and enlarges the pixels. It is a post-processing function.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q11-1', questionText: 'Which receiver function converts the negative voltages of the signal to positive ones?', options: ['Amplification', 'Compression', 'Rectification (Demodulation)', 'Rejection'], correctAnswer: 'Rectification (Demodulation)', explanation: 'Rectification turns all negative voltages into positive ones, a key part of demodulation.' },
              { id: 'q11-2', questionText: 'Increasing the receiver gain:', options: ['Increases the output power', 'Amplifies all returning echoes', 'Improves the signal-to-noise ratio', 'Increases patient exposure'], correctAnswer: 'Amplifies all returning echoes', explanation: 'Gain amplifies the received signal (both meaningful echoes and noise) but does not add new information or change patient exposure.' },
              { id: 'q11-3', questionText: 'Which of the following is a PRE-processing function?', options: ['Read zoom', 'B-color', 'Write zoom', '3D rendering'], correctAnswer: 'Write zoom', explanation: 'Write zoom occurs before data storage. The system rescans the ROI with more lines, improving spatial resolution.' },
              { id: 'q11-4', questionText: 'The number of bits per pixel determines the:', options: ['Spatial resolution', 'Contrast resolution', 'Temporal resolution', 'Frame rate'], correctAnswer: 'Contrast resolution', explanation: 'More bits per pixel allows for more shades of gray, improving contrast resolution.' },
              { id: 'q11-5', questionText: 'Which component controls the timing of the electrical signals sent to the transducer?', options: ['Receiver', 'Display', 'Beam Former', 'Master Synchronizer'], correctAnswer: 'Beam Former', explanation: 'The beam former (or pulser) determines the firing pattern, steering, and focusing of the beam.' }
            ]
          }
        },
        {
          id: '12',
          title: 'Advanced Doppler',
          description: 'Specialized Doppler techniques and artifact management.',
          learningObjectives: ['Analyze spectral waveforms.', 'Correct aliasing.', 'Understand Tissue Doppler.'],
          topics: [
            {
              id: '12-1',
              title: 'Spectral Analysis & Aliasing',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Spectral analysis breaks down the complex Doppler signal. Aliasing is the most common error."), React.createElement(AliasingCorrectionVisual, null), React.createElement(SpectralWaveformVisual, null)),
              keyPoints: ['Laminar flow: Clear spectral window.', 'Turbulent flow: Spectral broadening.', 'Aliasing: Wrap-around when Nyquist limit is exceeded.'],
              examFocus: 'Identify spectral broadening. Know 5 ways to fix aliasing: Increase Scale (PRF), Lower Baseline, Lower Frequency, Shallower Depth, Use CW.',
              conceptCheck: { questionText: 'What is the most effective way to eliminate aliasing?', options: ['Lower the baseline', 'Increase the gain', 'Use Continuous Wave Doppler', 'Increase the frequency'], correctAnswer: 'Use Continuous Wave Doppler', explanation: 'CW Doppler has no Nyquist limit, so it never aliases.' }
            },
            {
              id: '12-2',
              title: 'Tissue Doppler Imaging (TDI)',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "TDI focuses on the high-amplitude, low-velocity signals from moving tissue (heart muscle) rather than blood."), React.createElement(TissueDopplerVisual, null)),
              keyPoints: ['Standard Doppler: High velocity, Low amplitude (Blood).', 'Tissue Doppler: Low velocity, High amplitude (Muscle).', 'Used to assess diastolic function.'],
              examFocus: 'TDI measures wall motion. It uses a filter to REMOVE blood signals and KEEP tissue signals.',
              conceptCheck: { questionText: 'Tissue Doppler signals are characterized by:', options: ['High velocity, Low amplitude', 'Low velocity, High amplitude', 'High velocity, High amplitude', 'Low velocity, Low amplitude'], correctAnswer: 'Low velocity, High amplitude', explanation: 'Heart walls move much slower than blood but reflect sound much more strongly.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q12-1', questionText: 'Spectral broadening is associated with:', options: ['Laminar flow', 'Plug flow', 'Turbulent flow', 'Parabolic flow'], correctAnswer: 'Turbulent flow', explanation: 'Chaotic flow creates many different velocities at once, filling in the spectral window.' },
              { id: 'q12-2', questionText: 'Which of the following will NOT correct aliasing?', options: ['Increasing the PRF', 'Decreasing the transducer frequency', 'Increasing the imaging depth', 'Shifting the baseline'], correctAnswer: 'Increasing the imaging depth', explanation: 'Increasing depth lowers the PRF (listening time increases), which lowers the Nyquist limit and makes aliasing WORSE.' },
              { id: 'q12-3', questionText: 'The Fast Fourier Transform (FFT) is used to process:', options: ['Color Doppler signals', 'Spectral Doppler signals', 'B-Mode images', 'M-Mode traces'], correctAnswer: 'Spectral Doppler signals', explanation: 'FFT is the digital technique used to process Pulsed and CW Doppler signals into a spectral waveform.' },
              { id: 'q12-4', questionText: 'Autocorrelation is used to process:', options: ['Spectral Doppler', 'Color Doppler', 'A-Mode', 'Static images'], correctAnswer: 'Color Doppler', explanation: 'Autocorrelation is a faster but less accurate technique used for the massive amount of data in Color Doppler.' },
              { id: 'q12-5', questionText: 'Crosstalk (mirror image) artifact in Doppler is usually caused by:', options: ['Gain too high', 'Gain too low', 'PRF too high', 'Wall filter too high'], correctAnswer: 'Gain too high', explanation: 'Excessive receiver gain causes the signal to leak into the other channel, creating a mirror image.' }
            ]
          }
        },
        {
          id: '13',
          title: 'Elastography',
          description: 'Imaging tissue stiffness for lesion characterization.',
          learningObjectives: ['Define elastography.', 'Differentiate Strain vs. Shear Wave.', 'Identify clinical uses.'],
          topics: [
            {
              id: '13-1',
              title: 'Basics of Elastography',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "Elastography maps the stiffness (elastic modulus) of tissue. Malignant lesions are often stiffer than surrounding tissue."), React.createElement(ElastographyVisual, null)),
              keyPoints: ['Strain Elastography: Manual compression (Qualitative).', 'Shear Wave Elastography: Acoustic push pulse (Quantitative, m/s or kPa).'],
              examFocus: 'Strain = Deformation. Hard tissue deforms less. Shear waves travel FASTER in stiff tissue.',
              conceptCheck: { questionText: 'In Shear Wave Elastography, a higher velocity indicates:', options: ['Softer tissue', 'Stiffer tissue', 'Fluid', 'Gas'], correctAnswer: 'Stiffer tissue', explanation: 'Shear waves propagate faster through stiffer media.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q13-1', questionText: 'Elastography is used to evaluate tissue:', options: ['Blood flow', 'Stiffness', 'Temperature', 'Metabolism'], correctAnswer: 'Stiffness', explanation: 'Elastography images the mechanical properties (stiffness) of tissue.' },
              { id: 'q13-2', questionText: 'Which type of elastography provides a quantitative measurement (e.g., in kPa)?', options: ['Strain elastography', 'Shear wave elastography', 'Compression elastography', 'Static elastography'], correctAnswer: 'Shear wave elastography', explanation: 'Shear wave elastography measures the speed of shear waves to calculate a numerical stiffness value.' },
              { id: 'q13-3', questionText: 'In a strain elastogram, a malignant tumor will typically appear:', options: ['Softer (high strain)', 'Stiffer (low strain)', 'Anechoic', 'Vascular'], correctAnswer: 'Stiffer (low strain)', explanation: 'Malignant tissues are typically harder/stiffer and deform less (low strain) than normal tissue.' },
              { id: 'q13-4', questionText: 'The force used to generate the shear wave is called:', options: ['Manual compression', 'ARFI (Acoustic Radiation Force Impulse)', 'Piezoelectric effect', 'Doppler shift'], correctAnswer: 'ARFI (Acoustic Radiation Force Impulse)', explanation: 'A focused, high-intensity push pulse (ARFI) generates the shear waves.' },
              { id: 'q13-5', questionText: 'Shear waves cannot travel through:', options: ['Muscle', 'Liver', 'Fluids', 'Breast tissue'], correctAnswer: 'Fluids', explanation: 'Shear waves (transverse waves) require a solid medium to propagate; they cannot travel through simple fluids.' }
            ]
          }
        },
        {
          id: '14',
          title: '3D/4D Imaging',
          description: 'Volume acquisition and rendering techniques.',
          learningObjectives: ['Understand volume acquisition.', 'Define MPR and rendering.', 'Explain 4D imaging.'],
          topics: [
            {
              id: '14-1',
              title: 'Volume Imaging Basics',
              content: React.createElement(React.Fragment, null, React.createElement("p", null, "3D imaging acquires a volume of data (voxels). 4D is simply 3D in real-time."), React.createElement(ThreeDVisual, null)),
              keyPoints: ['Voxel: Volume element (3D pixel).', 'MPR (Multi-Planar Reconstruction): Viewing the volume in 3 orthogonal planes (A, B, C).', 'Rendering: Creating the surface 3D image.'],
              examFocus: 'Voxel = 3D pixel. 4D = 3D + Time. MPR allows viewing planes impossible with 2D (like the coronal plane of the uterus from a transabdominal scan).',
              conceptCheck: { questionText: 'What is the smallest unit of a 3D volume?', options: ['Pixel', 'Bit', 'Voxel', 'Frame'], correctAnswer: 'Voxel', explanation: 'A Voxel (VOlumetric piXEL) is the 3D data unit.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q14-1', questionText: '4D imaging refers to:', options: ['3D imaging with color', '3D imaging in real-time', 'High resolution 2D', 'Panoramic imaging'], correctAnswer: '3D imaging in real-time', explanation: 'The 4th dimension is time. 4D is a live, moving 3D image.' },
              { id: 'q14-2', questionText: 'Which display mode allows you to see three orthogonal planes (axial, sagittal, coronal) simultaneously?', options: ['Surface rendering', 'Transparency mode', 'Multi-Planar Reconstruction (MPR)', 'Volume rendering'], correctAnswer: 'Multi-Planar Reconstruction (MPR)', explanation: 'MPR slices the volume into three perpendicular planes for detailed analysis.' },
              { id: 'q14-3', questionText: 'A volume element is known as a:', options: ['Pixel', 'Matrix', 'Voxel', 'Bit'], correctAnswer: 'Voxel', explanation: 'Voxel stands for Volumetric Pixel.' },
              { id: 'q14-4', questionText: 'Surface rendering is best used for visualizing:', options: ['Internal cystic structures', 'The fetal face', 'Blood flow', 'Bone density'], correctAnswer: 'The fetal face', explanation: 'Surface rendering projects the external surface of structures, ideal for visualizing the fetal face.' },
              { id: 'q14-5', questionText: 'To acquire a 3D volume, the system must:', options: ['Scan a single line', 'Acquire a series of 2D slices', 'Use a CW probe', 'Use M-mode'], correctAnswer: 'Acquire a series of 2D slices', explanation: 'A 3D volume is built by stacking many 2D image frames collected as the probe sweeps across the anatomy.' }
            ]
          }
        },
        {
          id: '15',
          title: 'Hemodynamics II',
          description: 'Advanced concepts in blood flow mechanics.',
          learningObjectives: ['Analyze phasicity.', 'Understand hydrostatic pressure.', 'Explain the effects of respiration.'],
          topics: [
            {
              id: '15-1',
              title: 'Venous Hemodynamics',
              content: React.createElement("p", null, "Venous flow is low pressure and influenced by respiration. Inspiration lowers thoracic pressure (sucking blood from arms) and raises abdominal pressure (stopping blood from legs)."),
              keyPoints: ['Inspiration: Diaphragm down. Leg flow decreases. Arm flow increases.', 'Expiration: Diaphragm up. Leg flow increases. Arm flow decreases.', 'Hydrostatic Pressure: Weight of blood column. 0 at heart. +100 at ankles (standing).'],
              examFocus: 'Memorize the respiratory effects on venous return. Hydrostatic pressure adds to measured BP below the heart and subtracts above.',
              conceptCheck: { questionText: 'During inspiration, venous flow from the legs:', options: ['Increases', 'Decreases', 'Reverses', 'Stops'], correctAnswer: 'Decreases', explanation: 'Inspiration pushes the diaphragm down, increasing abdominal pressure, which impedes venous return from the lower extremities.' }
            }
          ],
          quiz: {
            questions: [
              { id: 'q15-1', questionText: 'Hydrostatic pressure is zero at the level of the:', options: ['Head', 'Heart', 'Ankles', 'Knees'], correctAnswer: 'Heart', explanation: 'Hydrostatic pressure is related to the weight of the column of blood. At the level of the heart, this weight is effectively zero.' },
              { id: 'q15-2', questionText: 'In a standing patient, the measured blood pressure at the ankle is:', options: ['True BP', 'True BP - Hydrostatic Pressure', 'True BP + Hydrostatic Pressure', 'Zero'], correctAnswer: 'True BP + Hydrostatic Pressure', explanation: 'The weight of the blood (approx 100 mmHg) adds to the circulatory pressure.' },
              { id: 'q15-3', questionText: 'Normal venous flow is described as:', options: ['Pulsatile', 'Phasic', 'Steady', 'Turbulent'], correctAnswer: 'Phasic', explanation: 'Venous flow changes with respiration, a quality known as phasicity.' },
              { id: 'q15-4', questionText: 'During expiration, the diaphragm moves:', options: ['Downward', 'Upward', 'Laterally', 'It does not move'], correctAnswer: 'Upward', explanation: 'Expiration releases the diaphragm, allowing it to rise into the chest.' },
              { id: 'q15-5', questionText: 'The energy loss due to blood sticking to the vessel wall is called:', options: ['Inertial loss', 'Viscous loss', 'Frictional loss', 'Thermal loss'], correctAnswer: 'Frictional loss', explanation: 'Friction occurs as blood cells slide against the vessel walls and each other, converting energy to heat.' }
            ]
          }
        }
      ]
    }
  ]
};
