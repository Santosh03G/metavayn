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
    <footer className="bg-black border-t border-pale-blue/20 mt-auto text-paper select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Identity & Mission */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="font-mono text-[10px] text-pale-blue uppercase tracking-widest block mb-1">
                ORGANIZATION IDENTIFIER
              </span>
              <h2 className="font-display font-bold text-lg sm:text-xl text-paper tracking-wide">
                METAVAYN TECHNOLOGIES PVT. LTD.
              </h2>
            </div>
            <p className="font-display text-sm font-medium text-pale-blue">
              Engineering the Next Dimension
            </p>
            <p className="font-sans text-xs text-paper/90 max-w-md leading-relaxed">
              Engineering services for product development, mechanical design, HVAC, manufacturing, and OEM engineering support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-pale-blue border-b border-pale-blue/20 pb-1">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-pale-blue hover:text-paper transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-pale-blue border-b border-pale-blue/20 pb-1">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-pale-blue hover:text-paper transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pale-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CAD Title Block on Black */}
        <div className="mt-12 pt-8 border-t border-pale-blue/20">
          <TitleBlock
            surface="black"
            drawingTitle="OFFICIAL WEB PORTAL - GENERAL SPECIFICATION"
            drawingNumber="MV-2026-ROOT"
            sheetNumber="00"
            totalSheets="07"
            scale="1:1"
            revision="01"
          />
        </div>

        {/* Legal & Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-pale-blue/70 font-mono">
          <p>© 2026 Metavayn Technologies Pvt. Ltd. All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">SEC CUT: B-B / ISO STANDARD COMPLIANT</p>
        </div>
      </div>
    </footer>
  );
}
