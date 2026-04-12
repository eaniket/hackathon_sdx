type PlatformBadgeProps = {
  label: string;
};

export function PlatformBadge({ label }: PlatformBadgeProps): JSX.Element {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
      {label}
    </span>
  );
}
