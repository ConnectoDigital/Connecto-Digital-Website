"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import {
  User,
  CreditCard,
  Users,
  Receipt,
  Plus,
  Download,
  Mail,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

type Tab = "profile" | "subscription" | "billing" | "team";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "PROFILE", icon: <User size={14} /> },
  { id: "subscription", label: "SUBSCRIPTION", icon: <CreditCard size={14} /> },
  { id: "billing", label: "BILLING", icon: <Receipt size={14} /> },
  { id: "team", label: "TEAM", icon: <Users size={14} /> },
];

const mockInvoices = [
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$5,000.00", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "$5,000.00", status: "Paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: "$5,000.00", status: "Paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: "$3,500.00", status: "Paid" },
];

const mockTeamMembers = [
  { name: "Juan Diego Rebolledo", email: "juan@connecto.dev", role: "Owner" },
  { name: "Sofia Martinez", email: "sofia@connecto.dev", role: "Admin" },
];

const mockPendingInvites = [
  { email: "carlos@example.com", role: "Member", sentAt: "Mar 20, 2026" },
];

interface ProfileData {
  companyName: string;
  website: string;
  industry: string;
}

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    companyName: "",
    website: "",
    industry: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Subscription state
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  // Team state (mock)
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/settings/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        if (data.onboarding) {
          setProfileData({
            companyName: data.onboarding.companyName || "",
            website: data.onboarding.website || "",
            industry: data.onboarding.industry || "",
          });
        }

        if (data.subscription) {
          setSubscription(data.subscription);
        }
      } catch (err) {
        setProfileError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setProfileLoading(false);
        setSubLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Also fetch stats for subscription tab if needed
  useEffect(() => {
    if (activeTab === "subscription" && !subscription) {
      async function fetchStats() {
        try {
          const res = await fetch("/api/dashboard/stats");
          if (!res.ok) return;
          const data = await res.json();
          if (data.plan) {
            setSubscription({
              plan: data.plan,
              status: data.subscriptionStatus || "ACTIVE",
              currentPeriodEnd: null,
            });
          }
        } catch {
          // silently fail
        } finally {
          setSubLoading(false);
        }
      }
      fetchStats();
    }
  }, [activeTab, subscription]);

  async function handleSaveProfile() {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setProfileSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-white/[0.06]">
        <nav className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-3 font-mono-accent text-[11px] uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF541F]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
            Personal Information
          </h3>

          {profileLoading ? (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="mb-1.5 h-3 w-20 animate-pulse bg-white/[0.04]" />
                  <div className="h-10 animate-pulse bg-white/[0.03]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Toast messages */}
              {profileSuccess && (
                <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <p className="text-[12px] text-emerald-400">Profile saved successfully</p>
                </div>
              )}
              {profileError && (
                <div className="flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-2">
                  <AlertCircle size={14} className="text-red-400" />
                  <p className="text-[12px] text-red-400">{profileError}</p>
                </div>
              )}

              <div>
                <label className="mb-1.5 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  Full Name
                </label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  disabled
                  className="w-full border border-white/[0.06] bg-white/[0.01] px-4 py-2.5 text-[14px] text-white/40 outline-none cursor-not-allowed"
                />
                <p className="mt-1 text-[11px] text-white/20">
                  Managed by your authentication provider
                </p>
              </div>

              <div>
                <label className="mb-1.5 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  Email Address
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full border border-white/[0.06] bg-white/[0.01] px-4 py-2.5 text-[14px] text-white/40 outline-none cursor-not-allowed"
                />
                <p className="mt-1 text-[11px] text-white/20">
                  Managed by your authentication provider
                </p>
              </div>

              <div>
                <label className="mb-1.5 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profileData.companyName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, companyName: e.target.value })
                  }
                  placeholder="Your company name"
                  className="w-full border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#FF541F]/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  Website
                </label>
                <input
                  type="url"
                  value={profileData.website}
                  onChange={(e) =>
                    setProfileData({ ...profileData, website: e.target.value })
                  }
                  placeholder="https://yourcompany.com"
                  className="w-full border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#FF541F]/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                  Industry
                </label>
                <input
                  type="text"
                  value={profileData.industry}
                  onChange={(e) =>
                    setProfileData({ ...profileData, industry: e.target.value })
                  }
                  placeholder="e.g. Technology, E-commerce, Healthcare"
                  className="w-full border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#FF541F]/40"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="flex items-center gap-2 bg-[#FF541F] px-5 py-2.5 font-mono-accent text-[12px] uppercase tracking-wider text-white transition-colors hover:bg-[#FF541F]/90 disabled:opacity-50"
                >
                  {profileSaving ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Current Plan
            </h3>

            {subLoading ? (
              <div className="space-y-4">
                <div className="h-8 w-40 animate-pulse bg-white/[0.04]" />
                <div className="h-4 w-64 animate-pulse bg-white/[0.03]" />
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-baseline justify-between">
                  <div>
                    <span className="font-mono-accent text-[22px] font-bold text-white">
                      {subscription?.plan || "FREE"}
                    </span>
                    {subscription?.currentPeriodEnd && (
                      <span className="ml-3 text-[14px] text-white/40">
                        Renews{" "}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    )}
                  </div>
                  <span
                    className={`border px-3 py-1 font-mono-accent text-[11px] uppercase tracking-wider ${
                      subscription?.status === "ACTIVE"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : subscription?.status === "PAUSED"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : subscription?.status === "CANCELLED"
                            ? "border-red-500/20 bg-red-500/10 text-red-400"
                            : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    {subscription?.status || "No subscription"}
                  </span>
                </div>

                {/* Plan Comparison */}
                <div className="border border-white/[0.06]">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                        <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                          Plan
                        </th>
                        <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                          Price
                        </th>
                        <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                          Requests
                        </th>
                        <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                          Support
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className={`border-b border-white/[0.06] ${
                          subscription?.plan === "STARTER" ? "bg-[#FF541F]/[0.04]" : ""
                        }`}
                      >
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "STARTER" ? "font-medium text-white" : "text-white/60"}`}>
                          Starter
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "STARTER" ? "text-white" : "text-white/60"}`}>
                          $3,500/mo
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "STARTER" ? "text-white" : "text-white/60"}`}>1</td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "STARTER" ? "text-white" : "text-white/60"}`}>
                          Email
                        </td>
                        <td className="px-4 py-3 text-right">
                          {subscription?.plan === "STARTER" ? (
                            <span className="font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F]">
                              Current
                            </span>
                          ) : (
                            <Link
                              href="/get-started"
                              className="border border-white/[0.06] px-3 py-1.5 font-mono-accent text-[11px] uppercase tracking-wider text-white/40 transition-colors hover:border-white/20 hover:text-white"
                            >
                              {subscription?.plan === "GROWTH" || subscription?.plan === "EMBEDDED"
                                ? "Downgrade"
                                : "Select"}
                            </Link>
                          )}
                        </td>
                      </tr>
                      <tr
                        className={`border-b border-white/[0.06] ${
                          subscription?.plan === "GROWTH" ? "bg-[#FF541F]/[0.04]" : ""
                        }`}
                      >
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "GROWTH" ? "font-medium text-white" : "text-white/60"}`}>
                          Growth
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "GROWTH" ? "text-white" : "text-white/60"}`}>
                          $5,000/mo
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "GROWTH" ? "text-white" : "text-white/60"}`}>2</td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "GROWTH" ? "text-white" : "text-white/60"}`}>
                          Priority
                        </td>
                        <td className="px-4 py-3 text-right">
                          {subscription?.plan === "GROWTH" ? (
                            <span className="font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F]">
                              Current
                            </span>
                          ) : (
                            <Link
                              href="/get-started"
                              className="border border-[#FF541F] px-3 py-1.5 font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F] transition-colors hover:bg-[#FF541F] hover:text-white"
                            >
                              {subscription?.plan === "EMBEDDED" ? "Downgrade" : "Upgrade"}
                            </Link>
                          )}
                        </td>
                      </tr>
                      <tr
                        className={
                          subscription?.plan === "EMBEDDED" ? "bg-[#FF541F]/[0.04]" : ""
                        }
                      >
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "EMBEDDED" ? "font-medium text-white" : "text-white/60"}`}>
                          Embedded
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "EMBEDDED" ? "text-white" : "text-white/60"}`}>
                          Custom
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "EMBEDDED" ? "text-white" : "text-white/60"}`}>
                          Unlimited
                        </td>
                        <td className={`px-4 py-3 text-[13px] ${subscription?.plan === "EMBEDDED" ? "text-white" : "text-white/60"}`}>
                          Dedicated
                        </td>
                        <td className="px-4 py-3 text-right">
                          {subscription?.plan === "EMBEDDED" ? (
                            <span className="font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F]">
                              Current
                            </span>
                          ) : (
                            <Link
                              href="/get-started"
                              className="border border-[#FF541F] px-3 py-1.5 font-mono-accent text-[11px] uppercase tracking-wider text-[#FF541F] transition-colors hover:bg-[#FF541F] hover:text-white"
                            >
                              Upgrade
                            </Link>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Subscription Actions */}
          <div className="flex items-center gap-6 border-t border-white/[0.06] pt-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-0"
            >
              <span className="font-mono-accent text-[12px] bg-[#FF541F] text-white px-5 py-2.5 hover:bg-[#FF541F]/90 transition-colors tracking-wider flex items-center gap-2">
                CHANGE PLAN
              </span>
              <span className="w-10 h-[38px] bg-[#FF541F] text-white flex items-center justify-center text-lg border-l border-white/10 hover:bg-[#FF541F]/90 transition-colors">
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Payment Method
            </h3>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center border border-white/[0.06] bg-white/[0.04]">
                <CreditCard size={20} className="text-white/60" />
              </div>
              <div>
                <p className="text-[14px] text-white">Visa ending in 4242</p>
                <p className="text-[12px] text-white/40">Expires 12/2028</p>
              </div>
            </div>

            <button className="border border-white/[0.06] px-4 py-2.5 font-mono-accent text-[11px] uppercase tracking-wider text-white/60 transition-colors hover:border-white/20 hover:text-white">
              Update Payment Method
            </button>
          </div>

          {/* Invoice History */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Invoice History
            </h3>

            <div className="border border-white/[0.06]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                      Invoice
                    </th>
                    <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                      Date
                    </th>
                    <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                      Amount
                    </th>
                    <th className="px-4 py-3 font-mono-accent text-[11px] uppercase tracking-wider text-white/40">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-white/[0.06] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-mono-accent text-[12px] text-white/60">
                        {invoice.id}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white/60">
                        {invoice.date}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-white">
                        {invoice.amount}
                      </td>
                      <td className="px-4 py-3">
                        <span className="border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono-accent text-[10px] uppercase tracking-wider text-emerald-400">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="flex items-center gap-1.5 text-[12px] text-white/40 transition-colors hover:text-[#FF541F]">
                          <Download size={12} />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Team Members */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Team Members
            </h3>

            <div className="space-y-3">
              {mockTeamMembers.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-white/[0.06] font-mono-accent text-[11px] text-white/60">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[13px] text-white">{member.name}</p>
                      <p className="text-[12px] text-white/40">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`border px-2.5 py-1 font-mono-accent text-[10px] uppercase tracking-wider ${
                      member.role === "Owner"
                        ? "border-[#FF541F]/20 bg-[#FF541F]/10 text-[#FF541F]"
                        : "border-white/[0.06] bg-white/[0.04] text-white/60"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Member */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Invite Member
            </h3>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full border border-white/[0.06] bg-white/[0.03] py-2.5 pl-9 pr-4 text-[13px] text-white outline-none placeholder:text-white/20 focus:border-[#FF541F]/40"
                />
              </div>

              <div className="relative">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="h-full appearance-none border border-white/[0.06] bg-white/[0.03] py-2.5 pl-3 pr-8 font-mono-accent text-[11px] uppercase tracking-wider text-white/60 outline-none focus:border-[#FF541F]/40"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30"
                />
              </div>

              <button className="flex items-center gap-2 bg-[#FF541F] px-5 py-2.5 font-mono-accent text-[12px] uppercase tracking-wider text-white transition-colors hover:bg-[#FF541F]/90">
                <Plus size={14} />
                Invite
              </button>
            </div>
          </div>

          {/* Pending Invitations */}
          <div className="border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-6 font-mono-accent text-[12px] uppercase tracking-wider text-white/40">
              Pending Invitations
            </h3>

            {mockPendingInvites.length > 0 ? (
              <div className="space-y-3">
                {mockPendingInvites.map((invite) => (
                  <div
                    key={invite.email}
                    className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                  >
                    <div>
                      <p className="text-[13px] text-white">{invite.email}</p>
                      <p className="text-[12px] text-white/40">
                        Sent {invite.sentAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono-accent text-[10px] uppercase tracking-wider text-amber-400">
                        Pending
                      </span>
                      <button className="font-mono-accent text-[11px] uppercase tracking-wider text-white/30 transition-colors hover:text-red-400">
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-white/30">
                No pending invitations.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
