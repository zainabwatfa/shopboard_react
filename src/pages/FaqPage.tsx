import { Link } from "react-router-dom";

// FAQ page: accessible collapsible answers for questions about the shop
export function FaqPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="faq-title">
        <p className="eyebrow">Help &amp; Questions</p>
        <h1 id="faq-title">
          Frequently Asked <em>Questions</em>
        </h1>
        <p className="lede">
          Clear answers about how ShopBoard handles routing, API loading, cart
          persistence, and themes.
        </p>
      </section>

      <section className="prose" aria-label="FAQ answers">
        <details>
          <summary>Can I place real orders or make payments?</summary>
          <div>
            <p>
              No. ShopBoard is purely an educational showcase. No financial
              transactions occur and no credit card information is collected.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How does the cart work across pages and survive a refresh?
          </summary>
          <div>
            <p>
              The cart is managed by a top-level <code>CartProvider</code> that
              persists item identifiers and quantities to{" "}
              <code>localStorage</code>. When you reload the page or navigate
              between routes, the cart state is immediately restored. Multi-tab
              synchronization is handled via the browser&apos;s{" "}
              <code>storage</code> event.
            </p>
          </div>
        </details>

        <details>
          <summary>How are pages loaded only when opened?</summary>
          <div>
            <p>
              ShopBoard uses code-splitting with <code>React.lazy()</code> and{" "}
              <code>Suspense</code>. The browser downloads the JavaScript bundle
              for a page (such as the Product page, About page, or Checkout)
              only when you visit that route.
            </p>
          </div>
        </details>

        <details>
          <summary>How does the product page load data by its id?</summary>
          <div>
            <p>
              The route extracts the product id parameter from the URL, queries
              the API endpoint for that specific product, and displays its
              details along with related products in the same category.
            </p>
          </div>
        </details>

        <details>
          <summary>How do themes work?</summary>
          <div>
            <p>
              You can toggle between System, Light, and Dark modes using the
              switch in the header. Your choice is stored in{" "}
              <code>localStorage</code> and evaluated before render to eliminate
              visual flashes.
            </p>
          </div>
        </details>

        <p style={{ marginTop: "2rem" }}>
          Have more questions? Head back to the <Link to="/">shop</Link> or
          check out your <Link to="/cart">cart</Link>.
        </p>
      </section>
    </>
  );
}
