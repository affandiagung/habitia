import * as React from "react";
import { cn } from "@/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    className={cn("text-sm font-medium leading-none text-neutral-950 dark:text-neutral-50", className)}
    ref={ref}
    {...props}
  />
));

Label.displayName = "Label";
