"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About us" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/our-approach", label: "Our approach" },
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
    <header className="sticky top-0 z-50 bg-royal border-b border-paper/20">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Monogram */}
          <Link
            href="/"
            className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal"
            aria-label="Metavayn Technologies Home"
          >
            {/* Monogram Mark */}
            <div className="w-9 h-9 border border-paper bg-royal flex items-center justify-center relative font-display text-sm font-bold text-paper group-hover:bg-white group-hover:text-royal transition-colors duration-fast">
              <span>M</span>
            </div>
            <div>
              <span className="font-display font-semibold tracking-wider text-sm sm:text-base text-paper block leading-tight">
                METAVAYN
              </span>
              <span className="font-sans text-[10px] text-paper/80 uppercase tracking-widest block font-medium">
                TECHNOLOGIES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-colors duration-fast relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal ${
                    isActive
                      ? "text-paper font-semibold"
                      : "text-paper/90 hover:text-white"
                  }`}
                >
                  {link.label}
                  {/* Single clean underline indicator, no box */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-paper" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button in sentence case */}
          <div className="hidden sm:flex items-center">
            <Link href="/contact">
              <Button surface="royal" variant="primary" size="sm">
                Talk to our engineers
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border border-paper text-paper hover:bg-paper/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-royal"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Toggle navigation menu"
          >
            <span className="font-sans text-xs font-medium">
              {mobileMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu Dialog */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="lg:hidden border-t border-paper/20 bg-royal px-4 pt-4 pb-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-normal"
        >
          <div className="grid grid-cols-1 divide-y divide-paper/15">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper ${
                    isActive
                      ? "text-paper font-semibold"
                      : "text-paper/90 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-paper" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-paper/20">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button surface="royal" variant="primary" size="base" className="w-full">
                Talk to our engineers
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}