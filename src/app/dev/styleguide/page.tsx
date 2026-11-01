"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { DrawingSheet } from "@/components/ui/DrawingSheet";
import { DimensionLine } from "@/components/drawing/DimensionLine";
import { RedlineCallout } from "@/components/drawing/RedlineCallout";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView, type CADRenderMode } from "@/components/canvas/CADModelView";
import { MOTION } from "@/lib/motion";

export default function StyleguidePage() {
  const [cadMode, setCadMode] = useState<CADRenderMode>("drawing");
  const [testTransition, setTestTransition] = useState(false);

  const colors = [
    { name: "Section Deep", hex: "#06142B", variable: "--color-deep", desc: "Darkest canvas background" },
    { name: "Cyanotype", hex: "#0D2B52", variable: "--color-cyanotype", desc: "Blueprint surface / panels" },
    { name: "Signal Blue", hex: "#2F7BFF", variable: "--color-signal", desc: "Single interactive accent" },
    { name: "Dimension Line", hex: "#7FB2FF", variable: "--color-dimension", desc: "Drafting lines & borders" },
    { name: "Linen", hex: "#EEF2F6", variable: "--color-linen", desc: "Cool paper light section cuts" },
    { name: "Graphite", hex: "#1B2430", variable: "--color-graphite", desc: "Text on light surfaces" },
    { name: "Redline", hex: "#E5484D", variable: "--color-redline", desc: "Revision markup & QA only" },
  ];

  const spacingScale = [
    { name: "cad-1", px: "4px", value: "var(--cad-space-1)" },
    { name: "cad-2", px: "8px", value: "var(--cad-space-2)" },
    { name: "cad-3", px: "12px", value: "var(--cad-space-3)" },
    { name: "cad-4", px: "16px", value: "var(--cad-space-4)" },
    { name: "cad-6", px: "24px", value: "var(--cad-space-6)" },
    { name: "cad-8", px: "32px", value: "var(--cad-space-8)" },
    { name: "cad-12", px: "48px", value: "var(--cad-space-12)" },
    { name: "cad-16", px: "64px", value: "var(--cad-space-16)" },
    { name: "cad-24", px: "96px", value: "var(--cad-space-24)" },
  ];

  return (
    <div className="min-h-screen bg-blueprint-deep text-blueprint-linen py-12">
      <Container size="wide">
        {/* Styleguide Header */}
        <div className="border-b border-[rgba(127,178,255,0.25)] pb-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-mono-xs text-blueprint-dimension/70 uppercase tracking-widest mb-1 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blueprint-signal" />
              <span>INTERNAL DESIGN SYSTEM BENCHMARK</span>
            </div>
            <h1 className="font-display text-display-2xl sm:text-display-3xl text-blueprint-linen">
              Metavayn Foundation Styleguide
            </h1>
          </div>
          <div className="font-mono text-mono-xs text-blueprint-dimension/80 border border-blueprint-dimension/30 px-3 py-1.5 bg-blueprint-cyanotype/30">
            SPEC: ISO 128 / ASME Y14.5 • REV 01
          </div>
        </div>

        {/* 1. 3D FOUNDATION & MATERIAL VIEW MODES (Triple View Pipeline) */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-4 border-b border-[rgba(127,178,255,0.2)] pb-2">
            <div>
              <h2 className="font-display text-display-xl text-blueprint-linen">
                01. 3D Foundation & CAD Material Pipeline
              </h2>
              <p className="font-sans text-body-sm text-blueprint-dimension/80">
                Single WebGL context, DPR capped at 1.75, off-screen pause, accessible 2D blueprint fallback.
              </p>
            </div>
            {/* Live Mode Toggle Controls */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-blueprint-dimension/60 mr-1 hidden sm:inline">VIEW MODE:</span>
              {(["drawing", "shaded", "wireframe"] as CADRenderMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCadMode(mode)}
                  className={`px-3 py-1.5 uppercase font-medium border text-mono-xs transition-colors ${
                    cadMode === mode
                      ? "bg-blueprint-signal text-white border-blueprint-signal"
                      : "bg-blueprint-cyanotype/50 text-blueprint-dimension border-blueprint-dimension/30 hover:border-blueprint-dimension"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <Scene aspectRatio="aspect-[16/10]">
                <CADModelView mode={cadMode} autoRotate={true} />
              </Scene>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-cyanotype/20 p-4">
                <span className="font-mono text-mono-xs text-blueprint-dimension block uppercase mb-1">
                  CURRENT ACTIVE MODE: [{cadMode.toUpperCase()}]
                </span>
                <p className="font-sans text-body-sm text-blueprint-linen/90 leading-relaxed">
                  {cadMode === "drawing" &&
                    "Hidden-Line Blueprint Mode: Geometry renders background color to occlude lines behind it, while EdgesGeometry draws crisp blueprint lines in #7FB2FF. Gives the authentic 2D CAD look."}
                  {cadMode === "shaded" &&
                    "Matte CAD Shaded Mode: Physical PBR material with controlled specular roughness and subtle directional key lighting."}
                  {cadMode === "wireframe" &&
                    "Isometric Wireframe Mode: Pure geometric lattice without surface occlusion."}
                </p>
              </div>

              <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep p-4 font-mono text-mono-xs space-y-2">
                <div className="text-blueprint-dimension/60 uppercase">WebGL Performance Checklist</div>
                <div className="text-blueprint-linen flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>DPR Capped at 1.75</span>
                </div>
                <div className="text-blueprint-linen flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>IntersectionObserver Off-Screen Pause</span>
                </div>
                <div className="text-blueprint-linen flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Non-WebGL SVG Fallback Slot</span>
                </div>
                <div className="text-blueprint-linen flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Draco & Meshopt Compression Configured</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COLOR PALETTE TOKENS */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            02. Disciplined Color System
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            Disciplined material palette. Blue is the material substrate, not a gradient wash.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colors.map((c) => (
              <div
                key={c.name}
                className="border border-[rgba(127,178,255,0.25)] bg-blueprint-deep p-4 flex flex-col justify-between"
              >
                <div
                  className="w-full h-16 border border-black/20 mb-3"
                  style={{ backgroundColor: c.hex }}
                />
                <div>
                  <div className="font-display font-semibold text-body-base text-blueprint-linen">
                    {c.name}
                  </div>
                  <div className="font-mono text-mono-xs text-blueprint-dimension/70">
                    {c.hex} • {c.variable}
                  </div>
                  <div className="font-sans text-body-sm text-blueprint-linen/60 mt-1">
                    {c.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TYPOGRAPHY SCALE */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            03. Type Scale & Measure Limits
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            Distinctive display (Bricolage Grotesque) + Workmanlike body (IBM Plex Sans) + Monospace only for callouts/tables.
          </p>

          <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep/80 divide-y divide-[rgba(127,178,255,0.15)]">
            <div className="p-6">
              <span className="font-mono text-mono-xs text-blueprint-dimension/60 uppercase block mb-1">
                DISPLAY 3XL • 48px / 52px • Bricolage Grotesque
              </span>
              <div className="font-display text-display-3xl text-blueprint-linen">
                Engineering the Next Dimension
              </div>
            </div>

            <div className="p-6">
              <span className="font-mono text-mono-xs text-blueprint-dimension/60 uppercase block mb-1">
                DISPLAY 2XL • 36px / 40px • Bricolage Grotesque
              </span>
              <div className="font-display text-display-2xl text-blueprint-linen">
                Precision Product Engineering & Design
              </div>
            </div>

            <div className="p-6">
              <span className="font-mono text-mono-xs text-blueprint-dimension/60 uppercase block mb-1">
                DISPLAY XL • 28px / 32px • Bricolage Grotesque
              </span>
              <div className="font-display text-display-xl text-blueprint-linen">
                Structured Engineering Process
              </div>
            </div>

            <div className="p-6">
              <span className="font-mono text-mono-xs text-blueprint-dimension/60 uppercase block mb-1">
                BODY MEASURE & SCALE • Max 75ch Line Length • IBM Plex Sans
              </span>
              <p className="font-sans text-body-base max-w-prose text-blueprint-linen/90 leading-relaxed border-l-2 border-blueprint-signal pl-4 my-2">
                We work as an extension of our clients&apos; engineering teams, supporting them across product design, mechanical engineering, engineering documentation, product development, and manufacturing readiness. Body measure is strictly capped at 75 characters for optimal readability.
              </p>
              <div className="mt-3">
                <DimensionLine value="MAX MEASURE: 75ch" tolerance="0.00" length="100%" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. COMPONENT PRIMITIVES */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            04. Brand Component Primitives
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            Sharp corners, hairline borders, no pill shapes, sentence case labels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Variants */}
            <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep p-6 space-y-4">
              <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1">
                Button Variants
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" size="base">
                  Talk to our engineers
                </Button>
                <Button variant="secondary" size="base">
                  Explore our services
                </Button>
                <Button variant="blueprint" size="base">
                  Request support
                </Button>
                <Button variant="danger-redline" size="base">
                  Reject revision
                </Button>
                <Button variant="ghost" size="base">
                  Technical index
                </Button>
              </div>

              <div className="pt-4 border-t border-[rgba(127,178,255,0.15)] flex items-center space-x-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="base">Base</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>

            {/* Links & Revision Callouts */}
            <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep p-6 space-y-6">
              <div>
                <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1 mb-3">
                  Technical TextLink (Dimension Underline Rule)
                </h3>
                <div className="space-x-6">
                  <TextLink href="#">View mechanical specifications</TextLink>
                  <TextLink href="#">Download 2D drafting BOM</TextLink>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-mono-xs text-blueprint-dimension uppercase tracking-wider border-b border-[rgba(127,178,255,0.15)] pb-1 mb-3">
                  Redline Revision Markers (Validation Only)
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <RedlineCallout revision="01" note="FLANGE THICKNESS ADJUSTED" />
                  <RedlineCallout revision="02" note="GD&T DATUM B ADDED" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DRAWING SHEET FRAME & ZONE MARKERS */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            05. Drawing Sheet Frame with Zone Markers & Title Block
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            ASME Y14.5 drafting frame with corner crosshairs, zone columns 1-8, zone rows A-D, and living Title Block.
          </p>

          <DrawingSheet
            drawingTitle="PRECISION BEARING FLANGE - GENERAL SPEC"
            drawingNumber="MV-2026-FLG-01"
            sheetNumber="01"
            totalSheets="04"
            scale="1:1"
            revision="01"
          >
            <div className="p-4 sm:p-8 flex flex-col justify-center items-center text-center space-y-3">
              <span className="font-mono text-mono-xs text-blueprint-dimension/70">
                ZONE B-4 • DRAWING WORKING ENVELOPE
              </span>
              <p className="font-display text-display-lg text-blueprint-linen">
                Full Technical Drawing Working Sheet Primitive
              </p>
              <div className="w-full max-w-md pt-2">
                <DimensionLine value="240.00" tolerance="0.05" />
              </div>
            </div>
          </DrawingSheet>
        </section>

        {/* 6. SPACING SCALE & DRAFTING GRID */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            06. Spacing Scale & Drafting Grid
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            CAD drafting module based on 4px increments.
          </p>

          <div className="border border-[rgba(127,178,255,0.2)] bg-blueprint-deep p-6">
            <div className="space-y-3">
              {spacingScale.map((s) => (
                <div key={s.name} className="flex items-center space-x-4">
                  <span className="font-mono text-mono-xs text-blueprint-dimension w-20">
                    {s.name} ({s.px})
                  </span>
                  <div
                    className="h-3 bg-blueprint-signal/60 border border-blueprint-signal"
                    style={{ width: s.px }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. MOTION SYSTEM */}
        <section className="mb-16">
          <h2 className="font-display text-display-xl text-blueprint-linen mb-2">
            07. Motion System Tokens
          </h2>
          <p className="font-sans text-body-sm text-blueprint-dimension/80 mb-6">
            Calm, eased deceleration. No bounce, no overshoot.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[rgba(127,178,255,0.2)] p-4 bg-blueprint-deep">
              <span className="font-mono text-mono-xs text-blueprint-dimension block uppercase">
                FAST • 150ms
              </span>
              <div className="font-display text-display-base text-blueprint-linen mt-1">
                Micro-interactions, button hover, focus rings.
              </div>
            </div>

            <div className="border border-[rgba(127,178,255,0.2)] p-4 bg-blueprint-deep">
              <span className="font-mono text-mono-xs text-blueprint-dimension block uppercase">
                NORMAL • 300ms
              </span>
              <div className="font-display text-display-base text-blueprint-linen mt-1">
                Drawer open, tab switch, filter changes.
              </div>
            </div>

            <div className="border border-[rgba(127,178,255,0.2)] p-4 bg-blueprint-deep">
              <span className="font-mono text-mono-xs text-blueprint-dimension block uppercase">
                DELIBERATE • 500ms
              </span>
              <div className="font-display text-display-base text-blueprint-linen mt-1">
                Section cut wipe, route transitions.
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
