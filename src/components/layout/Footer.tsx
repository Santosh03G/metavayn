import Link from "next/link";
import { TitleBlock } from "@/components/drawing/TitleBlock";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/our-approach", label: "Our Approach" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const SERVICES_LINKS = [
  { href: "/services#product-engineering", label: "Product Engineering" },
  { href: "/services#mechanical-design", label: "Mechanical Design" },
  { href: "/services#hvac-engineering", label: "HVAC Engineering" },
  { href: "/services#engineering-documentation", label: "Engineering Documentation" },
  { href: "/services#engineering-support", label: "Engineering Support" },
];

export function Footer() {
  return (
    <footer className="bg-blueprint-deep border-t border-[rgba(127,178,255,0.2)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Identity & Mission (Verbatim) */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="font-mono text-[10px] text-blueprint-dimension/70 uppercase tracking-widest block mb-1">
                ORGANIZATION IDENTIFIER
              </span>
              <h2 className="font-display font-bold text-lg sm:text-xl text-blueprint-linen tracking-wide">
                METAVAYN TECHNOLOGIES PVT. LTD.
              </h2>
            </div>
            <p className="font-display text-sm font-medium text-blueprint-dimension">
              Engineering the Next Dimension
            </p>
            <p className="font-sans text-xs text-blueprint-linen/80 max-w-md leading-relaxed">
              Engineering services for product development, mechanical design, HVAC, manufacturing, and OEM engineering support.
            </p>
          </div>

          {/* Quick Links (Verbatim) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-blueprint-dimension/80 border-b border-[rgba(127,178,255,0.15)] pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blueprint-linen/80 hover:text-blueprint-signal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services (Verbatim) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-blueprint-dimension/80 border-b border-[rgba(127,178,255,0.15)] pb-1">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blueprint-linen/80 hover:text-blueprint-signal transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CAD Title Block (Engineering Signature) */}
        <div className="mt-12 pt-8 border-t border-[rgba(127,178,255,0.2)]">
          <TitleBlock
            drawingTitle="OFFICIAL WEB PORTAL - GENERAL SPECIFICATION"
            drawingNumber="MV-2026-ROOT"
            sheetNumber="00"
            totalSheets="07"
            scale="1:1"
            revision="01"
          />
        </div>

        {/* Legal & Copyright (Verbatim) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blueprint-dimension/60 font-mono">
          <p>© 2026 Metavayn Technologies Pvt. Ltd. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">SEC CUT: B-B / ISO STANDARD COMPLIANT</p>
        </div>
      </div>
    </footer>
  );
}
