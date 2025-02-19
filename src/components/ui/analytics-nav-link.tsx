"use client";

import { cn } from "../../utils/class-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function AnalyticsNavLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={cn({ active: isActive }, "nav__link")}>
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">{label}</span>
    </Link>
  );
}
