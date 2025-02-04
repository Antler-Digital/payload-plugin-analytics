import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/class-utils";

const badgeVariants = cva(
  "tw-inline-flex tw-items-center tw-rounded-md tw-border tw-px-2.5 tw-py-0.5 tw-text-xs tw-font-semibold tw-transition-colors tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-ring tw-focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "tw-border-transparent tw-bg-primary tw-text-primary-foreground tw-shadow hover:bg-primary/80",
        secondary:
          "tw-border-transparent tw-bg-secondary tw-text-secondary-foreground hover:bg-secondary/80",
        positive:
          "tw-border-transparent tw-bg-green-500/40 tw-text-white tw-shadow hover:bg-green-600",
        negative:
          "tw-border-transparent tw-bg-red-500/40 tw-text-white tw-shadow hover:bg-red-600",
        destructive:
          "tw-border-transparent tw-bg-destructive tw-text-destructive-foreground tw-shadow hover:bg-destructive/80",
        outline: "tw-text-foreground",
        neutral: "tw-border-transparent tw-bg-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
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
