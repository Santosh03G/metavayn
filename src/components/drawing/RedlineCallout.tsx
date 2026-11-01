import { type SurfaceType } from "@/components/ui/Button";

interface RedlineCalloutProps {
  revision?: string;
  note?: string;
  surface?: SurfaceType;
  className?: string;
}

export function RedlineCallout({
  revision = "01",
  note,
  surface = "royal",
  className = "",
}: RedlineCalloutProps) {
  // Strict contrast & pairing enforcement:
  // --redline is for graphics only.
  // For text on paper: use --redline-text (#B3261E) -> 5.6:1 contrast.
  // For text on royal: use --paper (#F1EEE6) -> 5.9:1 contrast.
  // For text on black: use --pale-blue (#9DB2FF) -> 9.9:1 contrast.
  const textColors: Record<SurfaceType, string> = {
    paper: "text-redline-text",
    royal: "text-paper",
    black: "text-pale-blue",
  };

  const textColor = textColors[surface];

  return (
    <div
      className={`inline-flex items-center space-x-1.5 font-mono text-xs select-none ${className}`}
      aria-label={`Revision callout: Rev ${revision} ${note || ""}`}
    >
      {/* Delta Triangle Graphic Symbol (Standard CAD Revision) */}
      <div className={`relative w-4 h-4 flex items-center justify-center border border-redline bg-redline/15 ${textColor} text-[9px] font-bold`}>
        <span>{revision}</span>
      </div>
      {note && (
        <span className={`${textColor} text-[11px] font-mono tracking-tight`}>
          [{note}]
        </span>
      )}
    </div>
  );
}
