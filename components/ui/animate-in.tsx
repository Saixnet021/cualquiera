
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateInProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in';
    delay?: number;
    threshold?: number;
}

export function AnimateIn({
    children,
    className,
    animation = 'fade-in',
    delay = 0,
    threshold = 0.1,
}: AnimateInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const getInitialState = () => {
        switch (animation) {
            case 'slide-up': return 'opacity-0 translate-y-12 blur-[8px]';
            case 'slide-down': return 'opacity-0 -translate-y-12 blur-[8px]';
            case 'scale-in': return 'opacity-0 scale-90 blur-[8px]';
            default: return 'opacity-0 blur-[8px]';
        }
    };

    const getFinalState = () => {
        switch (animation) {
            case 'slide-up':
            case 'slide-down': return 'opacity-100 translate-y-0 blur-0';
            case 'scale-in': return 'opacity-100 scale-100 blur-0';
            default: return 'opacity-100 blur-0';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
                isVisible ? getFinalState() : getInitialState(),
                className
            )}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}
