"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Container } from "@/components/ui/Container";
import { TitleBlock } from "@/components/drawing/TitleBlock";
import { Scene } from "@/components/canvas/Scene";
import { CADModelView, type CADRenderMode } from "@/components/canvas/CADModelView";

export default function StyleguidePage() {
  const [cadMode, setCadMode] = useState<CADRenderMode>("drawing");
  const [activeSurface, setActiveSurface] = useState<"royal" | "paper" | "black">("royal");

  const d2Tokens = [
    { name: "Black", hex: "#050505", variable: "--black", desc: "Contrast sections, footer, headings on paper" },
    { name: "Royal", hex: "#2347E0", variable: "--royal", desc: "Hero and key section fields, primary fills on paper" },
    { name: "Royal Hover", hex: "#1B3AC4", variable: "--royal-hover", desc: "Hover/pressed for royal fills" },
    { name: "Paper", hex: "#F1EEE6", variable: "--paper", desc: "Light sections, text on royal and black" },
    { name: "Paper Line", hex: "rgba(5,5,5,0.14)", variable: "--paper-line", desc: "Hairlines and dividers on paper" },
    { name: "Copper", hex: "#F0A06A", variable: "--copper", desc: "Accent: pipework, one highlight per screen" },
    { name: "Pale Blue", hex: "#9DB2FF", variable: "--pale-blue", desc: "Thin lines, links and small graphics on black" },
    { name: "Redline", hex: "#E5484D", variable: "--redline", desc: "Graphics only (revision clouds)" },
    { name: "Redline Text", hex: "#B3261E", variable: "--redline-text", desc: "Red text on paper only (5.6:1 contrast)" },
  ];

  const allowedPairings = [
    { foreground: "--paper", bg: "--royal", ratio: "5.9:1", usage: "Body and headings on royal" },
    { foreground: "--black", bg: "--paper", ratio: "17.6:1", usage: "Body, headings and secondary buttons on paper" },
    { foreground: "--paper", bg: "--black", ratio: "17.6:1", usage: "Body and headings on black" },
    { foreground: "--pale-blue", bg: "--black", ratio: "9.9:1", usage: "Links, small labels, thin lines on black" },
    { foreground: "--royal", bg: "--paper", ratio: "5.9:1", usage: "Links, buttons, large text on paper" },
    { foreground: "--black", bg: "--copper", ratio: "9.6:1", usage: "Text on copper accent fills" },
    { foreground: "--redline-text", bg: "--paper", ratio: "5.6:1", usage: "Error messages and revision notes on paper" },
  ];

  return (
    <div className="min-h-screen bg-black text-paper py-12 select-none">
      <Container size="wide">
        {/* Styleguide Header */}
        <div className="border-b border-pale-blue/20 pb-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-mono-xs text-pale-blue uppercase tracking-widest mb-1 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-royal" />
              <span>THEME D2 DESIGN SYSTEM BENCHMARK</span>
            </div>
            <h1 className="font-display text-display-2xl sm:text-display-3xl text-paper">
              Metavayn D2 Foundation Styleguide
            </h1>
          </div>
          <div className="font-mono text-mono-xs text-pale-blue border border-pale-blue/30 px-3 py-1.5 bg-black">
            SPEC: D2 PALETTE • 0 GRADIENTS
          </div>
        </div>

        <div className="space-y-16">
          {/* 1. D2 Palette Tokens (Clean Graphic Swatches without embedded text) */}
          <section className="space-y-6">
            <h2 className="font-mono text-mono-xs uppercase text-pale-blue tracking-wider border-b border-pale-blue/20 pb-2">
              01 / DESIGN TOKENS (D2 PALETTE)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {d2Tokens.map((c) => (
                <div key={c.variable} className="border border-pale-blue/20 bg-black p-4 space-y-3">
                  <div
                    className="h-12 w-full border border-pale-blue/30"
                    style={{
                      backgroundColor: c.hex.startsWith("rgba") ? "#050505" : c.hex,
                      borderColor: c.hex.startsWith("rgba") ? "rgba(241,238,230,0.3)" : undefined,
                    }}
                  />
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-semibold text-body-base text-paper">{c.name}</span>
                      <span className="font-mono text-mono-xs text-pale-blue">{c.hex}</span>
                    </div>
                    <div className="font-mono text-mono-xs text-pale-blue/80 mt-0.5">{c.variable}</div>
                    <div className="font-sans text-body-sm text-paper/70 mt-1">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Strict Contrast & Allowed Pairings */}
          <section className="space-y-6">
            <h2 className="font-mono text-mono-xs uppercase text-pale-blue tracking-wider border-b border-pale-blue/20 pb-2">
              02 / COLOR PAIRINGS & WCAG CONTRAST MATRIX
            </h2>
            <div className="border border-pale-blue/20 bg-black overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-pale-blue/20 text-pale-blue">
                    <th className="py-2.5 px-4 font-semibold">PAIRING</th>
                    <th className="py-2.5 px-4 font-semibold">CONTRAST</th>
                    <th className="py-2.5 px-4 font-semibold">WCAG LEVEL</th>
                    <th className="py-2.5 px-4 font-semibold">ROLE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pale-blue/15 text-paper/90">
                  {allowedPairings.map((p) => (
                    <tr key={p.usage} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-4 font-semibold text-pale-blue">
                        {p.foreground} on {p.bg}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-paper">{p.ratio}</td>
                      <td className="py-2.5 px-4 text-emerald-400">PASS (AAA / AA)</td>
                      <td className="py-2.5 px-4 text-paper/70 font-sans">{p.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Surface System Demonstration */}
          <section className="space-y-6">
            <h2 className="font-mono text-mono-xs uppercase text-pale-blue tracking-wider border-b border-pale-blue/20 pb-2">
              03 / SECTION SURFACE SYSTEM (ROYAL • PAPER • BLACK)
            </h2>
            <div className="flex gap-2 mb-4">
              {(["royal", "paper", "black"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveSurface(s)}
                  className={`px-3 py-1.5 border font-mono text-xs uppercase font-semibold ${
                    activeSurface === s
                      ? "bg-paper text-black border-paper"
                      : "bg-transparent text-pale-blue border-pale-blue/30"
                  }`}
                >
                  Surface: {s}
                </button>
              ))}
            </div>

            <div
              className={`p-6 sm:p-8 border transition-colors ${
                activeSurface === "royal"
                  ? "bg-royal text-paper border-paper/30"
                  : activeSurface === "paper"
                  ? "bg-paper text-black border-paper-line"
                  : "bg-black text-paper border-pale-blue/30"
              }`}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-display-xl font-bold">
                    Surface Preview: {activeSurface.toUpperCase()}
                  </h3>
                  <p className="font-sans text-body-base mt-2 max-w-prose opacity-90">
                    This interactive specimen proves button contrast, focus rings, and link rules under the {activeSurface} surface token.
                  </p>
                </div>

                {/* Buttons on current surface */}
                <div className="flex flex-wrap gap-4 items-center pt-2">
                  <Button surface={activeSurface} variant="primary">
                    Primary Button
                  </Button>
                  <Button surface={activeSurface} variant="secondary">
                    Secondary Button
                  </Button>
                  <Button surface={activeSurface} variant="copper">
                    Copper Accent (1 Per Screen)
                  </Button>
                </div>

                {/* TextLink on current surface */}
                <div className="pt-2">
                  <TextLink surface={activeSurface} href="#">
                    CAD Dimension Underlined TextLink
                  </TextLink>
                </div>

                {/* TitleBlock on current surface */}
                <div className="pt-4">
                  <TitleBlock
                    surface={activeSurface}
                    drawingTitle="FOUNDATION STYLEGUIDE SPECIMEN"
                    drawingNumber="MV-2026-STY"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Form Pattern on Paper (Step 5 Specification) */}
          <section className="space-y-6">
            <h2 className="font-mono text-mono-xs uppercase text-pale-blue tracking-wider border-b border-pale-blue/20 pb-2">
              04 / FORM PATTERN (STEP 5 SPECIFICATION: PAPER SURFACE ONLY)
            </h2>
            <div className="border border-paper-line bg-paper p-6 sm:p-8 text-black space-y-6 max-w-2xl">
              <div>
                <span className="font-mono text-mono-xs text-black/60 uppercase tracking-widest block">
                  FORM SYSTEM SPECIFICATION
                </span>
                <h3 className="font-display text-display-lg text-black font-semibold mt-1">
                  Contact Intake Form Pattern
                </h3>
              </div>

              <div className="space-y-4 font-sans text-body-sm">
                <div>
                  <label className="block font-medium text-black mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Alex Wright"
                    className="w-full px-3 py-2 bg-white/60 border border-paper-line rounded-[2px] text-black focus:outline-none focus:border-royal focus:ring-1 focus:ring-royal"
                  />
                </div>

                <div>
                  <label className="block font-medium text-black mb-1">Company Email</label>
                  <input
                    type="email"
                    defaultValue="alex@oem-corp.com"
                    className="w-full px-3 py-2 bg-white/60 border border-paper-line rounded-[2px] text-black focus:outline-none focus:border-royal focus:ring-1 focus:ring-royal"
                  />
                </div>

                {/* Field with Error state complying with Step 5 */}
                <div>
                  <label className="block font-medium text-black mb-1">Engineering Domain</label>
                  <input
                    type="text"
                    defaultValue=""
                    placeholder="Required domain selection"
                    className="w-full px-3 py-2 bg-white/60 border border-redline-text rounded-[2px] text-black focus:outline-none focus:border-redline-text"
                  />
                  <div className="mt-1 flex items-center space-x-1 font-mono text-[11px] text-redline-text">
                    <span>⚠</span>
                    <span>ERROR: Please specify your engineering discipline</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button surface="paper" variant="primary">
                    Submit Project Inquiry
                  </Button>
                  <span className="font-mono text-[11px] text-royal font-semibold">
                    ✓ SECURE SUBMISSION (24H RESPONSE)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 3D WebGL Flat Material Specimen */}
          <section className="space-y-6">
            <h2 className="font-mono text-mono-xs uppercase text-pale-blue tracking-wider border-b border-pale-blue/20 pb-2">
              05 / 3D CAD MODEL SPECIMEN (FLAT-COLOUR sRGB OUTPUT)
            </h2>
            <div className="flex gap-2">
              {(["drawing", "shaded", "wireframe"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCadMode(m)}
                  className={`px-3 py-1 border font-mono text-xs uppercase font-semibold ${
                    cadMode === m
                      ? "bg-pale-blue text-black border-pale-blue"
                      : "bg-transparent text-pale-blue border-pale-blue/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="border border-pale-blue/30 bg-black p-4 sm:p-6">
              <Scene surface="black" aspectRatio="aspect-[16/9]" cameraPosition={[2.8, 2.2, 3.6]}>
                <CADModelView surface="black" mode={cadMode} autoRotate={true} />
              </Scene>
              <div className="mt-3 flex justify-between font-mono text-[10px] text-pale-blue/70">
                <span>OUTPUT: sRGB • TONE MAPPING: NONE (EXACT HEX RENDERING)</span>
                <span>DRAG TO ORBIT</span>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
