import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { CreatorCard } from "../components/creator-card";
import { SectionHeader } from "../components/section-header";
import { getCreators } from "../lib/api";
import { useWatchlist } from "../hooks/use-watchlist";

export function WatchlistPage(): JSX.Element {
  const watchlist = useWatchlist();
  const query = useQuery({
    queryKey: ["creators", "watchlist"],
    queryFn: () => getCreators(new URLSearchParams({ sort: "growth_30d" })),
  });

  const creators = useMemo(
    () => query.data?.items.filter((item) => watchlist.has(item.slug)) ?? [],
    [query.data?.items, watchlist],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Watchlist"
        title="Saved creator profiles"
        description="Track creators you want to revisit before committing capital."
      />
      {creators.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
          No watched creators yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
