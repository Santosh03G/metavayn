import React, { type HTMLAttributes } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "tight" | "wide" | "full";
  className?: string;
  children: React.ReactNode;
}

export function Container({
  size = "default",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const sizeStyles = {
    tight: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1440px]",
    full: "w-full",
  }[size];

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 w-full ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
