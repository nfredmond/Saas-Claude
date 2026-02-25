import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type MembershipRow = {
  workspace_id: string;
  role: string;
  workspaces: { name: string | null } | Array<{ name: string | null }> | null;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: memberships, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(name)")
    .eq("user_id", user.id)
    .limit(1);

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch workspace membership",
        details: error.message,
      },
      { status: 500 }
    );
  }

  const membership = memberships?.[0] as MembershipRow | undefined;

  if (!membership) {
    return NextResponse.json({ error: "No workspace membership found" }, { status: 404 });
  }

  const workspace = Array.isArray(membership.workspaces)
    ? membership.workspaces[0] ?? null
    : membership.workspaces;

  return NextResponse.json(
    {
      workspaceId: membership.workspace_id,
      name: workspace?.name ?? null,
      role: membership.role,
    },
    { status: 200 }
  );
}
