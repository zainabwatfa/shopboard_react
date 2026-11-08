import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface NavLinkProps {
  href: string;
  // True on the link to the page that is open: screen readers say "current page"
  isCurrent: boolean;
  children: ReactNode;
}

export function NavLink({ href, isCurrent, children }: NavLinkProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a href={href} aria-current={isCurrent ? "page" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} aria-current={isCurrent ? "page" : undefined}>
      {children}
    </Link>
  );
}
