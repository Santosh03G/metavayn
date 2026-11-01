import React, { forwardRef, type ButtonHTMLAttributes } from "react";

export type SurfaceType = "royal" | "paper" | "black";
export type ButtonVariant = "primary" | "secondary" | "copper" | "ghost" | "blueprint";
export type ButtonSize = "sm" | "base" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  surface?: SurfaceType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      surface = "royal",
      variant = "primary",
      size = "base",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Sharp 2px corners, engineering focus ring (2px with 2px offset by surface), sentence case
    const focusRingBySurface: Record<SurfaceType, string> = {
      royal:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal",
      paper:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
      black:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    };

    const baseStyles = `inline-flex items-center justify-center font-sans font-medium rounded-[2px] transition-colors duration-fast select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-[1px] ${focusRingBySurface[surface]}`;

    const sizeStyles = {
      sm: "px-3 py-1.5 text-body-sm leading-none space-x-1.5",
      base: "px-4 py-2 text-body-base leading-tight space-x-2",
      lg: "px-5 py-2.5 text-body-lg leading-normal space-x-2.5",
    }[size];

    // Surface-driven variants complying strictly with D2 token pairings
    const getVariantStyles = () => {
      // Allow copper variant on any surface (at most one per screen)
      if (variant === "copper") {
        return "bg-copper text-black font-semibold hover:brightness-105 shadow-sm";
      }

      if (surface === "royal") {
        switch (variant) {
          case "secondary":
          case "blueprint":
            return "bg-transparent text-paper border-[1.5px] border-paper hover:bg-paper/10";
          case "ghost":
            return "bg-transparent text-paper hover:bg-paper/10";
          case "primary":
          default:
            return "bg-paper text-black hover:bg-white shadow-sm";
        }
      }

      if (surface === "black") {
        switch (variant) {
          case "secondary":
          case "blueprint":
            return "bg-transparent text-pale-blue border-[1.5px] border-pale-blue hover:bg-pale-blue/10";
          case "ghost":
            return "bg-transparent text-pale-blue hover:bg-pale-blue/10";
          case "primary":
          default:
            return "bg-paper text-black hover:bg-white shadow-sm";
        }
      }

      // surface === "paper"
      switch (variant) {
        case "secondary":
        case "blueprint":
          return "bg-transparent text-black border-[1.5px] border-black hover:bg-black/5";
        case "ghost":
          return "bg-transparent text-black hover:bg-black/5";
        case "primary":
        default:
          return "bg-royal text-paper hover:bg-royal-hover shadow-sm";
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles} ${getVariantStyles()} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
