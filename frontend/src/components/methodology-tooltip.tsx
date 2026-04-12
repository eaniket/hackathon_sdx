type MethodologyTooltipProps = {
  label: string;
  value: string;
};

export function MethodologyTooltip({
  label,
  value,
}: MethodologyTooltipProps): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-black/10 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
  );
}
