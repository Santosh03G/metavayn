import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
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
      {/* 1. HERO SECTION: 2D-TO-3D EXTRUSION SIGNATURE MOMENT */}
      <section className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 bg-cad-grid border-b border-[rgba(127,178,255,0.2)]">
        <Container size="wide">
          <div className="cad-border bg-blueprint-deep/80 p-6 sm:p-10 lg:p-12">
            {/* Top Dimension Leader */}
            <div className="mb-6">
              <DimensionLine value="GENERAL ARRANGEMENT • 2400.00 mm" tolerance="0.05" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Hero Copy (Verbatim from site-content.md) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <RedlineCallout revision="01" note="DRAWING TO 3D EXTRUSION" />
                  <span className="font-mono text-mono-xs text-blueprint-dimension/60">
                    DWG: MV-AHU-HERO-01
                  </span>
                </div>

                <div className="space-y-3">
                  <h1 className="font-display text-display-2xl sm:text-display-3xl text-blueprint-linen tracking-tight">
                    Engineering the Next Dimension
                  </h1>
                  <p className="font-display text-display-lg text-blueprint-signal font-semibold">
                    Engineering Excellence. Delivered.
                  </p>
                </div>

                <p className="font-sans text-body-base max-w-prose text-blueprint-linen/85 leading-relaxed">
                  We help global OEMs and engineering-driven businesses accelerate
                  product development, expand engineering capacity, and deliver
                  better products faster.
                </p>

                {/* Primary Action Buttons (Verbatim labels) */}
                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <Link href="/services">
                    <Button variant="primary" size="base">
                      Explore Our Services
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="secondary" size="base">
                      Talk to Our Engineers
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 border-t border-[rgba(127,178,255,0.15)] flex items-center space-x-6 text-mono-xs font-mono text-blueprint-dimension/70">
                  <span>SCALE: 1:20 (ISO 128)</span>
                  <span>•</span>
                  <span>CAD DISCIPLINE: AIR HANDLING UNIT (M1)</span>
                </div>
              </div>

              {/* Hero 3D M1 AHU Assembly Viewport with 2D Blueprint Fallback */}
              <div className="lg:col-span-6">
                <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep/90 p-2 sm:p-4">
                  <Scene
                    aspectRatio="aspect-[4/3]"
                    cameraPosition={[3.6, 2.8, 4.8]}
                    fallback={<M1DrawingFallback />}
                  >
                    <M1AirHandlingUnit
                      explodeFactor={0.15}
                      interactiveTilt={true}
                    />
                  </Scene>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-blueprint-dimension/60 px-1">
                    <span>CURSOR TILT ACTIVE</span>
                    <span>SCROLL DOWN TO EXPLODE ASSEMBLY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Frame Living Title Block */}
            <div className="mt-10 pt-6 border-t border-[rgba(127,178,255,0.2)]">
              <TitleBlock
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

      {/* 2. ABOUT METAVAYN (MISSION & CAPACITY QUOTE) */}
      <Section
        id="about"
        theme="dark"
        sectionCutLabel="SECTION A-A / EXTENSION OF OEM TEAMS"
        sheetRef="MV-SEC-ABOUT"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest block">
              COMPANY OVERVIEW
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
              About Metavayn
            </h2>
            <h3 className="font-display text-display-base sm:text-display-lg text-blueprint-signal font-semibold">
              Your Engineering Partner for Faster Product Delivery
            </h3>
          </div>

          <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed">
            Metavayn Technologies Pvt. Ltd. is an engineering services company
            focused on delivering reliable, scalable, and technology-driven
            engineering solutions. We work as an extension of our clients&apos;
            engineering teams, supporting them across product design, mechanical
            engineering, engineering documentation, product development, and
            manufacturing readiness.
          </p>

          {/* Core Mission Quote Box */}
          <div className="border-l-2 border-blueprint-signal bg-blueprint-cyanotype/30 p-6 sm:p-8">
            <span className="font-mono text-mono-xs text-blueprint-dimension/60 uppercase block mb-2">
              CORE OBJECTIVE
            </span>
            <blockquote className="font-display text-display-base sm:text-display-lg font-medium text-blueprint-linen leading-snug">
              &ldquo;Help businesses transform engineering ideas into
              production-ready products — faster, smarter, and with greater
              confidence.&rdquo;
            </blockquote>
          </div>
        </div>
      </Section>

      {/* 3. WHAT WE DO: PINNED 3D EXPLODED MODEL & FIVE DISCIPLINES */}
      <WhatWeDoSection />

      {/* 4. OUR APPROACH TEASER (01-04 STRUCTURED PROCESS) */}
      <Section
        id="approach"
        theme="dark"
        sectionCutLabel="PROCESS WORKFLOW / 01 TO 04 SEQUENCE"
        sheetRef="MV-SEC-PROC"
      >
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[rgba(127,178,255,0.2)] pb-4 gap-4">
            <div>
              <span className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest block mb-1">
                STRUCTURED WORKFLOW
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
                Our Approach
              </h2>
              <p className="font-display text-display-base text-blueprint-signal font-medium mt-1">
                Define → Design → Deliver
              </p>
            </div>
            <Link href="/our-approach">
              <Button variant="blueprint" size="sm">
                Explore our complete process
              </Button>
            </Link>
          </div>

          <p className="font-sans text-body-base max-w-prose text-blueprint-linen/80 leading-relaxed">
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
                className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="font-mono text-mono-xs text-blueprint-signal font-bold pb-2 border-b border-[rgba(127,178,255,0.15)] mb-3">
                    {s.step} — {s.title.toUpperCase()}
                  </div>
                  <h3 className="font-display text-display-base text-blueprint-linen font-semibold mb-2">
                    {s.title}
                  </h3>
                  <p className="font-sans text-body-sm text-blueprint-linen/75 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="font-mono text-[9px] text-blueprint-dimension/50 uppercase">
                  PHASE STATUS: VERIFIED
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. OUR VALUE PROPOSITION: LARGE TYPOGRAPHIC MOMENT ON LIGHT LINEN */}
      <Section
        id="value-proposition"
        theme="light"
        sectionCutLabel="SECTION B-B / VALUE PROPOSITION SPECIFICATION"
        sheetRef="MV-SEC-VALUE"
        grid={false}
      >
        <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-mono-xs text-blueprint-graphite/60 uppercase tracking-widest block">
              COLLABORATION MODEL
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-graphite">
              Our Value Proposition
            </h2>
            <h3 className="font-display text-display-base sm:text-display-lg text-blueprint-signal font-semibold">
              Extend Your Engineering Team Without Extending Your Overhead
            </h3>
          </div>

          <p className="font-sans text-body-base max-w-prose text-blueprint-graphite/80 leading-relaxed">
            Whether you need support for a single engineering project or a
            long-term dedicated team, Metavayn provides flexible engineering
            capacity aligned with your business requirements.
          </p>

          {/* Large Typographic Hero Statement (Pure Typography, No Illustration) */}
          <div className="border-t border-b border-blueprint-graphite/20 py-10 my-8 space-y-3">
            <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-blueprint-graphite font-bold tracking-tight leading-tight">
              You bring the product vision.
            </p>
            <p className="font-display text-display-xl sm:text-display-2xl lg:text-display-3xl text-blueprint-signal font-bold tracking-tight leading-tight">
              We bring the engineering capability.
            </p>
          </div>

          <div>
            <DimensionLine
              value="VALUE PROPOSITION MEASURE: 75ch"
              tolerance="0.00"
              bgClassName="bg-blueprint-linen"
              className="!text-blueprint-graphite"
            />
          </div>
        </div>
      </Section>

      {/* 6. PARTNER WITH METAVAYN CTA SECTION */}
      <Section
        id="partner"
        theme="dark"
        sectionCutLabel="ENGAGEMENT INTAKE / FINAL SPECIFICATION"
        sheetRef="MV-SEC-CTA"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest block">
            GET STARTED
          </span>

          <h2 className="font-display text-display-2xl sm:text-display-3xl text-blueprint-linen">
            Partner With Metavayn
          </h2>

          <h3 className="font-display text-display-lg text-blueprint-signal font-semibold">
            Have an Engineering Challenge?
          </h3>

          <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help. Let&apos;s discuss your requirements and explore how
            Metavayn can support your engineering workflow.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
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

          <div className="pt-6 font-mono text-[11px] text-blueprint-dimension/60">
            RESPONSE PROTOCOL: WITHIN 24 BUSINESS HOURS • NON-DISCLOSURE GUARANTEED
          </div>
        </div>
      </Section>
    </div>
  );
}
