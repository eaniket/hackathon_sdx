import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { CreatorCard } from "../components/creator-card";
import { DataTable } from "../components/data-table";
import { SectionHeader } from "../components/section-header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { getCreators } from "../lib/api";
import { formatNumber, formatPercent } from "../lib/utils";

const categories = ["all", "fashion", "music", "education", "gaming", "podcasts", "fitness"];
const platforms = ["all", "YouTube", "Instagram", "TikTok", "Newsletter", "Podcast"];

export function DiscoveryPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [compare, setCompare] = useState<string[]>([]);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "all";
  const platform = searchParams.get("platform") ?? "all";
  const sort = searchParams.get("sort") ?? "growth_30d";
  const view = searchParams.get("view") ?? "cards";

  const params = useMemo(() => {
    const query = new URLSearchParams({ sort });
    if (search) {
      query.set("search", search);
    }
    if (category !== "all") {
      query.set("category", category);
    }
    if (platform !== "all") {
      query.set("platform", platform);
    }
    return query;
  }, [category, platform, search, sort]);

  const query = useQuery({
    queryKey: ["creators", params.toString()],
    queryFn: () => getCreators(params),
  });

  function updateParam(key: string, value: string): void {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  }

  function toggleCompare(slug: string): void {
    setCompare((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length === 2) {
        return [current[1], slug];
      }
      return [...current, slug];
    });
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Discovery"
        title="Browse creators as investable profiles"
        description="Scan growth, engagement, and sponsor history before committing a simulated position."
      />
      <div className="grid gap-3 rounded-2xl border border-border bg-panel/80 p-4 md:grid-cols-4">
        <Input value={search} onChange={(event) => updateParam("search", event.target.value)} placeholder="Search creators" />
        <Select value={category} onChange={(event) => updateParam("category", event.target.value)}>
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select value={platform} onChange={(event) => updateParam("platform", event.target.value)}>
          {platforms.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select value={sort} onChange={(event) => updateParam("sort", event.target.value)}>
          <option value="growth_30d">Sort by 30d growth</option>
          <option value="engagement_rate">Sort by engagement rate</option>
          <option value="sponsored_activity">Sort by sponsor activity</option>
          <option value="audience">Sort by audience</option>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={view === "cards" ? "primary" : "secondary"} onClick={() => updateParam("view", "cards")}>
            Card view
          </Button>
          <Button variant={view === "table" ? "primary" : "secondary"} onClick={() => updateParam("view", "table")}>
            Table view
          </Button>
        </div>
        <Link to={`/compare?left=${compare[0] ?? ""}&right=${compare[1] ?? ""}`}>
          <Button variant="secondary" disabled={compare.length !== 2}>
            Compare selected
          </Button>
        </Link>
      </div>
      {query.data?.items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
          No creators match the current filters.
        </div>
      ) : view === "table" ? (
        <DataTable
          rows={query.data?.items ?? []}
          columns={[
            {
              header: "Compare",
              render: (row) => (
                <input
                  type="checkbox"
                  checked={compare.includes(row.slug)}
                  onChange={() => toggleCompare(row.slug)}
                />
              ),
            },
            { header: "Creator", render: (row) => <Link to={`/creators/${row.slug}`}>{row.name}</Link> },
            { header: "Category", render: (row) => row.category },
            { header: "Audience", render: (row) => formatNumber(row.total_audience) },
            { header: "30d growth", render: (row) => formatPercent(row.growth_30d) },
            { header: "Engagement", render: (row) => formatPercent(row.engagement_rate) },
            { header: "Sponsors", render: (row) => row.detected_sponsored_posts },
          ]}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {query.data?.items.map((creator) => <CreatorCard key={creator.id} creator={creator} />)}
        </div>
      )}
    </div>
  );
}
