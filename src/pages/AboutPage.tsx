import { Link } from "react-router-dom";

// About page: explains the goals, architecture, and educational context of ShopBoard
export function AboutPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="about-title">
        <p className="eyebrow">Our Story</p>
        <h1 id="about-title">
          About <em>ShopBoard</em>
        </h1>
        <p className="lede">
          ShopBoard is a craftsmanship-first demo storefront designed to
          illustrate production-quality React patterns, strict TypeScript, and
          accessible interfaces.
        </p>
      </section>

      <section className="prose" aria-label="About details">
        <h2>Engineering Principles</h2>
        <p>
          ShopBoard was developed as part of a front-end engineering course. It
          demonstrates how to build scalable single-page applications without
          shortcuts:
        </p>
        <ul>
          <li>
            <strong>Strict Type Safety:</strong> Zero <code>any</code>, zero
            type assertions (<code>as</code>), and zero non-null assertions (
            <code>!</code>). All external data is guarded with runtime type
            guards.
          </li>
          <li>
            <strong>Shared Layout &amp; Unified Cart:</strong> A single,
            persisted cart state that coordinates smoothly across every page and
            survives browser reloads and multi-tab synchronization.
          </li>
          <li>
            <strong>On-Demand Code Splitting:</strong> Every route chunk is
            dynamically imported and rendered via React Suspense only when
            visited.
          </li>
          <li>
            <strong>Resilient Accessibility:</strong> Semantic landmarks, polite
            ARIA live regions for cart mutations and search results, and
            predictable keyboard focus management.
          </li>
        </ul>

        <h2>Demo Scope</h2>
        <p>
          Nothing is sold: there are no real transactions, payment processing,
          or physical inventory. All product imagery is sourced under Creative
          Commons from Pexels.
        </p>

        <p>
          Ready to explore? <Link to="/">Browse the collection</Link> or view
          the <Link to="/faq">Frequently Asked Questions</Link>.
        </p>
      </section>
    </>
  );
}
