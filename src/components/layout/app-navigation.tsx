"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  CircleDot,
  Home,
  ListChecks,
  Settings,
  Target,
  UsersRound,
} from "lucide-react";

const primaryNavigation = [
  { label: "Dashboard", href: "/dashboard", icon: Home, enabled: true },
  { label: "Family", href: "/family", icon: UsersRound, enabled: true },
  { label: "Goals", href: "/goals", icon: Target, enabled: true },
  { label: "Activities", href: "/activities", icon: ListChecks, enabled: false },
  { label: "Checklist", href: "/checklist", icon: CheckSquare, enabled: false },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, enabled: false },
  { label: "Reports", href: "/reports", icon: BarChart3, enabled: false },
  { label: "Settings", href: "/settings", icon: Settings, enabled: false },
];

const mobileNavigation = primaryNavigation.filter((item) =>
  ["Dashboard", "Family", "Goals", "Checklist", "Calendar"].includes(item.label),
);

function NavigationItem({
  item,
  compact = false,
}: {
  item: (typeof primaryNavigation)[number];
  compact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const baseClass = compact
    ? "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-medium"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium";
  const stateClass = isActive
    ? "bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950"
    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50";
  const disabledClass = "cursor-not-allowed text-neutral-400 opacity-60 dark:text-neutral-600";

  if (!item.enabled) {
    return (
      <span
        aria-disabled="true"
        className={`${baseClass} ${disabledClass}`}
        title="Coming in a later step"
      >
        <Icon aria-hidden="true" className="h-4 w-4" />
        <span>{item.label}</span>
      </span>
    );
  }

  return (
    <Link className={`${baseClass} ${stateClass}`} href={item.href}>
      <Icon aria-hidden="true" className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  );
}

export function AppSidebar({ email }: { email?: string }) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-950 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
          <CircleDot aria-hidden="true" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Habitia</p>
          <p className="max-w-44 truncate text-xs text-neutral-500">{email ?? "Family workspace"}</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="mt-8 flex flex-1 flex-col gap-1">
        {primaryNavigation.map((item) => (
          <NavigationItem item={item} key={item.label} />
        ))}
      </nav>
    </aside>
  );
}

export function MobileTopBar({ email }: { email?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <CircleDot aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Habitia</p>
            <p className="truncate text-xs text-neutral-500">{email ?? "Family workspace"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 lg:hidden"
    >
      {mobileNavigation.map((item) => (
        <NavigationItem compact item={item} key={item.label} />
      ))}
    </nav>
  );
}
