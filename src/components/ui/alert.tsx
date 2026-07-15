import * as React from "react";
import { cn } from "@/utils/cn";

type AlertVariant = "default" | "success" | "danger";

const variantClasses: Record<AlertVariant, string> = {
  default: "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300",
};

export function Alert({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: AlertVariant }) {
  return <div className={cn("rounded-lg border px-3 py-2 text-sm", variantClasses[variant], className)} {...props} />;
}
