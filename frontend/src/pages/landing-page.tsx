import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { CreatorCard } from "../components/creator-card";
import { SectionHeader } from "../components/section-header";
import { Button } from "../components/ui/button";
import { getCreators } from "../lib/api";

export function LandingPage(): JSX.Element {
  const query = useQuery({
    queryKey: ["creators", "landing"],
    queryFn: () => getCreators(new URLSearchParams({ sort: "growth_30d" })),
  });
  const items = query.data?.items.slice(0, 3) ?? [];

  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            Transparent creator market data
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white">
            Back emerging creators with transparent engagement and monetization data.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            Discover creator profiles, review audience and sponsor history, then simulate
            small positions in the next wave of cultural talent.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/discover">
              <Button>Explore creators</Button>
            </Link>
            <Link to="/methodology">
              <Button variant="secondary">Read methodology</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-panel/80 p-6">
          <SectionHeader
            eyebrow="Approach"
            title="Closer to a market terminal than a social feed."
            description="The product prioritizes active engagement, growth, and sponsor history over vanity metrics."
          />
        </div>
      </section>
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Preview"
          title="Sample creator profiles"
          description="A quick look at the discovery layer powering the product."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>
    </div>
  );
}
