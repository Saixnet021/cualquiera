
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    variant?: 'outline' | 'flat';
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    className,
    variant = 'flat'
}: FeatureCardProps) {
    return (
        <div className={cn(
            'p-6 rounded-2xl transition-all duration-300',
            variant === 'outline' && 'bg-white border border-[#E5E5E5] hover:border-[#CCC] hover:scale-[1.02]',
            variant === 'flat' && 'text-center group',
            className
        )}>
            {variant === 'outline' ? (
                <>
                    <Icon className="w-8 h-8 text-[#0A0A0A] mb-3" />
                    <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{title}</h3>
                    <p className="text-[#666] text-sm">{description}</p>
                </>
            ) : (
                <>
                    <div className="bg-[#FAFAFA] border border-[#E5E5E5] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#F5F5F5] transition-colors">
                        <Icon className="w-6 h-6 text-[#0A0A0A]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0A0A0A] mb-1.5">{title}</h3>
                    <p className="text-sm text-[#666] leading-relaxed">{description}</p>
                </>
            )}
        </div>
    );
}
