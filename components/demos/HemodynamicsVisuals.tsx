
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ControlButton from './ControlButton';

export const FlowPatternsVisual: React.FC = () => {
    const [flowType, setFlowType] = useState<'Laminar' | 'Turbulent'>('Laminar');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Handle resizing
        const updateSize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Particle System
        const numParticles = 150;
        const particles: { 
            x: number, 
            y: number, 
            vx: number, 
            vy: number, 
            radius: number,
            phase: number,
            turbulenceFactor: number
        }[] = [];

        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height - 20) + 10,
                vx: 0,
                vy: 0,
                radius: Math.random() * 1.5 + 1,
                phase: Math.random() * Math.PI * 2,
                turbulenceFactor: Math.random() * 0.8 + 0.2
            });
        }

        let animationId: number;
        let time = 0;

        const render = () => {
            if (!ctx) return;
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;
            const flowAreaHeight = height - 20; // 10px padding for walls

            ctx.clearRect(0, 0, width, height);

            // Draw Vessel Walls
            const wallGradient = ctx.createLinearGradient(0, 0, 0, 10);
            wallGradient.addColorStop(0, '#444');
            wallGradient.addColorStop(1, '#222');
            
            ctx.fillStyle = wallGradient;
            ctx.fillRect(0, 0, width, 10); // Top Wall
            
            const bottomGradient = ctx.createLinearGradient(0, height - 10, 0, height);
            bottomGradient.addColorStop(0, '#222');
            bottomGradient.addColorStop(1, '#444');
            ctx.fillStyle = bottomGradient;
            ctx.fillRect(0, height - 10, width, 10); // Bottom Wall

            // Draw Particles
            ctx.fillStyle = '#f87171'; // Tailwind red-400

            particles.forEach(p => {
                if (flowType === 'Laminar') {
                    // Parabolic Flow Equation: v = vmax * (1 - (r/R)^2)
                    const relativeY = p.y - centerY;
                    const maxRadius = flowAreaHeight / 2;
                    const normalizedR = relativeY / maxRadius;
                    const speedProfile = 1 - Math.pow(normalizedR, 2);
                    
                    // Target velocity based on profile
                    const targetVx = Math.max(0.5, speedProfile * 5); 
                    
                    // Smooth transition to laminar
                    p.vx += (targetVx - p.vx) * 0.1;
                    p.vy *= 0.9; // Dampen vertical motion
                    
                    // Keep within laminar layers (slight correction if they drifted)
                    if (Math.abs(p.vy) < 0.01) p.vy = 0;

                } else {
                    // Turbulent Flow
                    const baseSpeed = 2.5;
                    
                    // Chaos math: Time-varying sine waves based on phase and position
                    const chaosX = Math.sin(time * 0.05 + p.phase + p.y * 0.1) * p.turbulenceFactor;
                    const chaosY = Math.cos(time * 0.03 + p.phase * 2 + p.x * 0.05) * p.turbulenceFactor * 1.5;
                    
                    p.vx = baseSpeed + chaosX;
                    p.vy = chaosY;
                }

                // Update Position
                p.x += p.vx;
                p.y += p.vy;

                // Loop horizontally
                if (p.x > width) {
                    p.x = -5;
                    p.y = Math.random() * (height - 24) + 12; // Reset random Y to prevent clumping
                }
                
                // Bounce off walls
                if (p.y < 12) {
                    p.y = 12;
                    p.vy = Math.abs(p.vy) * 0.5;
                }
                if (p.y > height - 12) {
                    p.y = height - 12;
                    p.vy = -Math.abs(p.vy) * 0.5;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw Velocity Profile Overlay
            if (flowType === 'Laminar') {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                const profileX = width * 0.2;
                
                // Draw parabolic curve
                ctx.moveTo(profileX, 10);
                ctx.quadraticCurveTo(profileX + 50, centerY, profileX, height - 10);
                
                // Draw vector arrows
                for (let y = 20; y < height - 20; y += 15) {
                    const relativeY = y - centerY;
                    const maxRadius = flowAreaHeight / 2;
                    const normalizedR = relativeY / maxRadius;
                    const len = 25 * (1 - Math.pow(normalizedR, 2));
                    if (len > 0) {
                        ctx.moveTo(profileX, y);
                        ctx.lineTo(profileX + len, y);
                        // Arrowhead
                        ctx.lineTo(profileX + len - 3, y - 2);
                        ctx.moveTo(profileX + len, y);
                        ctx.lineTo(profileX + len - 3, y + 2);
                    }
                }
                ctx.stroke();
            }

            time++;
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateSize);
        };
    }, [flowType]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <div className="flex justify-center gap-2 mb-4">
                <ControlButton onClick={() => setFlowType('Laminar')} secondary={flowType !== 'Laminar'}>Laminar Flow</ControlButton>
                <ControlButton onClick={() => setFlowType('Turbulent')} secondary={flowType !== 'Turbulent'}>Turbulent Flow</ControlButton>
            </div>
            <div ref={containerRef} className="relative h-48 bg-black rounded-lg overflow-hidden border border-white/10 shadow-inner">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
             <p className="text-center text-xs text-white/60 mt-3 font-medium">
                {flowType === 'Laminar' 
                    ? "Parabolic Profile: Blood flows in parallel layers. Fastest in center, zero at walls." 
                    : "Chaotic Profile: Layers mix with eddies and swirls. High Reynold's Number (>2000)."}
            </p>
        </div>
    );
};

export const PhysicalPrinciplesVisual: React.FC = () => {
    const [stenosis, setStenosis] = useState(0); // 0-80%

    const flowRate = useMemo(() => Math.pow(1 - (stenosis / 100), 4) * 100, [stenosis]);
    const vesselPath = `M 0 20 C 50 20, 50 ${20 - stenosis * 0.2}, 100 0 C 150 ${20 - stenosis * 0.2}, 150 20, 200 20 L 200 80 C 150 80, 150 ${80 + stenosis * 0.2}, 100 100 C 50 ${80 + stenosis * 0.2}, 50 80, 0 80 Z`;

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 my-4 not-prose">
            <h4 className="font-semibold text-center text-white/80 mb-2">Poiseuille's Law</h4>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-2/3 h-40 bg-black rounded-lg p-2">
                    <svg width="100%" height="100%" viewBox="0 0 200 100">
                        <defs>
                            <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7f1d1d" />
                                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#7f1d1d" />
                            </linearGradient>
                        </defs>
                        <path d={vesselPath} fill="url(#vesselGrad)" stroke="#ef4444" strokeWidth="1" className="transition-all duration-300" />
                         {Array.from({ length: 10 }).map((_, i) => (
                            <circle key={i} cx={i * 20} cy="50" r="2" className="fill-red-300 opacity-70" style={{ animation: `pulse-race ${2 + (stenosis/100)*8}s linear infinite`, animationDelay: `${i * 0.2}s`}} />
                        ))}
                    </svg>
                </div>
                <div className="w-full md:w-1/3">
                    <label className="text-sm text-white/70 block mb-1">Stenosis: {stenosis}%</label>
                    <input type="range" min="0" max="80" value={stenosis} onChange={e => setStenosis(Number(e.target.value))} className="w-full accent-yellow-400" />
                     <div className="bg-black/40 p-2 rounded text-center mt-2">
                        <p className="text-sm text-white/70">Flow Rate:</p><p className="font-mono font-bold text-lg text-white">{flowRate.toFixed(0)}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
