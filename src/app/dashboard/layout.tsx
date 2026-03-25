"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Rocket,
} from "lucide-react";
import { DashboardThemeProvider, useDashboardTheme } from "@/lib/theme-context";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Requests", href: "/dashboard/requests", icon: FileText },
  { label: "Growth", href: "/dashboard/growth", icon: Rocket },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  if (pathname.startsWith("/dashboard/projects/")) return "Project Details";
  if (pathname === "/dashboard/projects") return "Projects";
  if (pathname === "/dashboard/requests") return "Requests";
  if (pathname === "/dashboard/growth") return "Growth";
  if (pathname === "/dashboard/messages") return "Messages";
  if (pathname === "/dashboard/settings") return "Settings";
  return "Dashboard";
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { theme, toggle } = useDashboardTheme();

  const user = session?.user;
  const pageTitle = getPageTitle(pathname);

  const isDark = theme === "dark";

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always black */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.06] bg-black
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
          <Image
            src="/connecto-logo.png"
            alt="Connecto Digital"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Connecto Digital
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-white/40 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 font-mono-accent text-[12px] tracking-wider transition-all ${
                  isActive
                    ? "bg-white/5 text-white border-l-2 border-[#FF541F]"
                    : "text-white/40 hover:bg-white/[0.03] hover:text-white/70 border-l-2 border-transparent"
                }`}
              >
                <Icon size={16} strokeWidth={1.8} className={isActive ? "text-white" : "text-white/25 group-hover:text-white/50"} />
                {item.label.toUpperCase()}
                {isActive && (
                  <ChevronRight size={12} className="ml-auto text-white/20" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#FF541F]/10 text-[12px] font-semibold text-[#FF541F]">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                {user?.name || "User"}
              </p>
              <p className="truncate font-mono-accent text-[10px] text-white/25">
                {user?.email || "user@email.com"}
              </p>
            </div>
            <span className="font-mono-accent bg-[#FF541F]/10 px-1.5 py-0.5 text-[9px] text-[#FF541F]">
              PRO
            </span>
          </div>
          <button
            onClick={() => authClient.signOut().then(() => window.location.href = "/")}
            className="flex w-full items-center gap-2 px-3 py-2 font-mono-accent text-[11px] tracking-wider text-white/30 transition-colors hover:bg-white/[0.03] hover:text-white/60"
          >
            <LogOut size={14} strokeWidth={1.8} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main area — themed */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-[#0a0a0a]" : "bg-[#f5f5f0]"
        }`}
      >
        {/* Top bar */}
        <header
          className={`flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 lg:px-8 transition-colors duration-300 ${
            isDark ? "border-white/[0.06]" : "border-black/[0.06]"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden ${isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"}`}
            >
              <Menu size={22} />
            </button>
            <h1
              className={`text-[16px] font-semibold tracking-tight transition-colors duration-300 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              isDark
                ? "text-white/40 hover:bg-white/5 hover:text-white"
                : "text-black/40 hover:bg-black/5 hover:text-black"
            }`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 lg:p-8 transition-colors duration-300 ${
            isDark ? "" : "dashboard-light"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardThemeProvider>
      <DashboardInner>{children}</DashboardInner>
    </DashboardThemeProvider>
  );
}
