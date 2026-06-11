// Shared domain types for the Behavioral Finance Agent.
// These mirror future MongoDB collections (users, investment_reports, bias_history, watchlists).

export type Horizon = "short" | "medium" | "long";
export type RiskTolerance = "low" | "medium" | "high";
export type Recommendation = "proceed" | "caution" | "avoid";
export type RiskLevel = "low" | "medium" | "high";

export const BIAS_TYPES = [
  "fomo",
  "herd_mentality",
  "overconfidence",
  "confirmation_bias",
  "panic_buying",
  "panic_selling",
] as const;
export type BiasType = (typeof BIAS_TYPES)[number];

export const BIAS_LABELS: Record<BiasType, string> = {
  fomo: "FOMO",
  herd_mentality: "Herd Mentality",
  overconfidence: "Overconfidence",
  confirmation_bias: "Confirmation Bias",
  panic_buying: "Panic Buying",
  panic_selling: "Panic Selling",
};

export interface AnalysisInput {
  stock_name: string;
  reason: string;
  horizon: Horizon;
  risk_tolerance: RiskTolerance;
  amount: number;
}

export interface BiasScore {
  bias_type: BiasType;
  score: number; // 0-100
  explanation: string;
}

export interface DecisionReport {
  reasoning_analysis: string;
  evidence_summary: string;
  bias_explanation: string;
  recommendation_rationale: string;
  key_questions: string[];
}

export interface AnalysisResult {
  bias_scores: BiasScore[];
  emotional_score: number;
  readiness_score: number;
  risk_level: RiskLevel;
  recommendation: Recommendation;
  summary: string;
  decision_report: DecisionReport;
}

export interface InvestmentReport extends AnalysisInput, AnalysisResult {
  id: string;
  session_id: string;
  created_at: string;
}

export interface WatchlistItem {
  id: string;
  session_id: string;
  stock_name: string;
  note: string;
  created_at: string;
}