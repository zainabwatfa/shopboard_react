import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form.tsx";
import { Input } from "../components/ui/input.tsx";
import { getCartLines, getCartTotal } from "../features/cart/cart.logic.ts";
import { useCart } from "../features/cart/hooks/useCart.ts";
import {
  DEFAULT_CHECKOUT_VALUES,
  checkoutSchema,
} from "../features/checkout/checkout.schema.ts";
import type { CheckoutFormValues } from "../features/checkout/checkout.schema.ts";
import { ProductImage } from "../features/products/components/ProductImage.tsx";
import { useProducts } from "../features/products/hooks/useProducts.ts";
import type { Product } from "../features/products/products.types.ts";
import { formatMoney } from "../lib/format.ts";
import { StatusMessage } from "../shared/components/StatusMessage.tsx";

const NO_PRODUCTS: readonly Product[] = [];

interface ConfirmedOrder {
  id: string;
  total: number;
  customerName: string;
  email: string;
  shippingMethod: string;
  address: string;
  city: string;
}

// Checkout page built with react-hook-form, Zod schema validation, and shadcn/ui components
export function CheckoutPage() {
  const { state: cart, actions } = useCart();
  const { state: productsState, retry } = useProducts((products) =>
    actions.keepOnly(products.map((p) => p.id)),
  );

  const [orderCounter, setOrderCounter] = useState(10482);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null,
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_CHECKOUT_VALUES,
    mode: "onTouched",
  });

  const products =
    productsState.status === "ready" ? productsState.products : NO_PRODUCTS;
  const lines = getCartLines(cart.items, products);
  const subtotal = getCartTotal(cart.items, products);

  const shippingMethod = useWatch({
    control: form.control,
    name: "shippingMethod",
  });
  const shippingCost = shippingMethod === "express" ? 15 : 0;
  const grandTotal = subtotal + shippingCost;

  function onSubmit(values: CheckoutFormValues): void {
    if (lines.length === 0) return;

    const orderId = `SB-${orderCounter}`;
    setOrderCounter((prev) => prev + 1);

    setConfirmedOrder({
      id: orderId,
      total: grandTotal,
      customerName: values.fullName,
      email: values.email,
      shippingMethod:
        values.shippingMethod === "express"
          ? "Express (1-2 business days)"
          : "Standard (3-5 business days)",
      address: values.address,
      city: values.city,
    });

    actions.clear();
  }

  return (
    <>
      <div className="page-head">
        <p className="eyebrow">Checkout</p>
        <h1>
          Complete your <em>order</em>
        </h1>
      </div>

      <p className="demo-note">
        <strong>Demo notice:</strong> ShopBoard is a course demonstration. No
        real payments, charges, or physical shipments occur.
      </p>

      {productsState.status === "loading" && (
        <StatusMessage
          id="checkout-status"
          tone="normal"
          message="Loading order details…"
        />
      )}

      {productsState.status === "error" && (
        <StatusMessage
          id="checkout-status"
          tone="error"
          message={productsState.message}
          action={{ label: "Try again", onClick: retry }}
        />
      )}

      {confirmedOrder ? (
        <section
          className="checkout-done"
          aria-labelledby="confirmation-heading"
        >
          <h2 id="confirmation-heading">Order confirmed!</h2>
          <p className="checkout-done-lead">
            Thank you, {confirmedOrder.customerName}! Your simulated demo order
            has been placed. A confirmation summary has been generated below.
          </p>

          <div className="checkout-row">
            <span>Order number</span>
            <strong>{confirmedOrder.id}</strong>
          </div>
          <div className="checkout-row">
            <span>Customer</span>
            <strong>{confirmedOrder.email}</strong>
          </div>
          <div className="checkout-row">
            <span>Shipping to</span>
            <strong>
              {confirmedOrder.address}, {confirmedOrder.city}
            </strong>
          </div>
          <div className="checkout-row">
            <span>Shipping method</span>
            <strong>{confirmedOrder.shippingMethod}</strong>
          </div>
          <div className="checkout-row">
            <span>Amount paid</span>
            <strong>{formatMoney(confirmedOrder.total)}</strong>
          </div>
          <div className="checkout-row">
            <span>Status</span>
            <strong>Demo completed</strong>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link to="/" className="button">
              Continue shopping
            </Link>
          </div>
        </section>
      ) : lines.length === 0 && productsState.status === "ready" ? (
        <div className="cart-empty-state">
          <p>Your cart is empty. Add products before checking out.</p>
          <Link to="/" className="button">
            Browse products
          </Link>
        </div>
      ) : lines.length > 0 ? (
        <div className="checkout-layout">
          <Form {...form}>
            <form
              className="checkout-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <h2>Contact &amp; Shipping</h2>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="field-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(555) 000-0000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Market Street, Apt 4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="field-row">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="94103" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="field-row">
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping method</FormLabel>
                      <FormControl>
                        <select className="field-input" {...field}>
                          <option value="standard">
                            Standard Delivery (Free, 3-5 days)
                          </option>
                          <option value="express">
                            Express Delivery ($15.00, 1-2 days)
                          </option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Express delivers within 1-2 business days.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment method</FormLabel>
                      <FormControl>
                        <select className="field-input" {...field}>
                          <option value="card">
                            Credit / Debit Card (Simulated)
                          </option>
                          <option value="demo">Demo Express Checkout</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Simulated demo payment only.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery instructions (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Leave package on the porch"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                style={{ marginTop: "1rem" }}
              >
                Place demo order ({formatMoney(grandTotal)})
              </Button>
            </form>
          </Form>

          <aside className="checkout-summary" aria-label="Order summary">
            <h2>Order summary ({cart.count} items)</h2>
            <ul className="checkout-lines">
              {lines.map((line) => (
                <li key={line.product.id} className="checkout-line">
                  <div className="checkout-thumb">
                    <ProductImage
                      src={line.product.image}
                      size={60}
                      className="product-image"
                    />
                  </div>
                  <span className="checkout-line-name">
                    {line.product.name}
                  </span>
                  <span className="checkout-line-qty">Qty {line.qty}</span>
                  <span className="checkout-line-total">
                    {formatMoney(line.product.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="checkout-row" style={{ marginTop: "1rem" }}>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="checkout-row">
              <span>Shipping</span>
              <strong>
                {shippingCost === 0 ? "Free" : formatMoney(shippingCost)}
              </strong>
            </div>

            <div
              className="checkout-row"
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "2px solid var(--color-line)",
              }}
            >
              <span>Total</span>
              <strong style={{ fontSize: "1.5rem" }}>
                {formatMoney(grandTotal)}
              </strong>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
