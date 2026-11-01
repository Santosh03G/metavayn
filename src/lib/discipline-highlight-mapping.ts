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
      skid: true,
      casing: true,
      filter: true,
      coil: true,
      fan: true,
      doors: true,
    },
    explanation: "Complete system integration: highlights all modular subassemblies in copper.",
  },
  mechanical: {
    id: "mechanical",
    number: "02",
    title: "Mechanical Design Engineering",
    description:
      "Our mechanical engineering capabilities support OEMs and manufacturers with accurate, production-ready designs.",
    has3DModel: true,
    highlightedParts: {
      skid: true,
      casing: true,
      filter: false,
      coil: false,
      fan: false,
      doors: true,
    },
    explanation: "Sheet metal and structural frame: highlights ISMC channel base skid and casing enclosure.",
  },
  hvac: {
    id: "hvac",
    number: "03",
    title: "HVAC & Thermal Engineering",
    description:
      "We support HVAC and thermal-system companies with engineering design and documentation services.",
    has3DModel: true,
    highlightedParts: {
      skid: false,
      casing: false,
      filter: false,
      coil: true,
      fan: true,
      doors: false,
    },
    explanation: "Thermal & air-movement core: highlights finned cooling coil bundle with copper headers and centrifugal fan impeller.",
  },
  documentation: {
    id: "documentation",
    number: "04",
    title: "Engineering Documentation",
    description:
      "Accurate documentation is critical for successful product development and manufacturing.",
    has3DModel: false,
    highlightedParts: {
      skid: false,
      casing: false,
      filter: false,
      coil: false,
      fan: false,
      doors: false,
    },
    explanation: "No 3D mechanical hardware: displays a 2D technical drawing sheet and BOM table illustration instead.",
  },
  support: {
    id: "support",
    number: "05",
    title: "Engineering Support",
    description:
      "Extend your engineering capacity without increasing your internal overhead.",
    has3DModel: true,
    highlightedParts: {
      skid: false,
      casing: false,
      filter: false,
      coil: false,
      fan: false,
      doors: true,
    },
    explanation: "Maintenance and revision access: highlights casing service access doors and inspection ports.",
  },
};
