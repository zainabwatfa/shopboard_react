import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { HeroTile } from "../hero.ts";
import { getTileHref } from "../hero.ts";

export interface HeroProps {
  // The picture tiles, one per product (see lib/hero.ts)
  tiles: readonly HeroTile[];
  // How many products the shop has; the round sticker shows it once known
  productCount: number;
  // A tile was clicked: the shop searches for that product
  onPick: (tile: HeroTile) => void;
}

// The top of the shop, as on the first site's home page: the title and
// buttons on the left, three tilted product tiles and a round sticker on the
// right. The motion (rise, drop-in) is in styles.css and is off when the
// visitor asks for reduced motion.
export function Hero({ tiles, productCount, onPick }: HeroProps) {
  function handleTileClick(
    event: MouseEvent<HTMLAnchorElement>,
    tile: HeroTile,
  ): void {
    // Ctrl/Cmd/Shift-click opens the link as usual (new tab or window)
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    onPick(tile);
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Bags · Shoes · Accessories</p>
          <h1 id="hero-title">
            Carry what <em>matters</em>.
          </h1>
          <p className="hero-lead">
            Everyday pieces, chosen with care. Find yours in seconds, and your
            cart waits for you until you're ready.
          </p>
          <div className="hero-actions">
            <a className="button" href="#products-title">
              Shop the collection
            </a>
            <Link className="button button-secondary" to="/cart">
              View your cart
            </Link>
          </div>
          <p className="hero-note">
            A demo shop for a course: nothing is really sold.
          </p>
        </div>

        {/* Each tile searches the shop for its product; the picture is
            decorative, the hidden name is the link text */}
        <div className="hero-art">
          {tiles.map((tile, position) => (
            <a
              key={tile.id}
              className={`hero-tile hero-tile--${position + 1}`}
              href={getTileHref(tile)}
              onClick={(event) => handleTileClick(event, tile)}
            >
              <img src={tile.image} alt="" width={200} height={200} />
              <span className="visually-hidden">{tile.name}</span>
            </a>
          ))}
          {productCount > 0 ? (
            <p className="hero-stamp" aria-hidden="true">
              <span>
                <strong>{productCount}</strong>pieces
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
