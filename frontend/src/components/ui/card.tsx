import type { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps): JSX.Element {
  return (
    <div
      className={cn("rounded-2xl border border-border bg-panel/90 p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
