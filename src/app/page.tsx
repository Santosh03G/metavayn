import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DimensionLine } from "@/components/drawing/DimensionLine";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION: ROYAL FIELD (2D-TO-3D EXTRUSION SIGNATURE MOMENT) */}
      <section className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 bg-royal text-paper border-b border-paper/30 select-none">
        <Container size="wide">
          <div className="border border-paper/40 bg-royal p-6 sm:p-10 lg:p-12">
            {/* Top Dimension Leader */}
            <div className="mb-6">
              <DimensionLine
                surface="royal"
                value="GENERAL ARRANGEMENT • 2400.00 mm"
                tolerance="0.05"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Hero Copy (Verbatim from site-content.md) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <RedlineCallout surface="royal" revision="01" note="DRAWING TO 3D EXTRUSION" />
                  <span className="font-mono text-mono-xs text-paper/70">
                    DWG: MV-AHU-HERO-01
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-display text-display-2xl sm:text-display-3xl text-paper tracking-tight">
                    Engineering the Next Dimension
                  </h1>
                  <p className="font-display text-display-lg text-paper font-semibold">
                    Engineering Excellence. Delivered.
                  </p>
                </div>

                <p className="font-sans text-body-base max-w-prose text-paper leading-relaxed">
                  We help global OEMs and engineering-driven businesses accelerate
                  product development, expand engineering capacity, and deliver
                  better products faster.
                </p>

                {/* Primary Action Buttons complying with Step 5:
                    Primary on royal: --paper bg, --black text
                    Secondary on royal: transparent, 1.5px --paper border, --paper text */}
                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link href="/services">
                    <Button surface="royal" variant="primary" size="base">
                      Explore Our Services
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button surface="royal" variant="secondary" size="base">
                      Talk to Our Engineers
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-paper/20 flex items-center space-x-6 text-mono-xs font-mono text-paper/70">
                  <span>SCALE: 1:20 (ISO 128)</span>
                  <span>•</span>
                  <span>CAD DISCIPLINE: AIR HANDLING UNIT (M1)</span>
                </div>
              </div>

              {/* Hero 3D M1 AHU Assembly Viewport with 2D Blueprint Fallback */}
              <div className="lg:col-span-6">
                <div className="border border-paper/30 bg-royal p-2 sm:p-4">
                  <Scene
                    surface="royal"
                    aspectRatio="aspect-[4/3]"
                    cameraPosition={[3.6, 2.8, 4.8]}
                    fallback={<M1DrawingFallback surface="royal" />}
                  >
                    <M1AirHandlingUnit
                      surface="royal"
                      explodeFactor={0.15}
                      interactiveTilt={true}
                    />
                  </Scene>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-paper/70 px-1">
                    <span>CURSOR TILT ACTIVE</span>
                    <span>SCROLL DOWN TO EXPLODE ASSEMBLY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Frame Living Title Block on Royal */}
            <div className="mt-10 pt-6 border-t border-paper/30">
              <TitleBlock
                surface="royal"
                drawingTitle="M1 AIR HANDLING UNIT - GENERAL ARRANGEMENT"
                drawingNumber="MV-2026-HERO-01"
                sheetNumber="01"
                totalSheets="07"
                scale="1:20"
                revision="01"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ABOUT METAVAYN: PAPER SECTION */}
      <Section
        id="about"
        surface="paper"
        sectionCutLabel="SECTION A-A / EXTENSION OF OEM TEAMS"
        sheetRef="MV-SEC-ABOUT"
      >
        <div className="max-w-4xl mx-auto space-y-8 select-none">
          <div className="space-y-3">
            <span className="font-mono text-mono-xs text-black/60 uppercase tracking-widest block">
              COMPANY OVERVIEW
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
              About Metavayn
            </h2>
            <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
              Your Engineering Partner for Faster Product Delivery
            </h3>
          </div>

          <p className="font-sans text-body-base text-black/90 leading-relaxed">
            Metavayn Technologies Pvt. Ltd. is an engineering services company
            focused on delivering reliable, scalable, and technology-driven
            engineering solutions. We work as an extension of our clients&apos;
            engineering teams, supporting them across product design, mechanical
            engineering, engineering documentation, product development, and
            manufacturing readiness.
          </p>

          {/* Core Mission Quote Box */}
          <div className="border-l-2 border-royal bg-black/[0.03] p-6 sm:p-8">
            <span className="font-mono text-mono-xs text-black/60 uppercase block mb-2">
              CORE OBJECTIVE
            </span>
            <blockquote className="font-display text-display-base sm:text-display-lg font-medium text-black leading-snug">
              &ldquo;Help businesses transform engineering ideas into
              production-ready products — faster, smarter, and with greater
              confidence.&rdquo;
            </blockquote>
          </div>
        </div>
      </Section>

      {/* 3. WHAT WE DO: BLACK SECTION (PINNED 3D EXPLODED MODEL & FIVE DISCIPLINES) */}
      <WhatWeDoSection />

      {/* 4. OUR APPROACH TEASER & VALUE PROPOSITION: PAPER SECTION */}
      <Section
        id="approach"
        surface="paper"
        sectionCutLabel="PROCESS WORKFLOW / 01 TO 04 SEQUENCE"
        sheetRef="MV-SEC-PROC"
      >
        <div className="space-y-12 select-none">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-paper-line pb-4 gap-4">
            <div>
              <span className="font-mono text-mono-xs text-black/60 uppercase tracking-widest block mb-1">
                STRUCTURED WORKFLOW
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our Approach
              </h2>
              <p className="font-display text-display-base text-royal font-medium mt-1">
                Define → Design → Deliver
              </p>
            </div>
            <Link href="/our-approach">
              <Button surface="paper" variant="secondary" size="sm">
                Explore our complete process
              </Button>
            </Link>
          </div>

          <p className="font-sans text-body-base max-w-prose text-black/90 leading-relaxed">
            We follow a structured engineering process designed to minimize errors,
            improve communication, and accelerate delivery.
          </p>

          {/* Sequence Steps (01-04) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Define",
                desc: "We understand your product requirements, engineering objectives, specifications, and project constraints.",
              },
              {
                step: "02",
                title: "Design",
                desc: "Our engineers transform requirements into detailed, accurate, and manufacturable engineering solutions.",
              },
              {
                step: "03",
                title: "Validate",
                desc: "We review designs, documentation, assemblies, BOMs, and engineering requirements to ensure quality and consistency.",
              },
              {
                step: "04",
                title: "Deliver",
                desc: "We deliver production-ready engineering outputs while maintaining documentation and revision control.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="border border-paper-line bg-paper p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="font-mono text-mono-xs text-royal font-bold pb-2 border-b border-paper-line mb-3">
                    {s.step} — {s.title.toUpperCase()}
                  </div>
                  <h3 className="font-display text-display-base text-black font-semibold mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-body-sm text-black/85 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="font-mono text-[9px] text-black/50 uppercase">
                  PHASE STATUS: VERIFIED
                </div>
              </div>
            ))}
          </div>

          {/* 5. OUR VALUE PROPOSITION: TYPOGRAPHIC MOMENT ON PAPER */}
          <div className="pt-12 border-t border-paper-line space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-mono-xs text-black/60 uppercase tracking-widest block">
                COLLABORATION MODEL
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our Value Proposition
              </h2>
              <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                Extend Your Engineering Team Without Extending Your Overhead
              </h3>
            </div>

            <p className="font-sans text-body-base max-w-prose text-black/85 leading-relaxed">
              Whether you need support for a single engineering project or a
              long-term dedicated team, Metavayn provides flexible engineering
              capacity aligned with your business requirements.
            </p>

            {/* Typographic Hero Statement: Pure Typography, No Illustration */}
            <div className="border-t border-b border-paper-line py-10 my-8 space-y-3">
              <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-black font-bold tracking-tight leading-tight">
                You bring the product vision.
              </p>
              <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-royal font-bold tracking-tight leading-tight">
                We bring the engineering capability.
              </p>
            </div>

            <div>
              <DimensionLine
                surface="paper"
                value="VALUE PROPOSITION MEASURE: 75ch"
                tolerance="0.00"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* 6. PARTNER WITH METAVAYN CTA: BLACK SECTION */}
      <Section
        id="partner"
        surface="black"
        sectionCutLabel="ENGAGEMENT INTAKE / FINAL SPECIFICATION"
        sheetRef="MV-SEC-CTA"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6 select-none">
          <span className="font-mono text-mono-xs text-pale-blue uppercase tracking-widest block">
            GET STARTED
          </span>

          <h2 className="font-display text-display-2xl sm:text-display-3xl text-paper">
            Partner With Metavayn
          </h2>

          <h3 className="font-display text-display-lg text-pale-blue font-semibold">
            Have an Engineering Challenge?
          </h3>

          <p className="font-sans text-body-base text-paper leading-relaxed max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help. Let&apos;s discuss your requirements and explore how
            Metavayn can support your engineering workflow.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button surface="black" variant="primary" size="base">
                Start a Conversation
              </Button>
            </Link>
            <Link href="/contact">
              <Button surface="black" variant="secondary" size="base">
                Request Engineering Support
              </Button>
            </Link>
          </div>

          <div className="pt-6 font-mono text-[11px] text-pale-blue/70">
            RESPONSE PROTOCOL: WITHIN 24 BUSINESS HOURS • NON-DISCLOSURE GUARANTEED
          </div>
        </div>
      </Section>
    </div>
  );
}
