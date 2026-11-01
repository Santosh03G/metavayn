import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { ApproachTimeline } from "@/components/approach/ApproachTimeline";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION: ROYAL FIELD (CHOREOGRAPHED PAGE LOAD) */}
      <HeroSection />

      {/* 2. ABOUT METAVAYN: PAPER SECTION (ALIGNED TO 12-COLUMN GRID)
          At 1280 and up: 2 columns (Left col 1-5: heading, subheading, paragraph; Right col 7-12: quote top-aligned at 40-48px).
          Below 1280: single column with quote after paragraph. */}
      <Section id="about" surface="paper" className="scroll-mt-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-start select-none">
          {/* Left Column: columns 1 to 5 at 1280+ */}
          <div className="xl:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                About Metavayn
              </h2>
              {/* Royal subheading kept for About subheading */}
              <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                Your engineering partner for faster product delivery
              </h3>
            </div>

            <p className="font-sans text-body text-black/90 leading-relaxed max-w-[68ch]">
              Metavayn Technologies Pvt. Ltd. is an engineering services company
              focused on delivering reliable, scalable, and technology-driven
              engineering solutions. We work as an extension of our clients&apos;
              engineering teams, supporting them across product design, mechanical
              engineering, engineering documentation, product development, and
              manufacturing readiness.
            </p>
          </div>

          {/* Right Column: columns 7 to 12 at 1280+ (top-aligned with heading, 40 to 48px) */}
          <div className="xl:col-span-6 xl:col-start-7 flex items-start">
            <blockquote className="font-display text-[32px] sm:text-[38px] xl:text-[44px] 2xl:text-[48px] font-medium text-black leading-tight border-t xl:border-t-0 border-paper-line pt-6 xl:pt-0">
              &ldquo;Help businesses transform engineering ideas into
              production-ready products &mdash; faster, smarter, and with greater
              confidence.&rdquo;
            </blockquote>
          </div>
        </div>
      </Section>

      {/* 3. WHAT WE DO: BLACK SECTION */}
      <WhatWeDoSection />

      {/* 4. OUR APPROACH TEASER & VALUE PROPOSITION: PAPER SECTION */}
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

            {/* Typographic Hero Statement: Pure Typography */}
            <div className="border-t border-b border-paper-line py-10 my-8 space-y-3">
              <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-black font-bold tracking-tight leading-tight">
                You bring the product vision.
              </p>
              <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-royal font-bold tracking-tight leading-tight">
                We bring the engineering capability.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 6. PARTNER WITH METAVAYN CTA: BLACK SECTION */}
      <Section id="partner" surface="black" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 select-none">
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
