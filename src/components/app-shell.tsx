import { Link } from "@tanstack/react-router";
import { Brain, History, Eye, LayoutDashboard, Home } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/analyze", label: "Analyze", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/watchlist", label: "Watchlist", icon: Eye },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
              <Brain className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">StockSense AI</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Behavioral Finance Agent</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary/60 transition-colors"
                activeProps={{ className: "text-foreground bg-secondary/80" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/analyze"
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95 transition-opacity",
            )}
          >
            New Analysis
          </Link>
        </div>
        <nav className="flex md:hidden items-center gap-1 overflow-x-auto px-4 pb-2 -mt-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-muted-foreground bg-secondary/40"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              <n.icon className="h-3.5 w-3.5" /> {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/60 mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 text-sm text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StockSense AI — Think before you invest.</p>
          <p className="text-xs">Educational decision-support tool. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}