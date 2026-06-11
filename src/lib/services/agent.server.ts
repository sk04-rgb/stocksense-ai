// AI Agent Service - Behavioral Finance Agent.
// Multi-step workflow: analyze reasoning -> detect biases -> assess risk -> generate decision report.
// The public contract is ResultSchema; keep that stable when swapping the
// direct Gemini call for Google Cloud Agent Builder / Agent Search.

import { generateObject } from "ai";
import { z } from "zod";

import { google } from "@ai-sdk/google";
import { BIAS_TYPES, type AnalysisInput, type AnalysisResult, type BiasType } from "./types";

const BiasSchema = z.object({
  bias_type: z.enum(BIAS_TYPES as unknown as [BiasType, ...BiasType[]]),
  score: z.number().int().min(0).max(100),
  explanation: z.string().min(1).max(400),
});

export const ResultSchema = z.object({
  bias_scores: z.array(BiasSchema),
  emotional_score: z.number().int().min(0).max(100),
  readiness_score: z.number().int().min(0).max(100),
  risk_level: z.enum(["low", "medium", "high"]),
  recommendation: z.enum(["proceed", "caution", "avoid"]),
  summary: z.string().min(1).max(600),
  decision_report: z.object({
    reasoning_analysis: z.string().min(1).max(800),
    evidence_summary: z.string().min(1).max(800),
    bias_explanation: z.string().min(1).max(800),
    recommendation_rationale: z.string().min(1).max(800),
    key_questions: z.array(z.string().min(1).max(200)).min(3).max(5),
  }),
});

const SYSTEM_PROMPT = `You are the Behavioral Finance Agent, an explainable AI decision-support agent for retail investors.

You are NOT a stock prediction engine. Your job is to detect emotional and cognitive biases in an investor's reasoning BEFORE they buy or sell, and to produce a structured decision report.

Workflow (follow internally):
1. Analyze the investor's stated reasoning for clarity, evidence, and emotional language.
2. Detect six behavioral biases: fomo, herd_mentality, overconfidence, confirmation_bias, panic_buying, panic_selling. Score each 0-100 (0 = no signal, 100 = strong signal).
3. Compare the reasoning against what is generally known about the stock and market context. Note evidence gaps.
4. Compute an emotional_score (overall emotional pressure) and readiness_score (how prepared this investor is to act rationally) on 0-100.
5. Set risk_level (low/medium/high) considering bias load, horizon, risk tolerance, and amount.
6. Output recommendation: "proceed" (low bias, sound reasoning), "caution" (some bias, needs reflection), or "avoid" (high emotional pressure, weak reasoning).
7. Write a decision_report with reasoning_analysis, evidence_summary, bias_explanation, recommendation_rationale, and 3-5 key_questions the investor should answer before acting.

Be candid but respectful. Never give buy/sell price targets. Focus on the investor's psychology and decision quality.`;

function buildUserPrompt(input: AnalysisInput): string {
  return `Investor input:
- Stock: ${input.stock_name}
- Reason for investing: ${input.reason}
- Investment horizon: ${input.horizon} term
- Risk tolerance: ${input.risk_tolerance}
- Amount: ${input.amount}

Run the full behavioral finance workflow and return the structured report.`;
}

export async function runBehavioralAgent(input: AnalysisInput): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const model = google("gemini-2.5-flash");

  const { object } = await generateObject({
    model,
    schema: ResultSchema,
    system:
      SYSTEM_PROMPT +
      `
Return ONLY data matching the schema.
Do not return markdown.
Do not return explanations outside the schema.
All six bias types must be included.
`,
    prompt: buildUserPrompt(input),
  });

  const byType = new Map(object.bias_scores.map((b) => [b.bias_type, b]));

  const ordered = BIAS_TYPES.map(
    (t) =>
      byType.get(t) ?? {
        bias_type: t,
        score: 0,
        explanation: "No signal detected.",
      },
  );

  return {
    ...object,
    bias_scores: ordered,
  };
}
