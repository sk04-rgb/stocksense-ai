import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Inbox } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { listReports } from "@/lib/analysis.functions";
import { getSessionId } from "@/lib/session";
import { BIAS_LABELS } from "@/lib/services/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [{ title: "History — StockSense AI" }],
  }),
  component: HistoryPage,
});

const recoColor = {
  proceed: "text-success border-success/40 bg-success/10",
  caution: "text-warning border-warning/40 bg-warning/10",
  avoid: "text-destructive border-destructive/40 bg-destructive/10",
} as const;

function HistoryPage() {
  const list = useServerFn(listReports);
  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => list({ data: { session_id: getSessionId() } }),
  });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "proceed" | "caution" | "avoid">("all");

  const filtered = useMemo(() => {
    const items = data ?? [];
    return items.filter((r) => {
      if (filter !== "all" && r.recommendation !== filter) return false;
      if (q && !r.stock_name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [data, q, filter]);

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Decision audit trail</p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">History</h1>
            <p className="mt-2 text-sm text-muted-foreground">Every analysis you've run, with biases and readiness scores.</p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            New analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by stock…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-secondary/40 p-1">
            {(["all", "proceed", "caution", "avoid"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-md capitalize ${filter === f ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground py-16">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border/60">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No analyses yet.</p>
            <Link to="/analyze" className="mt-4 inline-block text-sm text-primary">Run your first analysis →</Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((r) => {
              const topBiases = [...r.bias_scores]
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .filter((b) => b.score >= 40);
              return (
                <Link
                  key={r.id}
                  to="/results/$id"
                  params={{ id: r.id }}
                  className="group rounded-xl border border-border/60 p-5 transition-colors hover:border-primary/40"
                  style={{ background: "var(--gradient-card)" }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold tracking-tight">{r.stock_name}</h3>
                        <span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-0.5 ${recoColor[r.recommendation]}`}>
                          {r.recommendation}
                        </span>
                        <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 max-w-2xl">{r.reason}</p>
                      {topBiases.length > 0 ? (
                        <div className="mt-3 flex gap-1.5 flex-wrap">
                          {topBiases.map((b) => (
                            <span key={b.bias_type} className="text-[10px] uppercase tracking-wider rounded-full bg-secondary/80 px-2 py-0.5 text-muted-foreground">
                              {BIAS_LABELS[b.bias_type]} · {b.score}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Readiness</div>
                      <div className="text-2xl font-semibold tabular-nums">{r.readiness_score}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </AppShell>
  );
}