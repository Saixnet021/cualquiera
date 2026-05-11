
'use client';

import { cn } from '@/lib/utils';
import { Shield, Zap, Headphones, Award } from 'lucide-react';

interface PromoBannerProps { className?: string; }

export function PromoBanner({ className }: PromoBannerProps) {
    const items = [
        { text: "100% SEGURO", icon: Shield },
        { text: "ENTREGA RÁPIDA", icon: Zap },
        { text: "SOPORTE 24/7", icon: Headphones },
        { text: "GARANTÍA TOTAL", icon: Award },
    ];

    const ContentBlock = () => (
        <div className="flex items-center gap-12 px-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-12">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <item.icon className="w-3.5 h-3.5 text-muted-fg shrink-0" />
                            <span className="text-[10px] font-black text-fg uppercase tracking-widest whitespace-nowrap">
                                {item.text}
                            </span>
                            <span className="text-muted-fg/30 text-xl font-black mx-8 select-none">·</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className={cn("w-full overflow-hidden bg-bg border-y border-border py-2", className)}>
            <div className="flex w-fit animate-marquee">
                <ContentBlock />
                <ContentBlock />
            </div>
        </div>
    );
}
