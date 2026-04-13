import { forwardRef } from "react";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "../../lib/utils";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = "primary",
    ...props
  },
  ref,
): JSX.Element {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition",
        variant === "primary" && "border-accent bg-accent text-slate-950 hover:opacity-90",
        variant === "secondary" && "border-border bg-panel text-white hover:border-accent/60",
        variant === "ghost" && "border-transparent bg-transparent text-white hover:bg-white/5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
