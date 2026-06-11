import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Brain,
  TrendingUp,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ScoreRing } from "@/components/score-ring";
import { getReport } from "@/lib/analysis.functions";
import { getSessionId } from "@/lib/session";
import { BIAS_LABELS, type InvestmentReport } from "@/lib/services/types";

export const Route = createFileRoute("/results/$id")({
  head: () => ({
    meta: [{ title: "Decision Report — StockSense AI" }],
  }),
  component: ResultsPage,
});

const recoMeta = {
  proceed: { label: "Proceed with confidence", icon: CheckCircle2, tone: "success", color: "text-success" },
  caution: { label: "Caution advised", icon: AlertTriangle, tone: "warning", color: "text-warning" },
  avoid: { label: "Avoid for now", icon: XCircle, tone: "destructive", color: "text-destructive" },
} as const;

function biasTone(score: number) {
  if (score >= 70) return "destructive" as const;
  if (score >= 40) return "warning" as const;
  return "primary" as const;
}

function ResultsPage() {
  const { id } = useParams({ from: "/results/$id" });
  const get = useServerFn(getReport);

  const { data, isLoading, error } = useQuery({
    queryKey: ["report", id],
    queryFn: () => get({ data: { id, session_id: getSessionId() } }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-6 py-32 text-center text-muted-foreground">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-4 text-sm">Loading decision report…</p>
        </div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="text-2xl font-semibold">Report not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">It may belong to another browser session.</p>
          <Link to="/analyze" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" /> Start a new analysis
          </Link>
        </div>
      </AppShell>
    );
  }

  return <ResultView report={data} />;
}

function ResultView({ report }: { report: InvestmentReport }) {
  const reco = recoMeta[report.recommendation];
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-14 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link to="/history" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> History
            </Link>
            <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              {report.stock_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {report.horizon} term · {report.risk_tolerance} risk · ${report.amount.toLocaleString()}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm ${reco.color}`}>
            <reco.icon className="h-4 w-4" /> {reco.label}
          </div>
        </div>

        {/* Top score cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Hero
            icon={<Brain className="h-4 w-4" />}
            title="Investment Readiness"
            value={report.readiness_score}
            tone={report.readiness_score >= 70 ? "primary" : report.readiness_score >= 40 ? "warning" : "destructive"}
            caption="How prepared you are to act rationally on this trade."
          />
          <Hero
            icon={<TrendingUp className="h-4 w-4" />}
            title="Emotional Pressure"
            value={report.emotional_score}
            tone={report.emotional_score >= 70 ? "destructive" : report.emotional_score >= 40 ? "warning" : "primary"}
            caption="Overall emotional load detected in your reasoning."
          />
          <Hero
            icon={<ShieldAlert className="h-4 w-4" />}
            title="Risk Level"
            value={report.risk_level === "low" ? 25 : report.risk_level === "medium" ? 55 : 85}
            tone={report.risk_level === "low" ? "primary" : report.risk_level === "medium" ? "warning" : "destructive"}
            caption={`${report.risk_level.toUpperCase()} — given bias load, horizon, and amount.`}
            showLabel={report.risk_level.toUpperCase()}
          />
        </div>

        {/* Bias detection */}
        <Card title="Behavioral Bias Detection" subtitle="Six cognitive biases that derail investor decisions, scored 0-100.">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {report.bias_scores.map((b) => (
              <div key={b.bias_type} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{BIAS_LABELS[b.bias_type]}</span>
                  <span className={`text-xs font-medium ${biasTone(b.score) === "destructive" ? "text-destructive" : biasTone(b.score) === "warning" ? "text-warning" : "text-primary"}`}>
                    {b.score >= 70 ? "High" : b.score >= 40 ? "Med" : "Low"}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums">{b.score}</span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={
                      biasTone(b.score) === "destructive"
                        ? "h-full bg-destructive"
                        : biasTone(b.score) === "warning"
                          ? "h-full bg-warning"
                          : "h-full bg-primary"
                    }
                    style={{ width: `${b.score}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{b.explanation}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card title="AI Recommendation" subtitle="Plain-English summary of what the agent thinks.">
          <p className="text-sm leading-relaxed text-foreground/90">{report.summary}</p>
        </Card>

        {/* Decision report */}
        <Card title="Decision Report" subtitle="Structured reasoning from the Behavioral Finance Agent.">
          <dl className="grid md:grid-cols-2 gap-5">
            <Block term="Reasoning analysis" def={report.decision_report.reasoning_analysis} />
            <Block term="Evidence summary" def={report.decision_report.evidence_summary} />
            <Block term="Bias explanation" def={report.decision_report.bias_explanation} />
            <Block term="Recommendation rationale" def={report.decision_report.recommendation_rationale} />
          </dl>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Questions to answer before acting</div>
            <ul className="mt-2 space-y-2">
              {report.decision_report.key_questions.map((q, i) => (
                <li key={i} className="flex gap-3 rounded-md border border-border/60 bg-background/30 p-3 text-sm">
                  <span className="text-primary tabular-nums">Q{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* User's reason */}
        <Card title="Your Stated Reason">
          <p className="text-sm text-muted-foreground italic">"{report.reason}"</p>
        </Card>
      </section>
    </AppShell>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-border/60 p-6 sm:p-7"
      style={{ background: "var(--gradient-card)" }}
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Block({ term, def }: { term: string; def: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/30 p-4">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{term}</dt>
      <dd className="mt-2 text-sm leading-relaxed">{def}</dd>
    </div>
  );
}

function Hero({
  icon,
  title,
  value,
  tone,
  caption,
  showLabel,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  tone: "primary" | "warning" | "destructive";
  caption: string;
  showLabel?: string;
}) {
  return (
    <div
      className="rounded-2xl border border-border/60 p-6 flex items-center gap-5"
      style={{ background: "var(--gradient-card)" }}
    >
      <ScoreRing value={value} tone={tone} size={104} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          {icon} {title}
        </div>
        {showLabel ? <div className="mt-1 text-xl font-semibold">{showLabel}</div> : null}
        <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}