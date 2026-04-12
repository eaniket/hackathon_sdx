import type { BrandDeal } from "../types/api";
import { formatDate } from "../lib/utils";
import { Card } from "./ui/card";

type BrandDealListProps = {
  deals: BrandDeal[];
};

export function BrandDealList({ deals }: BrandDealListProps): JSX.Element {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Brand deal history</h3>
        <span className="text-sm text-muted">{deals.length} records</span>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <div key={deal.id} className="rounded-xl border border-border bg-black/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{deal.brand_name}</p>
                <p className="text-sm text-muted">
                  {deal.platform} · {deal.source_type}
                </p>
              </div>
              <div className="text-right text-sm text-muted">
                <p>{formatDate(deal.deal_date)}</p>
                <p>{Math.round(deal.confidence * 100)}% confidence</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-200">{deal.evidence_text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
