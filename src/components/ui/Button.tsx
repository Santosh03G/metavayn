import React, { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "blueprint"
  | "danger-redline"
  | "ghost";

export type ButtonSize = "sm" | "base" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "base",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: sharp 2px corners, engineering focus ring, no pills, sentence case
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium rounded-[2px] transition-all duration-fast select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blueprint-signal disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px]";

    const sizeStyles = {
      sm: "px-3 py-1.5 text-body-sm leading-none space-x-1.5",
      base: "px-4 py-2 text-body-base leading-tight space-x-2",
      lg: "px-5 py-2.5 text-body-lg leading-normal space-x-2.5",
    }[size];

    const variantStyles = {
      primary:
        "bg-blueprint-signal text-white border border-transparent hover:bg-blue-600 shadow-sm",
      secondary:
        "bg-blueprint-cyanotype text-blueprint-linen border border-[rgba(127,178,255,0.35)] hover:border-blueprint-signal hover:text-white",
      blueprint:
        "bg-transparent text-blueprint-linen border border-[rgba(127,178,255,0.3)] hover:bg-blueprint-cyanotype/40 hover:border-blueprint-dimension",
      "danger-redline":
        "bg-blueprint-redline/15 text-blueprint-redline border border-blueprint-redline/50 hover:bg-blueprint-redline/25",
      ghost:
        "bg-transparent text-blueprint-dimension hover:text-blueprint-linen hover:bg-blueprint-cyanotype/30 border border-transparent",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
