"use client";

import { useEffect, useState, useMemo } from "react";
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";

interface SubscriptionRow {
  id: string;
  userId: string;
  plan: string;
  status: string;
  stripeSubscriptionId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

const planPrices: Record<string, number> = {
  STARTER: 25,
  GROWTH: 50,
  EMBEDDED: 90,
};

const planColor: Record<string, string> = {
  STARTER: "bg-white/[0.06] text-white/60",
  GROWTH: "bg-[#FF541F]/15 text-[#FF541F]",
  EMBEDDED: "bg-purple-500/15 text-purple-400",
};

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  PAUSED: "bg-yellow-500/15 text-yellow-400",
  CANCELLED: "bg-red-500/15 text-red-400",
  PAST_DUE: "bg-orange-500/15 text-orange-400",
};

type StatusFilter = "ALL" | "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE";
type PlanFilter = "ALL" | "STARTER" | "GROWTH" | "EMBEDDED";

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("ALL");

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await fetch("/api/admin/subscriptions");
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        const data = await res.json();
        setSubs(data.subscriptions ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  const filtered = useMemo(() => {
    return subs.filter((s) => {
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      const matchesPlan = planFilter === "ALL" || s.plan === planFilter;
      return matchesStatus && matchesPlan;
    });
  }, [subs, statusFilter, planFilter]);

  const totalMRR = subs
    .filter((s) => s.status === "ACTIVE")
    .reduce((sum, s) => sum + (planPrices[s.plan] || 0), 0);
  const activeCount = subs.filter((s) => s.status === "ACTIVE").length;

  const stats = [
    {
      label: "Monthly Recurring Revenue",
      value: `$${totalMRR.toLocaleString()}`,
      icon: DollarSign,
      color: "#22C55E",
    },
    {
      label: "Active Subscriptions",
      value: activeCount,
      icon: TrendingUp,
      color: "#FF541F",
    },
    {
      label: "Total Subscriptions",
      value: subs.length,
      icon: Users,
      color: "#A78BFA",
    },
    {
      label: "Avg. Revenue / Sub",
      value: `$${activeCount ? Math.round(totalMRR / activeCount).toLocaleString() : 0}`,
      icon: CreditCard,
      color: "#FACC15",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscriptions</h1>
          <p className="mt-1 font-mono-accent text-sm text-white/40">
            Manage billing, plans, and revenue.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono-accent text-[11px] font-medium uppercase tracking-wider text-white/30">
                  {stat.label}
                </span>
                <div
                  className="flex h-8 w-8 items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {(["ALL", "ACTIVE", "PAUSED", "CANCELLED", "PAST_DUE"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                s !== "ALL" ? "border-l-0" : ""
              } ${
                statusFilter === s
                  ? "bg-white/5 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {s === "ALL" ? "ALL STATUS" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {(["ALL", "STARTER", "GROWTH", "EMBEDDED"] as PlanFilter[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                p !== "ALL" ? "border-l-0" : ""
              } ${
                planFilter === p
                  ? "bg-white/5 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {p === "ALL" ? "ALL PLANS" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-red-400/60">{error}</p>
        </div>
      )}

      {/* Subscriptions table */}
      {!error && (
        <div className="overflow-x-auto border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  User
                </th>
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  Plan
                </th>
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  Amount
                </th>
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  Period End
                </th>
                <th className="px-6 py-3 text-left font-mono-accent text-xs font-semibold uppercase tracking-wider text-white/40">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 w-full animate-pulse bg-white/[0.04]" />
                      </td>
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-white/30">
                        No subscriptions found.
                      </td>
                    </tr>
                  )
                : filtered.map((sub) => (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white/80 font-mono">
                          {sub.userId.slice(0, 16)}...
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 font-mono-accent text-[10px] font-bold tracking-wider ${
                            planColor[sub.plan] ?? ""
                          }`}
                        >
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-medium text-white/70">
                        ${(planPrices[sub.plan] || 0).toLocaleString()}/mo
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 font-mono-accent text-[10px] font-medium ${
                            statusBadge[sub.status] ?? ""
                          }`}
                        >
                          {sub.status.replace("_", " ")}
                        </span>
                        {sub.cancelAtPeriodEnd && (
                          <span className="ml-2 font-mono-accent text-[9px] text-orange-400">
                            CANCELS AT END
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-white/30">
                        {sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-white/30">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
