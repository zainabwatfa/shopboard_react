import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";

export interface InputProps extends ComponentProps<"input"> {}

// Accessible styled input component
export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn("field-input", className)}
      {...props}
    />
  );
}
