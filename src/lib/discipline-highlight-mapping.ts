/**
 * Discipline Highlight Mapping for M1 Air Handling Unit 3D Scene
 *
 * Defines the precise mapping between the five core engineering disciplines
 * and the physical AHU subassembly parts that are highlighted in copper (#F0A06A).
 *
 * Strict Rule: Only the active item's parts receive copper tinting;
 * all non-active parts remain paper (#F1EEE6) with black edges (#050505).
 * Disciplines with no physical hardware (Engineering Documentation)
 * render a 2D drawing sheet instead of a 3D model.
 */

export interface DisciplineMapping {
  id: string;
  number: string;
  title: string;
  description: string;
  has3DModel: boolean;
  highlightedParts: {
    allEdgesCopper?: boolean; // For Product Engineering: whole unit edges copper, fills stay paper
    skid: boolean;
    casing: boolean;
    filter: boolean;
    coil: boolean;
    fan: boolean;
    doors: boolean;
  };
  explanation: string;
}

export const DISCIPLINE_HIGHLIGHT_MAPPINGS: Record<string, DisciplineMapping> = {
  product: {
    id: "product",
    number: "01",
    title: "Product Engineering",
    description:
      "From concept development to detailed engineering, we help transform product ideas into practical and manufacturable designs.",
    has3DModel: true,
    highlightedParts: {
      allEdgesCopper: true,
      skid: false,
      casing: false,
      filter: false,
      coil: false,
      fan: false,
      doors: false,
    },
    explanation:
      "Whole unit edge geometry highlighted: all subassembly edges tinted copper (#F0A06A), fills remain neutral paper (#F1EEE6).",
  },
  mechanical: {
    id: "mechanical",
    number: "02",
    title: "Mechanical Design Engineering",
    description:
      "Our mechanical engineering capabilities support OEMs and manufacturers with accurate, production-ready designs.",
    has3DModel: true,
    highlightedParts: {
      allEdgesCopper: false,
      skid: true,
      casing: true,
      filter: false,
      coil: false,
      fan: false,
      doors: true,
    },
    explanation:
      "Sheet metal and structural enclosure: casing panels and base skid tinted copper (#F0A06A).",
  },
  hvac: {
    id: "hvac",
    number: "03",
    title: "HVAC & Thermal Engineering",
    description:
      "We support HVAC and thermal-system companies with engineering design and documentation services.",
    has3DModel: true,
    highlightedParts: {
      allEdgesCopper: false,
      skid: false,
      casing: false,
      filter: false,
      coil: true,
      fan: true,
      doors: false,
    },
    explanation:
      "Thermal and air-movement core: cooling coil bundle and centrifugal fan section tinted copper (#F0A06A).",
  },
  documentation: {
    id: "documentation",
    number: "04",
    title: "Engineering Documentation",
    description:
      "Accurate documentation is critical for successful product development and manufacturing.",
    has3DModel: false,
    highlightedParts: {
      allEdgesCopper: false,
      skid: false,
      casing: false,
      filter: false,
      coil: false,
      fan: false,
      doors: false,
    },
    explanation:
      "No 3D hardware: displays a 2D technical drawing sheet and BOM table in the stage instead of the 3D model.",
  },
  support: {
    id: "support",
    number: "05",
    title: "Engineering Support",
    description:
      "Extend your engineering capacity without increasing your internal overhead.",
    has3DModel: true,
    highlightedParts: {
      allEdgesCopper: false,
      skid: false,
      casing: false,
      filter: false,
      coil: false,
      fan: false,
      doors: false,
    },
    explanation:
      "Ongoing lifecycle support: no part tint; model stays neutral paper (#F1EEE6) with black edges (#050505).",
  },
};
