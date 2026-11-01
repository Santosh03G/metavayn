import React, { forwardRef, type AnchorHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";
import { type SurfaceType } from "./Button";

export interface TextLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  surface?: SurfaceType;
  className?: string;
  external?: boolean;
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ children, surface = "paper", className = "", external, href, ...props }, ref) => {
    const focusRingBySurface: Record<SurfaceType, string> = {
      royal:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal",
      paper:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
      black:
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black",
    };

    const linkColorsBySurface: Record<SurfaceType, { text: string; underline: string }> = {
      royal: {
        text: "text-paper hover:text-white",
        underline: "bg-paper/40 group-hover:bg-paper",
      },
      paper: {
        text: "text-royal hover:text-royal-hover",
        underline: "bg-royal/40 group-hover:bg-royal",
      },
      black: {
        text: "text-pale-blue hover:text-paper",
        underline: "bg-pale-blue/40 group-hover:bg-pale-blue",
      },
    };

    const config = linkColorsBySurface[surface];

    return (
      <Link
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`group relative inline-flex items-center text-body-base font-medium transition-colors duration-fast ${config.text} ${focusRingBySurface[surface]} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {/* CAD Dimension Rule Underline */}
        <span className={`absolute bottom-0 left-0 w-full h-[1px] transition-colors duration-fast ${config.underline}`}>
          <span className={`absolute left-0 -top-[2px] w-[1px] h-[5px] transition-colors duration-fast ${config.underline}`} />
          <span className={`absolute right-0 -top-[2px] w-[1px] h-[5px] transition-colors duration-fast ${config.underline}`} />
        </span>
      </Link>
    );
  }
);

TextLink.displayName = "TextLink";
