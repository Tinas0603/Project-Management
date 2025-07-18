import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-danger text-white shadow hover:bg-danger/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input shadow-sm bg-dropdown-hover-bg hover:bg-dropdown-hover-bg/20 hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:dropdown-hover-bg hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        create:
          "bg-sidebar-frameicon text-white hover:bg-navbar-createbtn-hover",
        option:
          "border border-input shadow-sm bg-background hover:bg-dropdown-hover-bg hover:text-accent-foreground",
        static:
          "bg-[#F2F4FF] text-black/50",
        datefield:
          "bg-sidebar-input",
        status:
          "bg-sidebar text-muted hover:bg-sidebar/20",
        statusHover:"text-muted hover:bg-sidebar",
        column:"bg-dropdown-hover-bg border border-sidebar-border hover:bg-dropdown-hover-bg/20 mb-2"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        date:"h-9 px-3 py-2"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
