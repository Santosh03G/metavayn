import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Scene } from "@/components/canvas/Scene";
import { M1AirHandlingUnit } from "@/components/canvas/M1AirHandlingUnit";
import { M1DrawingFallback } from "@/components/canvas/M1DrawingFallback";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* 1. HERO SECTION: ROYAL FIELD */}
      <section className="relative min-h-[85vh] flex flex-col justify-center py-12 sm:py-20 lg:py-24 bg-royal text-paper select-none">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Hero Copy Block */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <h1 className="font-display text-display-2xl sm:text-display-3xl text-paper tracking-tight">
                  Engineering the next dimension
                </h1>
                <p className="font-display text-display-lg text-paper font-semibold">
                  Engineering excellence. Delivered.
                </p>
              </div>

              <p className="font-sans text-body-base sm:text-body-lg max-w-prose text-paper leading-relaxed">
                We help global OEMs and engineering-driven businesses accelerate
                product development, expand engineering capacity, and deliver
                better products faster.
              </p>

              {/* Action Buttons in Sentence Case */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <Link href="/services">
                  <Button surface="royal" variant="primary" size="base">
                    Explore our services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button surface="royal" variant="secondary" size="base">
                    Talk to our engineers
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero 3D M1 AHU Assembly: 1.6x scale, 55-65% width on desktop, centered on headline */}
            <div className="lg:col-span-6 flex items-center justify-center w-full">
              <div className="w-full">
                <Scene
                  surface="royal"
                  aspectRatio="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                  orthographic={true}
                  cameraPosition={[16, 13, 16]}
                  borderless={true}
                  modelScale={1.6}
                  orthoPadding={0.09}
                  fallback={<M1DrawingFallback surface="royal" />}
                >
                  <M1AirHandlingUnit
                    surface="royal"
                    explodeFactor={0}
                    modelScale={1.6}
                  />
                </Scene>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ABOUT METAVAYN: PAPER SECTION (ALIGNED TO 12-COLUMN GRID) */}
      <Section id="about" surface="paper" className="scroll-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                About Metavayn
              </h2>
              <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                Your engineering partner for faster product delivery
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

            {/* Full-column Typographic Quote */}
            <blockquote className="font-display text-display-lg sm:text-display-xl lg:text-display-2xl font-medium text-black leading-snug pt-4 pb-2 border-t border-paper-line">
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
        <div className="space-y-14 select-none">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-paper-line pb-4 gap-4">
            <div>
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our approach
              </h2>
              <p className="font-display text-display-base text-royal font-medium mt-1">
                Define, Design, Validate, Deliver
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

          {/* Sequence Timeline: Horizontal line with 4 stops on desktop, vertical on mobile */}
          <div className="relative">
            {/* Desktop Horizontal Line */}
            <div className="hidden lg:block absolute top-5 left-6 right-6 h-[1px] bg-paper-line -z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  num: "1",
                  title: "Define",
                  desc: "We understand your product requirements, engineering objectives, specifications, and project constraints.",
                },
                {
                  num: "2",
                  title: "Design",
                  desc: "Our engineers transform requirements into detailed, accurate, and manufacturable engineering solutions.",
                },
                {
                  num: "3",
                  title: "Validate",
                  desc: "We review designs, documentation, assemblies, BOMs, and engineering requirements to ensure quality and consistency.",
                },
                {
                  num: "4",
                  title: "Deliver",
                  desc: "We deliver production-ready engineering outputs while maintaining documentation and revision control.",
                },
              ].map((s) => (
                <div key={s.num} className="flex flex-col space-y-3">
                  {/* Number Node on Line */}
                  <div className="w-10 h-10 rounded-full border border-paper-line bg-paper flex items-center justify-center font-display font-semibold text-sm text-royal">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="font-display text-display-base text-black font-semibold mb-2">
                      {s.title}
                    </h3>
                    <p className="font-sans text-body-sm text-black/85 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. OUR VALUE PROPOSITION: TYPOGRAPHIC MOMENT ON PAPER */}
          <div className="pt-12 border-t border-paper-line space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-display-xl sm:text-display-2xl text-black">
                Our value proposition
              </h2>
              <h3 className="font-display text-display-base sm:text-display-lg text-royal font-semibold">
                Extend your engineering team without extending your overhead
              </h3>
            </div>

            <p className="font-sans text-body-base max-w-prose text-black/85 leading-relaxed">
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

          <h3 className="font-display text-display-lg text-pale-blue font-semibold">
            Have an engineering challenge?
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