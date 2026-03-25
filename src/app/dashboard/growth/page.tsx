"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Check,
  ArrowUpRight,
  DollarSign,
  Star,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "one-time" | "monthly" | "per-project";
  category: string;
  features: string[];
  popular?: boolean;
}

// These would come from admin-managed services via API
const availableServices: Service[] = [
  {
    id: "1",
    name: "Custom Website",
    description: "Full responsive website design and development",
    price: 3500,
    period: "one-time",
    category: "WEBSITE",
    features: ["Custom Design", "Mobile Responsive", "SEO Optimized", "CMS Integration"],
  },
  {
    id: "2",
    name: "Web Application",
    description: "Custom web app with backend, API, and database",
    price: 8000,
    period: "per-project",
    category: "DEVELOPMENT",
    features: ["Custom Backend", "Database Design", "API Development", "User Auth"],
    popular: true,
  },
  {
    id: "3",
    name: "Monthly Website Maintenance",
    description: "Updates, backups, security monitoring, and bug fixes",
    price: 500,
    period: "monthly",
    category: "MAINTENANCE",
    features: ["Weekly Updates", "Security Monitoring", "Performance Reports", "Priority Support"],
  },
  {
    id: "4",
    name: "Social Media Marketing",
    description: "Monthly content creation, scheduling, and analytics",
    price: 1500,
    period: "monthly",
    category: "MARKETING",
    features: ["Content Calendar", "Post Design", "Analytics Reports", "Community Management"],
    popular: true,
  },
  {
    id: "5",
    name: "SEO Optimization",
    description: "On-page SEO, technical audit, and monthly reporting",
    price: 800,
    period: "monthly",
    category: "MARKETING",
    features: ["Technical Audit", "Keyword Research", "On-page SEO", "Monthly Reports"],
  },
];

const CATEGORIES = ["ALL", "WEBSITE", "DEVELOPMENT", "MAINTENANCE", "MARKETING"];

const categoryColors: Record<string, string> = {
  WEBSITE: "text-blue-400",
  DEVELOPMENT: "text-[#FF541F]",
  MAINTENANCE: "text-emerald-400",
  MARKETING: "text-purple-400",
  AUTOMATION: "text-amber-400",
};

export default function GrowthPage() {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL"
      ? availableServices
      : availableServices.filter((s) => s.category === filter);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center bg-[#FF541F]/10">
            <Zap size={18} className="text-[#FF541F]" />
          </div>
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight text-white">
              Grow Your Business
            </h2>
            <p className="font-mono-accent text-[11px] tracking-wider text-white/30">
              ADD-ON SERVICES TO ACCELERATE YOUR GROWTH
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/40 max-w-lg">
          Explore additional services to complement your current plan. Request
          any service below and we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
              c !== "ALL" ? "border-l-0" : ""
            } ${
              filter === c
                ? "bg-white/5 text-white"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {c === "ALL" ? "ALL SERVICES" : c}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="group border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.1] hover:bg-white/[0.03] transition-all relative"
          >
            {/* Popular badge */}
            {service.popular && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#FF541F]/10 px-2.5 py-1 font-mono-accent text-[9px] tracking-wider text-[#FF541F]">
                <Star size={9} fill="currentColor" />
                POPULAR
              </div>
            )}

            {/* Category */}
            <span
              className={`font-mono-accent text-[9px] tracking-wider ${
                categoryColors[service.category] || "text-white/30"
              }`}
            >
              {service.category}
            </span>

            {/* Name + Description */}
            <h3 className="mt-2 text-[17px] font-semibold text-white">
              {service.name}
            </h3>
            <p className="mt-1 text-[13px] text-white/35 leading-relaxed">
              {service.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-1 mt-4 mb-5">
              <DollarSign size={16} className="text-white/30" />
              <span className="text-[32px] font-bold text-white tracking-tight">
                {service.price.toLocaleString()}
              </span>
              <span className="font-mono-accent text-[10px] text-white/25 tracking-wider ml-1">
                {service.period === "one-time"
                  ? "ONE-TIME"
                  : service.period === "monthly"
                    ? "/ MONTH"
                    : "/ PROJECT"}
              </span>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check size={12} className="text-[#FF541F] shrink-0" />
                  <span className="text-[13px] text-white/50">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={`/dashboard/requests?new=true&service=${encodeURIComponent(service.name)}`}
              className="inline-flex items-center gap-0 w-full"
            >
              <span className="flex-1 text-center font-mono-accent text-[12px] border border-white/[0.08] text-white/60 py-2.5 tracking-wider hover:bg-white/[0.04] hover:text-white transition-colors">
                REQUEST THIS SERVICE
              </span>
              <span className="w-10 h-[42px] border border-white/[0.08] border-l-0 text-white/40 flex items-center justify-center hover:bg-white/[0.04] hover:text-white transition-colors">
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Custom service CTA */}
      <div className="border border-dashed border-white/[0.08] p-8 text-center">
        <p className="text-white/50 text-sm mb-1">
          Don&apos;t see what you need?
        </p>
        <p className="text-white/25 text-[13px] mb-4">
          We build custom solutions tailored to your business.
        </p>
        <Link
          href="/dashboard/requests?new=true"
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors tracking-wider">
            REQUEST CUSTOM SERVICE
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </Link>
      </div>
    </div>
  );
}
