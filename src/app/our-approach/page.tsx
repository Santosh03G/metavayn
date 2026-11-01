import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ApproachSequenceViewer } from "@/components/approach/ApproachSequenceViewer";
import { QualitySection } from "@/components/approach/QualitySection";

export default function OurApproachPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. APPROACH HEADER: ROYAL FIELD */}
      <section className="relative py-12 sm:py-20 bg-royal text-paper select-none">
        <Container>
          <div className="max-w-3xl space-y-4">
            <h1 className="font-display text-display-2xl sm:text-display-3xl text-paper tracking-tight">
              Our approach
            </h1>
            <p className="font-display text-display-lg text-paper font-semibold">
              Define, Design, Validate, Deliver
            </p>
            <p className="font-sans text-body-lg text-paper leading-relaxed max-w-prose">
              We follow a structured engineering process designed to minimize
              errors, improve communication, and accelerate delivery.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. PINNED / INTERACTIVE 4-STAGE SEQUENCE (ROYAL STAGE) */}
      <Section id="process-sequence" surface="royal" className="scroll-mt-16">
        <div className="space-y-10 select-none">
          <div className="max-w-3xl space-y-2">
            <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
              The engineering lifecycle
            </h2>
            <p className="font-sans text-body-base text-paper leading-relaxed max-w-prose">
              From initial requirements capture to finalized manufacturing documentation, each stage represents a rigorous milestone in our delivery lifecycle.
            </p>
          </div>

          <ApproachSequenceViewer />
        </div>
      </Section>

      {/* 3. QUALITY & ENGINEERING EXCELLENCE (PAPER SECTION) */}
      <QualitySection />

      {/* 4. PARTNER CTA SECTION (BLACK SECTION) */}
      <Section id="approach-cta" surface="black" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 select-none">
          <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
            Have an engineering challenge?
          </h2>
          <p className="font-sans text-body-base text-paper max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help. Let&apos;s discuss your requirements and explore how
            Metavayn can support your engineering workflow.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button surface="black" variant="primary" size="base">
                Start a conversation
              </Button>
            </Link>
            <Link href="/contact">
              <Button surface="black" variant="secondary" size="base">
                Request engineering support
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}