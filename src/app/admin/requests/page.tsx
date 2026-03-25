"use client";

import { useEffect, useState, useMemo } from "react";
import { Search } from "lucide-react";

interface RequestRow {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project: { id: string; name: string };
}

const requestStatusOptions = [
  "PENDING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "CANCELLED",
];

const priorityOptions = ["LOW", "NORMAL", "HIGH", "URGENT"];

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/15 text-blue-400",
  IN_REVIEW: "bg-purple-500/15 text-purple-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-400",
};

const priorityColor: Record<string, string> = {
  LOW: "text-white/30",
  NORMAL: "text-white/50",
  HIGH: "text-orange-400",
  URGENT: "text-red-400",
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("/api/admin/requests");
        if (!res.ok) throw new Error("Failed to fetch requests");
        const data = await res.json();
        setRequests(data.requests ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load requests");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.userId.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" || r.status === filterStatus;
      const matchesPriority =
        filterPriority === "ALL" || r.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, search, filterStatus, filterPriority]);

  async function updateStatus(requestId: string, status: string) {
    setUpdatingId(requestId);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error("Failed to update request status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Requests</h1>
        <p className="mt-1 font-mono-accent text-sm text-white/40">
          All requests across every client and project.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search by title, project, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF541F]/40"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono-accent text-xs tracking-wider text-white/70 outline-none transition-colors focus:border-[#FF541F]/40"
        >
          <option value="ALL">ALL STATUS</option>
          {requestStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono-accent text-xs tracking-wider text-white/70 outline-none transition-colors focus:border-[#FF541F]/40"
        >
          <option value="ALL">All Priority</option>
          {priorityOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-red-400/60">{error}</p>
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="overflow-hidden border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-white/30"
                  >
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white/80">
                      {req.title}
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40">
                      {req.project?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-white/40 font-mono">
                      {req.userId.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${
                          priorityColor[req.priority] ?? ""
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={req.status}
                          onChange={(e) => updateStatus(req.id, e.target.value)}
                          disabled={updatingId === req.id}
                          className={`rounded border-0 px-2 py-1 text-xs font-medium outline-none ${
                            statusColor[req.status] ?? "bg-white/[0.06] text-white/40"
                          } ${updatingId === req.id ? "opacity-50" : ""}`}
                        >
                          {requestStatusOptions.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-[#0a0a0a] text-white"
                            >
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white/30">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
