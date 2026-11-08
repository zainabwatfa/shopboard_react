import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.ts";

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "danger";
}

// Accessible styled button component
export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "secondary"
      ? "button-secondary"
      : variant === "danger"
        ? "button-danger"
        : "";

  return (
    <button
      type={type}
      className={cn("button", variantClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}
