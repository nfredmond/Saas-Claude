"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavLinkPillProps = {
  href: string;
  label: string;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinkPill({ href, label }: NavLinkPillProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
        isActive
          ? "border border-border/70 bg-muted text-foreground shadow-sm"
          : "border border-transparent text-muted-foreground hover:border-border/65 hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}
