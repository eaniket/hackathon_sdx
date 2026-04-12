import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border bg-[#0b1120] px-3 py-2 text-sm text-white outline-none placeholder:text-muted focus:border-accent",
        props.className,
      )}
      {...props}
    />
  );
}
