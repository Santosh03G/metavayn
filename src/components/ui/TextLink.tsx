import React, { forwardRef, type AnchorHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";

export interface TextLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ children, className = "", external, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`group relative inline-flex items-center text-body-base font-medium text-blueprint-dimension hover:text-blueprint-linen transition-colors duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blueprint-signal ${className}`}
        {...props}
      >
        <span>{children}</span>
        {/* CAD Dimension Rule Underline */}
        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blueprint-dimension/40 group-hover:bg-blueprint-signal transition-colors duration-fast">
          <span className="absolute left-0 -top-[2px] w-[1px] h-[5px] bg-blueprint-dimension/40 group-hover:bg-blueprint-signal transition-colors duration-fast" />
          <span className="absolute right-0 -top-[2px] w-[1px] h-[5px] bg-blueprint-dimension/40 group-hover:bg-blueprint-signal transition-colors duration-fast" />
        </span>
      </Link>
    );
  }
);

TextLink.displayName = "TextLink";
