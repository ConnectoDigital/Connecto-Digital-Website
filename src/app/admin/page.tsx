"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Users,
  FileText,
  DollarSign,
  Zap,
  Loader2,
} from "lucide-react";

interface StatsData {
  totalClients: number;
  activeSubscriptions: number;
  openRequests: number;
  mrr: number;
  recentActivity: {
    id: string;
    title: string;
    status: string;
    projectName: string;
    updatedAt: string;
  }[];
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function isOverdue(dateStr: string): boolean {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return new Date(dateStr).getTime() < sevenDaysAgo;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 font-mono-accent text-sm text-white/40">
            Overview of platform activity and metrics.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
        <div className="flex h-40 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-white/20" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 font-mono-accent text-sm text-white/40">
            Overview of platform activity and metrics.
          </p>
        </div>
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-red-400/60">
            {error || "FAILED TO LOAD DASHBOARD DATA"}
          </p>
        </div>
      </div>
    );
  }

  const overdueRequests = stats.recentActivity.filter(
    (a) => a.status === "PENDING" && isOverdue(a.updatedAt)
  );

  const kpiCards = [
    {
      label: "MRR",
      value: `$${stats.mrr.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "ACTIVE CLIENTS",
      value: String(stats.totalClients),
      icon: Users,
    },
    {
      label: "PENDING REQUESTS",
      value: String(stats.openRequests),
      icon: FileText,
    },
    {
      label: "ACTIVE SUBSCRIPTIONS",
      value: String(stats.activeSubscriptions),
      icon: Clock,
    },
  ];

  const quickStats = [
    { label: "TOTAL CLIENTS", value: String(stats.totalClients) },
    { label: "OPEN REQUESTS", value: String(stats.openRequests) },
    { label: "ACTIVE SUBSCRIPTIONS", value: String(stats.activeSubscriptions) },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 font-mono-accent text-sm text-white/40">
          Overview of platform activity and metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.1]"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-accent text-[11px] font-medium uppercase tracking-wider text-white/40">
                  {kpi.label}
                </span>
                <Icon size={16} className="text-[#FF541F]/60" />
              </div>
              <div className="mt-3 flex items-end gap-3">
                <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Placeholder Chart */}
      <div className="border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-6 font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-white/40">
          Monthly Recurring Revenue
        </h2>
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <div className="text-center">
            <DollarSign size={32} className="mx-auto mb-3 text-[#FF541F]/30" />
            <p className="text-3xl font-bold tracking-tight text-white">
              ${stats.mrr.toLocaleString()}
            </p>
            <p className="mt-2 font-mono-accent text-[11px] tracking-wider text-white/30">
              CURRENT MRR FROM {stats.activeSubscriptions} ACTIVE SUBSCRIPTION{stats.activeSubscriptions !== 1 ? "S" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Items Alert Banner */}
      {overdueRequests.length > 0 && (
        <div className="flex items-center gap-6 border border-white/[0.06] border-l-[#FF541F] border-l-[3px] bg-white/[0.02] px-6 py-4">
          <AlertTriangle size={18} className="shrink-0 text-[#FF541F]" />
          <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">
                <strong className="text-white">{overdueRequests.length} request{overdueRequests.length !== 1 ? "s" : ""}</strong> overdue (pending {">"} 7 days)
              </span>
              <Link
                href="/admin/requests"
                className="inline-flex items-center gap-1 border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F] transition-colors hover:bg-white/[0.05]"
              >
                View <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Client Activity Feed */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-4 font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Recent Activity
          </h2>
          <div className="space-y-0">
            {stats.recentActivity.length === 0 ? (
              <div className="flex h-20 items-center justify-center">
                <p className="font-mono-accent text-[12px] text-white/20">
                  NO RECENT ACTIVITY
                </p>
              </div>
            ) : (
              stats.recentActivity.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 py-3 ${
                    index !== stats.recentActivity.length - 1
                      ? "border-b border-white/[0.04]"
                      : ""
                  }`}
                >
                  <Zap
                    size={12}
                    className="mt-1 shrink-0 text-[#FF541F]/50"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-white/70">
                      <span className="font-medium text-white/90">{item.title}</span>
                      {" "}
                      <span className="text-white/40">in {item.projectName}</span>
                    </p>
                    <span className="font-mono-accent text-[10px] text-white/25">
                      {item.status.replace("_", " ")}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono-accent text-[10px] text-white/25">
                    {formatTimeAgo(item.updatedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-4 font-mono-accent text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Quick Stats
          </h2>
          <div className="space-y-0">
            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex items-center justify-between py-4 ${
                  index !== quickStats.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
                }`}
              >
                <span className="font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
