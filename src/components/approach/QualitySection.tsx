import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function QualitySection() {
  const qualityPoints = [
    "Design accuracy",
    "Drawing quality",
    "Engineering standards",
    "Documentation consistency",
    "Revision control",
    "Manufacturability",
    "Client-specific processes",
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-paper text-black border-b border-paper-line select-none scroll-mt-16">
      <Container size="wide">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-3">
            <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
              Quality & Engineering Excellence
            </h2>
            <p className="font-sans text-body-base sm:text-body-lg text-black/90 leading-relaxed max-w-prose">
              At Metavayn, quality is integrated into every stage of our engineering
              workflow.
            </p>
          </div>

          {/* 7 Quality Focus Points */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-black/70 border-b border-paper-line pb-2">
              We focus on:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {qualityPoints.map((point) => (
                <div
                  key={point}
                  className="p-3.5 border border-paper-line bg-paper flex items-center space-x-3"
                >
                  <span className="font-sans text-sm text-royal font-bold">
                    ✓
                  </span>
                  <span className="font-sans text-body-sm font-medium text-black">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Typographic Quote */}
          <div className="pt-6 pb-2 border-t border-paper-line space-y-3">
            <p className="font-sans text-body-base text-black/80 leading-relaxed">
              Our objective is not simply to deliver engineering files.
            </p>
            <blockquote className="font-display text-display-lg sm:text-display-xl font-medium text-black leading-snug">
              &ldquo;Our objective is to deliver engineering outputs that are ready
              to move to the next stage of your product lifecycle.&rdquo;
            </blockquote>
          </div>

          {/* Direct Link to About Page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-paper-line">
            <span className="font-sans text-body-sm text-black/80">
              Want to learn more about our engineering team and operational standards?
            </span>
            <Link href="/about-us">
              <Button surface="paper" variant="secondary" size="base">
                Learn more about our team and standards
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}