import { useQuery } from "@tanstack/react-query";

import { DataTable } from "../components/data-table";
import { MetricCard } from "../components/metric-card";
import { SectionHeader } from "../components/section-header";
import { Card } from "../components/ui/card";
import { getPortfolio } from "../lib/api";
import { formatDate, formatNumber } from "../lib/utils";

export function PortfolioPage(): JSX.Element {
  const query = useQuery({
    queryKey: ["portfolio"],
    queryFn: getPortfolio,
  });

  const portfolio = query.data;
  if (!portfolio) {
    return <div className="text-sm text-muted">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Portfolio"
        title="Simulated creator positions"
        description="Track capital allocation across creator categories and revisit conviction over time."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total invested" value={`$${formatNumber(portfolio.total_invested)}`} />
        <MetricCard label="Creators backed" value={String(portfolio.creators_backed)} />
        <MetricCard label="Allocations" value={String(portfolio.allocations.length)} />
        <MetricCard label="Positions" value={String(portfolio.positions.length)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Category allocation</h2>
          <div className="space-y-3">
            {portfolio.allocations.map((allocation) => (
              <div key={allocation.label} className="flex items-center justify-between text-sm">
                <span className="capitalize text-muted">{allocation.label}</span>
                <span className="tabular-nums text-white">${formatNumber(allocation.value)}</span>
              </div>
            ))}
          </div>
        </Card>
        <DataTable
          rows={portfolio.positions}
          columns={[
            { header: "Creator", render: (row) => row.creator_name },
            { header: "Category", render: (row) => row.category },
            { header: "Amount", render: (row) => `$${formatNumber(row.amount)}` },
            { header: "Date", render: (row) => formatDate(row.created_at) },
          ]}
        />
      </div>
    </div>
  );
}
