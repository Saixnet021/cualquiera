
import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-none border border-input-border bg-input-bg px-4 py-2 text-sm text-fg placeholder:text-muted-fg focus-visible:outline-none focus-visible:border-fg disabled:cursor-not-allowed disabled:opacity-50 transition-colors font-black uppercase tracking-widest",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
