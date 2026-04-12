import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { DataTable } from "../components/data-table";
import { GrowthChart } from "../components/growth-chart";
import { SectionHeader } from "../components/section-header";
import { Card } from "../components/ui/card";
import { getCreator, getCreators } from "../lib/api";
import { formatNumber, formatPercent } from "../lib/utils";

export function ComparePage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const leftSlug = searchParams.get("left") ?? "";
  const rightSlug = searchParams.get("right") ?? "";

  const creatorsQuery = useQuery({
    queryKey: ["creators", "compare-select"],
    queryFn: () => getCreators(new URLSearchParams({ sort: "growth_30d" })),
  });
  const leftQuery = useQuery({
    queryKey: ["compare", leftSlug],
    queryFn: () => getCreator(leftSlug),
    enabled: leftSlug.length > 0,
  });
  const rightQuery = useQuery({
    queryKey: ["compare", rightSlug],
    queryFn: () => getCreator(rightSlug),
    enabled: rightSlug.length > 0,
  });

  const rows = useMemo(() => {
    if (!leftQuery.data || !rightQuery.data) {
      return [];
    }
    return [
      {
        label: "Total audience",
        left: formatNumber(leftQuery.data.total_audience),
        right: formatNumber(rightQuery.data.total_audience),
      },
      {
        label: "30d growth",
        left: formatPercent(leftQuery.data.growth_30d),
        right: formatPercent(rightQuery.data.growth_30d),
      },
      {
        label: "Engagement rate",
        left: formatPercent(leftQuery.data.engagement_rate),
        right: formatPercent(rightQuery.data.engagement_rate),
      },
      {
        label: "Brand partners",
        left: String(leftQuery.data.unique_brand_partners),
        right: String(rightQuery.data.unique_brand_partners),
      },
    ];
  }, [leftQuery.data, rightQuery.data]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Compare"
        title="Side-by-side creator underwriting inputs"
        description="Use transparent metrics to compare creator profiles without collapsing them into a single opaque score."
      />
      <Card className="text-sm text-muted">
        {creatorsQuery.data?.items.map((creator) => creator.slug).join(" · ")}
      </Card>
      {leftQuery.data && rightQuery.data ? (
        <>
          <DataTable
            rows={rows}
            columns={[
              { header: "Metric", render: (row) => row.label },
              { header: leftQuery.data.name, render: (row) => row.left },
              { header: rightQuery.data.name, render: (row) => row.right },
            ]}
          />
          <div className="grid gap-4 xl:grid-cols-2">
            <GrowthChart title={`${leftQuery.data.name} growth`} data={leftQuery.data.audience_growth} />
            <GrowthChart title={`${rightQuery.data.name} growth`} data={rightQuery.data.audience_growth} />
          </div>
        </>
      ) : (
        <Card className="text-sm text-muted">
          Select two creators from discovery table view to compare them here.
        </Card>
      )}
    </div>
  );
}
