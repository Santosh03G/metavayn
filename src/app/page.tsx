import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { ApproachTimeline } from "@/components/approach/ApproachTimeline";
import { PlantRoomPlanBackground } from "@/components/home/PlantRoomPlanBackground";
import { SectionCut } from "@/lib/motion/SectionCut";
import { SplitLines } from "@/lib/motion/SplitLines";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION: ROYAL FIELD (CHOREOGRAPHED PAGE LOAD) */}
      <HeroSection />

      {/* SECTION CUT: ROYAL TO PAPER (30-DEG ISOMETRIC WIPE WITH 45-DEG HATCH BAND) */}
      <SectionCut fromSurface="royal" toSurface="paper" />

      {/* 2. ABOUT METAVAYN: PAPER SECTION (IDEA TO PRODUCT SIGNATURE MOMENT)
          Pinned for 150vh at >= 1280px; unpinned on mobile; 3-state SVG AHU evolution */}
      <AboutSection />

      {/* SECTION CUT: PAPER TO BLACK */}
      <SectionCut fromSurface="paper" toSurface="black" />

      {/* 3. WHAT WE DO: BLACK SECTION (ROTATION & COPPER PART CROSS-FADE) */}
      <WhatWeDoSection />

      {/* SECTION CUT: BLACK TO PAPER */}
      <SectionCut fromSurface="black" toSurface="paper" />

      {/* 4. OUR APPROACH & VALUE PROPOSITION: PAPER SECTION */}
      <Section id="approach" surface="paper" className="scroll-mt-16">
        <div className="space-y-12 select-none">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-paper-line pb-4 gap-4">
            <div>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our approach
              </h2>
              {/* Heading Recipe: Lead paragraph in black (22-24px, weight 500) */}
              <p className="text-lead text-black mt-1">
                Define, Design, Validate, Deliver
              </p>
            </div>
            <Link href="/our-approach">
              <Button surface="paper" variant="secondary" size="sm">
                Explore our complete process
              </Button>
            </Link>
          </div>

          <p className="font-sans text-body max-w-[68ch] text-black/90 leading-relaxed">
            We follow a structured engineering process designed to minimize errors,
            improve communication, and accelerate delivery.
          </p>

          {/* Sequence Timeline: Terminated at step 4 node with scroll-driven royal fill */}
          <ApproachTimeline />

          {/* 5. OUR VALUE PROPOSITION: TYPOGRAPHIC MOMENT ON PAPER */}
          <div className="pt-12 border-t border-paper-line space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our value proposition
              </h2>
              {/* Heading Recipe: Lead paragraph in black (22-24px, weight 500) */}
              <p className="text-lead text-black max-w-[68ch]">
                Extend your engineering team without extending your overhead
              </p>
            </div>

            <p className="font-sans text-body max-w-[68ch] text-black/85 leading-relaxed">
              Whether you need support for a single engineering project or a
              long-term dedicated team, Metavayn provides flexible engineering
              capacity aligned with your business requirements.
            </p>

            {/* Typographic Hero Statement: Scrubbed Masked Line Reveal */}
            <div className="border-t border-b border-paper-line py-10 my-8 space-y-3">
              <SplitLines scrub={1}>
                <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-black font-bold tracking-tight leading-tight">
                  You bring the product vision.
                </p>
              </SplitLines>
              <SplitLines scrub={1} delay={0.1}>
                <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-royal font-bold tracking-tight leading-tight">
                  We bring the engineering capability.
                </p>
              </SplitLines>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION CUT: PAPER TO BLACK */}
      <SectionCut fromSurface="paper" toSurface="black" />

      {/* 6. PARTNER WITH METAVAYN CTA: BLACK SECTION (WITH PLANT ROOM PLAN DRIFT) */}
      <Section id="partner" surface="black" className="relative scroll-mt-16 overflow-hidden">
        {/* Slow-drifting plan view of the plant room behind text (max 24px drift, paused off-screen) */}
        <PlantRoomPlanBackground />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 select-none">
          <h2 className="font-display text-display-2xl sm:text-display-3xl text-paper">
            Partner with Metavayn
          </h2>

          {/* Heading Recipe: Lead paragraph in paper on black (22-24px, weight 500) */}
          <p className="text-lead text-paper max-w-[68ch] mx-auto">
            Have an engineering challenge?
          </p>

          <p className="font-sans text-body text-paper leading-relaxed max-w-[68ch] mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help. Let&apos;s discuss your requirements and explore how
            Metavayn can support your engineering workflow.
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
