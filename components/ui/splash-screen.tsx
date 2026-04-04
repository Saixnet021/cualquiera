'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

export function SplashScreen() {
    const [mounted, setMounted] = useState(false);
    // Phases: init -> drop -> flash -> expand -> done
    const [phase, setPhase] = useState<'init' | 'drop' | 'flash' | 'expand' | 'done'>('init');

    useEffect(() => {
        setMounted(true);
        // Start animation sequence (longer duration)
        const p1 = setTimeout(() => setPhase('drop'), 100);
        const p2 = setTimeout(() => setPhase('flash'), 1400); // Wait 1.3s after drop
        const p3 = setTimeout(() => setPhase('expand'), 3000); // Longer viewing time (1.6s)
        const p4 = setTimeout(() => setPhase('done'), 4200);   // Slower fade out (1.2s)

        return () => {
            clearTimeout(p1); clearTimeout(p2); clearTimeout(p3); clearTimeout(p4);
        };
    }, []);

    if (!mounted || phase === 'done') return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] bg-[#0a0e14] flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                phase === 'expand' ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
            <div className={`relative flex flex-col items-center transition-all duration-700 ease-in-out ${
                phase === 'expand' ? 'scale-[4] blur-xl opacity-0' : 'scale-100'
            }`}>
                
                {/* Icon wrapper */}
                <div className="relative w-28 h-28 flex items-center justify-center z-10 mb-2">
                    <Package 
                        className={`w-20 h-20 text-[#1d4ed8] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            phase === 'init' ? '-translate-y-20 opacity-0 scale-50 blur-md' : 
                            phase === 'drop' ? 'translate-y-0 opacity-100 scale-100 blur-0' :
                            'scale-[1.10] drop-shadow-md'
                        }`}
                        strokeWidth={1.5}
                    />
                </div>

                {/* Brand Text */}
                <div className="overflow-hidden mt-4">
                    <h1 className={`text-5xl font-[family-name:var(--font-manrope)] font-black tracking-[0.25em] uppercase text-white transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        (phase === 'init' || phase === 'drop') ? 'translate-y-full opacity-0 blur-sm' : 'translate-y-0 opacity-100 blur-0'
                    }`}>
                        Pinguis
                    </h1>
                </div>

            </div>
        </div>
    );
}
