"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    requests: number;
    files: number;
  };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: "ACTIVE", color: "text-[#FF541F]", bg: "bg-[#FF541F]/10" },
  COMPLETED: { label: "COMPLETED", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ON_HOLD: { label: "ON HOLD", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  ARCHIVED: { label: "ARCHIVED", color: "text-white/40", bg: "bg-white/[0.06]" },
};

type PageTab = "ACTIVE" | "DONE";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTab, setPageTab] = useState<PageTab>("ACTIVE");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.projects ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.status !== "COMPLETED" &&
          p.status !== "ARCHIVED" &&
          (!search || p.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [projects, search]
  );

  const doneProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          (p.status === "COMPLETED" || p.status === "ARCHIVED") &&
          (!search || p.name.toLowerCase().includes(search.toLowerCase()))
      ),
    [projects, search]
  );

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
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-white/30 outline-none focus:border-[#FF541F]/40"
        />
      </div>

      {/* Tabs: Active / Done */}
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

      {/* Error state */}
      {error && (
        <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
          <p className="font-mono-accent text-[12px] text-red-400/60">{error}</p>
        </div>
      )}

      {/* ACTIVE TAB */}
      {!error && pageTab === "ACTIVE" && (
        <>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse border border-white/[0.06] bg-white/[0.02]"
                />
              ))}
            </div>
          ) : activeProjects.length > 0 ? (
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
      {!error && pageTab === "DONE" && (
        <>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse border border-white/[0.06] bg-white/[0.02]"
                />
              ))}
            </div>
          ) : doneProjects.length > 0 ? (
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
  project: ProjectRow;
  done?: boolean;
}) {
  const cfg = statusConfig[project.status] ?? statusConfig["ACTIVE"];

  return (
    <Link
      href={`/admin/projects/${project.id}`}
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
          className={`px-2.5 py-0.5 font-mono-accent text-[10px] font-medium tracking-wider ${cfg.bg} ${cfg.color}`}
        >
          {cfg.label}
        </span>
      </div>

      <h3
        className={`mb-1 text-[15px] font-semibold ${
          done ? "text-white/60" : "text-white"
        }`}
      >
        {project.name}
      </h3>
      {project.description && (
        <p className="mb-4 line-clamp-2 text-[13px] text-white/30">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-4 border-t border-white/[0.04] pt-3 font-mono-accent text-[10px] tracking-wider text-white/20">
        <span className="flex items-center gap-1.5">
          <FileText size={11} />
          {project._count.requests} REQUEST{project._count.requests !== 1 ? "S" : ""}
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
        MANAGE PROJECT
        <ArrowRight size={12} />
      </div>
    </Link>
  );
}
