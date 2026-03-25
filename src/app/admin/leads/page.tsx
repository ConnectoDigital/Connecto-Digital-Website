"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Paperclip,
  Mail,
  DollarSign,
  Search,
  ChevronDown,
} from "lucide-react";

type ServiceType =
  | "DEVELOPMENT"
  | "WEBSITE"
  | "MARKETING_MONTHLY"
  | "DEV_MAINTENANCE"
  | "WEBSITE_MAINTENANCE";

type LeadStage =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

interface Lead {
  id: string;
  name: string;
  email: string;
  serviceType: ServiceType;
  dealAmount: number;
  stage: LeadStage;
  attachments: number;
  createdAt: string;
  notes?: string;
}

const serviceLabels: Record<ServiceType, { label: string; color: string }> = {
  DEVELOPMENT: { label: "DEVELOPMENT", color: "text-[#FF541F] bg-[#FF541F]/10" },
  WEBSITE: { label: "WEBSITE", color: "text-blue-400 bg-blue-500/10" },
  MARKETING_MONTHLY: { label: "MARKETING", color: "text-purple-400 bg-purple-500/10" },
  DEV_MAINTENANCE: { label: "DEV MAINT.", color: "text-emerald-400 bg-emerald-500/10" },
  WEBSITE_MAINTENANCE: { label: "WEB MAINT.", color: "text-amber-400 bg-amber-500/10" },
};

const stageColumns: { key: LeadStage; label: string; accent: string }[] = [
  { key: "NEW", label: "NEW", accent: "border-t-white/30" },
  { key: "CONTACTED", label: "CONTACTED", accent: "border-t-blue-400" },
  { key: "QUALIFIED", label: "QUALIFIED", accent: "border-t-purple-400" },
  { key: "PROPOSAL", label: "PROPOSAL", accent: "border-t-amber-400" },
  { key: "NEGOTIATION", label: "NEGOTIATION", accent: "border-t-[#FF541F]" },
  { key: "WON", label: "WON", accent: "border-t-emerald-500" },
  { key: "LOST", label: "LOST", accent: "border-t-red-500" },
];

const initialLeads: Lead[] = [
  {
    id: "l1",
    name: "Maria Santos",
    email: "maria@tropicalresorts.aw",
    serviceType: "WEBSITE",
    dealAmount: 8000,
    stage: "NEW",
    attachments: 0,
    createdAt: "2026-03-22",
  },
  {
    id: "l2",
    name: "Carlos Maduro",
    email: "carlos@abclogistics.com",
    serviceType: "DEVELOPMENT",
    dealAmount: 25000,
    stage: "CONTACTED",
    attachments: 2,
    createdAt: "2026-03-20",
    notes: "Interested in a full logistics dashboard",
  },
  {
    id: "l3",
    name: "Ana de Vries",
    email: "ana@curacaotech.cw",
    serviceType: "MARKETING_MONTHLY",
    dealAmount: 5000,
    stage: "QUALIFIED",
    attachments: 1,
    createdAt: "2026-03-18",
    notes: "Needs monthly social media management",
  },
  {
    id: "l4",
    name: "James Richardson",
    email: "james@bonairedivers.com",
    serviceType: "WEBSITE",
    dealAmount: 12000,
    stage: "PROPOSAL",
    attachments: 3,
    createdAt: "2026-03-15",
    notes: "Sent proposal for diving booking platform",
  },
  {
    id: "l5",
    name: "Sofia Croes",
    email: "sofia@arubafoods.aw",
    serviceType: "DEV_MAINTENANCE",
    dealAmount: 2500,
    stage: "NEGOTIATION",
    attachments: 1,
    createdAt: "2026-03-12",
  },
  {
    id: "l6",
    name: "Diego Martijn",
    email: "diego@islandrealestate.aw",
    serviceType: "DEVELOPMENT",
    dealAmount: 18000,
    stage: "WON",
    attachments: 4,
    createdAt: "2026-02-28",
    notes: "Signed — starting next month",
  },
  {
    id: "l7",
    name: "Elena Petrova",
    email: "elena@caribbeancraft.com",
    serviceType: "WEBSITE_MAINTENANCE",
    dealAmount: 1500,
    stage: "WON",
    attachments: 0,
    createdAt: "2026-03-01",
  },
  {
    id: "l8",
    name: "Mark Johnson",
    email: "mark@sunsetbar.aw",
    serviceType: "WEBSITE",
    dealAmount: 4000,
    stage: "LOST",
    attachments: 1,
    createdAt: "2026-02-20",
    notes: "Went with another agency",
  },
  {
    id: "l9",
    name: "Priya Sharma",
    email: "priya@techstartup.cw",
    serviceType: "DEVELOPMENT",
    dealAmount: 30000,
    stage: "PROPOSAL",
    attachments: 2,
    createdAt: "2026-03-19",
    notes: "SaaS platform — high value",
  },
  {
    id: "l10",
    name: "Roberto Alvarez",
    email: "roberto@bonairewind.com",
    serviceType: "MARKETING_MONTHLY",
    dealAmount: 3000,
    stage: "NEW",
    attachments: 0,
    createdAt: "2026-03-23",
  },
];

const serviceTypes: ServiceType[] = [
  "DEVELOPMENT",
  "WEBSITE",
  "MARKETING_MONTHLY",
  "DEV_MAINTENANCE",
  "WEBSITE_MAINTENANCE",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    serviceType: "DEVELOPMENT" as ServiceType,
    dealAmount: "",
    notes: "",
  });

  const filtered = leads.filter(
    (l) =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pipeline stats
  const pipelineValue = leads
    .filter((l) => l.stage !== "LOST")
    .reduce((sum, l) => sum + l.dealAmount, 0);
  const wonValue = leads
    .filter((l) => l.stage === "WON")
    .reduce((sum, l) => sum + l.dealAmount, 0);

  function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    const lead: Lead = {
      id: `l${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      serviceType: newLead.serviceType,
      dealAmount: Number(newLead.dealAmount) || 0,
      stage: "NEW",
      attachments: 0,
      createdAt: new Date().toISOString().split("T")[0],
      notes: newLead.notes || undefined,
    };
    setLeads([lead, ...leads]);
    setNewLead({ name: "", email: "", serviceType: "DEVELOPMENT", dealAmount: "", notes: "" });
    setShowAddForm(false);
  }

  function moveStage(leadId: string, newStage: LeadStage) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage your sales pipeline and track deal progress.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-0"
        >
          <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
            <Plus size={14} />
            ADD LEAD
          </span>
          <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
            +
          </span>
        </button>
      </div>

      {/* Pipeline stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-white/[0.06] bg-white/[0.02] p-4">
          <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
            PIPELINE VALUE
          </span>
          <p className="mt-1 text-xl font-bold text-white">
            ${pipelineValue.toLocaleString()}
          </p>
        </div>
        <div className="border border-white/[0.06] bg-white/[0.02] p-4">
          <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
            WON DEALS
          </span>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            ${wonValue.toLocaleString()}
          </p>
        </div>
        <div className="border border-white/[0.06] bg-white/[0.02] p-4">
          <span className="font-mono-accent text-[10px] tracking-wider text-white/30">
            TOTAL LEADS
          </span>
          <p className="mt-1 text-xl font-bold text-white">{leads.length}</p>
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
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF541F]/40"
        />
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 min-w-[1400px]">
          {stageColumns.map((col) => {
            const columnLeads = filtered.filter((l) => l.stage === col.key);
            const colTotal = columnLeads.reduce((s, l) => s + l.dealAmount, 0);

            return (
              <div
                key={col.key}
                className={`flex w-[220px] shrink-0 flex-col border border-white/[0.06] bg-white/[0.01] border-t-2 ${col.accent}`}
              >
                {/* Column header */}
                <div className="border-b border-white/[0.06] px-3 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-accent text-[10px] font-bold tracking-widest text-white/60">
                      {col.label}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center bg-white/[0.06] font-mono-accent text-[10px] font-bold text-white/40">
                      {columnLeads.length}
                    </span>
                  </div>
                  {colTotal > 0 && (
                    <span className="font-mono-accent text-[10px] text-white/20">
                      ${colTotal.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Lead cards */}
                <div className="flex flex-1 flex-col gap-2 p-2 max-h-[600px] overflow-y-auto scrollbar-hide">
                  {columnLeads.length === 0 ? (
                    <div className="flex h-20 items-center justify-center border border-dashed border-white/[0.06]">
                      <span className="font-mono-accent text-[9px] text-white/15">
                        NO LEADS
                      </span>
                    </div>
                  ) : (
                    columnLeads.map((lead) => {
                      const svc = serviceLabels[lead.serviceType];
                      const isExpanded = expandedLead === lead.id;

                      return (
                        <div
                          key={lead.id}
                          className="border border-white/[0.06] bg-white/[0.02] p-3 hover:border-white/[0.12] transition-colors"
                        >
                          {/* Name + expand */}
                          <button
                            onClick={() =>
                              setExpandedLead(isExpanded ? null : lead.id)
                            }
                            className="w-full text-left flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-white truncate">
                                {lead.name}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Mail size={9} className="text-white/20" />
                                <span className="text-[10px] text-white/30 truncate">
                                  {lead.email}
                                </span>
                              </div>
                            </div>
                            <ChevronDown
                              size={12}
                              className={`shrink-0 text-white/20 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Service + Amount */}
                          <div className="flex items-center justify-between mt-2">
                            <span
                              className={`px-1.5 py-0.5 font-mono-accent text-[8px] tracking-wider ${svc.color}`}
                            >
                              {svc.label}
                            </span>
                            <span className="flex items-center gap-0.5 font-mono-accent text-[10px] font-bold text-white/60">
                              <DollarSign size={10} />
                              {lead.dealAmount.toLocaleString()}
                            </span>
                          </div>

                          {/* Attachments indicator */}
                          {lead.attachments > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Paperclip size={9} className="text-white/20" />
                              <span className="font-mono-accent text-[9px] text-white/20">
                                {lead.attachments} FILE
                                {lead.attachments > 1 ? "S" : ""}
                              </span>
                            </div>
                          )}

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
                              {lead.notes && (
                                <p className="text-[11px] text-white/40 leading-relaxed">
                                  {lead.notes}
                                </p>
                              )}
                              <p className="font-mono-accent text-[9px] text-white/15">
                                ADDED{" "}
                                {new Date(lead.createdAt).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </p>

                              {/* Move stage buttons */}
                              <div className="pt-1">
                                <span className="font-mono-accent text-[8px] tracking-wider text-white/20 block mb-1.5">
                                  MOVE TO
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {stageColumns
                                    .filter((s) => s.key !== lead.stage)
                                    .map((s) => (
                                      <button
                                        key={s.key}
                                        onClick={() =>
                                          moveStage(lead.id, s.key)
                                        }
                                        className="px-2 py-1 border border-white/[0.08] font-mono-accent text-[8px] tracking-wider text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
                                      >
                                        {s.label}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddForm(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-white/[0.06] bg-[#0a0a0a] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h2 className="font-mono-accent text-[13px] tracking-wider text-white">
                ADD NEW LEAD
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-5">
              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  NAME *
                </label>
                <input
                  type="text"
                  required
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  EMAIL *
                </label>
                <input
                  type="email"
                  required
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  placeholder="john@company.com"
                  className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  SERVICE TYPE *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceTypes.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        setNewLead({ ...newLead, serviceType: st })
                      }
                      className={`py-2.5 border font-mono-accent text-[10px] tracking-wider transition-all ${
                        newLead.serviceType === st
                          ? "border-[#FF541F] bg-[#FF541F]/10 text-white"
                          : "border-white/[0.06] text-white/30 hover:border-white/20"
                      }`}
                    >
                      {serviceLabels[st].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  DEAL AMOUNT ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newLead.dealAmount}
                  onChange={(e) =>
                    setNewLead({ ...newLead, dealAmount: e.target.value })
                  }
                  placeholder="5000"
                  className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  ATTACHMENTS
                </label>
                <div className="flex h-20 flex-col items-center justify-center gap-1 border-2 border-dashed border-white/[0.08] hover:border-[#FF541F]/20 transition-colors cursor-pointer">
                  <Paperclip size={16} className="text-white/20" />
                  <span className="font-mono-accent text-[10px] tracking-wider text-white/20">
                    DROP FILES OR CLICK
                  </span>
                </div>
              </div>

              <div>
                <label className="font-mono-accent mb-1.5 block text-[10px] tracking-wider text-white/30">
                  NOTES
                </label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) =>
                    setNewLead({ ...newLead, notes: e.target.value })
                  }
                  placeholder="Any additional context..."
                  rows={3}
                  className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="inline-flex items-center gap-0">
                  <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider">
                    ADD LEAD
                  </span>
                  <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10">
                    +
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="font-mono-accent text-[12px] border border-white/[0.06] px-5 py-2.5 tracking-wider text-white/40 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
