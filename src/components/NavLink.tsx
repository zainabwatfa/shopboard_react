import type { ReactNode } from "react";

export interface NavLinkProps {
  href: string;
  // True on the link to the page that is open: screen readers say "current page"
  isCurrent: boolean;
  children: ReactNode;
}

export function NavLink({ href, isCurrent, children }: NavLinkProps) {
  return (
    <a href={href} aria-current={isCurrent ? "page" : undefined}>
      {children}
    </a>
  );
}
