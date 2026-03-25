"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const plansData = [
  {
    name: "STARTER" as const,
    monthlyPrice: 2500,
    highlighted: false,
    label: "ONGOING WORK",
    features: [
      "One request at a time",
      "3-5 day turnaround",
      "Unlimited revisions",
      "Direct communication",
      "Pause or cancel anytime",
    ],
  },
  {
    name: "GROWTH" as const,
    monthlyPrice: 5000,
    highlighted: true,
    label: "MOST POPULAR",
    features: [
      "Two requests at a time",
      "2-4 day turnaround",
      "Priority support",
      "Everything in Starter",
      "Strategy & consulting included",
    ],
  },
  {
    name: "EMBEDDED" as const,
    monthlyPrice: 9000,
    highlighted: false,
    label: "FULL CAPACITY",
    features: [
      "Priority turnaround, 1-3 days",
      "Dedicated team member",
      "Near full-time availability",
      "Everything in Growth",
      "For heavy build phases",
    ],
  },
];

export default function GetStartedPage() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const status = isLoading ? "loading" : session ? "authenticated" : "unauthenticated";
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const plans = plansData.map((p) => ({
    ...p,
    price:
      billing === "annual"
        ? `$${Math.round(p.monthlyPrice * 0.8).toLocaleString()}`
        : `$${p.monthlyPrice.toLocaleString()}`,
  }));

  async function handleSelectPlan(plan: "STARTER" | "GROWTH" | "EMBEDDED") {
    if (status !== "authenticated") {
      router.push(`/auth/signup?plan=${plan}`);
      return;
    }

    setLoadingPlan(plan);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoadingPlan(null);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight">
            connecto
          </Link>
          {status === "authenticated" ? (
            <span className="font-mono-accent text-xs text-white/40">
              {session?.user?.email}
            </span>
          ) : (
            <Link
              href="/auth/signin"
              className="font-mono-accent text-xs text-white/60 hover:text-white transition-colors"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between mb-16 md:mb-20"
        >
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Choose your
              <br />
              plan.
            </h1>
            <p className="text-white/40 text-sm mt-4 max-w-md">
              Select the plan that fits your needs. All plans include unlimited
              revisions and direct communication with your team.
            </p>
          </div>
          <span className="hidden md:block font-mono-accent text-xs text-primary tracking-wider">
            // GET STARTED
          </span>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-center gap-0 mb-12"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`font-mono-accent text-xs tracking-wider px-6 py-2.5 border transition-all duration-200 ${
              billing === "monthly"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/40 border-white/10 hover:text-white/60"
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`font-mono-accent text-xs tracking-wider px-6 py-2.5 border border-l-0 transition-all duration-200 ${
              billing === "annual"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/40 border-white/10 hover:text-white/60"
            }`}
          >
            ANNUAL
            <span className="ml-2 text-[10px] text-primary font-bold">-20%</span>
          </button>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 md:p-10 border ${
                plan.highlighted
                  ? "bg-white/[0.06] text-white border-white/10"
                  : "bg-white/[0.02] text-white border-white/5"
              } ${i === 0 ? "md:rounded-l-lg" : ""} ${
                i === plans.length - 1 ? "md:rounded-r-lg" : ""
              } ${plan.highlighted ? "rounded-lg md:rounded-none" : ""}`}
            >
              {/* Plan name */}
              <div className="flex items-center gap-2 mb-8">
                <span className="w-2.5 h-2.5 bg-primary" />
                <span className="font-mono-accent text-xs tracking-wider">
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div className="mb-10">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span
                  className={`text-sm ml-2 ${
                    plan.highlighted ? "text-white/40" : "text-white/30"
                  }`}
                >
                  / month
                </span>
              </div>

              {/* Features */}
              <div className="space-y-0 mb-10">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className={`py-3 border-b text-sm ${
                      plan.highlighted
                        ? "border-white/10 text-white/80"
                        : "border-white/5 text-white/60"
                    }`}
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* Label */}
              <p
                className={`font-mono-accent text-[10px] tracking-wider mb-2 ${
                  plan.highlighted ? "text-white/30" : "text-white/30"
                }`}
              >
                {plan.label}
              </p>

              {/* Spots left */}
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-primary" />
                <span
                  className={`font-mono-accent text-[10px] tracking-wider ${
                    plan.highlighted ? "text-white/40" : "text-white/30"
                  }`}
                >
                  ONLY 3 SPOTS LEFT
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSelectPlan(plan.name)}
                disabled={loadingPlan !== null}
                className="inline-flex items-center gap-0 cursor-pointer disabled:opacity-50"
              >
                <span className="font-mono-accent text-sm px-5 py-2.5 border border-white text-white hover:bg-white hover:text-black transition-all duration-300">
                  {loadingPlan === plan.name ? "LOADING..." : "GET STARTED"}
                </span>
                <span className="w-10 h-[42px] border border-white border-l-0 flex items-center justify-center text-lg text-white hover:bg-white hover:text-black transition-all duration-300">
                  +
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-12 max-w-2xl mx-auto"
        >
          Need a defined project? Connecto also builds fixed-scope projects
          starting from $5,000. Contact us for a custom quote.
        </motion.p>
      </div>
    </main>
  );
}
