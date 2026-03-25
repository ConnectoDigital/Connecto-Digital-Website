"use client";

import { useEffect, useState, useMemo } from "react";
import {
  UserCog,
  Shield,
  ShieldCheck,
  Search,
} from "lucide-react";

interface UserRow {
  id: string;
  userId: string;
  role: "ADMIN" | "CLIENT";
  createdAt: string;
  updatedAt: string;
  subscription?: {
    plan: string;
    status: string;
  } | null;
  _count?: {
    projects: number;
  };
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-[#FF541F]/10 text-[#FF541F]",
  CLIENT: "bg-blue-500/10 text-blue-400",
};

const roleIcons: Record<string, typeof Shield> = {
  ADMIN: ShieldCheck,
  CLIENT: UserCog,
};

type RoleFilter = "ALL" | "ADMIN" | "CLIENT";

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search || u.userId.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  async function updateRole(userId: string, role: "ADMIN" | "CLIENT") {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.userId === userId ? { ...u, role } : u))
        );
      } else {
        const data = await res.json();
        console.error("Failed to update role:", data.error);
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            User Management
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {users.length} USERS
          </p>
        </div>
      </div>

      {/* Search + Role filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user ID..."
            className="w-full border border-white/[0.06] bg-white/[0.02] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-0">
          {(["ALL", "ADMIN", "CLIENT"] as RoleFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`whitespace-nowrap px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                r !== "ALL" ? "border-l-0" : ""
              } ${
                roleFilter === r
                  ? "bg-white/5 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {r}
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

      {/* User table */}
      {!error && (
        <div className="border border-white/[0.06] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
            <span className="col-span-4 font-mono-accent text-[10px] tracking-wider text-white/30">USER ID</span>
            <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">ROLE</span>
            <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">SUBSCRIPTION</span>
            <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">JOINED</span>
            <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30 text-right">CHANGE ROLE</span>
          </div>

          {/* Loading state */}
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-5 py-4 border-b border-white/[0.04]">
                <div className="h-4 w-full animate-pulse bg-white/[0.04]" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-white/30">
              No users found.
            </div>
          ) : (
            /* Rows */
            filtered.map((user) => {
              const RoleIcon = roleIcons[user.role] || UserCog;
              const isUpdating = updatingId === user.userId;
              return (
                <div
                  key={user.id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  {/* User info */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#FF541F]/10 text-[12px] font-bold text-[#FF541F]">
                      <UserCog size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-white font-mono">
                        {user.userId.slice(0, 20)}...
                      </p>
                      <p className="truncate text-[11px] text-white/20 font-mono">
                        ID: {user.id.slice(0, 12)}
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono-accent text-[10px] tracking-wider ${roleColors[user.role]}`}>
                      <RoleIcon size={11} />
                      {user.role}
                    </span>
                  </div>

                  {/* Subscription */}
                  <div className="col-span-2">
                    {user.subscription ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono-accent text-[10px] tracking-wider text-white/50">
                          {user.subscription.plan}
                        </span>
                        <span className={`font-mono-accent text-[9px] tracking-wider ${
                          user.subscription.status === "ACTIVE" ? "text-emerald-400" : "text-yellow-400"
                        }`}>
                          {user.subscription.status}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono-accent text-[10px] tracking-wider text-white/20">
                        NONE
                      </span>
                    )}
                  </div>

                  {/* Joined */}
                  <div className="col-span-2">
                    <span className="font-mono-accent text-[11px] text-white/30">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Change Role */}
                  <div className="col-span-2 flex justify-end">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.userId, e.target.value as "ADMIN" | "CLIENT")}
                      disabled={isUpdating}
                      className={`border border-white/[0.08] bg-[#0a0a0a] px-3 py-1.5 font-mono-accent text-[10px] tracking-wider text-white/60 outline-none transition-colors hover:border-white/20 focus:border-[#FF541F]/40 ${
                        isUpdating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="CLIENT" className="bg-[#0a0a0a]">CLIENT</option>
                      <option value="ADMIN" className="bg-[#0a0a0a]">ADMIN</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
