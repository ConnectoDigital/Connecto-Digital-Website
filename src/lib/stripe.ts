import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 2500,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
  },
  GROWTH: {
    name: "Growth",
    price: 5000,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
  },
  EMBEDDED: {
    name: "Embedded",
    price: 9000,
    priceId: process.env.STRIPE_EMBEDDED_PRICE_ID!,
  },
} as const;
