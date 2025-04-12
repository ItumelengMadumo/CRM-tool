import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium text-sm uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary text-white hover:bg-primary/90 shadow": variant === "primary",
            "bg-white text-primary border border-primary hover:bg-gray-50": variant === "secondary",
            "bg-red-600 text-white hover:bg-red-700": variant === "danger",
            "px-3 py-1 text-xs": size === "sm",
            "px-6 py-2": size === "md",
            "px-8 py-3": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
