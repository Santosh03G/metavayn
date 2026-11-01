interface RedlineCalloutProps {
  revision?: string;
  note?: string;
  className?: string;
}

export function RedlineCallout({
  revision = "01",
  note,
  className = "",
}: RedlineCalloutProps) {
  return (
    <div
      className={`inline-flex items-center space-x-1.5 font-mono text-xs select-none ${className}`}
      aria-label={`Revision callout: Rev ${revision} ${note || ""}`}
    >
      {/* Delta Triangle Symbol (Standard CAD Revision) */}
      <div className="relative w-4 h-4 flex items-center justify-center border border-blueprint-redline text-blueprint-redline text-[9px] font-bold bg-blueprint-redline/10">
        <span>{revision}</span>
      </div>
      {note && (
        <span className="text-blueprint-redline/90 text-[11px] font-mono tracking-tight">
          [{note}]
        </span>
      )}
    </div>
  );
}
