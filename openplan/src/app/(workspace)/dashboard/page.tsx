import Link from "next/link";
import { RunHistory } from "@/components/runs/RunHistory";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(name)")
    .eq("user_id", user!.id)
    .limit(1);

  const membership = memberships?.[0] as
    | { workspace_id: string; role: string; workspaces: { name: string } | null }
    | undefined;

  const workspaceName = membership?.workspaces?.name ?? "Your workspace";
  const workspaceRole = membership?.role ?? "member";
  const workspaceId = membership?.workspace_id ?? "";
  const workspaceIdSnippet = workspaceId ? workspaceId.slice(0, 8) : "unavailable";

  const actions = [
    {
      href: "/explore",
      title: "Open Corridor Analysis",
      description: "Start a new run and move from corridor geometry to scored output.",
    },
    {
      href: "/sign-up",
      title: "Add a Test User",
      description: "Validate workspace bootstrap and role assignment with a second account.",
    },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">{workspaceName}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Signed in as {user?.email}. Sprint focus: route protection, reproducible analysis runs, and client-safe reporting.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="info">{workspaceRole}</StatusBadge>
          <p className="text-[0.72rem] uppercase tracking-[0.08em] text-muted-foreground">
            Workspace ID: <span className="font-mono text-foreground">{workspaceIdSnippet}</span>
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-[0_10px_24px_rgba(20,33,43,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
          >
            <h2 className="text-base font-semibold tracking-tight">{action.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
          </Link>
        ))}
      </div>

      <article className="rounded-2xl border border-border/80 bg-card p-5 shadow-[0_10px_24px_rgba(20,33,43,0.06)]">
        <h2 className="text-lg font-semibold tracking-tight">Current Baseline</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Supabase auth flow is live for sign-up, sign-in, and protected routes.</li>
          <li>Analysis API supports validated corridor scoring requests.</li>
          <li>Runs persist and reload cleanly at workspace scope.</li>
          <li>Report endpoint returns structured HTML/PDF-ready output.</li>
          <li>Core layers now use GTFS, crashes, Census, and LODES inputs.</li>
        </ul>
      </article>

      <RunHistory workspaceId={workspaceId} />
    </section>
  );
}
