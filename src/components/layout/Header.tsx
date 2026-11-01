"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/our-approach", label: "Our Approach" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Accessibility: Handle Escape key and focus trap
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-blueprint-deep/95 backdrop-blur-none border-b border-[rgba(127,178,255,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Monogram */}
          <Link
            href="/"
            className="flex items-center space-x-3 group"
            aria-label="Metavayn Technologies Home"
          >
            {/* CAD Monogram Mark */}
            <div className="w-9 h-9 border border-blueprint-dimension bg-blueprint-cyanotype/40 flex items-center justify-center relative font-mono text-xs font-bold text-blueprint-dimension group-hover:border-blueprint-signal group-hover:text-blueprint-signal transition-colors duration-fast">
              <span className="relative z-10">M</span>
              {/* Drafting Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-blueprint-dimension/30 -translate-y-1/2 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-blueprint-dimension/30 -translate-x-1/2 pointer-events-none" />
            </div>
            <div>
              <span className="font-display font-semibold tracking-wider text-sm sm:text-base text-blueprint-linen block leading-tight">
                METAVAYN
              </span>
              <span className="font-mono text-[9px] text-blueprint-dimension/70 uppercase tracking-widest block">
                TECHNOLOGIES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (The 7 links) */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-fast relative ${
                    isActive
                      ? "text-blueprint-linen bg-blueprint-cyanotype/60 border border-blueprint-dimension/40"
                      : "text-blueprint-dimension/80 hover:text-blueprint-linen hover:bg-blueprint-cyanotype/30"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-[2px] bg-blueprint-signal" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button */}
          <div className="hidden sm:flex items-center">
            <Link href="/contact">
              <Button variant="primary" size="sm">
                Talk to our engineers
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border border-blueprint-dimension/40 text-blueprint-dimension hover:text-blueprint-linen focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blueprint-signal"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Toggle navigation menu"
          >
            <span className="font-mono text-xs">
              {mobileMenuOpen ? "[CLOSE]" : "[MENU]"}
            </span>
          </button>
        </div>
      </div>

      {/* Accessible, Calm Mobile Menu Dialog */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="lg:hidden border-t border-[rgba(127,178,255,0.25)] bg-blueprint-deep px-4 pt-4 pb-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-normal"
        >
          <div className="text-[10px] font-mono text-blueprint-dimension/60 uppercase tracking-widest pb-1 border-b border-[rgba(127,178,255,0.15)]">
            INDEX NAVIGATION
          </div>

          <div className="grid grid-cols-1 divide-y divide-[rgba(127,178,255,0.1)]">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blueprint-signal font-semibold bg-blueprint-cyanotype/40"
                      : "text-blueprint-linen hover:text-blueprint-signal"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-[10px] text-blueprint-dimension/50">
                    {isActive ? "[CURRENT]" : "VIEW"}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(127,178,255,0.2)]">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="primary" size="base" className="w-full">
                Talk to our engineers
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
