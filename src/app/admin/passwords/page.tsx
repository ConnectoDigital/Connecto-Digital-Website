"use client";

import { useState } from "react";
import {
  KeyRound,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  Check,
} from "lucide-react";

interface PasswordEntry {
  id: string;
  platform: string;
  url: string;
  username: string;
  password: string;
  notes: string;
  category: string;
  updatedAt: string;
}

const CATEGORIES = ["ALL", "HOSTING", "DOMAINS", "TOOLS", "SOCIAL", "EMAIL", "OTHER"] as const;

const mockPasswords: PasswordEntry[] = [
  {
    id: "1",
    platform: "Vercel",
    url: "https://vercel.com",
    username: "admin@connectodigital.com",
    password: "V3rc3l$ecure!2026",
    notes: "Main deployment platform for all client projects",
    category: "HOSTING",
    updatedAt: "2026-03-20",
  },
  {
    id: "2",
    platform: "Namecheap",
    url: "https://namecheap.com",
    username: "connecto_domains",
    password: "D0m@ins#Secure99",
    notes: "Domain registrar — all .com and .aw domains",
    category: "DOMAINS",
    updatedAt: "2026-03-15",
  },
  {
    id: "3",
    platform: "Stripe",
    url: "https://dashboard.stripe.com",
    username: "billing@connectodigital.com",
    password: "Str1p3P@yments!",
    notes: "Payment processing for subscriptions",
    category: "TOOLS",
    updatedAt: "2026-03-18",
  },
  {
    id: "4",
    platform: "Instagram Business",
    url: "https://instagram.com",
    username: "@connectodigital",
    password: "S0c1@lM3dia#2026",
    notes: "Main business Instagram account",
    category: "SOCIAL",
    updatedAt: "2026-02-28",
  },
  {
    id: "5",
    platform: "Google Workspace",
    url: "https://admin.google.com",
    username: "admin@connectodigital.com",
    password: "G00gl3W0rk$p@ce!",
    notes: "Company email and Google services admin",
    category: "EMAIL",
    updatedAt: "2026-03-10",
  },
  {
    id: "6",
    platform: "Figma",
    url: "https://figma.com",
    username: "design@connectodigital.com",
    password: "F1gm@D3sign!Pro",
    notes: "Design team account — Organization plan",
    category: "TOOLS",
    updatedAt: "2026-03-22",
  },
];

export default function PasswordsPage() {
  const [passwords, setPasswords] = useState(mockPasswords);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [masterUnlocked, setMasterUnlocked] = useState(false);
  const [masterInput, setMasterInput] = useState("");

  // Master password gate
  if (!masterUnlocked) {
    return (
      <div className="mx-auto max-w-md space-y-6 pt-20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#FF541F]/10">
            <KeyRound size={24} className="text-[#FF541F]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Protected Area</h2>
          <p className="mt-2 text-sm text-white/40">
            Enter master password to access credentials
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // In production, validate against hashed master password
            if (masterInput.length > 0) {
              setMasterUnlocked(true);
            }
          }}
          className="space-y-4"
        >
          <input
            type="password"
            value={masterInput}
            onChange={(e) => setMasterInput(e.target.value)}
            placeholder="Master password"
            className="w-full border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="w-full font-mono-accent text-[12px] bg-[#FF541F] text-white py-3 tracking-wider hover:bg-[#FF541F]/90 transition-colors"
          >
            UNLOCK
          </button>
        </form>
      </div>
    );
  }

  const filtered = passwords.filter((p) => {
    const matchesSearch =
      p.platform.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "ALL" || p.category === category;
    return matchesSearch && matchesCat;
  });

  function toggleVisibility(id: string) {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function copyPassword(id: string, password: string) {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function deletePassword(id: string) {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-white">
            Passwords
          </h2>
          <p className="mt-0.5 font-mono-accent text-[11px] tracking-wider text-white/30">
            {passwords.length} CREDENTIALS STORED
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMasterUnlocked(false)}
            className="font-mono-accent text-[11px] border border-white/[0.06] px-4 py-2 tracking-wider text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-colors"
          >
            LOCK
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-0"
          >
            <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors flex items-center gap-2 tracking-wider">
              <Plus size={14} />
              ADD
            </span>
            <span className="w-10 h-[42px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
              +
            </span>
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search platforms..."
            className="w-full border border-white/[0.06] bg-white/[0.02] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none"
          />
        </div>
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-3 py-2 font-mono-accent text-[10px] tracking-wider border border-white/[0.06] transition-colors ${
                c !== "ALL" ? "border-l-0" : ""
              } ${
                category === c
                  ? "bg-white/5 text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = new FormData(form);
            setPasswords((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                platform: data.get("platform") as string,
                url: data.get("url") as string,
                username: data.get("username") as string,
                password: data.get("pwd") as string,
                notes: data.get("notes") as string,
                category: data.get("category") as string,
                updatedAt: new Date().toISOString().split("T")[0],
              },
            ]);
            setShowAdd(false);
            form.reset();
          }}
          className="border border-white/[0.06] bg-white/[0.02] p-6 space-y-4"
        >
          <h3 className="font-mono-accent text-[11px] tracking-wider text-white/40">
            ADD NEW CREDENTIAL
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="platform" placeholder="Platform name" required className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="url" placeholder="URL" className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="username" placeholder="Username / Email" required className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="pwd" type="password" placeholder="Password" required className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <input name="notes" placeholder="Notes (optional)" className="border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#FF541F]/30 focus:outline-none" />
            <select name="category" className="border border-white/[0.06] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white focus:border-[#FF541F]/30 focus:outline-none">
              {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 tracking-wider">SAVE</button>
            <button type="button" onClick={() => setShowAdd(false)} className="font-mono-accent text-[12px] border border-white/[0.06] px-5 py-2.5 tracking-wider text-white/40 hover:text-white transition-colors">CANCEL</button>
          </div>
        </form>
      )}

      {/* Password list */}
      <div className="space-y-2">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FF541F]/10">
                <KeyRound size={16} className="text-[#FF541F]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-[15px] font-semibold text-white">
                    {entry.platform}
                  </h4>
                  <span className="font-mono-accent text-[9px] tracking-wider text-white/20 bg-white/5 px-2 py-0.5">
                    {entry.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  <div>
                    <span className="font-mono-accent text-[9px] tracking-wider text-white/20 block mb-0.5">USERNAME</span>
                    <span className="text-sm text-white/60">{entry.username}</span>
                  </div>
                  <div>
                    <span className="font-mono-accent text-[9px] tracking-wider text-white/20 block mb-0.5">PASSWORD</span>
                    <span className="text-sm text-white/60 font-mono">
                      {visibleIds.has(entry.id)
                        ? entry.password
                        : "••••••••••••"}
                    </span>
                  </div>
                </div>

                {entry.notes && (
                  <p className="mt-2 text-[12px] text-white/25">{entry.notes}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisibility(entry.id)}
                  className="p-2 text-white/20 hover:text-white/60 transition-colors"
                  title={visibleIds.has(entry.id) ? "Hide" : "Show"}
                >
                  {visibleIds.has(entry.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => copyPassword(entry.id, entry.password)}
                  className="p-2 text-white/20 hover:text-white/60 transition-colors"
                  title="Copy password"
                >
                  {copiedId === entry.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                {entry.url && (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/20 hover:text-white/60 transition-colors"
                    title="Open platform"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  onClick={() => deletePassword(entry.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
