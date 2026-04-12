import type { BrandDeal } from "../types/api";
import { formatDate } from "../lib/utils";
import { Card } from "./ui/card";

type SponsorTimelineProps = {
  deals: BrandDeal[];
};

export function SponsorTimeline({ deals }: SponsorTimelineProps): JSX.Element {
  return (
    <Card className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Sponsor activity timeline</h3>
      <div className="space-y-4">
        {deals.map((deal) => (
          <div key={deal.id} className="flex gap-4">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
            <div>
              <p className="font-medium text-white">{deal.brand_name}</p>
              <p className="text-sm text-muted">
                {formatDate(deal.deal_date)} · {deal.platform} · {deal.campaign_type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
