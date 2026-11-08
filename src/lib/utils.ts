// Utility function for conditional class names
export function cn(
  ...inputs: readonly (string | undefined | null | false)[]
): string {
  return inputs.filter(Boolean).join(" ");
}
