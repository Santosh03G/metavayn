import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { IndustriesInteractiveSection } from "@/components/industries/IndustriesInteractiveSection";

export const metadata = {
  title: "Industries We Serve | Metavayn Technologies",
  description:
    "We provide engineering support for organizations operating in engineering-intensive industries, including Industrial Equipment, HVAC & Thermal Systems, Manufacturing, OEM Product Development, and Engineering & Technology.",
};

export default function IndustriesPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. PAGE HEADER & INTRODUCTION: PAPER SURFACE */}
      <section className="relative py-14 sm:py-20 lg:py-24 bg-paper text-black border-b border-paper-line select-none">
        <Container>
          <div className="max-w-3xl space-y-4">
            <h1 className="font-display text-display-2xl sm:text-display-3xl text-black tracking-tight">
              Industries we serve
            </h1>
            <p className="text-lead text-black max-w-[68ch]">
              We provide engineering support for organizations operating in engineering-intensive industries.
            </p>
            <p className="font-sans text-body text-black/85 leading-relaxed max-w-[68ch]">
              From custom industrial equipment and complex thermal systems to high-volume manufacturing lines and OEM product cycles, Metavayn works as a dedicated extension of your engineering department.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. MAIN INTERACTIVE INDEX & STAGE: BLACK SURFACE */}
      <IndustriesInteractiveSection />

      {/* 3. FEATURED CAPABILITY: ROYAL SURFACE (ONE FEATURED DOMAIN BLOCK) */}
      <Section id="cross-industry" surface="royal" className="scroll-mt-16">
        <div className="space-y-12 select-none">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
              Cross-disciplinary engineering capability
            </h2>
            <p className="text-lead text-paper max-w-[68ch]">
              Bridging thermal, structural, and production workflows across sectors
            </p>
            <p className="font-sans text-body text-paper/90 leading-relaxed max-w-[68ch]">
              Engineering challenges rarely exist in isolation. Our multidisciplinary approach ensures that structural requirements, fluid flow, thermal behavior, and manufacturing constraints are balanced throughout every phase of product development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
            {[
              {
                num: "01",
                title: "Thermal & Structural Synergy",
                desc: "Simultaneous consideration of thermal gradients, airflow paths, and structural rigidity to eliminate mechanical interferences.",
              },
              {
                num: "02",
                title: "Design for Manufacturing",
                desc: "Seamless translation of 3D parametric concepts into production-ready 2D drawings, weldment schedules, and verified BOMs.",
              },
              {
                num: "03",
                title: "Modular Scaling",
                desc: "Flexible engineering pods that integrate directly into your internal workflow without long-term overhead.",
              },
            ].map((col) => (
              <div
                key={col.num}
                className="p-6 border border-paper/20 bg-royal/60 space-y-3"
              >
                <span className="font-mono text-xs text-paper/60 font-semibold block">
                  {col.num} // INTEGRATION
                </span>
                <h3 className="font-display text-display-base text-paper font-semibold">
                  {col.title}
                </h3>
                <p className="font-sans text-body-sm text-paper/85 leading-relaxed">
                  {col.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. PARTNER CTA SECTION: BLACK SURFACE */}
      <Section id="industries-cta" surface="black" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 select-none">
          <h2 className="font-display text-display-2xl sm:text-display-3xl text-paper">
            Partner with Metavayn
          </h2>

          <p className="text-lead text-paper max-w-[68ch] mx-auto">
            Have an engineering challenge?
          </p>

          <p className="font-sans text-body text-paper leading-relaxed max-w-[68ch] mx-auto">
            Whether you&apos;re developing a new product, expanding your engineering team, or looking for additional design capacity, we&apos;re ready to help. Let&apos;s discuss your requirements and explore how Metavayn can support your engineering workflow.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
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
