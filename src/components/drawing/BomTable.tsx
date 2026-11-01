export interface BomItem {
  item: number;
  qty: number;
  partNo: string;
  description: string;
  material: string;
  spec: string;
}

export const AHU_BOM_DATA: BomItem[] = [
  { item: 1, qty: 1, partNo: "MV-AHU-CS-01", description: "Main Casing Assembly", material: "GI Sheet 1.6mm", spec: "ASTM A653" },
  { item: 2, qty: 1, partNo: "MV-AHU-CL-02", description: "Chilled Water Coil Assembly", material: "Cu Tubes / Al Fins", spec: "AHRI 410" },
  { item: 3, qty: 2, partNo: "MV-AHU-FN-03", description: "Centrifugal Blower Fan", material: "Welded Steel Impeller", spec: "AMCA 210" },
  { item: 4, qty: 1, partNo: "MV-AHU-SK-04", description: "Structural Skid Base Frame", material: "ISMC 100 Channel", spec: "IS 2062" },
  { item: 5, qty: 1, partNo: "MV-AHU-DM-05", description: "Opposed Blade Damper", material: "Extruded Aluminum", spec: "AMCA 500-D" },
];

interface BomTableProps {
  className?: string;
}

export function BomTable({ className = "" }: BomTableProps) {
  return (
    <div className={`border border-[rgba(127,178,255,0.3)] bg-blueprint-deep p-4 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-[rgba(127,178,255,0.2)] pb-2 mb-3">
        <span className="text-mono-xs text-blueprint-dimension uppercase tracking-wider font-semibold">
          TABLE 1: BILL OF MATERIALS (BOM) — M1 AIR HANDLING UNIT
        </span>
        <span className="text-[10px] text-blueprint-dimension/60">
          DOC: MV-BOM-AHU-01 • REV 01
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-[rgba(127,178,255,0.25)] text-blueprint-dimension/80">
              <th className="py-1.5 px-2 font-semibold w-10">ITEM</th>
              <th className="py-1.5 px-2 font-semibold w-10">QTY</th>
              <th className="py-1.5 px-2 font-semibold">PART NO.</th>
              <th className="py-1.5 px-2 font-semibold">DESCRIPTION</th>
              <th className="py-1.5 px-2 font-semibold">MATERIAL</th>
              <th className="py-1.5 px-2 font-semibold">SPECIFICATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(127,178,255,0.1)]">
            {AHU_BOM_DATA.map((row) => (
              <tr key={row.item} className="hover:bg-blueprint-cyanotype/30 transition-colors">
                <td className="py-2 px-2 text-blueprint-dimension">{row.item}</td>
                <td className="py-2 px-2 text-blueprint-linen">{row.qty}</td>
                <td className="py-2 px-2 text-blueprint-dimension font-semibold">{row.partNo}</td>
                <td className="py-2 px-2 text-blueprint-linen">{row.description}</td>
                <td className="py-2 px-2 text-blueprint-linen/80">{row.material}</td>
                <td className="py-2 px-2 text-blueprint-dimension/70">{row.spec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-2 border-t border-[rgba(127,178,255,0.15)] flex justify-between text-[10px] text-blueprint-dimension/60">
        <span>ALL DIMENSIONS IN MILLIMETERS</span>
        <span>VERIFIED: METAVAYN DOCUMENTATION TEAM</span>
      </div>
    </div>
  );
}
