import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";

export interface LabelProps extends ComponentProps<"label"> {}

// Accessible form field label
export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn("field-label", className)} {...props}>
      {children}
    </label>
  );
}
