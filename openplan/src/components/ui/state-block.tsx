import * as React from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type BaseStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
};

function StateBlock({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
  tone = "neutral",
}: BaseStateProps & {
  icon: React.ReactNode;
  tone?: "neutral" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        tone === "danger"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-border/80 bg-muted/35 text-foreground",
        compact ? "space-y-1.5" : "space-y-2.5",
        className
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
            tone === "danger"
              ? "border-destructive/35 bg-destructive/10 text-destructive"
              : "border-border/70 bg-background text-muted-foreground"
          )}
        >
          {icon}
        </span>

        <div className="space-y-1">
          <p className={cn("font-semibold tracking-tight", compact ? "text-sm" : "text-base")}>{title}</p>
          {description ? (
            <p
              className={cn(
                compact ? "text-xs" : "text-sm",
                tone === "danger" ? "text-destructive/90" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action ? <div className="pt-0.5">{action}</div> : null}
    </div>
  );
}

type LoadingStateProps = {
  label?: string;
  description?: string;
  compact?: boolean;
  className?: string;
};

export function LoadingState({
  label = "Loading",
  description,
  compact = false,
  className,
}: LoadingStateProps) {
  return (
    <StateBlock
      icon={<Loader2 className="h-4 w-4 animate-spin" />}
      title={label}
      description={description}
      compact={compact}
      className={className}
    />
  );
}

export function EmptyState({ title, description, action, compact = false, className }: BaseStateProps) {
  return (
    <StateBlock
      icon={<Inbox className="h-4 w-4" />}
      title={title}
      description={description}
      action={action}
      compact={compact}
      className={className}
    />
  );
}

export function ErrorState({ title, description, action, compact = false, className }: BaseStateProps) {
  return (
    <StateBlock
      icon={<AlertTriangle className="h-4 w-4" />}
      title={title}
      description={description}
      action={action}
      compact={compact}
      className={className}
      tone="danger"
    />
  );
}
