import { type SurfaceType } from "@/components/ui/Button";

export interface BomItem {
  item: number;
  qty: number;
  partNo: string;
  description: string;
  material: string;
  spec: string;
}

export const AHU_BOM_DATA: BomItem[] = [
  { item: 1, qty: 1, partNo: "AHU-CS-01", description: "Main Casing Assembly", material: "GI Sheet 1.6mm", spec: "Industrial Sheet" },
  { item: 2, qty: 1, partNo: "AHU-CL-02", description: "Chilled Water Coil Assembly", material: "Cu Tubes / Al Fins", spec: "Finned Coil Spec" },
  { item: 3, qty: 2, partNo: "AHU-FN-03", description: "Centrifugal Blower Fan", material: "Welded Steel Impeller", spec: "Centrifugal Spec" },
  { item: 4, qty: 1, partNo: "AHU-SK-04", description: "Structural Skid Base Frame", material: "ISMC 100 Channel", spec: "Structural Channel" },
  { item: 5, qty: 1, partNo: "AHU-DM-05", description: "Opposed Blade Damper", material: "Extruded Aluminum", spec: "Louver Damper" },
];

interface BomTableProps {
  surface?: SurfaceType;
  className?: string;
}

export function BomTable({ surface = "black", className = "" }: BomTableProps) {
  const stylesBySurface: Record<
    SurfaceType,
    {
      container: string;
      headerBorder: string;
      headerLabel: string;
      metaText: string;
      th: string;
      divide: string;
      hover: string;
      itemCol: string;
      qtyCol: string;
      partCol: string;
      descCol: string;
      matCol: string;
      specCol: string;
      footer: string;
    }
  > = {
    royal: {
      container: "border border-paper/30 bg-royal/90 text-paper",
      headerBorder: "border-paper/20",
      headerLabel: "text-paper font-semibold",
      metaText: "text-paper/70",
      th: "border-paper/20 text-paper/80",
      divide: "divide-paper/15",
      hover: "hover:bg-paper/10",
      itemCol: "text-paper",
      qtyCol: "text-paper",
      partCol: "text-paper font-semibold",
      descCol: "text-paper",
      matCol: "text-paper",
      specCol: "text-paper/70",
      footer: "border-paper/15 text-paper/70",
    },
    black: {
      container: "border border-pale-blue/30 bg-black text-paper",
      headerBorder: "border-pale-blue/20",
      headerLabel: "text-pale-blue font-semibold",
      metaText: "text-pale-blue/70",
      th: "border-pale-blue/20 text-pale-blue/80",
      divide: "divide-pale-blue/15",
      hover: "hover:bg-pale-blue/10",
      itemCol: "text-pale-blue",
      qtyCol: "text-paper",
      partCol: "text-pale-blue font-semibold",
      descCol: "text-paper",
      matCol: "text-paper",
      specCol: "text-pale-blue/70",
      footer: "border-pale-blue/15 text-pale-blue/70",
    },
    paper: {
      container: "border border-paper-line bg-paper text-black",
      headerBorder: "border-paper-line",
      headerLabel: "text-black font-semibold",
      metaText: "text-black/60",
      th: "border-paper-line text-black/70",
      divide: "divide-paper-line",
      hover: "hover:bg-black/[0.03]",
      itemCol: "text-black",
      qtyCol: "text-black font-semibold",
      partCol: "text-royal font-semibold",
      descCol: "text-black",
      matCol: "text-black",
      specCol: "text-black/70",
      footer: "border-paper-line text-black/60",
    },
  };

  const s = stylesBySurface[surface];

  return (
    <div className={`p-4 font-mono text-xs ${s.container} ${className}`}>
      <div className={`flex items-center justify-between border-b ${s.headerBorder} pb-2 mb-3`}>
        <span className={`text-mono-xs uppercase tracking-wider ${s.headerLabel}`}>
          TABLE 1: BILL OF MATERIALS (BOM) — M1 AIR HANDLING UNIT
        </span>
        <span className={`text-[10px] ${s.metaText}`}>
          BOM SPECIFICATION • REV 01
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className={`border-b ${s.headerBorder} ${s.th}`}>
              <th className="py-1.5 px-2 font-semibold w-10">ITEM</th>
              <th className="py-1.5 px-2 font-semibold w-10">QTY</th>
              <th className="py-1.5 px-2 font-semibold">PART NO.</th>
              <th className="py-1.5 px-2 font-semibold">DESCRIPTION</th>
              <th className="py-1.5 px-2 font-semibold">MATERIAL</th>
              <th className="py-1.5 px-2 font-semibold">SPECIFICATION</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${s.divide}`}>
            {AHU_BOM_DATA.map((row) => (
              <tr key={row.item} className={`${s.hover} transition-colors`}>
                <td className={`py-2 px-2 ${s.itemCol}`}>{row.item}</td>
                <td className={`py-2 px-2 ${s.qtyCol}`}>{row.qty}</td>
                <td className={`py-2 px-2 ${s.partCol}`}>{row.partNo}</td>
                <td className={`py-2 px-2 ${s.descCol}`}>{row.description}</td>
                <td className={`py-2 px-2 ${s.matCol}`}>{row.material}</td>
                <td className={`py-2 px-2 ${s.specCol}`}>{row.spec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mt-3 pt-2 border-t ${s.footer} flex justify-between text-[10px]`}>
        <span>ALL DIMENSIONS IN MILLIMETERS</span>
        <span>METAVAYN DOCUMENTATION TEAM</span>
      </div>
    </div>
  );
}