"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Building2,
  Globe,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface ClientDetail {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  subscription: {
    id: string;
    plan: string;
    status: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  projects: {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    _count: { requests: number };
  }[];
  requests: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
    project: { name: string };
  }[];
  onboarding: {
    step: number;
    completed: boolean;
    companyName: string | null;
    website: string | null;
    industry: string | null;
    projectGoals: string | null;
    techStack: string | null;
  } | null;
}

const requestStatusOptions = [
  "PENDING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "CANCELLED",
];

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

const projectStatusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  COMPLETED: "bg-blue-500/15 text-blue-400",
  ON_HOLD: "bg-yellow-500/15 text-yellow-400",
  ARCHIVED: "bg-white/[0.06] text-white/40",
};

export default function AdminClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/admin/clients/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setClient(data.client);
        }
      } catch (error) {
        console.error("Failed to fetch client:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [clientId]);

  async function updateRequestStatus(requestId: string, status: string) {
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      if (res.ok && client) {
        setClient({
          ...client,
          requests: client.requests.map((r) =>
            r.id === requestId ? { ...r, status } : r
          ),
        });
      }
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/[0.04]" />
        <div className="h-64 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/40">Client not found.</p>
        <Link
          href="/admin/clients"
          className="mt-4 text-sm text-[#FF541F] hover:underline"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  const onboardingSteps = [
    "Company Info",
    "Brand & Design",
    "Project Goals",
    "Technical Details",
    "Communication",
  ];

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/60"
      >
        <ArrowLeft size={14} />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {client.name ?? "Unnamed Client"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> {client.email}
            </span>
            {client.onboarding?.companyName && (
              <span className="flex items-center gap-1.5">
                <Building2 size={13} /> {client.onboarding.companyName}
              </span>
            )}
            {client.onboarding?.website && (
              <span className="flex items-center gap-1.5">
                <Globe size={13} /> {client.onboarding.website}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />{" "}
              Joined{" "}
              {new Date(client.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Subscription Info */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
            Subscription
          </h2>
          {client.subscription ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">Plan</span>
                <span className="text-sm font-medium">
                  {client.subscription.plan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/40">Status</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    client.subscription.status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {client.subscription.status}
                </span>
              </div>
              {client.subscription.currentPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Renews</span>
                  <span className="text-sm text-white/60">
                    {new Date(
                      client.subscription.currentPeriodEnd
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {client.subscription.cancelAtPeriodEnd && (
                <p className="mt-2 rounded bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  Cancels at end of period
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-white/30">No active subscription.</p>
          )}
        </div>

        {/* Onboarding Status */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
            Onboarding
          </h2>
          {client.onboarding ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {client.onboarding.completed ? (
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                    Completed
                  </span>
                ) : (
                  <span className="rounded bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">
                    Step {client.onboarding.step} of {onboardingSteps.length}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {onboardingSteps.map((step, i) => (
                  <div key={step} className="flex flex-1 items-center gap-2">
                    {i + 1 <= (client.onboarding?.step ?? 0) ? (
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                    ) : (
                      <Circle size={14} className="shrink-0 text-white/20" />
                    )}
                    <span className="text-xs text-white/40">{step}</span>
                  </div>
                ))}
              </div>
              {client.onboarding.industry && (
                <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/30">Industry:</span>{" "}
                    <span className="text-white/60">
                      {client.onboarding.industry}
                    </span>
                  </div>
                  {client.onboarding.techStack && (
                    <div>
                      <span className="text-white/30">Tech Stack:</span>{" "}
                      <span className="text-white/60">
                        {client.onboarding.techStack}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-white/30">Onboarding not started.</p>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
          Projects ({client.projects.length})
        </h2>
        {client.projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {client.projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-4"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-white/80">
                    {project.name}
                  </h3>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                      projectStatusColor[project.status] ?? ""
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-2 font-mono-accent text-xs text-white/30">
                  {project._count.requests} request
                  {project._count.requests !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/30">No projects yet.</p>
        )}
      </div>

      {/* Requests */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
          Requests ({client.requests.length})
        </h2>
        {client.requests.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-white/[0.04]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    Title
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    Project
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    Priority
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-white/30">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {client.requests.map((req) => (
                  <tr key={req.id} className="transition-colors hover:bg-white/[0.01]">
                    <td className="px-4 py-3 text-sm text-white/70">
                      {req.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">
                      {req.project.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          priorityColor[req.priority] ?? ""
                        }`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={req.status}
                        onChange={(e) =>
                          updateRequestStatus(req.id, e.target.value)
                        }
                        className={`rounded border-0 px-2 py-1 text-xs font-medium outline-none ${
                          statusColor[req.status] ?? "bg-white/[0.06] text-white/40"
                        }`}
                      >
                        {requestStatusOptions.map((s) => (
                          <option key={s} value={s} className="bg-[#0a0a0a] text-white">
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-white/30">No requests yet.</p>
        )}
      </div>
    </div>
  );
}
