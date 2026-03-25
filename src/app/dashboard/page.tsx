"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  CheckCircle2,
  CreditCard,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface RecentActivity {
  id: string;
  title: string;
  status: string;
  projectName: string;
  updatedAt: string;
}

interface DashboardStats {
  activeProjects: number;
  pendingRequests: number;
  completedRequests: number;
  plan: string | null;
  subscriptionStatus: string | null;
  recentActivity: RecentActivity[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400" },
  IN_PROGRESS: { bg: "bg-blue-500/10", text: "text-blue-400" },
  IN_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  CANCELLED: { bg: "bg-white/5", text: "text-white/30" },
};

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Skeleton banner */}
        <div className="h-[72px] animate-pulse border border-white/[0.06] bg-white/[0.02]" />
        {/* Skeleton welcome */}
        <div className="space-y-2">
          <div className="h-6 w-64 animate-pulse bg-white/[0.04]" />
          <div className="h-4 w-48 animate-pulse bg-white/[0.03]" />
        </div>
        {/* Skeleton stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[100px] animate-pulse border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
        {/* Skeleton activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[240px] animate-pulse border border-white/[0.06] bg-white/[0.02]" />
          <div className="h-[240px] animate-pulse border border-white/[0.06] bg-white/[0.02] lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 p-5">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: FolderKanban,
      color: "#FF541F",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: FileText,
      color: "#FACC15",
    },
    {
      label: "Completed",
      value: stats.completedRequests,
      icon: CheckCircle2,
      color: "#22C55E",
    },
    {
      label: "Current Plan",
      value: stats.plan || "FREE",
      icon: CreditCard,
      color: "#A78BFA",
    },
  ];

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Plan Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#FF541F]/20 bg-[#FF541F]/[0.04] p-5">
        <div>
          <p className="font-mono-accent text-[11px] tracking-wider text-white/40 uppercase">
            Subscription
          </p>
          <p className="mt-1 text-[15px] font-semibold text-white">
            Your Plan:{" "}
            <span className="text-[#FF541F]">{stats.plan || "FREE"}</span>{" "}
            <span className="text-white/30">&mdash;</span>{" "}
            <span className="text-white/50 font-normal">
              {stats.subscriptionStatus === "ACTIVE"
                ? "Active"
                : stats.subscriptionStatus === "PAUSED"
                  ? "Paused"
                  : stats.subscriptionStatus === "CANCELLED"
                    ? "Cancelled"
                    : stats.subscriptionStatus === "PAST_DUE"
                      ? "Past Due"
                      : "No active subscription"}
            </span>
          </p>
        </div>
        <Link
          href="/get-started"
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            UPGRADE
          </span>
          <span className="w-10 h-[38px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>

      {/* Welcome */}
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-white">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}
        </h2>
        <p className="mt-1 text-[14px] text-white/40">
          Here&apos;s what&apos;s happening with your projects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono-accent text-[11px] uppercase tracking-wider text-white/30">
                  {card.label}
                </span>
                <div
                  className="flex h-8 w-8 items-center justify-center"
                  style={{ backgroundColor: `${card.color}10` }}
                >
                  <Icon size={16} style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-[28px] font-bold tracking-tight text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="font-mono-accent mb-5 text-[11px] uppercase tracking-wider text-white/40">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/requests?new=true"
              className="inline-flex items-center gap-0"
            >
              <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
                <Plus size={14} />
                NEW REQUEST
              </span>
              <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
                +
              </span>
            </Link>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-3 border border-white/[0.06] px-4 py-2.5 font-mono-accent text-[12px] tracking-wider text-white/60 transition-all hover:bg-white/[0.03] hover:text-white"
            >
              <FolderKanban size={14} />
              VIEW PROJECTS
              <ArrowRight size={12} className="ml-auto" />
            </Link>
            <Link
              href="/dashboard/requests"
              className="flex items-center gap-3 border border-white/[0.06] px-4 py-2.5 font-mono-accent text-[12px] tracking-wider text-white/60 transition-all hover:bg-white/[0.03] hover:text-white"
            >
              <FileText size={14} />
              ALL REQUESTS
              <ArrowRight size={12} className="ml-auto" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 border border-white/[0.06] px-4 py-2.5 font-mono-accent text-[12px] tracking-wider text-white/60 transition-all hover:bg-white/[0.03] hover:text-white"
            >
              <CreditCard size={14} />
              MANAGE BILLING
              <ArrowRight size={12} className="ml-auto" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-white/[0.06] bg-white/[0.02] p-6 lg:col-span-2">
          <h3 className="font-mono-accent mb-5 text-[11px] uppercase tracking-wider text-white/40">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity) => {
                const style = statusColors[activity.status] || statusColors.PENDING;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 border border-white/[0.04] bg-white/[0.01] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-white/[0.04]">
                      <FileText size={13} className="text-white/30" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-white">
                        {activity.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="truncate text-[12px] text-white/30">
                          {activity.projectName}
                        </p>
                        <span
                          className={`shrink-0 px-1.5 py-0.5 font-mono-accent text-[9px] uppercase tracking-wider ${style.bg} ${style.text}`}
                        >
                          {activity.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono-accent shrink-0 text-[10px] tracking-wider text-white/20">
                      {formatTimeAgo(activity.updatedAt)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex h-24 items-center justify-center">
                <p className="font-mono-accent text-[12px] text-white/20">
                  NO RECENT ACTIVITY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
