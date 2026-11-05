export interface ProductImageProps {
  // Path inside public/, no leading "/", e.g. "products/sunglasses.webp"
  src: string;
  className: string;
  // Width and height in pixels, so the page doesn't jump while it loads
  size: number;
}

// Product pictures sit next to the product name, so they are decorative
// (alt="") and screen readers don't read the name twice
export function ProductImage({ src, className, size }: ProductImageProps) {
  return (
    <img
      className={className}
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  );
}
