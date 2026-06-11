import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addWatchlist, listWatchlist, removeWatchlist } from "@/lib/analysis.functions";
import { getSessionId } from "@/lib/session";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — StockSense AI" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const qc = useQueryClient();
  const list = useServerFn(listWatchlist);
  const add = useServerFn(addWatchlist);
  const remove = useServerFn(removeWatchlist);

  const { data, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => list({ data: { session_id: getSessionId() } }),
  });

  const [stock, setStock] = useState("");
  const [note, setNote] = useState("");

  const addMut = useMutation({
    mutationFn: () =>
      add({ data: { session_id: getSessionId(), stock_name: stock.trim(), note: note.trim() } }),
    onSuccess: () => {
      setStock("");
      setNote("");
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Added to watchlist");
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Failed to add"),
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id, session_id: getSessionId() } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 md:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary">Saved for later</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Watchlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stocks you're considering. Cool off before you act on them.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (stock.trim()) addMut.mutate();
          }}
          className="mt-8 rounded-2xl border border-border/60 p-5 grid sm:grid-cols-[1fr_1.5fr_auto] gap-3"
          style={{ background: "var(--gradient-card)" }}
        >
          <Input placeholder="Stock (e.g. TSLA)" value={stock} onChange={(e) => setStock(e.target.value)} maxLength={80} />
          <Input placeholder="Note — why are you watching it?" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
          <Button
            type="submit"
            disabled={!stock.trim() || addMut.isPending}
            className="bg-[image:var(--gradient-primary)] text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </form>

        <div className="mt-8 space-y-3">
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-12">Loading…</div>
          ) : (data ?? []).length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border/60">
              <Eye className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Your watchlist is empty.</p>
            </div>
          ) : (
            (data ?? []).map((w) => (
              <div
                key={w.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/60 p-4"
                style={{ background: "var(--gradient-card)" }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{w.stock_name}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</span>
                  </div>
                  {w.note ? <p className="mt-1 text-sm text-muted-foreground">{w.note}</p> : null}
                </div>
                <button
                  onClick={() => removeMut.mutate(w.id)}
                  className="rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}