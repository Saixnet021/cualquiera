
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-black uppercase tracking-tighter transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-30 cursor-pointer active:scale-[0.98]"
    const variants = {
      default: "bg-fg text-bg hover:opacity-80",
      destructive: "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
      outline: "border border-border bg-transparent text-fg hover:bg-fg hover:text-bg hover:border-fg",
      secondary: "bg-muted hover:bg-border text-fg border border-border",
      ghost: "text-muted-fg hover:bg-muted hover:text-fg",
      link: "text-fg underline-offset-4 hover:underline"
    }
    const sizes = {
      default: "h-11 px-6",
      sm: "h-8 px-3 text-[10px]",
      lg: "h-14 px-10 text-sm",
      icon: "h-10 w-10"
    }
    return (
      <button className={cn(base, variants[variant], sizes[size], className)} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"
export { Button }
