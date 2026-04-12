import type { SelectHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>): JSX.Element {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-border bg-[#0b1120] px-3 py-2 text-sm text-white outline-none focus:border-accent",
        props.className,
      )}
      {...props}
    />
  );
}
