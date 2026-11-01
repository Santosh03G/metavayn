import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView } from "@/components/canvas/CADModelView";
import { MechanicalDesignViewer } from "@/components/services/MechanicalDesignViewer";
import { HvacThermalViewer } from "@/components/services/HvacThermalViewer";
import { SelfBuildingDrawing } from "@/components/drawing/SelfBuildingDrawing";
import { EngagementComparisonTable } from "@/components/services/EngagementComparisonTable";

export default function ServicesPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. SERVICES DIRECTORY HEADER: PAPER SECTION */}
      <section className="relative py-12 sm:py-20 bg-paper text-black border-b border-paper-line select-none">
        <Container>
          <div className="max-w-3xl space-y-4">
            <h1 className="font-display text-display-2xl sm:text-display-3xl text-black tracking-tight">
              What we do
            </h1>
            <p className="font-sans text-body-lg text-black/90 leading-relaxed max-w-prose">
              From concept development to detailed engineering, we help
              transform product ideas into practical and manufacturable designs.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. SERVICE 1: PRODUCT ENGINEERING (Model Turntable): BLACK SECTION */}
      <Section id="product-engineering" surface="black" className="scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start select-none">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
                Product engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-paper leading-relaxed max-w-prose">
              From concept development to detailed engineering, we help
              transform product ideas into practical and manufacturable designs.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-pale-blue border-b border-pale-blue/20 pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-paper">
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
                    <span className="w-1.5 h-1.5 bg-pale-blue" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Turntable on Black */}
          <div className="lg:col-span-6">
            <div className="border border-pale-blue/30 bg-black/60 p-4 sm:p-6 space-y-3">
              <Scene surface="black" aspectRatio="aspect-[16/10]" cameraPosition={[2.8, 2.2, 3.5]}>
                <CADModelView surface="black" autoRotate={true} />
              </Scene>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. SERVICE 2: MECHANICAL DESIGN ENGINEERING: FEATURED ROYAL SECTION (M2 Unfold Scrubber + M3 Welds) */}
      <Section id="mechanical-design" surface="royal" className="scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start select-none">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
                Mechanical design engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-paper leading-relaxed max-w-prose">
              Our mechanical engineering capabilities support OEMs and
              manufacturers with accurate, production-ready designs.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-paper border-b border-paper/20 pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-paper">
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
                    <span className="w-1.5 h-1.5 bg-paper" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature Moment: M2 Sheet Metal Unfold Scrubber + M3 Weld Callouts on Royal */}
          <div className="lg:col-span-6">
            <MechanicalDesignViewer surface="royal" />
          </div>
        </div>
      </Section>

      {/* 4. SERVICE 3: HVAC & THERMAL ENGINEERING: BLACK SECTION */}
      <Section id="hvac-engineering" surface="black" className="scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start select-none">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
                HVAC & thermal engineering
              </h2>
            </div>

            <p className="font-sans text-body-base text-paper leading-relaxed max-w-prose">
              We support HVAC and thermal-system companies with engineering
              design and documentation services.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-pale-blue border-b border-pale-blue/20 pb-1">
                Capabilities include:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-paper">
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
                    <span className="w-1.5 h-1.5 bg-pale-blue" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* M1 AHU with View Switcher */}
          <div className="lg:col-span-6">
            <HvacThermalViewer />
          </div>
        </div>
      </Section>

      {/* 5. SERVICE 4: ENGINEERING DOCUMENTATION: PAPER SECTION */}
      <Section id="engineering-documentation" surface="paper" className="scroll-mt-16">
        <div className="space-y-8 select-none">
          <div className="max-w-3xl space-y-3">
            <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
              Engineering documentation
            </h2>
            <p className="font-sans text-body-base text-black/90 leading-relaxed">
              Accurate documentation is critical for successful product
              development and manufacturing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-black/70 border-b border-paper-line pb-1">
                We provide:
              </h3>
              <ul className="space-y-2 font-sans text-body-sm text-black/90">
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
                    <span className="w-1.5 h-1.5 bg-royal" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Building SVG Drawing Sheet on Paper */}
            <div className="lg:col-span-8">
              <SelfBuildingDrawing surface="paper" />
            </div>
          </div>
        </div>
      </Section>

      {/* 6. SERVICE 5: ENGINEERING SUPPORT: BLACK SECTION */}
      <Section id="engineering-support" surface="black" className="scroll-mt-16">
        <div className="max-w-4xl space-y-6 select-none">
          <div>
            <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
              Engineering support
            </h2>
            <p className="font-sans text-body-base text-paper leading-relaxed mt-2 max-w-prose">
              Extend your engineering capacity without increasing your internal
              overhead.
            </p>
          </div>

          <div className="pt-2">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-pale-blue border-b border-pale-blue/20 pb-1 mb-4">
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
                  className="p-3.5 border border-pale-blue/20 bg-black flex items-center space-x-3"
                >
                  <span className="font-sans text-xs text-pale-blue font-bold">
                    ✓
                  </span>
                  <span className="font-sans text-body-sm text-paper">
                    {cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 7. ENGAGEMENT MODELS COMPARISON TABLE: PAPER SECTION */}
      <Section id="engagement-models" surface="paper" className="scroll-mt-16">
        <div className="space-y-8 select-none">
          <div className="space-y-2">
            <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
              Engineering services that scale with you
            </h2>
            <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
              Extend your engineering team without extending your overhead
            </h3>
          </div>

          <EngagementComparisonTable />
        </div>
      </Section>

      {/* 8. SERVICES CTA: BLACK SECTION */}
      <Section id="services-cta" surface="black" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 select-none">
          <h2 className="font-display text-display-xl sm:text-display-2xl text-paper">
            Have an engineering challenge?
          </h2>
          <p className="font-sans text-body-base text-paper max-w-prose mx-auto">
            Whether you&apos;re developing a new product, expanding your
            engineering team, or looking for additional design capacity, we&apos;re
            ready to help.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link href="/contact">
              <Button surface="black" variant="primary" size="base">
                Request engineering support
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}