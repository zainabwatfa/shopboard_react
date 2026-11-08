import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CHECKOUT_VALUES,
  checkoutSchema,
} from "../src/features/checkout/checkout.schema.ts";

const VALID_DATA = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Market Street, Apt 4",
  city: "San Francisco",
  postalCode: "94103",
  shippingMethod: "standard",
  paymentMethod: "card",
  notes: "Leave by front door",
};

describe("checkoutSchema", () => {
  test("accepts valid checkout data and trims strings", () => {
    const result = checkoutSchema.safeParse({
      ...VALID_DATA,
      fullName: "  Jane Doe  ",
      email: "  jane@example.com  ",
    });
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.fullName, "Jane Doe");
      assert.equal(result.data.email, "jane@example.com");
    }
  });

  test("accepts data without optional notes", () => {
    const { notes: _, ...withoutNotes } = VALID_DATA;
    const result = checkoutSchema.safeParse(withoutNotes);
    assert.equal(result.success, true);
  });

  test("validates fullName minimum length and clear message", () => {
    const result = checkoutSchema.safeParse({
      ...VALID_DATA,
      fullName: "J",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "fullName");
      assert.equal(issue?.message, "Full name must be at least 2 characters");
    }
  });

  test("validates email format and clear message", () => {
    const result = checkoutSchema.safeParse({
      ...VALID_DATA,
      email: "not-an-email",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "email");
      assert.equal(issue?.message, "Please enter a valid email address");
    }
  });

  test("validates phone minimum length and allowed characters", () => {
    const shortResult = checkoutSchema.safeParse({
      ...VALID_DATA,
      phone: "123",
    });
    assert.equal(shortResult.success, false);
    if (!shortResult.success) {
      const issue = shortResult.error.issues.find((i) => i.path[0] === "phone");
      assert.equal(issue?.message, "Phone number must be at least 7 digits");
    }

    const invalidCharResult = checkoutSchema.safeParse({
      ...VALID_DATA,
      phone: "555-CALL-NOW",
    });
    assert.equal(invalidCharResult.success, false);
    if (!invalidCharResult.success) {
      const issue = invalidCharResult.error.issues.find(
        (i) => i.path[0] === "phone",
      );
      assert.equal(
        issue?.message,
        "Phone number can only contain digits, spaces, and ()-",
      );
    }
  });

  test("validates address and city minimum lengths", () => {
    const addressResult = checkoutSchema.safeParse({
      ...VALID_DATA,
      address: "No",
    });
    assert.equal(addressResult.success, false);
    if (!addressResult.success) {
      const issue = addressResult.error.issues.find(
        (i) => i.path[0] === "address",
      );
      assert.equal(
        issue?.message,
        "Street address must be at least 5 characters",
      );
    }

    const cityResult = checkoutSchema.safeParse({
      ...VALID_DATA,
      city: "A",
    });
    assert.equal(cityResult.success, false);
    if (!cityResult.success) {
      const issue = cityResult.error.issues.find((i) => i.path[0] === "city");
      assert.equal(issue?.message, "City name must be at least 2 characters");
    }
  });

  test("validates postal code minimum and maximum lengths", () => {
    const shortResult = checkoutSchema.safeParse({
      ...VALID_DATA,
      postalCode: "12",
    });
    assert.equal(shortResult.success, false);
    if (!shortResult.success) {
      const issue = shortResult.error.issues.find(
        (i) => i.path[0] === "postalCode",
      );
      assert.equal(
        issue?.message,
        "Postal code must be at least 3 characters",
      );
    }
  });

  test("DEFAULT_CHECKOUT_VALUES provides empty initial fields", () => {
    assert.equal(DEFAULT_CHECKOUT_VALUES.fullName, "");
    assert.equal(DEFAULT_CHECKOUT_VALUES.shippingMethod, "standard");
    assert.equal(DEFAULT_CHECKOUT_VALUES.paymentMethod, "card");
  });
});
