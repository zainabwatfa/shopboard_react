// The three products on the hero's picture tiles, the same ones as the first
// site's home page. tests/products.data.test.ts checks that each one matches
// public/api/products.json (id, name and picture).

export type HeroTile = {
  id: number;
  name: string;
  // Path inside public/, no leading "/"
  image: string;
};

export const HERO_TILES: readonly HeroTile[] = [
  { id: 1, name: "Leather Tote Bag", image: "products/leather-tote-bag.webp" },
  { id: 8, name: "Silver Watch", image: "products/silver-watch.webp" },
  { id: 4, name: "White Sneakers", image: "products/white-sneakers.webp" },
];

// A tile's link: the shop searching for that product. With JavaScript the
// shop handles the click itself, without a reload.
export function getTileHref(tile: HeroTile): string {
  return `index.html?${new URLSearchParams({ q: tile.name }).toString()}`;
}
