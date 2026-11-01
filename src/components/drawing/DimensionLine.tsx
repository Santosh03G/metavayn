import { type SurfaceType } from "@/components/ui/Button";

interface DimensionLineProps {
  value: string;
  tolerance?: string;
  surface?: SurfaceType;
  orientation?: "horizontal" | "vertical";
  length?: number | string;
  bgClassName?: string;
  className?: string;
}

export function DimensionLine({
  value,
  tolerance,
  surface = "royal",
  orientation = "horizontal",
  length = "100%",
  bgClassName,
  className = "",
}: DimensionLineProps) {
  const isHorizontal = orientation === "horizontal";

  // Dimension lines and annotations: --paper on royal, --black on paper, --pale-blue on black
  const surfaceConfig: Record<SurfaceType, { text: string; bg: string }> = {
    royal: {
      text: "text-paper",
      bg: "bg-royal",
    },
    paper: {
      text: "text-black",
      bg: "bg-paper",
    },
    black: {
      text: "text-pale-blue",
      bg: "bg-black",
    },
  };

  const config = surfaceConfig[surface];
  const effectiveBg = bgClassName || config.bg;

  return (
    <div
      className={`font-mono text-[10px] select-none flex items-center justify-center ${config.text} ${className}`}
      style={{
        width: isHorizontal ? length : "auto",
        height: !isHorizontal ? length : "auto",
      }}
      aria-label={`Dimension callout: ${value} ${tolerance || ""}`}
    >
      {isHorizontal ? (
        <div className="w-full flex items-center">
          {/* Left extension line */}
          <div className="h-3 w-[1px] bg-current opacity-40 -mr-[1px]" />
          {/* Left Arrow */}
          <div className="w-0 h-0 border-y-[3px] border-y-transparent border-r-[6px] border-r-current opacity-80" />
          {/* Line before text */}
          <div className="flex-1 h-[1px] bg-current opacity-40" />
          {/* Dimension Value */}
          <div className={`px-1.5 whitespace-nowrap flex items-center space-x-1 ${effectiveBg}`}>
            <span>{value}</span>
            {tolerance && (
              <span className="text-[8px] opacity-70">
                ±{tolerance}
              </span>
            )}
          </div>
          {/* Line after text */}
          <div className="flex-1 h-[1px] bg-current opacity-40" />
          {/* Right Arrow */}
          <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-current opacity-80" />
          {/* Right extension line */}
          <div className="h-3 w-[1px] bg-current opacity-40 -ml-[1px]" />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center">
          {/* Top extension line */}
          <div className="w-3 h-[1px] bg-current opacity-40 -mb-[1px]" />
          {/* Top Arrow */}
          <div className="w-0 h-0 border-x-[3px] border-x-transparent border-b-[6px] border-b-current opacity-80" />
          {/* Line before text */}
          <div className="flex-1 w-[1px] bg-current opacity-40" />
          {/* Dimension Value (vertical) */}
          <div className={`py-1.5 whitespace-nowrap writing-vertical-lr text-center ${effectiveBg}`}>
            <span>{value}</span>
            {tolerance && (
              <span className="text-[8px] opacity-70 block">
                ±{tolerance}
              </span>
            )}
          </div>
          {/* Line after text */}
          <div className="flex-1 w-[1px] bg-current opacity-40" />
          {/* Bottom Arrow */}
          <div className="w-0 h-0 border-x-[3px] border-x-transparent border-t-[6px] border-t-current opacity-80" />
          {/* Bottom extension line */}
          <div className="w-3 h-[1px] bg-current opacity-40 -mt-[1px]" />
        </div>
      )}
    </div>
  );
}
