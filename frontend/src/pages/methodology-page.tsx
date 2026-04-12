import { useQuery } from "@tanstack/react-query";

import { SectionHeader } from "../components/section-header";
import { Card } from "../components/ui/card";
import { getMethodology } from "../lib/api";

export function MethodologyPage(): JSX.Element {
  const query = useQuery({
    queryKey: ["methodology"],
    queryFn: getMethodology,
  });
  const methodology = query.data;

  if (!methodology) {
    return <div className="text-sm text-muted">Loading methodology...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Methodology"
        title="Transparent measurement, not black-box scoring"
        description={methodology.philosophy}
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {methodology.sections.map((section) => (
          <Card key={section.title} className="space-y-4">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            <ul className="space-y-2 text-sm text-slate-200">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Metric definitions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {methodology.metrics.map((metric) => (
            <div key={metric.name} className="rounded-xl border border-border bg-black/10 p-4">
              <p className="text-sm font-semibold text-white">{metric.name}</p>
              <p className="mt-2 text-sm text-slate-200">{metric.definition}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                {metric.formula}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
