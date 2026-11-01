/**
 * Industries We Serve Data Model
 *
 * Single source of truth for the 5 core engineering industry sectors.
 * Descriptions are preserved verbatim from content/site-content.md.
 */

export type IndustryVisualId =
  | "industrial"
  | "hvac"
  | "manufacturing"
  | "oem"
  | "tech";

export interface IndustryItem {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  visualId: IndustryVisualId;
  capabilities: string[];
}

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: "industrial-equipment",
    number: "01",
    title: "Industrial Equipment",
    shortTitle: "Industrial",
    description:
      "Engineering support for machinery, equipment, assemblies, and industrial products.",
    visualId: "industrial",
    capabilities: [
      "Machinery and heavy equipment design",
      "Structural weldment analysis & detailing",
      "Mechanism and drive train assemblies",
      "Manufacturing drafting and assembly instructions",
    ],
  },
  {
    id: "hvac-thermal",
    number: "02",
    title: "HVAC & Thermal Systems",
    shortTitle: "HVAC & Thermal",
    description:
      "Engineering design and documentation support for HVAC and thermal equipment manufacturers.",
    visualId: "hvac",
    capabilities: [
      "Air handling unit (AHU) modular design",
      "Coil header and refrigerant pipework routing",
      "Centrifugal and axial blower packaging",
      "Sheet metal enclosure fabrication drawings",
    ],
  },
  {
    id: "manufacturing",
    number: "03",
    title: "Manufacturing",
    shortTitle: "Manufacturing",
    description:
      "Production-ready engineering, drawings, BOMs, and manufacturing documentation.",
    visualId: "manufacturing",
    capabilities: [
      "Production-ready 2D manufacturing drawings",
      "Detailed Bill of Materials (BOM) management",
      "Sheet metal flat pattern unfold calculation",
      "Inspection schedules and fabrication tolerances",
    ],
  },
  {
    id: "oem-product-development",
    number: "04",
    title: "OEM Product Development",
    shortTitle: "OEM Products",
    description:
      "Dedicated engineering resources for OEMs developing and improving products.",
    visualId: "oem",
    capabilities: [
      "3D CAD parametric modeling and assemblies",
      "Concept development to production handover",
      "Component redesign for cost & weight reduction",
      "Rapid design turnarounds for product variants",
    ],
  },
  {
    id: "engineering-technology",
    number: "05",
    title: "Engineering & Technology",
    shortTitle: "Engineering & Tech",
    description:
      "Flexible engineering support for companies that require additional design and development capacity.",
    visualId: "tech",
    capabilities: [
      "Seamless external engineering capacity extension",
      "CAD software migration and legacy data conversion",
      "Product engineering workflows and change orders",
      "Dedicated client-embedded engineering pods",
    ],
  },
];
