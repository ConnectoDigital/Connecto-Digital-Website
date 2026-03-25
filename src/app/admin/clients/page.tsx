"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Users,
  Plus,
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
} from "lucide-react";

interface Client {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
  } | null;
  _count: {
    projects: number;
  };
}

const planLabels: Record<string, { label: string; color: string }> = {
  STARTER: { label: "STARTER", color: "text-white/60" },
  GROWTH: { label: "GROWTH", color: "text-[#FF541F]" },
  EMBEDDED: { label: "EMBEDDED", color: "text-purple-400" },
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  ACTIVE: { label: "ACTIVE", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  PAUSED: { label: "PAUSED", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: PauseCircle },
  CANCELLED: { label: "CANCELLED", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle },
  PAST_DUE: { label: "PAST DUE", color: "text-orange-400", bg: "bg-orange-500/10", icon: AlertCircle },
};

type StatusTab = "ALL" | "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE";
type PlanFilter = "ALL" | "STARTER" | "GROWTH" | "EMBEDDED";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [planFilter, setPlanFilter] = useState<PlanFilter>("ALL");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/clients");
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data.clients ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load clients");
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        !search ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusTab === "ALL" || c.subscription?.status === statusTab;
      const matchesPlan =
        planFilter === "ALL" || c.subscription?.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clients, search, statusTab, planFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: clients.length };
    clients.forEach((c) => {
      const s = c.subscription?.status ?? "NONE";
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [clients]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            Clients
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {clients.length} TOTAL · {statusCounts["ACTIVE"] || 0} ACTIVE
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            <Plus size={14} />
            ADD CLIENT
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          placeholder="Search by user ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-white/30 outline-none focus:border-[#FF541F]/40"
        />
      </div>

      {/* Status tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="flex gap-0">
          {(["ALL", "ACTIVE", "PAUSED", "PAST_DUE", "CANCELLED"] as StatusTab[]).map(
            (tab) => {
              const count = statusCounts[tab] || 0;
              const cfg = tab !== "ALL" ? statusConfig[tab] : null;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`relative px-6 py-3 font-mono-accent text-[12px] tracking-wider transition-colors flex items-center gap-2 ${
                    statusTab === tab
                      ? "text-white"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {cfg && <cfg.icon size={13} />}
                  {tab === "ALL" ? `ALL (${count})` : `${cfg?.label} (${count})`}
                  {statusTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF541F]" />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Plan filter */}
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
            {p === "ALL" ? "ALL PLANS" : planLabels[p].label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-red-400/60">{error}</p>
        </div>
      )}

      {/* Client cards grid */}
      {!error && loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : !error && filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client, index) => (
            <ClientCard key={client.id} client={client} index={index} />
          ))}
        </div>
      ) : !error ? (
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-white/20">
            NO CLIENTS FOUND
          </p>
        </div>
      ) : null}
    </div>
  );
}

/* ============ CLIENT CARD ============ */
function ClientCard({ client, index }: { client: Client; index: number }) {
  const plan = client.subscription?.plan ?? "NONE";
  const status = client.subscription?.status ?? "NONE";
  const cfg = statusConfig[status];
  const planCfg = planLabels[plan];

  const displayName = client.name ?? `Client #${index + 1}`;
  const displayIdentifier = client.email ?? client.id;

  return (
    <Link
      href={`/admin/clients/${client.id}`}
      className="group border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.03] hover:border-white/[0.1]"
    >
      {/* Top row: avatar + status */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center bg-[#FF541F]/10">
          <Users size={18} className="text-[#FF541F]" />
        </div>
        {cfg ? (
          <span
            className={`px-2.5 py-0.5 font-mono-accent text-[10px] font-medium tracking-wider ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 font-mono-accent text-[10px] font-medium tracking-wider bg-white/[0.06] text-white/40">
            NO SUB
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="mb-1 text-[15px] font-semibold text-white">
        {displayName}
      </h3>

      {/* Plan */}
      <div className="flex items-center gap-2 mb-2">
        {planCfg ? (
          <span className={`font-mono-accent text-[9px] tracking-wider ${planCfg.color}`}>
            {planCfg.label}
          </span>
        ) : (
          <span className="font-mono-accent text-[9px] tracking-wider text-white/30">
            NO PLAN
          </span>
        )}
      </div>

      {/* Identifier */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="font-mono-accent text-[11px] text-white/30 truncate">
          {displayIdentifier}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 border-t border-white/[0.04] pt-3 font-mono-accent text-[10px] tracking-wider text-white/20">
        <span className="flex items-center gap-1.5">
          <FolderKanban size={11} />
          {client._count.projects} PROJECT{client._count.projects !== 1 ? "S" : ""}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {new Date(client.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Action */}
      <div className="mt-3 flex items-center gap-2 font-mono-accent text-[10px] tracking-wider text-white/10 group-hover:text-[#FF541F]/60 transition-colors">
        MANAGE CLIENT
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}
