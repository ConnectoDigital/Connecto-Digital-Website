"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Upload,
  Check,
  Plus,
  GripVertical,
  ChevronDown,
} from "lucide-react";

const BASE_TABS = [
  "Overview",
  "Requests",
  "Tasks",
  "Kanban",
  "Timeline",
  "Files",
  "Activity",
] as const;
const SPRINT_TABS = [
  "Overview",
  "Requests",
  "Sprints",
  "Backlog",
  "Board",
  "Timeline",
  "Files",
  "Activity",
] as const;
type Tab = (typeof BASE_TABS)[number] | (typeof SPRINT_TABS)[number];

type ServiceType =
  | "DEVELOPMENT"
  | "WEBSITE"
  | "MARKETING_MONTHLY"
  | "DEV_MAINTENANCE"
  | "WEBSITE_MAINTENANCE";

const serviceLabels: Record<ServiceType, { label: string; color: string }> = {
  DEVELOPMENT: { label: "DEVELOPMENT", color: "text-[#FF541F]" },
  WEBSITE: { label: "WEBSITE", color: "text-blue-400" },
  MARKETING_MONTHLY: { label: "MARKETING MONTHLY", color: "text-purple-400" },
  DEV_MAINTENANCE: { label: "DEV MAINTENANCE", color: "text-emerald-400" },
  WEBSITE_MAINTENANCE: {
    label: "WEBSITE MAINTENANCE",
    color: "text-amber-400",
  },
};

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  assignee: string;
  dueDate: string;
}

const mockProjects: Record<
  string,
  {
    name: string;
    status: string;
    description: string;
    client: string;
    serviceType: ServiceType;
    startDate: string;
    expectedCompletion: string;
    team: string[];
    progress: number;
  }
> = {
  "1": {
    name: "Private Boat Tours",
    status: "IN_PROGRESS",
    description:
      "Full booking platform for private boat tours in Aruba with payment integration, availability calendar, and admin dashboard.",
    client: "Caribbean Experiences",
    serviceType: "DEVELOPMENT",
    startDate: "2025-11-01",
    expectedCompletion: "2026-04-15",
    team: ["Juan", "Sofia", "Diego"],
    progress: 72,
  },
  "2": {
    name: "Egaroshi Logistics",
    status: "IN_PROGRESS",
    description:
      "International shipping and logistics platform with real-time tracking.",
    client: "Egaroshi International",
    serviceType: "WEBSITE",
    startDate: "2025-12-15",
    expectedCompletion: "2026-05-01",
    team: ["Juan", "Sofia"],
    progress: 45,
  },
  "3": {
    name: "RoadReady Car Wash",
    status: "COMPLETED",
    description: "Booking and payment system for car wash services.",
    client: "RoadReady BV",
    serviceType: "DEV_MAINTENANCE",
    startDate: "2025-08-20",
    expectedCompletion: "2026-02-28",
    team: ["Diego"],
    progress: 100,
  },
};

const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Design homepage wireframes",
    status: "DONE",
    priority: "HIGH",
    assignee: "Sofia",
    dueDate: "2025-12-01",
  },
  {
    id: "t2",
    title: "Build booking flow UI",
    status: "DONE",
    priority: "HIGH",
    assignee: "Juan",
    dueDate: "2026-01-15",
  },
  {
    id: "t3",
    title: "Implement payment gateway",
    status: "IN_PROGRESS",
    priority: "URGENT",
    assignee: "Juan",
    dueDate: "2026-03-20",
  },
  {
    id: "t4",
    title: "Calendar availability system",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignee: "Diego",
    dueDate: "2026-03-25",
  },
  {
    id: "t5",
    title: "Admin dashboard for boat owners",
    status: "IN_REVIEW",
    priority: "NORMAL",
    assignee: "Sofia",
    dueDate: "2026-03-28",
  },
  {
    id: "t6",
    title: "Email notification system",
    status: "TODO",
    priority: "NORMAL",
    assignee: "Juan",
    dueDate: "2026-04-01",
  },
  {
    id: "t7",
    title: "SEO optimization",
    status: "TODO",
    priority: "LOW",
    assignee: "Sofia",
    dueDate: "2026-04-05",
  },
  {
    id: "t8",
    title: "Mobile responsive QA",
    status: "TODO",
    priority: "HIGH",
    assignee: "Diego",
    dueDate: "2026-04-10",
  },
];

const milestones = [
  { title: "Project kickoff", date: "2025-11-01", status: "completed" as const },
  { title: "UI/UX Design", date: "2025-12-15", status: "completed" as const },
  { title: "Frontend Development", date: "2026-02-01", status: "in_progress" as const },
  { title: "Backend Integration", date: "2026-03-15", status: "upcoming" as const },
  { title: "Testing & Launch", date: "2026-04-15", status: "upcoming" as const },
];

const files = [
  { name: "brand-guidelines.pdf", size: "2.4 MB", uploadDate: "2025-11-05" },
  { name: "homepage-mockup.fig", size: "18.7 MB", uploadDate: "2025-12-20" },
  { name: "logo-final.svg", size: "124 KB", uploadDate: "2025-11-10" },
  { name: "content-doc.docx", size: "890 KB", uploadDate: "2026-01-08" },
];

const activities = [
  { user: "Juan", action: "uploaded brand-guidelines.pdf", time: "2h ago" },
  { user: "Sofia", action: "completed UI/UX Design milestone", time: "1d ago" },
  { user: "Diego", action: "started Frontend Development", time: "2d ago" },
  { user: "Juan", action: "added comment on homepage layout", time: "3d ago" },
  { user: "Sofia", action: "uploaded homepage-mockup.fig", time: "5d ago" },
  { user: "Diego", action: "updated project description", time: "1w ago" },
];

/* ============ SPRINT DATA ============ */
interface SprintTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  assignee: string;
  storyPoints: number;
}

interface Sprint {
  id: string;
  name: string;
  status: "COMPLETED" | "ACTIVE" | "PLANNED";
  startDate: string;
  endDate: string;
  goal: string;
  tasks: SprintTask[];
}

const mockSprints: Sprint[] = [
  {
    id: "s1",
    name: "Sprint 1 — Foundation",
    status: "COMPLETED",
    startDate: "2025-11-04",
    endDate: "2025-11-17",
    goal: "Project setup, design system, and homepage wireframes",
    tasks: [
      { id: "s1t1", title: "Setup Next.js project + CI/CD", status: "DONE", priority: "HIGH", assignee: "Juan", storyPoints: 3 },
      { id: "s1t2", title: "Design system & component library", status: "DONE", priority: "HIGH", assignee: "Sofia", storyPoints: 5 },
      { id: "s1t3", title: "Homepage wireframes", status: "DONE", priority: "HIGH", assignee: "Sofia", storyPoints: 3 },
      { id: "s1t4", title: "Database schema design", status: "DONE", priority: "NORMAL", assignee: "Diego", storyPoints: 5 },
    ],
  },
  {
    id: "s2",
    name: "Sprint 2 — UI/UX",
    status: "COMPLETED",
    startDate: "2025-11-18",
    endDate: "2025-12-01",
    goal: "High-fidelity designs and component development",
    tasks: [
      { id: "s2t1", title: "High-fidelity homepage design", status: "DONE", priority: "HIGH", assignee: "Sofia", storyPoints: 5 },
      { id: "s2t2", title: "Booking flow UI components", status: "DONE", priority: "HIGH", assignee: "Juan", storyPoints: 8 },
      { id: "s2t3", title: "Responsive navigation", status: "DONE", priority: "NORMAL", assignee: "Juan", storyPoints: 3 },
      { id: "s2t4", title: "User authentication pages", status: "DONE", priority: "HIGH", assignee: "Diego", storyPoints: 5 },
    ],
  },
  {
    id: "s3",
    name: "Sprint 3 — Core Features",
    status: "ACTIVE",
    startDate: "2026-03-10",
    endDate: "2026-03-23",
    goal: "Payment gateway and calendar availability system",
    tasks: [
      { id: "s3t1", title: "Stripe payment integration", status: "IN_PROGRESS", priority: "URGENT", assignee: "Juan", storyPoints: 8 },
      { id: "s3t2", title: "Calendar availability engine", status: "IN_PROGRESS", priority: "HIGH", assignee: "Diego", storyPoints: 8 },
      { id: "s3t3", title: "Admin dashboard — boat owners", status: "IN_REVIEW", priority: "NORMAL", assignee: "Sofia", storyPoints: 5 },
      { id: "s3t4", title: "Booking confirmation emails", status: "TODO", priority: "NORMAL", assignee: "Juan", storyPoints: 3 },
      { id: "s3t5", title: "Unit tests for payment flow", status: "TODO", priority: "HIGH", assignee: "Diego", storyPoints: 3 },
    ],
  },
  {
    id: "s4",
    name: "Sprint 4 — Polish & Launch",
    status: "PLANNED",
    startDate: "2026-03-24",
    endDate: "2026-04-06",
    goal: "SEO, mobile QA, performance optimization, and launch",
    tasks: [
      { id: "s4t1", title: "SEO optimization", status: "TODO", priority: "NORMAL", assignee: "Sofia", storyPoints: 3 },
      { id: "s4t2", title: "Mobile responsive QA", status: "TODO", priority: "HIGH", assignee: "Diego", storyPoints: 5 },
      { id: "s4t3", title: "Performance audit & optimization", status: "TODO", priority: "HIGH", assignee: "Juan", storyPoints: 5 },
      { id: "s4t4", title: "Launch checklist & deployment", status: "TODO", priority: "URGENT", assignee: "Juan", storyPoints: 3 },
    ],
  },
];

interface ProjectRequest {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  createdAt: string;
  updatedAt: string;
}

const mockRequests: Record<string, ProjectRequest[]> = {
  "1": [
    { id: "r1", title: "Add multi-boat booking support", description: "Allow customers to book multiple boats in a single checkout.", status: "IN_PROGRESS", priority: "HIGH", createdAt: "2026-03-18", updatedAt: "2026-03-20" },
    { id: "r2", title: "Fix calendar timezone display", description: "Calendar shows wrong times for EST timezone users.", status: "PENDING", priority: "URGENT", createdAt: "2026-03-21", updatedAt: "2026-03-21" },
    { id: "r3", title: "Add captain profile pages", description: "Each captain should have a dedicated profile with bio and reviews.", status: "IN_REVIEW", priority: "NORMAL", createdAt: "2026-03-10", updatedAt: "2026-03-19" },
    { id: "r4", title: "Implement refund flow", description: "Customers need ability to request refunds within 24h of booking.", status: "PENDING", priority: "HIGH", createdAt: "2026-03-22", updatedAt: "2026-03-22" },
    { id: "r5", title: "Homepage hero image optimization", description: "Current hero images are too large, affecting page load speed.", status: "COMPLETED", priority: "NORMAL", createdAt: "2026-02-28", updatedAt: "2026-03-05" },
  ],
  "2": [
    { id: "r6", title: "Add shipment tracking API", description: "Integrate real-time tracking from DHL and FedEx.", status: "IN_PROGRESS", priority: "HIGH", createdAt: "2026-03-15", updatedAt: "2026-03-18" },
    { id: "r7", title: "Dashboard export to CSV", description: "Allow admins to export shipment data.", status: "PENDING", priority: "NORMAL", createdAt: "2026-03-20", updatedAt: "2026-03-20" },
    { id: "r8", title: "Fix login page mobile layout", description: "Login form breaks on screens below 375px.", status: "COMPLETED", priority: "LOW", createdAt: "2026-03-01", updatedAt: "2026-03-03" },
  ],
  "3": [
    { id: "r9", title: "Monthly security patches", description: "Apply latest dependency updates and security fixes.", status: "COMPLETED", priority: "HIGH", createdAt: "2026-02-15", updatedAt: "2026-02-20" },
    { id: "r10", title: "Update booking confirmation email", description: "Redesign the transactional email template.", status: "COMPLETED", priority: "NORMAL", createdAt: "2026-02-10", updatedAt: "2026-02-25" },
  ],
};

const backlogTasks: SprintTask[] = [
  { id: "b1", title: "Multi-language support (EN/NL/PAP)", status: "TODO", priority: "LOW", assignee: "Sofia", storyPoints: 8 },
  { id: "b2", title: "Loyalty program integration", status: "TODO", priority: "LOW", assignee: "Diego", storyPoints: 5 },
  { id: "b3", title: "Advanced analytics dashboard", status: "TODO", priority: "NORMAL", assignee: "Juan", storyPoints: 8 },
  { id: "b4", title: "SMS notification system", status: "TODO", priority: "NORMAL", assignee: "Diego", storyPoints: 3 },
  { id: "b5", title: "Boat owner mobile app", status: "TODO", priority: "LOW", assignee: "Juan", storyPoints: 13 },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const priorityStyle: Record<string, string> = {
  LOW: "text-white/30",
  NORMAL: "text-blue-400",
  HIGH: "text-amber-400",
  URGENT: "text-red-400",
};

const taskStatusStyle: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  TODO: { bg: "bg-white/[0.06]", text: "text-white/40", label: "TO DO" },
  IN_PROGRESS: { bg: "bg-[#FF541F]/10", text: "text-[#FF541F]", label: "IN PROGRESS" },
  IN_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400", label: "IN REVIEW" },
  DONE: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "DONE" },
};

const kanbanColumns: { key: TaskStatus; label: string; accent: string }[] = [
  { key: "TODO", label: "TO DO", accent: "border-t-white/20" },
  { key: "IN_PROGRESS", label: "IN PROGRESS", accent: "border-t-[#FF541F]" },
  { key: "IN_REVIEW", label: "IN REVIEW", accent: "border-t-purple-500" },
  { key: "DONE", label: "DONE", accent: "border-t-emerald-500" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const project = mockProjects[projectId] ?? mockProjects["1"];
  const service = serviceLabels[project.serviceType];
  const isDev = project.serviceType === "DEVELOPMENT";
  const tabs = isDev ? SPRINT_TABS : BASE_TABS;

  // If switching project type, reset to Overview if current tab doesn't exist
  const currentTab = (tabs as readonly string[]).includes(activeTab) ? activeTab : "Overview";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-2 font-mono-accent text-[12px] tracking-wider text-white/30 hover:text-white/60 transition-colors"
      >
        <ArrowLeft size={14} />
        BACK TO PROJECTS
      </Link>

      {/* Header */}
      <div className="border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-tight text-white">
                {project.name}
              </h1>
              <span
                className={`px-3 py-1 font-mono-accent text-[10px] tracking-wider ${
                  project.status === "IN_PROGRESS"
                    ? "bg-[#FF541F]/10 text-[#FF541F]"
                    : project.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {project.status.replace("_", " ")}
              </span>
              {isDev && (
                <span className="px-2 py-0.5 font-mono-accent text-[9px] tracking-wider bg-blue-500/10 text-blue-400">
                  SPRINT
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono-accent text-[11px] tracking-wider text-white/30">
                {project.client}
              </span>
              <span className="text-white/10">|</span>
              <span
                className={`font-mono-accent text-[11px] tracking-wider ${service.color}`}
              >
                {service.label}
              </span>
            </div>
          </div>
          <div className="font-mono-accent text-[11px] tracking-wider text-white/20 text-right">
            <div>{project.progress}% COMPLETE</div>
            <div className="mt-1 h-1.5 w-32 bg-white/[0.06]">
              <div
                className="h-full bg-[#FF541F]"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            {isDev && (
              <div className="mt-2 text-blue-400">
                SPRINT {mockSprints.findIndex((s) => s.status === "ACTIVE") + 1} OF {mockSprints.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.06]">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`relative whitespace-nowrap px-5 py-3 font-mono-accent text-[11px] tracking-wider transition-colors ${
                currentTab === tab
                  ? "text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {tab.toUpperCase()}
              {currentTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF541F]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {currentTab === "Overview" && <OverviewTab project={project} isDev={isDev} />}
      {currentTab === "Requests" && <RequestsTab projectId={projectId} />}
      {currentTab === "Tasks" && <TasksTab />}
      {currentTab === "Kanban" && <KanbanTab />}
      {currentTab === "Sprints" && <SprintsTab />}
      {currentTab === "Backlog" && <BacklogTab />}
      {currentTab === "Board" && <SprintBoardTab />}
      {currentTab === "Timeline" && <TimelineTab />}
      {currentTab === "Files" && <FilesTab />}
      {currentTab === "Activity" && <ActivityTab />}
    </div>
  );
}

/* ============ OVERVIEW ============ */
function OverviewTab({
  project,
  isDev,
}: {
  project: (typeof mockProjects)[string];
  isDev?: boolean;
}) {
  const activeSprint = mockSprints.find((s) => s.status === "ACTIVE");
  const completedSprints = mockSprints.filter((s) => s.status === "COMPLETED");
  const totalPoints = isDev
    ? mockSprints.flatMap((s) => s.tasks).reduce((a, t) => a + t.storyPoints, 0) + backlogTasks.reduce((a, t) => a + t.storyPoints, 0)
    : 0;
  const donePoints = isDev
    ? mockSprints.flatMap((s) => s.tasks).filter((t) => t.status === "DONE").reduce((a, t) => a + t.storyPoints, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="mb-3 font-mono-accent text-[11px] tracking-wider text-white/30">
          DESCRIPTION
        </h3>
        <p className="text-[14px] leading-relaxed text-white/60">
          {project.description}
        </p>
      </div>

      {/* Sprint overview for dev projects */}
      {isDev && activeSprint && (
        <div className="border border-blue-500/20 bg-blue-500/[0.04] p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono-accent text-[11px] tracking-wider text-blue-400">
              ACTIVE SPRINT
            </h3>
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              {new Date(activeSprint.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" — "}
              {new Date(activeSprint.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <p className="text-[15px] font-semibold text-white mb-1">
            {activeSprint.name}
          </p>
          <p className="text-[13px] text-white/40 mb-4">{activeSprint.goal}</p>
          <div className="flex gap-4">
            {(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as TaskStatus[]).map((s) => {
              const count = activeSprint.tasks.filter((t) => t.status === s).length;
              const style = taskStatusStyle[s];
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className={`font-mono-accent text-[10px] tracking-wider ${style.text}`}>
                    {count}
                  </span>
                  <span className="font-mono-accent text-[9px] tracking-wider text-white/20">
                    {style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Velocity / Sprint stats for dev projects */}
      {isDev && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              SPRINTS COMPLETED
            </span>
            <p className="mt-1 text-2xl font-bold text-white">{completedSprints.length}</p>
          </div>
          <div className="border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              TOTAL STORY POINTS
            </span>
            <p className="mt-1 text-2xl font-bold text-white">{totalPoints}</p>
          </div>
          <div className="border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              POINTS DONE
            </span>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{donePoints}</p>
          </div>
          <div className="border border-white/[0.06] bg-white/[0.02] p-4">
            <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
              AVG VELOCITY
            </span>
            <p className="mt-1 text-2xl font-bold text-blue-400">
              {completedSprints.length > 0
                ? Math.round(
                    completedSprints.reduce(
                      (sum, s) => sum + s.tasks.reduce((a, t) => a + t.storyPoints, 0),
                      0
                    ) / completedSprints.length
                  )
                : 0}
              <span className="text-sm text-white/20 ml-1">pts/sprint</span>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-4 font-mono-accent text-[11px] tracking-wider text-white/30">
            TEAM
          </h3>
          <div className="flex gap-3">
            {project.team.map((m) => (
              <div key={m} className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center bg-[#FF541F]/10 text-[13px] font-semibold text-[#FF541F]">
                  {getInitials(m)}
                </div>
                <span className="text-[12px] text-white/50">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-4 font-mono-accent text-[11px] tracking-wider text-white/30">
            KEY DATES
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[13px] text-white/40">Start</span>
              <span className="font-mono-accent text-[13px] text-white/70">
                {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex justify-between">
              <span className="text-[13px] text-white/40">Expected</span>
              <span className="font-mono-accent text-[13px] text-white/70">
                {new Date(project.expectedCompletion).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Task summary — for non-dev projects */}
      {!isDev && (
        <div className="grid gap-4 sm:grid-cols-4">
          {(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as TaskStatus[]).map((s) => {
            const count = mockTasks.filter((t) => t.status === s).length;
            const style = taskStatusStyle[s];
            return (
              <div key={s} className="border border-white/[0.06] bg-white/[0.02] p-4">
                <span className={`font-mono-accent text-[10px] tracking-wider ${style.text}`}>
                  {style.label}
                </span>
                <p className="mt-1 text-2xl font-bold text-white">{count}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============ TASKS LIST ============ */
function TasksTab() {
  const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL");
  const filtered = filter === "ALL" ? mockTasks : mockTasks.filter((t) => t.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter + Add */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-0">
          {(["ALL", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                s !== "ALL" ? "border-l-0" : ""
              } ${
                filter === s
                  ? "bg-white/5 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {s === "ALL" ? "ALL" : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-0">
          <span className="font-mono-accent text-[11px] bg-[#FF541F] text-white px-4 py-2 tracking-wider flex items-center gap-2">
            <Plus size={12} /> ADD TASK
          </span>
          <span className="w-8 h-[36px] bg-[#FF541F] text-white flex items-center justify-center text-sm border-l border-white/10">
            +
          </span>
        </button>
      </div>

      {/* Task list */}
      <div className="border border-white/[0.06]">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
          <span className="col-span-5 font-mono-accent text-[10px] tracking-wider text-white/30">TASK</span>
          <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">STATUS</span>
          <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">PRIORITY</span>
          <span className="col-span-2 font-mono-accent text-[10px] tracking-wider text-white/30">ASSIGNEE</span>
          <span className="col-span-1 font-mono-accent text-[10px] tracking-wider text-white/30">DUE</span>
        </div>

        {filtered.map((task) => {
          const ss = taskStatusStyle[task.status];
          return (
            <div
              key={task.id}
              className="grid grid-cols-12 gap-4 items-center px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              <div className="col-span-5 flex items-center gap-3">
                <GripVertical size={12} className="text-white/10 shrink-0" />
                <span className="text-[13px] text-white/80 truncate">
                  {task.title}
                </span>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-0.5 font-mono-accent text-[9px] tracking-wider ${ss.bg} ${ss.text}`}>
                  {ss.label}
                </span>
              </div>
              <div className="col-span-2">
                <span className={`font-mono-accent text-[10px] tracking-wider ${priorityStyle[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center bg-[#FF541F]/10 text-[9px] font-semibold text-[#FF541F]">
                  {getInitials(task.assignee)}
                </div>
                <span className="text-[12px] text-white/40">{task.assignee}</span>
              </div>
              <div className="col-span-1 font-mono-accent text-[10px] text-white/20">
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ KANBAN ============ */
function KanbanTab() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kanbanColumns.map((col) => {
        const tasks = mockTasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className={`flex flex-col border border-white/[0.06] bg-white/[0.01] border-t-2 ${col.accent}`}
          >
            <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
              <span className="font-mono-accent text-[10px] font-bold tracking-widest text-white/60">
                {col.label}
              </span>
              <span className="flex h-5 w-5 items-center justify-center bg-white/[0.06] font-mono-accent text-[10px] font-bold text-white/40">
                {tasks.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              {tasks.length === 0 ? (
                <div className="flex h-20 items-center justify-center border border-dashed border-white/[0.06]">
                  <span className="font-mono-accent text-[10px] text-white/15">
                    NO TASKS
                  </span>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-colors cursor-pointer"
                  >
                    <p className="text-[12px] font-medium text-white/80 mb-2">
                      {task.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono-accent text-[9px] tracking-wider ${priorityStyle[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center bg-[#FF541F]/10 text-[8px] font-bold text-[#FF541F]">
                          {getInitials(task.assignee)}
                        </div>
                        <span className="font-mono-accent text-[9px] text-white/20">
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ TIMELINE ============ */
function TimelineTab() {
  return (
    <div className="border border-white/[0.06] bg-white/[0.02] p-6">
      <h3 className="mb-6 font-mono-accent text-[11px] tracking-wider text-white/30">
        PROJECT MILESTONES
      </h3>
      <div className="space-y-0">
        {milestones.map((m, i) => (
          <div key={m.title} className="relative flex gap-4 pb-8">
            {i < milestones.length - 1 && (
              <div className="absolute left-[11px] top-[24px] h-full w-px bg-white/[0.08]" />
            )}
            <div className="relative z-10 mt-[2px] flex h-[22px] w-[22px] shrink-0 items-center justify-center">
              {m.status === "completed" ? (
                <div className="flex h-[22px] w-[22px] items-center justify-center bg-emerald-500">
                  <Check size={12} className="text-white" />
                </div>
              ) : m.status === "in_progress" ? (
                <div className="flex h-[22px] w-[22px] items-center justify-center border-2 border-[#FF541F] bg-[#FF541F]/20">
                  <div className="h-[8px] w-[8px] bg-[#FF541F]" />
                </div>
              ) : (
                <div className="flex h-[22px] w-[22px] items-center justify-center border border-white/[0.12] bg-white/[0.04]">
                  <div className="h-[6px] w-[6px] bg-white/20" />
                </div>
              )}
            </div>
            <div className="flex-1 pt-[1px]">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[14px] font-medium ${
                    m.status === "completed" ? "text-white/60" : m.status === "in_progress" ? "text-white" : "text-white/30"
                  }`}
                >
                  {m.title}
                </span>
                {m.status === "in_progress" && (
                  <span className="bg-[#FF541F]/10 px-2 py-0.5 font-mono-accent text-[10px] tracking-wider text-[#FF541F]">
                    CURRENT
                  </span>
                )}
              </div>
              <span className="mt-1 block font-mono-accent text-[11px] text-white/20">
                {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ REQUESTS ============ */
function RequestsTab({ projectId }: { projectId: string }) {
  const requests = mockRequests[projectId] ?? [];
  const [filter, setFilter] = useState<string>("ALL");

  const reqStatusStyle: Record<string, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", label: "PENDING" },
    IN_PROGRESS: { bg: "bg-[#FF541F]/10", text: "text-[#FF541F]", label: "IN PROGRESS" },
    IN_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400", label: "IN REVIEW" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "COMPLETED" },
    CANCELLED: { bg: "bg-white/[0.06]", text: "text-white/30", label: "CANCELLED" },
  };

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter + New Request */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-0">
          {["ALL", "PENDING", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"].map((s, i) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                i > 0 ? "border-l-0" : ""
              } ${filter === s ? "bg-white/5 text-white" : "text-white/30 hover:text-white/50"}`}
            >
              {s === "ALL" ? `ALL (${requests.length})` : s.replace("_", " ")}
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-0">
          <span className="font-mono-accent text-[11px] bg-[#FF541F] text-white px-4 py-2 tracking-wider flex items-center gap-2">
            <Plus size={12} /> NEW REQUEST
          </span>
          <span className="w-8 h-[36px] bg-[#FF541F] text-white flex items-center justify-center text-sm border-l border-white/10">
            +
          </span>
        </button>
      </div>

      {/* Requests list */}
      {filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center border border-dashed border-white/[0.06]">
          <span className="font-mono-accent text-[12px] text-white/20">NO REQUESTS</span>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const ss = reqStatusStyle[req.status] ?? reqStatusStyle.PENDING;
            return (
              <div
                key={req.id}
                className="border border-white/[0.06] bg-white/[0.02] p-4 hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[14px] font-medium text-white truncate">
                      {req.title}
                    </h4>
                    <p className="text-[12px] text-white/30 mt-0.5 line-clamp-1">
                      {req.description}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 font-mono-accent text-[9px] tracking-wider ${ss.bg} ${ss.text}`}>
                    {ss.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono-accent text-[10px] tracking-wider text-white/20">
                  <span className={`${priorityStyle[req.priority]}`}>
                    {req.priority}
                  </span>
                  <span>
                    CREATED {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span>
                    UPDATED {new Date(req.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============ FILES ============ */
function FilesTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {files.map((f) => (
          <div key={f.name} className="flex items-center gap-4 border border-white/[0.06] bg-white/[0.02] px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-white">{f.name}</p>
              <p className="mt-0.5 font-mono-accent text-[11px] text-white/25">
                {f.size} · {new Date(f.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <button className="flex items-center gap-2 border border-white/[0.08] px-3 py-2 font-mono-accent text-[11px] tracking-wider text-white/50 hover:border-[#FF541F]/30 hover:text-white transition-colors">
              <Download size={12} /> DOWNLOAD
            </button>
          </div>
        ))}
      </div>
      <div className="flex h-32 flex-col items-center justify-center gap-2 border-2 border-dashed border-white/[0.08] hover:border-[#FF541F]/20 transition-colors">
        <Upload size={20} className="text-white/20" />
        <span className="font-mono-accent text-[12px] tracking-wider text-white/20">
          DROP FILES HERE OR CLICK TO UPLOAD
        </span>
      </div>
    </div>
  );
}

/* ============ ACTIVITY ============ */
function ActivityTab() {
  return (
    <div className="border border-white/[0.06] bg-white/[0.02] p-6">
      <h3 className="mb-6 font-mono-accent text-[11px] tracking-wider text-white/30">
        RECENT ACTIVITY
      </h3>
      {activities.map((a, i) => (
        <div
          key={i}
          className={`flex items-start gap-4 py-4 ${i < activities.length - 1 ? "border-b border-white/[0.06]" : ""}`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#FF541F]/10 text-[11px] font-semibold text-[#FF541F]">
            {getInitials(a.user)}
          </div>
          <div className="flex-1">
            <p className="text-[13px] text-white/60">
              <span className="font-medium text-white">{a.user}</span> {a.action}
            </p>
          </div>
          <span className="shrink-0 font-mono-accent text-[11px] text-white/20">{a.time}</span>
        </div>
      ))}
    </div>
  );
}

/* ============ SPRINTS TAB ============ */
function SprintsTab() {
  const [expandedSprint, setExpandedSprint] = useState<string | null>(
    mockSprints.find((s) => s.status === "ACTIVE")?.id ?? null
  );

  const completedSprints = mockSprints.filter((s) => s.status === "COMPLETED");
  const velocityData = completedSprints.map((s) => ({
    name: s.name.split("—")[0].trim(),
    points: s.tasks.reduce((a, t) => a + t.storyPoints, 0),
  }));

  return (
    <div className="space-y-6">
      {/* Velocity chart */}
      {velocityData.length > 0 && (
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-4 font-mono-accent text-[11px] tracking-wider text-white/30">
            VELOCITY
          </h3>
          <div className="flex items-end gap-3 h-24">
            {velocityData.map((v) => {
              const maxPts = Math.max(...velocityData.map((d) => d.points));
              const h = (v.points / maxPts) * 100;
              return (
                <div key={v.name} className="flex flex-col items-center gap-1 flex-1">
                  <span className="font-mono-accent text-[10px] text-white/40">
                    {v.points}
                  </span>
                  <div
                    className="w-full bg-blue-500/40 transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="font-mono-accent text-[9px] text-white/20 truncate max-w-full">
                    {v.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sprint list */}
      <div className="space-y-3">
        {mockSprints.map((sprint) => {
          const isExpanded = expandedSprint === sprint.id;
          const totalPts = sprint.tasks.reduce((a, t) => a + t.storyPoints, 0);
          const donePts = sprint.tasks
            .filter((t) => t.status === "DONE")
            .reduce((a, t) => a + t.storyPoints, 0);
          const pctDone = totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0;

          const statusStyle =
            sprint.status === "ACTIVE"
              ? "border-l-[#FF541F] bg-[#FF541F]/[0.03]"
              : sprint.status === "COMPLETED"
                ? "border-l-emerald-500"
                : "border-l-white/10";

          return (
            <div
              key={sprint.id}
              className={`border border-white/[0.06] bg-white/[0.02] border-l-[3px] ${statusStyle}`}
            >
              {/* Sprint header */}
              <button
                onClick={() => setExpandedSprint(isExpanded ? null : sprint.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-white truncate">
                      {sprint.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 font-mono-accent text-[9px] tracking-wider ${
                        sprint.status === "ACTIVE"
                          ? "bg-[#FF541F]/10 text-[#FF541F]"
                          : sprint.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/[0.06] text-white/30"
                      }`}
                    >
                      {sprint.status}
                    </span>
                  </div>
                  <span className="font-mono-accent text-[10px] tracking-wider text-white/20">
                    {new Date(sprint.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" — "}
                    {new Date(sprint.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono-accent text-[10px] text-white/30">
                      {donePts}/{totalPts} PTS
                    </span>
                    <div className="mt-1 h-1 w-20 bg-white/[0.06]">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${pctDone}%` }}
                      />
                    </div>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-white/20 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {/* Sprint details */}
              {isExpanded && (
                <div className="border-t border-white/[0.06] px-5 py-4">
                  <p className="text-[13px] text-white/40 mb-4">
                    <span className="font-mono-accent text-[10px] text-white/20 tracking-wider">GOAL: </span>
                    {sprint.goal}
                  </p>

                  {/* Sprint tasks */}
                  <div className="border border-white/[0.06]">
                    <div className="grid grid-cols-12 gap-2 bg-white/[0.02] px-4 py-2 border-b border-white/[0.06]">
                      <span className="col-span-5 font-mono-accent text-[9px] tracking-wider text-white/25">TASK</span>
                      <span className="col-span-2 font-mono-accent text-[9px] tracking-wider text-white/25">STATUS</span>
                      <span className="col-span-2 font-mono-accent text-[9px] tracking-wider text-white/25">ASSIGNEE</span>
                      <span className="col-span-1 font-mono-accent text-[9px] tracking-wider text-white/25">PTS</span>
                      <span className="col-span-2 font-mono-accent text-[9px] tracking-wider text-white/25">PRIORITY</span>
                    </div>
                    {sprint.tasks.map((task) => {
                      const ss = taskStatusStyle[task.status];
                      return (
                        <div
                          key={task.id}
                          className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-white/[0.04] last:border-b-0"
                        >
                          <span className="col-span-5 text-[12px] text-white/70 truncate">
                            {task.title}
                          </span>
                          <div className="col-span-2">
                            <span className={`px-1.5 py-0.5 font-mono-accent text-[8px] tracking-wider ${ss.bg} ${ss.text}`}>
                              {ss.label}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center bg-[#FF541F]/10 text-[8px] font-bold text-[#FF541F]">
                              {getInitials(task.assignee)}
                            </div>
                            <span className="text-[11px] text-white/30">{task.assignee}</span>
                          </div>
                          <span className="col-span-1 font-mono-accent text-[11px] text-white/40 font-bold">
                            {task.storyPoints}
                          </span>
                          <span className={`col-span-2 font-mono-accent text-[9px] tracking-wider ${priorityStyle[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ BACKLOG TAB ============ */
function BacklogTab() {
  const totalBacklogPts = backlogTasks.reduce((a, t) => a + t.storyPoints, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-white">Product Backlog</h3>
          <span className="font-mono-accent text-[11px] tracking-wider text-white/30">
            {backlogTasks.length} ITEMS · {totalBacklogPts} STORY POINTS
          </span>
        </div>
        <button className="inline-flex items-center gap-0">
          <span className="font-mono-accent text-[11px] bg-[#FF541F] text-white px-4 py-2 tracking-wider flex items-center gap-2">
            <Plus size={12} /> ADD ITEM
          </span>
          <span className="w-8 h-[36px] bg-[#FF541F] text-white flex items-center justify-center text-sm border-l border-white/10">
            +
          </span>
        </button>
      </div>

      <div className="border border-white/[0.06]">
        <div className="grid grid-cols-12 gap-4 bg-white/[0.02] px-5 py-3 border-b border-white/[0.06]">
          <span className="col-span-1 font-mono-accent text-[9px] tracking-wider text-white/25">#</span>
          <span className="col-span-5 font-mono-accent text-[9px] tracking-wider text-white/25">ITEM</span>
          <span className="col-span-2 font-mono-accent text-[9px] tracking-wider text-white/25">PRIORITY</span>
          <span className="col-span-2 font-mono-accent text-[9px] tracking-wider text-white/25">ASSIGNEE</span>
          <span className="col-span-1 font-mono-accent text-[9px] tracking-wider text-white/25">PTS</span>
          <span className="col-span-1 font-mono-accent text-[9px] tracking-wider text-white/25">ACTION</span>
        </div>
        {backlogTasks.map((task, i) => (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-4 items-center px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
          >
            <div className="col-span-1 flex items-center gap-2">
              <GripVertical size={11} className="text-white/10" />
              <span className="font-mono-accent text-[10px] text-white/20">
                {i + 1}
              </span>
            </div>
            <span className="col-span-5 text-[13px] text-white/70">{task.title}</span>
            <span className={`col-span-2 font-mono-accent text-[10px] tracking-wider ${priorityStyle[task.priority]}`}>
              {task.priority}
            </span>
            <div className="col-span-2 flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center bg-[#FF541F]/10 text-[9px] font-bold text-[#FF541F]">
                {getInitials(task.assignee)}
              </div>
              <span className="text-[11px] text-white/30">{task.assignee}</span>
            </div>
            <span className="col-span-1 font-mono-accent text-[11px] text-white/40 font-bold">
              {task.storyPoints}
            </span>
            <div className="col-span-1">
              <button className="font-mono-accent text-[9px] tracking-wider border border-white/[0.08] px-2 py-1 text-white/30 hover:text-white/60 hover:border-white/20 transition-colors">
                → SPRINT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ SPRINT BOARD (Active Sprint Kanban) ============ */
function SprintBoardTab() {
  const activeSprint = mockSprints.find((s) => s.status === "ACTIVE");

  if (!activeSprint) {
    return (
      <div className="flex h-40 items-center justify-center border border-dashed border-white/[0.06]">
        <span className="font-mono-accent text-[12px] text-white/20">
          NO ACTIVE SPRINT
        </span>
      </div>
    );
  }

  const totalPts = activeSprint.tasks.reduce((a, t) => a + t.storyPoints, 0);
  const donePts = activeSprint.tasks.filter((t) => t.status === "DONE").reduce((a, t) => a + t.storyPoints, 0);
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(activeSprint.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-4">
      {/* Sprint info bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-blue-500/20 bg-blue-500/[0.04] px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-semibold text-white">
            {activeSprint.name}
          </span>
          <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
            {donePts}/{totalPts} PTS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
            {daysLeft} DAYS LEFT
          </span>
          <div className="h-1.5 w-24 bg-white/[0.06]">
            <div
              className="h-full bg-blue-400 transition-all"
              style={{ width: `${totalPts > 0 ? (donePts / totalPts) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Board columns */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kanbanColumns.map((col) => {
          const tasks = activeSprint.tasks.filter((t) => t.status === col.key);
          const colPts = tasks.reduce((a, t) => a + t.storyPoints, 0);

          return (
            <div
              key={col.key}
              className={`flex flex-col border border-white/[0.06] bg-white/[0.01] border-t-2 ${col.accent}`}
            >
              <div className="border-b border-white/[0.06] px-3 py-3 flex items-center justify-between">
                <span className="font-mono-accent text-[10px] font-bold tracking-widest text-white/60">
                  {col.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono-accent text-[9px] text-white/20">
                    {colPts} pts
                  </span>
                  <span className="flex h-5 w-5 items-center justify-center bg-white/[0.06] font-mono-accent text-[10px] font-bold text-white/40">
                    {tasks.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-2">
                {tasks.length === 0 ? (
                  <div className="flex h-16 items-center justify-center border border-dashed border-white/[0.06]">
                    <span className="font-mono-accent text-[9px] text-white/15">EMPTY</span>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-colors"
                    >
                      <p className="text-[12px] font-medium text-white/80 mb-2">
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono-accent text-[8px] tracking-wider ${priorityStyle[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                          <span className="font-mono-accent text-[9px] text-white/20 border border-white/[0.08] px-1.5 py-0.5">
                            {task.storyPoints} pts
                          </span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center bg-[#FF541F]/10 text-[8px] font-bold text-[#FF541F]">
                          {getInitials(task.assignee)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
