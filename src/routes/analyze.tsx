import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analyzeInvestment } from "@/lib/analysis.functions";
import { getSessionId } from "@/lib/session";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Investor Analysis — StockSense AI" },
      { name: "description", content: "Run a behavioral finance analysis on your next investment." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeInvestment);

  const [stock, setStock] = useState("");
  const [reason, setReason] = useState("");
  const [horizon, setHorizon] = useState<"short" | "medium" | "long">("medium");
  const [risk, setRisk] = useState<"low" | "medium" | "high">("medium");
  const [amount, setAmount] = useState("1000");

  const mutation = useMutation({
    mutationFn: async () => {
      return analyze({
        data: {
          session_id: getSessionId(),
          stock_name: stock.trim(),
          reason: reason.trim(),
          horizon,
          risk_tolerance: risk,
          amount: Number(amount) || 0,
        },
      });
    },
    onSuccess: (report) => {
      toast.success("Decision report ready");
      navigate({ to: "/results/$id", params: { id: report.id } });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      toast.error(msg);
    },
  });

  const disabled = mutation.isPending || stock.trim().length < 1 || reason.trim().length < 10;

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Behavioral Finance Agent</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Investor Analysis</h1>
          <p className="mt-3 text-muted-foreground">
            Describe the trade you're considering. The agent will detect bias, score your readiness, and produce a decision report.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!disabled) mutation.mutate();
          }}
          className="rounded-2xl border border-border/60 p-6 sm:p-8 space-y-6"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock name or ticker</Label>
              <Input
                id="stock"
                placeholder="e.g. NVDA, Apple, Reliance"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                maxLength={80}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Investment amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                step={50}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why are you investing in this?</Label>
            <Textarea
              id="reason"
              placeholder="Be honest. E.g. 'Everyone on Twitter is loading up and I don't want to miss the next leg up.'"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={2000}
              rows={5}
              required
            />
            <p className="text-xs text-muted-foreground">{reason.length}/2000 · minimum 10 characters</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label>Investment horizon</Label>
              <RadioGroup
                value={horizon}
                onValueChange={(v) => setHorizon(v as typeof horizon)}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { v: "short", l: "Short" },
                  { v: "medium", l: "Medium" },
                  { v: "long", l: "Long" },
                ].map((o) => (
                  <label
                    key={o.v}
                    htmlFor={`h-${o.v}`}
                    className="cursor-pointer rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-center hover:border-primary/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/10"
                  >
                    <RadioGroupItem id={`h-${o.v}`} value={o.v} className="sr-only" />
                    {o.l}
                  </label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label>Risk tolerance</Label>
              <RadioGroup
                value={risk}
                onValueChange={(v) => setRisk(v as typeof risk)}
                className="grid grid-cols-3 gap-2"
              >
                {[
                  { v: "low", l: "Low" },
                  { v: "medium", l: "Medium" },
                  { v: "high", l: "High" },
                ].map((o) => (
                  <label
                    key={o.v}
                    htmlFor={`r-${o.v}`}
                    className="cursor-pointer rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-center hover:border-primary/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/10"
                  >
                    <RadioGroupItem id={`r-${o.v}`} value={o.v} className="sr-only" />
                    {o.l}
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-md border border-border/60 bg-background/30 p-3 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <p>
              StockSense AI does not predict prices. It analyzes your reasoning for behavioral bias. The output is educational, not financial advice.
            </p>
          </div>

          <Button
            type="submit"
            disabled={disabled}
            className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-95"
            size="lg"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running agent workflow…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Analyze
              </>
            )}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}