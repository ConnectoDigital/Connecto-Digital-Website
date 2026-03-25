"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  DollarSign,
  Tag,
  Zap,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "one-time" | "monthly" | "per-project";
  category: string;
  features: string[];
  active: boolean;
  popular?: boolean;
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Custom Website",
    description: "Full responsive website design and development",
    price: 3500,
    period: "one-time",
    category: "WEBSITE",
    features: ["Custom Design", "Mobile Responsive", "SEO Optimized", "CMS Integration"],
    active: true,
  },
  {
    id: "2",
    name: "Web Application",
    description: "Custom web app with backend, API, and database",
    price: 8000,
    period: "per-project",
    category: "DEVELOPMENT",
    features: ["Custom Backend", "Database Design", "API Development", "User Auth"],
    active: true,
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
    active: true,
  },
  {
    id: "4",
    name: "Social Media Marketing",
    description: "Monthly content creation, scheduling, and analytics",
    price: 1500,
    period: "monthly",
    category: "MARKETING",
    features: ["Content Calendar", "Post Design", "Analytics Reports", "Community Management"],
    active: true,
  },
  {
    id: "5",
    name: "SEO Optimization",
    description: "On-page SEO, technical audit, and monthly reporting",
    price: 800,
    period: "monthly",
    category: "MARKETING",
    features: ["Technical Audit", "Keyword Research", "On-page SEO", "Monthly Reports"],
    active: true,
  },
  {
    id: "6",
    name: "Automation Setup",
    description: "Custom workflow automations with Zapier, Make, or N8N",
    price: 2000,
    period: "per-project",
    category: "AUTOMATION",
    features: ["Workflow Design", "API Integrations", "Testing", "Documentation"],
    active: false,
  },
];

const CATEGORIES = ["ALL", "WEBSITE", "DEVELOPMENT", "MAINTENANCE", "MARKETING", "AUTOMATION"];

export default function ServicesPage() {
  const [services, setServices] = useState(mockServices);
  const [filter, setFilter] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = filter === "ALL" ? services : services.filter((s) => s.category === filter);

  function toggleActive(id: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }

  function togglePopular(id: string) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, popular: !s.popular } : s))
    );
  }

  function deleteService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            Services & Pricing
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {services.filter((s) => s.active).length} ACTIVE · {services.filter((s) => !s.active).length} INACTIVE — SHOWN ON CLIENT GROWTH TAB
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            <Plus size={14} />
            NEW SERVICE
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
              c !== "ALL" ? "border-l-0" : ""
            } ${filter === c ? "bg-white/5 text-white" : "text-white/30 hover:text-white/50"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            setServices((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                name: data.get("name") as string,
                description: data.get("description") as string,
                price: Number(data.get("price")),
                period: data.get("period") as Service["period"],
                category: data.get("category") as string,
                features: (data.get("features") as string).split(",").map((f) => f.trim()).filter(Boolean),
                active: true,
              },
            ]);
            setShowAdd(false);
            form.reset();
          }}
          className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-4"
        >
          <h3 className="font-mono-accent text-[11px] tracking-wider text-white/40">
            CREATE NEW SERVICE
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="name" placeholder="Service Name" required className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="price" type="number" placeholder="Price ($)" required className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="description" placeholder="Short description" required className="col-span-2 border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <select name="period" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:outline-none">
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="per-project">Per Project</option>
            </select>
            <select name="category" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:outline-none">
              {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input name="features" placeholder="Features (comma separated)" className="col-span-2 border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider">CREATE</button>
            <button type="button" onClick={() => setShowAdd(false)} className="font-mono-accent text-[12px] border border-white/[0.06] px-5 py-2.5 tracking-wider text-white/40 hover:text-white transition-colors">CANCEL</button>
          </div>
        </form>
      )}

      {/* Services grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((service) => (
          <div
            key={service.id}
            className={`border p-5 transition-colors ${
              service.active
                ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03]"
                : "border-white/[0.03] bg-white/[0.01] opacity-50"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center bg-[#FF541F]/10">
                  <DollarSign size={14} className="text-[#FF541F]" />
                </div>
                <span className="font-mono-accent text-[9px] tracking-wider text-white/20 bg-white/5 px-2 py-0.5">
                  {service.category}
                </span>
                {service.popular && (
                  <span className="font-mono-accent text-[9px] tracking-wider text-[#FF541F] bg-[#FF541F]/10 px-2 py-0.5 flex items-center gap-1">
                    <Zap size={8} /> POPULAR
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePopular(service.id)}
                  className={`p-1.5 transition-colors ${service.popular ? "text-[#FF541F]" : "text-white/15 hover:text-white/40"}`}
                  title="Toggle popular"
                >
                  <Zap size={13} />
                </button>
                <button
                  onClick={() => toggleActive(service.id)}
                  className={`p-1.5 transition-colors ${service.active ? "text-emerald-400" : "text-white/15 hover:text-white/40"}`}
                  title={service.active ? "Deactivate" : "Activate"}
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-1.5 text-white/15 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <h3 className="text-[15px] font-semibold text-white mb-1">{service.name}</h3>
            <p className="text-[13px] text-white/30 mb-3">{service.description}</p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-[28px] font-bold text-white">
                ${service.price.toLocaleString()}
              </span>
              <span className="font-mono-accent text-[10px] text-white/30 tracking-wider">
                / {service.period === "one-time" ? "ONE-TIME" : service.period === "monthly" ? "MONTH" : "PROJECT"}
              </span>
            </div>

            <div className="space-y-1.5">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={10} className="text-[#FF541F] shrink-0" />
                  <span className="text-[12px] text-white/40">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
