import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-blue-500/30 bg-blue-500/10 text-blue-400 backdrop-blur-md shadow-sm shadow-blue-500/20",
        secondary:
          "border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md",
        destructive:
          "border border-red-500/30 bg-red-500/10 text-red-400 backdrop-blur-md",
        outline: "text-foreground border border-white/20",
        success:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-md",
        purple:
          "border border-purple-500/30 bg-purple-500/10 text-purple-300 backdrop-blur-md shadow-sm shadow-purple-500/20",
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
