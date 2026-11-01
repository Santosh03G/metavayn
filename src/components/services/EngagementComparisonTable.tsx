interface EngagementModel {
  name: string;
  scope: string;
  description: string;
  bestFor: string[];
}

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    name: "Project-Based Engineering",
    scope: "Specific Product / Project Scope",
    description:
      "Ideal for companies that need engineering support for a specific product or project.",
    bestFor: [
      "New product development",
      "Engineering modifications",
      "CAD projects",
      "Documentation projects",
      "Short-term engineering requirements",
    ],
  },
  {
    name: "Dedicated Engineering Teams",
    scope: "Continuous Team Capacity Extension",
    description:
      "Build a dedicated engineering team aligned with your processes and product requirements.",
    bestFor: [
      "Long-term projects",
      "Continuous product development",
      "OEM engineering support",
      "Large engineering workloads",
      "Recurring design requirements",
    ],
  },
  {
    name: "Ongoing Engineering Support",
    scope: "Continuous Technical & Lifecycle Support",
    description:
      "Keep your engineering pipeline moving with continuous technical support.",
    bestFor: [
      "Engineering change requests",
      "Product updates",
      "Drawing revisions",
      "BOM maintenance",
      "Manufacturing support",
    ],
  },
];

export function EngagementComparisonTable() {
  return (
    <div className="border border-blueprint-graphite/20 bg-blueprint-linen overflow-x-auto select-none">
      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-blueprint-graphite/20 bg-blueprint-graphite/5 font-display text-blueprint-graphite">
            <th className="py-4 px-4 sm:px-6 w-1/4 font-semibold uppercase font-mono text-[11px] tracking-wider text-blueprint-graphite/70">
              ENGAGEMENT PARAMETER
            </th>
            {ENGAGEMENT_MODELS.map((m) => (
              <th
                key={m.name}
                className="py-4 px-4 sm:px-6 w-1/4 font-semibold text-body-base text-blueprint-graphite border-l border-blueprint-graphite/15"
              >
                <div>{m.name}</div>
                <div className="font-mono text-[10px] text-blueprint-signal font-normal mt-0.5">
                  [{m.scope.toUpperCase()}]
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-blueprint-graphite/15 text-blueprint-graphite/90">
          {/* Row 1: What It Is */}
          <tr className="hover:bg-blueprint-graphite/[0.02] transition-colors">
            <td className="py-4 px-4 sm:px-6 font-mono text-[11px] font-semibold text-blueprint-graphite/80 uppercase">
              What It Is
            </td>
            {ENGAGEMENT_MODELS.map((m) => (
              <td
                key={`desc-${m.name}`}
                className="py-4 px-4 sm:px-6 border-l border-blueprint-graphite/15 align-top leading-relaxed text-xs sm:text-sm"
              >
                {m.description}
              </td>
            ))}
          </tr>

          {/* Row 2: Best For */}
          <tr className="hover:bg-blueprint-graphite/[0.02] transition-colors">
            <td className="py-4 px-4 sm:px-6 font-mono text-[11px] font-semibold text-blueprint-graphite/80 uppercase align-top">
              Best For
            </td>
            {ENGAGEMENT_MODELS.map((m) => (
              <td
                key={`best-${m.name}`}
                className="py-4 px-4 sm:px-6 border-l border-blueprint-graphite/15 align-top"
              >
                <ul className="space-y-1.5 text-xs text-blueprint-graphite/85">
                  {m.bestFor.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-blueprint-signal font-mono">▪</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>

          {/* Row 3: Engagement Structure */}
          <tr className="hover:bg-blueprint-graphite/[0.02] transition-colors bg-blueprint-graphite/[0.03]">
            <td className="py-4 px-4 sm:px-6 font-mono text-[11px] font-semibold text-blueprint-graphite/80 uppercase">
              Engagement Structure
            </td>
            <td className="py-4 px-4 sm:px-6 border-l border-blueprint-graphite/15 font-mono text-[11px]">
              Milestone / Fixed Deliverable SOW
            </td>
            <td className="py-4 px-4 sm:px-6 border-l border-blueprint-graphite/15 font-mono text-[11px]">
              Full-Time Dedicated Offshore Pod
            </td>
            <td className="py-4 px-4 sm:px-6 border-l border-blueprint-graphite/15 font-mono text-[11px]">
              Monthly Retainer / Hourly Engineering
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
