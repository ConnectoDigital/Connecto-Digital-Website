"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "STARTER",
    price: "$2,500",
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
    name: "GROWTH",
    price: "$5,000",
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
    name: "EMBEDDED",
    price: "$9,000",
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

export default function PricingSection() {
  return (
    <section className="py-24 md:py-32 bg-black text-white" id="pricing">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-start justify-between mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Simple, transparent
            <br />
            pricing.
          </h2>
          <span className="hidden md:block font-mono-accent text-xs text-primary tracking-wider">
            // PRICING
          </span>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                <span
                  className={`w-2.5 h-2.5 ${
                    plan.highlighted ? "bg-primary" : "bg-primary"
                  }`}
                />
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
                  plan.highlighted ? "text-white/30" : "text-black/30"
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
              <Link
                href="/get-started"
                className="inline-flex items-center gap-0"
              >
                <span
                  className={`font-mono-accent text-sm px-5 py-2.5 border transition-all duration-300 ${
                    plan.highlighted
                      ? "border-white text-white hover:bg-white hover:text-black"
                      : "border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  GET STARTED
                </span>
                <span
                  className={`w-10 h-[42px] border flex items-center justify-center text-lg transition-all duration-300 ${
                    plan.highlighted
                      ? "border-white text-white hover:bg-white hover:text-black border-l-0"
                      : "border-white text-white hover:bg-white hover:text-black border-l-0"
                  }`}
                >
                  +
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-white/30 text-sm mt-12 max-w-2xl mx-auto"
        >
          Need a defined project? Connecto also builds fixed-scope projects
          starting from $5,000. Contact us for a custom quote.
        </motion.p>
      </div>
    </section>
  );
}
