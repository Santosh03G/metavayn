import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DimensionLine } from "@/components/drawing/DimensionLine";
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
    <section className="relative py-16 sm:py-24 bg-paper text-black border-b border-paper-line select-none">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-paper-line pb-3 mb-8 font-mono text-mono-xs text-black/70 uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full border border-black" />
            <span>QUALITY & ENGINEERING STANDARDS • ISO 9001 COMPLIANT</span>
          </div>
          <span>SEC REF: QA-STD-01</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-mono-xs text-black/60 uppercase tracking-widest block">
              ENGINEERING GOVERNANCE
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
              Quality & Engineering Excellence
            </h2>
            <p className="font-sans text-body-base text-black/90 leading-relaxed max-w-prose">
              At Metavayn, quality is integrated into every stage of our engineering
              workflow.
            </p>
          </div>

          {/* 7 Quality Focus Points */}
          <div className="pt-2">
            <h3 className="font-mono text-mono-xs text-black/70 uppercase tracking-wider mb-4 border-b border-paper-line pb-1">
              We focus on:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {qualityPoints.map((point) => (
                <div
                  key={point}
                  className="p-3.5 border border-paper-line bg-white/60 flex items-center space-x-3"
                >
                  <span className="font-mono text-mono-xs text-royal font-bold">
                    ✓
                  </span>
                  <span className="font-sans text-body-sm font-medium text-black">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Objective Callout */}
          <div className="border-l-2 border-royal bg-black/[0.03] p-6 sm:p-8 space-y-3 my-8">
            <span className="font-mono text-mono-xs text-royal font-bold uppercase block">
              PRIMARY QA OBJECTIVE
            </span>
            <p className="font-sans text-body-base text-black/80 leading-relaxed">
              Our objective is not simply to deliver engineering files.
            </p>
            <blockquote className="font-display text-display-base sm:text-display-lg font-bold text-black leading-snug">
              &ldquo;Our objective is to deliver engineering outputs that are ready
              to move to the next stage of your product lifecycle.&rdquo;
            </blockquote>
          </div>

          {/* Dimension Rule + Direct Link to About Page */}
          <div className="pt-2 space-y-6">
            <DimensionLine
              surface="paper"
              value="QUALITY AUDIT GATE • 100% REVISION CONTROL"
              tolerance="0.00"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-paper-line">
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
        </div>
      </Container>
    </section>
  );
}
