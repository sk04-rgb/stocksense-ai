import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  Activity,
  Sparkles,
  LineChart,
  Database,
  Workflow,
  Eye,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StockSense AI — Think Before You Invest" },
      {
        name: "description",
        content:
          "Behavioral finance AI agent that detects FOMO, herd mentality, overconfidence and panic before you invest.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Brain, title: "Bias Detection", desc: "FOMO, herd mentality, overconfidence, confirmation bias, and panic — scored in real time." },
  { icon: ShieldCheck, title: "Investment Readiness", desc: "A single score that tells you whether your decision is driven by reasoning or emotion." },
  { icon: Sparkles, title: "Explainable AI", desc: "Every score comes with a plain-English rationale. No black boxes." },
  { icon: Activity, title: "Risk Assessment", desc: "Maps your stated horizon, risk tolerance and amount against your psychological state." },
  { icon: Database, title: "Memory & History", desc: "Persistent decision log so you can audit how your thinking changes over time." },
  { icon: Workflow, title: "Multi-Step Agent", desc: "Analyze reasoning → detect biases → research evidence → generate a decision report." },
];

const steps = [
  { n: "01", title: "Describe your intent", desc: "Tell the agent which stock you're considering and why." },
  { n: "02", title: "Agent runs the workflow", desc: "Gemini-powered reasoning detects six behavioral biases and grades your readiness." },
  { n: "03", title: "Read the decision report", desc: "Get a structured report with recommendation, risk level, and questions to answer before acting." },
];

function Landing() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 pb-28 md:pt-32 md:pb-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Powered by Gemini · Behavioral Finance Agent
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
                Think before
              </span>{" "}
              you invest.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              An AI-powered behavioral finance agent that helps investors avoid costly emotional decisions —
              by detecting bias before money moves.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95 transition-opacity"
              >
                Start an analysis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary/50 px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                See decision history
              </Link>
            </div>

            {/* Floating preview card */}
            <div className="relative mt-16">
              <div
                aria-hidden
                className="absolute -inset-x-10 -inset-y-6 -z-10 rounded-[2rem] blur-3xl opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div
                className="mx-auto max-w-3xl rounded-2xl border border-border/60 p-6 text-left shadow-[var(--shadow-card)]"
                style={{ background: "var(--gradient-card)" }}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><LineChart className="h-3.5 w-3.5" /> NVDA · Long term · Medium risk</span>
                  <span className="rounded-full bg-warning/20 px-2 py-0.5 text-warning">Caution</span>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Readiness", value: 62, tone: "primary" },
                    { label: "FOMO", value: 78, tone: "warning" },
                    { label: "Herd", value: 54, tone: "warning" },
                    { label: "Overconfidence", value: 41, tone: "muted" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                      <div className="mt-1 text-2xl font-semibold tabular-nums">{m.value}</div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className={
                            m.tone === "primary"
                              ? "h-full bg-primary"
                              : m.tone === "warning"
                                ? "h-full bg-warning"
                                : "h-full bg-muted-foreground/60"
                          }
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">What it does</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            A decision-support agent, not a stock picker.
          </h2>
          <p className="mt-4 text-muted-foreground">
            StockSense AI focuses on the only variable you actually control: your own decision quality.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border/60 p-5 transition-colors hover:border-primary/40"
              style={{ background: "var(--gradient-card)" }}
            >
              <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">How it works</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              Three steps between impulse and action.
            </h2>
            <p className="mt-4 text-muted-foreground">
              The agent walks through reasoning analysis, bias detection, evidence comparison, and report generation —
              then saves every decision to your audit trail.
            </p>
          </div>
          <ol className="space-y-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex gap-4 rounded-xl border border-border/60 p-5"
                style={{ background: "var(--gradient-card)" }}
              >
                <span className="text-2xl font-semibold text-primary tabular-nums">{s.n}</span>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div
          className="relative overflow-hidden rounded-2xl border border-border/60 p-10 sm:p-14 text-center"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Eye className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Audit your next investment decision.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Spend two minutes with the agent. Avoid the trade you'll regret.
          </p>
          <Link
            to="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)]"
          >
            Run an analysis <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
