import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { DimensionLine } from "@/components/drawing/DimensionLine";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView } from "@/components/canvas/CADModelView";
import { MechanicalDesignViewer } from "@/components/services/MechanicalDesignViewer";
import { HvacThermalViewer } from "@/components/services/HvacThermalViewer";
import { SelfBuildingDrawing } from "@/components/drawing/SelfBuildingDrawing";
import { EngagementComparisonTable } from "@/components/services/EngagementComparisonTable";

export default function ServicesPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. SERVICES DIRECTORY HEADER */}
      <section className="relative py-12 sm:py-20 bg-cad-grid border-b border-[rgba(127,178,255,0.2)]">
        <Container size="wide">
          <div className="cad-border bg-blueprint-deep/80 p-6 sm:p-10 lg:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <RedlineCallout revision="01" note="SERVICES SPECIFICATION DIRECTORY" />
              <span className="font-mono text-mono-xs text-blueprint-dimension/60">
                DOC: MV-SRV-2026
              </span>
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-display-2xl sm:text-display-3xl text-blueprint-linen tracking-tight">
                What We Do
              </h1>
              <p className="font-sans text-body-lg text-blueprint-linen/90 leading-relaxed max-w-prose">
                From concept development to detailed engineering, we help
                transform product ideas into practical and manufacturable designs.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[rgba(127,178,255,0.2)] flex flex-wrap gap-4 text-mono-xs font-mono text-blueprint-dimension/70">
              <span>DISCIPLINES: 05 CORE ENGINEERING DOMAINS</span>
              <span>•</span>
              <span>STANDARDS: ISO / ASME / AHRI COMPLIANT</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SERVICE 1: PRODUCT ENGINEERING (Model Turntable) */}
      <Section
        id="product-engineering"
        theme="dark"
        sectionCutLabel="SERVICE 01 / PRODUCT ENGINEERING"
        sheetRef="MV-SRV-PE-01"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-mono-xs text-blueprint-signal font-bold uppercase tracking-wider block mb-1">
                01 — CAPABILITY SPECIFICATION
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
                Product Engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed max-w-prose">
              From concept development to detailed engineering, we help
              transform product ideas into practical and manufacturable designs.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-blueprint-linen/90">
                {[
                  "Product design and development",
                  "3D CAD modeling",
                  "Detailed component design",
                  "Assembly design",
                  "Design optimization",
                  "Engineering drawings",
                  "Design documentation",
                  "Design modifications and improvements",
                ].map((cap) => (
                  <li key={cap} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-blueprint-signal" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Turntable */}
          <div className="lg:col-span-6">
            <div className="border border-[rgba(127,178,255,0.3)] bg-blueprint-deep/95 p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 font-mono text-mono-xs text-blueprint-dimension">
                <span>M4 PARAMETRIC COMPONENT TURNTABLE</span>
                <span>MODE: ACTIVE ROTATION</span>
              </div>
              <Scene aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.5]}>
                <CADModelView autoRotate={true} />
              </Scene>
              <div className="flex justify-between items-center text-[10px] font-mono text-blueprint-dimension/60 pt-1">
                <span>FEATURE EDGES DRAWN VIA EDGESGEOMETRY</span>
                <span>DRAG TO ORBIT</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. SERVICE 2: MECHANICAL DESIGN ENGINEERING (Signature Moment: M2 Unfold Scrubber + M3 Welds) */}
      <Section
        id="mechanical-design"
        theme="dark"
        sectionCutLabel="SERVICE 02 / MECHANICAL DESIGN & SHEET METAL KINEMATICS"
        sheetRef="MV-SRV-MD-02"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-mono-xs text-blueprint-signal font-bold uppercase tracking-wider block mb-1">
                02 — CAPABILITY SPECIFICATION
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
                Mechanical Design Engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed max-w-prose">
              Our mechanical engineering capabilities support OEMs and
              manufacturers with accurate, production-ready designs.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-blueprint-linen/90">
                {[
                  "3D modeling",
                  "2D manufacturing drawings",
                  "Sheet metal design",
                  "Weldments and fabrication",
                  "Machine and equipment design",
                  "Structural design",
                  "Assembly modeling",
                  "GD&T and engineering documentation",
                ].map((cap) => (
                  <li key={cap} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-blueprint-signal" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature Moment: M2 Sheet Metal Unfold Scrubber + M3 Weld Callouts */}
          <div className="lg:col-span-6">
            <MechanicalDesignViewer />
          </div>
        </div>
      </Section>

      {/* 4. SERVICE 3: HVAC & THERMAL ENGINEERING (M1 Section View Mode Switcher) */}
      <Section
        id="hvac-engineering"
        theme="dark"
        sectionCutLabel="SERVICE 03 / HVAC & THERMAL SYSTEMS"
        sheetRef="MV-SRV-HVAC-03"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-mono-xs text-blueprint-signal font-bold uppercase tracking-wider block mb-1">
                03 — CAPABILITY SPECIFICATION
              </span>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
                HVAC & Thermal Engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed max-w-prose">
              We support HVAC and thermal-system companies with engineering
              design and documentation services.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-blueprint-linen/90">
                {[
                  "HVAC equipment design",
                  "Thermal-system engineering support",
                  "Component and assembly design",
                  "Fabrication-ready documentation",
                  "Equipment layouts",
                  "Engineering BOM preparation",
                  "Design modifications",
                  "Manufacturing support",
                ].map((cap) => (
                  <li key={cap} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-blueprint-signal" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* M1 AHU with Shaded/Wireframe/Drawing View Switcher */}
          <div className="lg:col-span-6">
            <HvacThermalViewer />
          </div>
        </div>
      </Section>

      {/* 5. SERVICE 4: ENGINEERING DOCUMENTATION (Self-Building Drawing Sheet) */}
      <Section
        id="engineering-documentation"
        theme="dark"
        sectionCutLabel="SERVICE 04 / DOCUMENTATION & REVISION CONTROL"
        sheetRef="MV-SRV-DOC-04"
      >
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-mono-xs text-blueprint-signal font-bold uppercase tracking-wider block mb-1">
              04 — CAPABILITY SPECIFICATION
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
              Engineering Documentation
            </h2>
            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed">
              Accurate documentation is critical for successful product
              development and manufacturing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1">
                We provide:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-blueprint-linen/90">
                {[
                  "Manufacturing drawings",
                  "Assembly drawings",
                  "Bill of Materials (BOM)",
                  "Engineering specifications",
                  "Design documentation",
                  "Revision management",
                  "Technical documentation",
                  "Manufacturing documentation",
                ].map((cap) => (
                  <li key={cap} className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 bg-blueprint-signal" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Building SVG Drawing Sheet */}
            <div className="lg:col-span-8">
              <SelfBuildingDrawing />
            </div>
          </div>
        </div>
      </Section>

      {/* 6. SERVICE 5: ENGINEERING SUPPORT (Simple, Text-Led Architectural Index) */}
      <Section
        id="engineering-support"
        theme="dark"
        sectionCutLabel="SERVICE 05 / CAPACITY EXTENSION"
        sheetRef="MV-SRV-SUP-05"
      >
        <div className="max-w-4xl space-y-6">
          <div>
            <span className="font-mono text-mono-xs text-blueprint-signal font-bold uppercase tracking-wider block mb-1">
              05 — CAPABILITY SPECIFICATION
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
              Engineering Support
            </h2>
            <p className="font-sans text-body-base text-blueprint-linen/85 leading-relaxed mt-2 max-w-prose">
              Extend your engineering capacity without increasing your internal
              overhead.
            </p>
          </div>

          <div className="pt-2">
            <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1 mb-4">
              Our dedicated engineering teams can support:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "New product development",
                "Existing product modifications",
                "Engineering change requests",
                "Drawing conversion",
                "CAD migration",
                "Design validation support",
                "Documentation activities",
                "Ongoing engineering projects",
              ].map((cap) => (
                <div
                  key={cap}
                  className="p-3.5 border border-[rgba(127,178,255,0.2)] bg-blueprint-deep flex items-center space-x-3"
                >
                  <span className="font-mono text-mono-xs text-blueprint-signal">
                    [+]
                  </span>
                  <span className="font-sans text-body-sm text-blueprint-linen">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 7. ENGAGEMENT MODELS COMPARISON TABLE (LIGHT LINEN SECTION CUT) */}
      <Section
        id="engagement-models"
        theme="light"
        sectionCutLabel="SECTION C-C / PROCUREMENT & ENGAGEMENT MATRIX"
        sheetRef="MV-SEC-ENGAGE"
        grid={false}
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-mono-xs text-blueprint-graphite/60 uppercase tracking-widest block">
              COLLABORATION MATRIX
            </span>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-graphite">
              Engineering Services That Scale With You
            </h2>
            <h3 className="font-display text-display-base sm:text-display-lg text-blueprint-signal font-semibold">
              Extend Your Engineering Team Without Extending Your Overhead
            </h3>
          </div>

          <EngagementComparisonTable />

          <div className="pt-4">
            <DimensionLine
              value="ENGAGEMENT COMPARISON • 100% TRANSPARENT SCOPE"
              tolerance="0.00"
              bgClassName="bg-blueprint-linen"
              className="!text-blueprint-graphite"
            />
          </div>
        </div>
      </Section>

      {/* 8. SERVICES CTA */}
      <Section
        id="services-cta"
        theme="dark"
        sectionCutLabel="SERVICE INTAKE"
        sheetRef="MV-SEC-CTA-SRV"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-display-xl sm:text-display-2xl text-blueprint-linen">
            Have an Engineering Challenge?
          </h2>
          <p className="font-sans text-body-base text-blueprint-linen/85 max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="base">
                Request Engineering Support
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
