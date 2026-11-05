// The footer's links. Data only: Footer.tsx turns the groups into columns.
// Links inside the site never start with "/": GitHub Pages serves a project
// site under /<repo-name>/, so "/cart.html" would point outside it.

export type SiteLink = {
  href: string;
  label: string;
};

export type LinkGroup = {
  heading: string;
  links: readonly SiteLink[];
};

const REPO_URL = "https://github.com/zainabwatfa/shopboard_react";

// Only pages that exist in this site, plus the photo credits and the code on GitHub
export const FOOTER_GROUPS: readonly LinkGroup[] = [
  {
    heading: "Shop",
    links: [
      { href: "index.html", label: "All products" },
      { href: "cart.html", label: "Cart" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: `${REPO_URL}/blob/main/CREDITS.md`, label: "Photo credits" },
      { href: REPO_URL, label: "Source code" },
    ],
  },
];
