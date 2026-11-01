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
    <div className="border border-paper-line bg-paper text-black overflow-x-auto select-none">
      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
        <thead>
          <tr className="border-b-2 border-paper-line bg-black/[0.03] font-display text-black">
            <th className="py-4 px-4 sm:px-6 w-1/4 font-semibold uppercase font-sans text-xs tracking-wider text-black/70">
              Engagement Parameter
            </th>
            {ENGAGEMENT_MODELS.map((m) => (
              <th
                key={m.name}
                className="py-4 px-4 sm:px-6 w-1/4 font-bold text-sm sm:text-base border-l border-paper-line text-black"
              >
                {m.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-paper-line">
          {/* Row 1: What it is */}
          <tr className="hover:bg-black/[0.02] transition-colors">
            <td className="py-4 px-4 sm:px-6 font-semibold font-sans text-xs uppercase tracking-wider text-black/70 align-top">
              What it is
            </td>
            {ENGAGEMENT_MODELS.map((m) => (
              <td
                key={`desc-${m.name}`}
                className="py-4 px-4 sm:px-6 border-l border-paper-line text-black/90 leading-relaxed align-top"
              >
                <div className="font-medium text-royal mb-1">{m.scope}</div>
                <div>{m.description}</div>
              </td>
            ))}
          </tr>

          {/* Row 2: Best for */}
          <tr className="hover:bg-black/[0.02] transition-colors">
            <td className="py-4 px-4 sm:px-6 font-semibold font-sans text-xs uppercase tracking-wider text-black/70 align-top">
              Best for
            </td>
            {ENGAGEMENT_MODELS.map((m) => (
              <td
                key={`best-${m.name}`}
                className="py-4 px-4 sm:px-6 border-l border-paper-line align-top"
              >
                <ul className="space-y-1.5 text-xs text-black/85">
                  {m.bestFor.map((item) => (
                    <li key={item} className="flex items-start space-x-2">
                      <span className="text-royal font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}