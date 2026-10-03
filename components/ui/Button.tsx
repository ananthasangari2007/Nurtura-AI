import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-800 text-white shadow-soft hover:bg-navy-900 hover:shadow-lift",
        blush: "bg-blush-500 text-white shadow-soft hover:bg-blush-600",
        lavender: "bg-lavender-500 text-white shadow-soft hover:bg-lavender-600",
        teal: "bg-teal-soft-600 text-white shadow-soft hover:bg-teal-soft-700",
        soft: "bg-white text-navy-800 border border-navy-100 shadow-soft hover:border-lavender-200 hover:shadow-lift",
        ghost: "text-navy-600 hover:bg-navy-50 hover:text-navy-800",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6",
        lg: "h-[52px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
