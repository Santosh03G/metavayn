interface DimensionLineProps {
  value: string;
  tolerance?: string;
  orientation?: "horizontal" | "vertical";
  length?: number | string;
  bgClassName?: string;
  className?: string;
}

export function DimensionLine({
  value,
  tolerance,
  orientation = "horizontal",
  length = "100%",
  bgClassName = "bg-blueprint-deep",
  className = "",
}: DimensionLineProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`font-mono text-[10px] text-blueprint-dimension select-none flex items-center justify-center ${className}`}
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
          <div className={`px-1.5 whitespace-nowrap flex items-center space-x-1 ${bgClassName}`}>
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
          <div className={`py-1.5 whitespace-nowrap writing-vertical-lr text-center ${bgClassName}`}>
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
