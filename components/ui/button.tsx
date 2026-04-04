import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    const variants = {
      default: "bg-[#1d4ed8] text-white hover:bg-[#1e3a8a] shadow-sm",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-[#1e293b] bg-transparent text-white hover:bg-[#1e293b] transition-all",
      secondary: "bg-[#1e293b] hover:bg-[#334155] text-white border border-[#334155]",
      ghost: "text-[#9ca3af] hover:bg-[#1e293b] hover:text-white",
      link: "text-[var(--primary)] underline-offset-4 hover:underline"
    }
    const sizes = {
      default: "h-11 min-h-[44px] px-5 py-2",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-lg px-8 text-sm",
      icon: "h-10 w-10 rounded-lg"
    }
    return (
      <button className={cn(base, variants[variant], sizes[size], className)} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"
export { Button }
