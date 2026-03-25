"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    requests: number;
  };
}

type PageTab = "ACTIVE" | "DONE";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTab, setPageTab] = useState<PageTab>("ACTIVE");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      setNewName("");
      setNewDesc("");
      setShowNewForm(false);
      await fetchProjects();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  const activeProjects = projects.filter((p) => p.status !== "COMPLETED");
  const doneProjects = projects.filter((p) => p.status === "COMPLETED");

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse bg-white/[0.04]" />
            <div className="h-4 w-48 animate-pulse bg-white/[0.03]" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[200px] animate-pulse border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            Projects
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {activeProjects.length} ACTIVE · {doneProjects.length} COMPLETED
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            <Plus size={14} />
            NEW PROJECT
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </button>
      </div>

      {/* Top-level tabs: Active / Done */}
      <div className="border-b border-white/[0.06]">
        <div className="flex gap-0">
          {(["ACTIVE", "DONE"] as PageTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setPageTab(tab)}
              className={`relative px-6 py-3 font-mono-accent text-[12px] tracking-wider transition-colors flex items-center gap-2 ${
                pageTab === tab
                  ? "text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab === "DONE" && <CheckCircle2 size={13} />}
              {tab === "ACTIVE"
                ? `ACTIVE (${activeProjects.length})`
                : `DONE (${doneProjects.length})`}
              {pageTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF541F]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <form
          onSubmit={handleCreate}
          className="border border-white/[0.06] bg-white/[0.02] p-6"
        >
          <h3 className="font-mono-accent mb-5 text-[11px] tracking-wider text-white/40">
            CREATE NEW PROJECT
          </h3>
          {createError && (
            <div className="mb-4 flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-2">
              <AlertCircle size={14} className="text-red-400" />
              <p className="text-[12px] text-red-400">{createError}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                PROJECT NAME
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Website Redesign"
                className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                DESCRIPTION
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief description of your project..."
                rows={3}
                className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-0"
              >
                <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider flex items-center gap-2">
                  {creating ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {creating ? "CREATING..." : "CREATE"}
                </span>
                <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10">
                  +
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="font-mono-accent text-[12px] border border-white/[0.06] px-5 py-2.5 tracking-wider text-white/40 hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ACTIVE TAB */}
      {pageTab === "ACTIVE" && (
        <>
          {activeProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
              <p className="font-mono-accent text-[12px] text-white/20">
                NO ACTIVE PROJECTS
              </p>
            </div>
          )}
        </>
      )}

      {/* DONE TAB */}
      {pageTab === "DONE" && (
        <>
          {doneProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {doneProjects.map((project) => (
                <ProjectCard key={project.id} project={project} done />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
              <p className="font-mono-accent text-[12px] text-white/20">
                NO COMPLETED PROJECTS
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============ PROJECT CARD ============ */
function ProjectCard({
  project,
  done,
}: {
  project: Project;
  done?: boolean;
}) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    ACTIVE: { bg: "bg-[#FF541F]/10", text: "text-[#FF541F]" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    ON_HOLD: { bg: "bg-amber-500/10", text: "text-amber-400" },
    ARCHIVED: { bg: "bg-white/5", text: "text-white/30" },
  };

  const style = statusColors[project.status] || statusColors.ACTIVE;

  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className={`group border bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.03] ${
        done
          ? "border-white/[0.04] hover:border-white/[0.08]"
          : "border-white/[0.06] hover:border-white/[0.1]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center bg-[#FF541F]/10">
          {done ? (
            <CheckCircle2 size={18} className="text-emerald-400" />
          ) : (
            <FolderKanban size={18} className="text-[#FF541F]" />
          )}
        </div>
        <span
          className={`px-2.5 py-0.5 font-mono-accent text-[10px] font-medium tracking-wider ${style.bg} ${style.text}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      <h3
        className={`mb-1 text-[15px] font-semibold ${done ? "text-white/60" : "text-white"}`}
      >
        {project.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-[13px] text-white/30">
        {project.description || "No description"}
      </p>

      <div className="flex items-center gap-4 border-t border-white/[0.04] pt-3 font-mono-accent text-[10px] tracking-wider text-white/20">
        <span className="flex items-center gap-1.5">
          <FileText size={11} />
          {project._count.requests} REQUESTS
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={11} />
          {new Date(project.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 font-mono-accent text-[10px] tracking-wider text-white/10 group-hover:text-[#FF541F]/60 transition-colors">
        VIEW PROJECT
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}
