import { Link } from "react-router-dom";

// 404 Not Found page: displayed whenever an unknown route is requested
export function NotFoundPage() {
  return (
    <section className="page-hero" aria-labelledby="not-found-title">
      <p className="eyebrow">Error 404</p>
      <h1 id="not-found-title">
        Page not <em>found</em>
      </h1>
      <p className="lede">
        We couldn&apos;t find the page you were looking for. The link may be
        mistyped or the resource has been relocated.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/" className="button">
          Back to shop
        </Link>
      </div>
    </section>
  );
}
