type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps): JSX.Element {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-muted">{description}</p> : null}
    </div>
  );
}
