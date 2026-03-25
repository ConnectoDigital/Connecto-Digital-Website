"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Filter,
  Plus,
  X,
  Upload,
  ArrowRight,
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";

interface RequestMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  userId: string;
}

interface Request {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  project: {
    id: string;
    name: string;
  };
  messages: RequestMessage[];
}

interface Project {
  id: string;
  name: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400" },
  IN_PROGRESS: { bg: "bg-blue-500/10", text: "text-blue-400" },
  IN_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400" },
  COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  CANCELLED: { bg: "bg-white/5", text: "text-white/30" },
};

const priorityColors: Record<string, { bg: string; text: string }> = {
  LOW: { bg: "bg-white/5", text: "text-white/40" },
  NORMAL: { bg: "bg-blue-500/10", text: "text-blue-400" },
  HIGH: { bg: "bg-amber-500/10", text: "text-amber-400" },
  URGENT: { bg: "bg-red-500/10", text: "text-red-400" },
};

const statusFilters = [
  "ALL",
  "PENDING",
  "IN_PROGRESS",
  "IN_REVIEW",
  "COMPLETED",
  "CANCELLED",
];

const priorityOptions = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export default function RequestsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-white/30" size={24} /></div>}>
      <RequestsPage />
    </Suspense>
  );
}

function RequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPriority, setFormPriority] = useState<string>("NORMAL");
  const [formProjectId, setFormProjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Messages for expanded request
  const [expandedMessages, setExpandedMessages] = useState<RequestMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data.projects);
      if (data.projects.length > 0 && !formProjectId) {
        setFormProjectId(data.projects[0].id);
      }
    } catch {
      // silently fail - projects are for the form dropdown
    }
  }, [formProjectId]);

  useEffect(() => {
    fetchRequests();
    fetchProjects();
  }, [fetchRequests, fetchProjects]);

  // Open form if ?new=true in URL
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowForm(true);
    }
  }, [searchParams]);

  // Fetch messages when a request is expanded
  async function fetchMessages(requestId: string) {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?requestId=${requestId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setExpandedMessages(data.messages);
    } catch {
      setExpandedMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }

  function handleExpand(requestId: string) {
    if (expandedId === requestId) {
      setExpandedId(null);
      setReplyingTo(null);
      setReplyContent("");
    } else {
      setExpandedId(requestId);
      setReplyingTo(null);
      setReplyContent("");
      fetchMessages(requestId);
    }
  }

  const openForm = () => {
    setShowForm(true);
    router.replace("/dashboard/requests?new=true");
  };

  const closeForm = () => {
    setShowForm(false);
    setFormTitle("");
    setFormDescription("");
    setFormPriority("NORMAL");
    if (projects.length > 0) setFormProjectId(projects[0].id);
    setSubmitError(null);
    router.replace("/dashboard/requests");
  };

  const handleSubmit = async () => {
    if (!formTitle || !formDescription || !formProjectId) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          priority: formPriority,
          projectId: formProjectId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create request");
      }

      closeForm();
      await fetchRequests();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (requestId: string) => {
    if (!replyContent.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          content: replyContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setReplyContent("");
      setReplyingTo(null);
      await fetchMessages(requestId);
    } catch {
      // keep the reply content so user can retry
    } finally {
      setSendingReply(false);
    }
  };

  const filtered =
    filterStatus === "ALL"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse bg-white/[0.04]" />
            <div className="h-4 w-24 animate-pulse bg-white/[0.03]" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/5 p-5">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-[14px] text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            All Requests
          </h2>
          <p className="mt-0.5 text-[13px] text-white/30">
            {filtered.length} request{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter */}
          <div className="hidden items-center gap-2 sm:flex">
            <Filter size={14} className="text-white/20" />
            <div className="flex flex-wrap gap-1.5">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 text-[11px] font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-white/10 text-white"
                      : "text-white/25 hover:text-white/50"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* New Request Button */}
          <button
            onClick={openForm}
            className="inline-flex items-center gap-0"
          >
            <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider flex items-center gap-2">
              <Plus size={14} /> NEW REQUEST
            </span>
            <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10">
              +
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="flex items-center gap-2 sm:hidden overflow-x-auto pb-2">
        <Filter size={14} className="shrink-0 text-white/20" />
        <div className="flex gap-1.5">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`whitespace-nowrap px-3 py-1 text-[11px] font-medium transition-colors ${
                filterStatus === status
                  ? "bg-white/10 text-white"
                  : "text-white/25 hover:text-white/50"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((req) => {
            const reqStatusStyle =
              statusColors[req.status] || statusColors.PENDING;
            const reqPriorityStyle =
              priorityColors[req.priority] || priorityColors.NORMAL;
            const isExpanded = expandedId === req.id;

            return (
              <div
                key={req.id}
                className="border border-white/[0.06] bg-white/[0.02] transition-colors"
              >
                {/* Request row */}
                <button
                  onClick={() => handleExpand(req.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <FileText size={16} className="shrink-0 text-white/20" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-white">
                      {req.title}
                    </p>
                    <p className="mt-0.5 font-mono-accent text-[11px] uppercase tracking-wider text-white/20">
                      {req.project.name}
                    </p>
                  </div>
                  <span
                    className={`hidden shrink-0 px-2.5 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider font-medium sm:inline ${reqStatusStyle.bg} ${reqStatusStyle.text}`}
                  >
                    {req.status.replace("_", " ")}
                  </span>
                  <span
                    className={`hidden shrink-0 px-2 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider font-medium md:inline ${reqPriorityStyle.bg} ${reqPriorityStyle.text}`}
                  >
                    {req.priority}
                  </span>
                  <span className="hidden shrink-0 font-mono-accent text-[11px] text-white/15 lg:block">
                    <Clock size={12} className="mr-1 inline" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="shrink-0 text-white/20" />
                  ) : (
                    <ChevronDown size={16} className="shrink-0 text-white/20" />
                  )}
                </button>

                {/* Expanded: description + messages thread */}
                {isExpanded && (
                  <div className="border-t border-white/[0.04] px-5 py-4">
                    <p className="mb-4 text-[13px] text-white/40">
                      {req.description}
                    </p>

                    {/* Mobile status/priority badges */}
                    <div className="mb-4 flex flex-wrap gap-2 sm:hidden">
                      <span
                        className={`px-2.5 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider font-medium ${reqStatusStyle.bg} ${reqStatusStyle.text}`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider font-medium ${reqPriorityStyle.bg} ${reqPriorityStyle.text}`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    {/* Messages thread */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={13} className="text-white/20" />
                        <span className="font-mono-accent text-[11px] uppercase tracking-wider font-medium text-white/30">
                          Messages
                        </span>
                      </div>

                      {loadingMessages ? (
                        <div className="flex items-center gap-2 py-3">
                          <Loader2 size={14} className="animate-spin text-white/20" />
                          <span className="text-[12px] text-white/20">Loading messages...</span>
                        </div>
                      ) : expandedMessages.length > 0 ? (
                        expandedMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`px-4 py-3 ${
                              msg.isAdmin
                                ? "border border-[#FF541F]/10 bg-[#FF541F]/5"
                                : "border border-white/[0.04] bg-white/[0.02]"
                            }`}
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <span className="font-mono-accent text-[11px] uppercase tracking-wider font-medium text-white/50">
                                {msg.isAdmin ? "Connecto Team" : "You"}
                              </span>
                              <span className="text-[10px] text-white/15">
                                {new Date(msg.createdAt).toLocaleDateString()}{" "}
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-[13px] text-white/60">
                              {msg.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="font-mono-accent text-[11px] uppercase tracking-wider text-white/15">
                          No messages yet
                        </p>
                      )}

                      {/* Reply input */}
                      {replyingTo === req.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(req.id);
                              }
                            }}
                            placeholder="Type your reply..."
                            className="flex-1 border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-white placeholder-white/15 outline-none focus:border-[#FF541F]/30"
                            autoFocus
                          />
                          <button
                            onClick={() => handleReply(req.id)}
                            disabled={sendingReply || !replyContent.trim()}
                            className="flex h-[42px] w-[42px] items-center justify-center bg-[#FF541F] text-white transition-colors hover:bg-[#FF541F]/90 disabled:opacity-50"
                          >
                            {sendingReply ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Send size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                            className="flex h-[42px] w-[42px] items-center justify-center border border-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(req.id)}
                          className="font-mono-accent text-[11px] tracking-wider text-white/30 hover:text-[#FF541F] transition-colors flex items-center gap-2"
                        >
                          <MessageSquare size={12} />
                          REPLY
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center border border-dashed border-white/[0.06]">
          <FileText size={28} className="mb-3 text-white/10" />
          <p className="text-[14px] text-white/30">No requests found</p>
        </div>
      )}

      {/* Slide-in Panel Overlay */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeForm}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[540px] border-l border-white/[0.06] bg-[#0a0a0a] transition-transform duration-300 ease-out ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
            <div>
              <h3 className="font-mono-accent text-[13px] uppercase tracking-wider text-white">
                New Request
              </h3>
              <p className="mt-1 text-[12px] text-white/25">
                Submit a new task or feature request
              </p>
            </div>
            <button
              onClick={closeForm}
              className="flex h-10 w-10 items-center justify-center border border-white/[0.06] bg-white/[0.02] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 space-y-6 px-6 py-6">
            {submitError && (
              <div className="flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-2">
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-[12px] text-red-400">{submitError}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="mb-2 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Brief summary of your request"
                className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[13px] text-white placeholder-white/15 outline-none transition-colors focus:border-[#FF541F]/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                Description
              </label>
              <textarea
                rows={6}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe what you need in detail..."
                className="w-full resize-none border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[13px] text-white placeholder-white/15 outline-none transition-colors focus:border-[#FF541F]/30"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-2">
                {priorityOptions.map((p) => {
                  const isActive = formPriority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setFormPriority(p)}
                      className={`border px-3 py-2.5 font-mono-accent text-[11px] uppercase tracking-wider transition-colors ${
                        isActive
                          ? "border-[#FF541F] bg-[#FF541F]/10 text-[#FF541F]"
                          : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project */}
            <div>
              <label className="mb-2 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                Project
              </label>
              <div className="relative">
                {projects.length > 0 ? (
                  <>
                    <select
                      value={formProjectId}
                      onChange={(e) => setFormProjectId(e.target.value)}
                      className="w-full appearance-none border border-white/[0.06] bg-white/[0.02] px-4 py-3 pr-10 text-[13px] text-white outline-none transition-colors focus:border-[#FF541F]/30"
                    >
                      {projects.map((proj) => (
                        <option
                          key={proj.id}
                          value={proj.id}
                          className="bg-[#0a0a0a] text-white"
                        >
                          {proj.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/20"
                    />
                  </>
                ) : (
                  <p className="text-[13px] text-white/30">
                    No projects yet.{" "}
                    <a
                      href="/dashboard/projects"
                      className="text-[#FF541F] hover:underline"
                    >
                      Create one first
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* File Upload Placeholder */}
            <div>
              <label className="mb-2 flex items-center gap-2 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                <Upload size={12} />
                Attachments
              </label>
              <div className="flex h-28 flex-col items-center justify-center border border-dashed border-white/[0.06] bg-white/[0.01]">
                <Upload size={20} className="mb-2 text-white/10" />
                <span className="font-mono-accent text-[11px] uppercase tracking-wider text-white/15">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Panel Footer */}
          <div className="border-t border-white/[0.06] px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting || projects.length === 0}
                className="inline-flex items-center gap-0"
              >
                <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider flex items-center gap-2 disabled:opacity-50">
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : null}
                  {submitting ? "SUBMITTING..." : "SUBMIT REQUEST"}
                </span>
                <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10">
                  <ArrowRight size={14} />
                </span>
              </button>
              <button
                onClick={closeForm}
                className="border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 font-mono-accent text-[12px] uppercase tracking-wider text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
