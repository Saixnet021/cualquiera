
import { cn } from '@/lib/utils';
import { AnimateIn } from './animate-in';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    container?: boolean;
    background?: 'primary' | 'muted' | 'none';
}

export function Section({
    children,
    className,
    container = true,
    background = 'none',
    ...props
}: SectionProps) {
    const bgColors = {
        primary: 'bg-bg',
        muted: 'bg-muted',
        none: '',
    };

    return (
        <section
            className={cn(
                'w-full py-16 md:py-24',
                bgColors[background],
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}

interface SectionHeaderProps {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    align?: 'left' | 'center' | 'right';
}

export function SectionHeader({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    align = 'center',
}: SectionHeaderProps) {
    return (
        <AnimateIn animation="fade-in" className={cn('mb-16', className)}>
            <div className={cn(
                'flex flex-col gap-4',
                align === 'center' && 'items-center text-center',
                align === 'right' && 'items-end text-right',
            )}>
                <h2 className={cn(
                    'text-4xl md:text-5xl font-black tracking-tighter text-fg uppercase',
                    titleClassName
                )}>
                    {title}
                </h2>
                {description && (
                    <p className={cn(
                        'text-xs font-black uppercase tracking-widest text-muted-fg',
                        descriptionClassName
                    )}>
                        {description}
                    </p>
                )}
            </div>
        </AnimateIn>
    );
}
