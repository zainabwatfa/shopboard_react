import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface HeaderProps {
  // What sits next to the logo: the main navigation and the theme switch
  children: ReactNode;
}

// The site header: semantic header with accessible home link, nav, and theme switch
export function Header({ children }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" to="/" aria-label="ShopBoard home">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path
              d="M4 9a5 5 0 0 1 5-5h9.6a3 3 0 0 1 2.1.9l7.4 7.4a3 3 0 0 1 0 4.2l-9.6 9.6a3 3 0 0 1-4.2 0L4.9 18.7A3 3 0 0 1 4 16.6z"
              fill="currentColor"
            />
            <circle className="logo-cut" cx="10.5" cy="10.5" r="2.6" />
            <path
              className="logo-cut"
              d="M13 20.5l6-6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          ShopBoard
        </Link>
        {children}
      </div>
    </header>
  );
}
