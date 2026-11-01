import Link from "next/link";

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
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Identity & Mission */}
          <div className="md:col-span-6 space-y-3">
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-paper">
                Metavayn Technologies Pvt. Ltd.
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
            <h3 className="font-sans text-xs font-semibold text-pale-blue">
              Quick links
            </h3>
            <ul className="space-y-2 text-xs font-sans">
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
            <h3 className="font-sans text-xs font-semibold text-pale-blue">
              Services
            </h3>
            <ul className="space-y-2 text-xs font-sans">
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

        {/* Legal & Copyright */}
        <div className="mt-12 pt-6 border-t border-pale-blue/20 flex flex-col sm:flex-row items-center justify-between text-xs text-pale-blue/70 font-sans">
          <p>© 2026 Metavayn Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}