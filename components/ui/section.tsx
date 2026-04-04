
import { cn } from '@/lib/utils';
import { AnimateIn } from './animate-in';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    container?: boolean;
    background?: 'white' | 'gray' | 'dark';
}

export function Section({
    children,
    className,
    container = true,
    background = 'white',
    ...props
}: SectionProps) {
    const bgColors = {
        white: 'bg-white',
        gray: 'bg-[#FAFAFA]',
        dark: 'bg-[#0A0A0A]',
    };

    return (
        <section
            className={cn(
                'w-full py-16 md:py-20',
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
    textColor?: 'dark' | 'light';
}

export function SectionHeader({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    align = 'center',
    textColor = 'dark'
}: SectionHeaderProps) {
    return (
        <AnimateIn animation="fade-in" className={cn('mb-12', className)}>
            <div className={cn(
                'flex flex-col gap-2',
                align === 'center' && 'items-center text-center',
                align === 'right' && 'items-end text-right',
            )}>
                <h2 className={cn(
                    'text-3xl md:text-4xl font-extrabold tracking-tight',
                    textColor === 'dark' ? 'text-[#0A0A0A]' : 'text-white',
                    titleClassName
                )}>
                    {title}
                </h2>
                {description && (
                    <p className={cn(
                        'text-sm sm:text-base',
                        textColor === 'dark' ? 'text-[#666]' : 'text-[#999]',
                        descriptionClassName
                    )}>
                        {description}
                    </p>
                )}
            </div>
        </AnimateIn>
    );
}
