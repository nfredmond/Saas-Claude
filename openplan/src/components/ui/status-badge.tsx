import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/ui/status";

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-border bg-background text-foreground/80",
  info: "border-[color:var(--accent)]/35 bg-[color:var(--accent)]/12 text-[color:var(--accent)]",
  success: "border-[color:var(--pine)]/35 bg-[color:var(--pine)]/12 text-[color:var(--pine)]",
  warning: "border-[color:var(--copper)]/45 bg-[color:var(--copper)]/16 text-[color:var(--copper)]",
  danger: "border-destructive/45 bg-destructive/10 text-destructive",
};

type StatusBadgeProps = React.ComponentProps<typeof Badge> & {
  tone?: StatusTone;
};

export function StatusBadge({ tone = "neutral", className, children, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em]",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
