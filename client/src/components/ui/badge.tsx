import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        option:"hover:bg-sidebar-frameicon",
        [TaskStatusEnum.BACKLOG]: "badge-danger",
        [TaskStatusEnum.TODO]: "badge-info",
        [TaskStatusEnum.IN_PROGRESS]: "badge-warning",
        [TaskStatusEnum.IN_REVIEW]: "bg-primary text-white",
        [TaskStatusEnum.DONE]: "badge-success",
        [TaskPriorityEnum.HIGH]: "badge-danger",
        [TaskPriorityEnum.MEDIUM]: "badge-warning",
        [TaskPriorityEnum.LOW]: "badge-success",
        create: "bg-sidebar-frameicon text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
