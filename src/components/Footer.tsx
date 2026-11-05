import type { LinkGroup } from "../lib/siteLinks.ts";

export interface FooterProps {
  // One column per group (Shop, About), see FOOTER_GROUPS in lib/siteLinks.ts
  groups: readonly LinkGroup[];
}

// The site footer: name, link groups and the demo line
export function Footer({ groups }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-card">
        <p className="footer-name">ShopBoard</p>
        <nav className="footer-nav" aria-label="Footer">
          {groups.map((group) => (
            <div key={group.heading} className="footer-group">
              <h2 className="footer-heading">{group.heading}</h2>
              <ul className="footer-links">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="footer-bar">
          <span>© 2026 ShopBoard</span>
          <span>Demo shop for a course: no real orders or payments.</span>
        </p>
      </div>
    </footer>
  );
}
