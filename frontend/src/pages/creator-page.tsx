import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { BrandDealList } from "../components/brand-deal-list";
import { DataTable } from "../components/data-table";
import { GrowthChart } from "../components/growth-chart";
import { InvestDialog } from "../components/invest-dialog";
import { MethodologyTooltip } from "../components/methodology-tooltip";
import { MetricCard } from "../components/metric-card";
import { PlatformBadge } from "../components/platform-badge";
import { SectionHeader } from "../components/section-header";
import { SponsorTimeline } from "../components/sponsor-timeline";
import { VerificationDialog } from "../components/verification-dialog";
import { WatchlistButton } from "../components/watchlist-button";
import { Card } from "../components/ui/card";
import { getCreator } from "../lib/api";
import { formatDate, formatNumber, formatPercent } from "../lib/utils";
import { useWatchlist } from "../hooks/use-watchlist";

export function CreatorPage(): JSX.Element {
  const params = useParams();
  const slug = params.slug ?? "";
  const query = useQuery({
    queryKey: ["creator", slug],
    queryFn: () => getCreator(slug),
    enabled: slug.length > 0,
  });
  const watchlist = useWatchlist();

  const creator = query.data;
  if (!creator) {
    return <div className="text-sm text-muted">Loading creator profile...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <img src={creator.avatar_url} alt={creator.name} className="h-20 w-20 rounded-full object-cover" />
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-semibold text-white">{creator.name}</h1>
                <p className="mt-1 text-sm capitalize text-muted">
                  {creator.category} · {creator.location}
                </p>
              </div>
              <p className="max-w-3xl text-sm text-slate-200">{creator.bio}</p>
              <div className="flex flex-wrap gap-2">
                {creator.platforms.map((platform) => (
                  <PlatformBadge key={platform.platform} label={platform.platform} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <WatchlistButton
                  active={watchlist.has(creator.slug)}
                  onToggle={() => watchlist.toggle(creator.slug)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total audience" value={formatNumber(creator.total_audience)} />
            <MetricCard label="30d growth" value={formatPercent(creator.growth_30d)} />
            <MetricCard label="Engagement rate" value={formatPercent(creator.engagement_rate)} />
            <MetricCard
              label="Brand partners"
              value={String(creator.unique_brand_partners)}
              detail={`${creator.detected_sponsored_posts} detected sponsor posts`}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <GrowthChart title="Audience growth" data={creator.audience_growth} />
            <GrowthChart title="Engagement trend" data={creator.engagement_trend} />
          </div>
          <SectionHeader
            eyebrow="Platform metrics"
            title="Cross-platform performance"
            description="Transparent platform-by-platform inputs for audience and engagement."
          />
          <DataTable
            rows={creator.platforms}
            columns={[
              { header: "Platform", render: (row) => row.platform },
              { header: "Followers", render: (row) => formatNumber(row.followers) },
              { header: "Avg views", render: (row) => formatNumber(row.avg_views) },
              { header: "Posts / week", render: (row) => row.posts_per_week.toFixed(1) },
              { header: "30d growth", render: (row) => formatPercent(row.growth_30d) },
            ]}
          />
          <SectionHeader
            eyebrow="Content"
            title="Recent creator output"
            description="Recent posts and releases used to contextualize growth and sponsor activity."
          />
          <DataTable
            rows={creator.content}
            columns={[
              { header: "Date", render: (row) => formatDate(row.published_at) },
              { header: "Platform", render: (row) => row.platform },
              { header: "Title", render: (row) => row.title },
              { header: "Views", render: (row) => formatNumber(row.views) },
              { header: "Engagement", render: (row) => formatNumber(row.likes + row.comments + row.shares) },
            ]}
          />
          <div className="grid gap-4 xl:grid-cols-2">
            <BrandDealList deals={creator.brand_deals} />
            <SponsorTimeline deals={creator.brand_deals} />
          </div>
          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Monetization history</h3>
            <div className="space-y-3">
              {creator.monetization_history.map((item) => (
                <div key={item.channel} className="rounded-xl border border-border bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{item.channel}</p>
                    <span className="text-sm text-muted">{item.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Simulated investment</h2>
            <p className="text-sm text-muted">
              Use fixed ticket sizes to add this creator to the demo portfolio.
            </p>
            <InvestDialog creatorId={creator.id} creatorName={creator.name} />
            <VerificationDialog slug={creator.slug} />
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Methodology snapshot</h2>
            <div className="space-y-3">
              <MethodologyTooltip
                label="Total audience"
                value="Sum of followers and subscribers across the creator's supported channels."
              />
              <MethodologyTooltip
                label="30d growth"
                value="Average 30-day growth across supported platforms."
              />
              <MethodologyTooltip
                label="Brand deals"
                value="Detected from captions and titles with sponsor-language heuristics, plus creator-verified records."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
