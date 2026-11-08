import { z } from "zod";

// Unified checkout form validation schema
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be under 80 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .regex(
      /^[+\d\s()-]+$/,
      "Phone number can only contain digits, spaces, and ()-",
    ),
  address: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City name must be at least 2 characters"),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(12, "Postal code must be under 12 characters"),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card", "demo"]),
  notes: z
    .string()
    .max(200, "Delivery notes must be under 200 characters")
    .optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const DEFAULT_CHECKOUT_VALUES: CheckoutFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  shippingMethod: "standard",
  paymentMethod: "card",
  notes: "",
};
