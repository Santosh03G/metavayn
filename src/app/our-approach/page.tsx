import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";
import { ApproachSequenceViewer } from "@/components/approach/ApproachSequenceViewer";
import { QualitySection } from "@/components/approach/QualitySection";

export default function OurApproachPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. APPROACH HEADER */}
      <section className="relative py-12 sm:py-20 bg-cad-grid border-b border-[rgba(127,178,255,0.2)]">
        <Container size="wide">
          <div className="cad-border bg-blueprint-deep/80 p-6 sm:p-10 lg:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <RedlineCallout revision="01" note="STRUCTURED PROCESS WORKFLOW" />
              <span className="font-mono text-mono-xs text-blueprint-dimension/60">
                DOC: MV-PROC-2026
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-display-2xl sm:text-display-3xl text-blueprint-linen tracking-tight">
                Our Approach
              </h1>
              <p className="font-display text-display-lg text-blueprint-signal font-semibold">
                Define → Design → Deliver
              </p>
              <p className="font-sans text-body-lg text-blueprint-linen/90 leading-relaxed max-w-prose">
                We follow a structured engineering process designed to minimize
                errors, improve communication, and accelerate delivery.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(127,178,255,0.2)] flex flex-wrap gap-4 text-mono-xs font-mono text-blueprint-dimension/70">
              <span>WORKFLOW: 04 RIGOROUS STAGES</span>
              <span>•</span>
              <span>QUALITY PROTOCOL: ISO 9001 / ASME Y14.5</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PINNED / INTERACTIVE 4-STAGE EVOLUTION SEQUENCE (SIGNATURE MOMENT) */}
      <Section
        id="process-sequence"
        theme="dark"
        sectionCutLabel="SECTION D-D / 4-STAGE CAD EVOLUTION SEQUENCE"
        sheetRef="MV-SEC-PROC-04"
      >
        <div className="space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest block">
              EXECUTION DISCIPLINE
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
              The Engineering Lifecycle
            </h2>
            <p className="font-sans text-body-base text-blueprint-linen/80 leading-relaxed max-w-prose">
              From initial requirements capture to finalized manufacturing documentation, each stage represents a verified engineering gate.
            </p>
          </div>

          <ApproachSequenceViewer />
        </div>
      </Section>

      {/* 3. QUALITY & ENGINEERING EXCELLENCE (LIGHT LINEN CUT) */}
      <QualitySection />

      {/* 4. PARTNER CTA SECTION */}
      <Section
        id="approach-cta"
        theme="dark"
        sectionCutLabel="ENGAGEMENT INTAKE"
        sheetRef="MV-SEC-CTA-APP"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest block">
            READY TO COLLABORATE
          </span>
          <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
            Have an Engineering Challenge?
          </h2>
          <p className="font-sans text-body-base text-blueprint-linen/85 max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help. Let&apos;s discuss your requirements and explore how
            Metavayn can support your engineering workflow.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="base">
                Start a Conversation
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="base">
                Request Engineering Support
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
