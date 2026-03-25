"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Target,
  KeyRound,
  UserCog,
  ListTodo,
  ShoppingBag,
  ArrowRightLeft,
} from "lucide-react";
import { DashboardThemeProvider, useDashboardTheme } from "@/lib/theme-context";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "To-Do", href: "/admin/todos", icon: ListTodo },
  { label: "Leads", href: "/admin/leads", icon: Target },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Requests", href: "/admin/requests", icon: FileText },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Services", href: "/admin/services", icon: ShoppingBag },
  { label: "Passwords", href: "/admin/passwords", icon: KeyRound },
  { label: "User Mgmt", href: "/admin/users", icon: UserCog },
];

function AdminInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user ?? { name: "Admin", email: "admin@connectodigital.com" };
  const { theme, toggle } = useDashboardTheme();

  const isDark = theme === "dark";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar — always black */}
      <aside className="flex w-64 flex-col border-r border-white/[0.06] bg-black shrink-0">
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-5">
          <span className="font-mono-accent text-lg font-bold tracking-tight text-white">
            connecto
          </span>
          <span className="rounded bg-[#FF541F]/15 px-2 py-0.5 font-mono-accent text-[10px] font-bold uppercase tracking-widest text-[#FF541F]">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 font-mono-accent text-[12px] tracking-wider transition-all ${
                  active
                    ? "bg-[#FF541F]/10 text-[#FF541F] border-l-2 border-[#FF541F]"
                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70 border-l-2 border-transparent"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  className={active ? "text-[#FF541F]" : "text-white/25 group-hover:text-white/50"}
                />
                {item.label.toUpperCase()}
                {active && (
                  <ChevronRight size={12} className="ml-auto text-[#FF541F]/40" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/[0.06] px-3 py-4">
          <div className="mb-3 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#FF541F]/15 text-[11px] font-bold text-[#FF541F]">
              {user.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-[13px] font-medium text-white/80">
                {user.name ?? "Admin"}
              </p>
              <p className="truncate font-mono-accent text-[10px] text-white/25">
                {user.email}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex w-full items-center gap-3 px-3 py-2 font-mono-accent text-[11px] tracking-wider text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
          >
            <ArrowRightLeft size={14} />
            CLIENT VIEW
          </Link>
          <button
            onClick={() => authClient.signOut().then(() => window.location.href = "/")}
            className="flex w-full items-center gap-3 px-3 py-2 font-mono-accent text-[11px] tracking-wider text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
          >
            <LogOut size={14} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Content — themed */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-[#0a0a0a]" : "bg-[#f5f5f0]"
        }`}
      >
        {/* Top bar */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between px-8 border-b transition-colors duration-300 ${
            isDark ? "border-white/[0.06]" : "border-black/[0.06]"
          }`}
        >
          <h1
            className={`text-sm font-semibold tracking-tight transition-colors duration-300 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {navItems.find((n) => isActive(n.href))?.label ?? "Admin"}
          </h1>

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
          className={`flex-1 overflow-y-auto transition-colors duration-300 ${
            isDark ? "" : "dashboard-light"
          }`}
        >
          <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardThemeProvider>
      <AdminInner>{children}</AdminInner>
    </DashboardThemeProvider>
  );
}
