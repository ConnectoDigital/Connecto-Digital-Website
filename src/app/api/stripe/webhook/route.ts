import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as "STARTER" | "GROWTH" | "EMBEDDED";

        if (!userId || !plan) break;

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            plan,
            status: "ACTIVE",
            currentPeriodStart: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            plan,
            status: "ACTIVE",
            currentPeriodStart: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;

        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId },
        });

        if (!existing) break;

        const statusMap: Record<string, "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE"> = {
          active: "ACTIVE",
          paused: "PAUSED",
          canceled: "CANCELLED",
          past_due: "PAST_DUE",
        };

        await prisma.subscription.update({
          where: { stripeSubscriptionId },
          data: {
            status: statusMap[subscription.status] || "ACTIVE",
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodStart: new Date((subscription as unknown as { current_period_start: number }).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = subscription.id;

        await prisma.subscription.update({
          where: { stripeSubscriptionId },
          data: {
            status: "CANCELLED",
            cancelAtPeriodEnd: false,
          },
        });

        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
