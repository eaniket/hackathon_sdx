import { Card } from "./ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps): JSX.Element {
  return (
    <Card className="space-y-2">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="tabular-nums text-2xl font-semibold text-white">{value}</p>
      {detail ? <p className="text-sm text-muted">{detail}</p> : null}
    </Card>
  );
}
