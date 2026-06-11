// AI Agent Service - Behavioral Finance Agent.

import { generateText } from "ai";
import { z } from "zod";

import { google } from "@ai-sdk/google";
import {
  BIAS_TYPES,
  type AnalysisInput,
  type AnalysisResult,
  type BiasType,
} from "./types";

const BiasSchema = z.object({
  bias_type: z.enum(BIAS_TYPES as unknown as [BiasType, ...BiasType[]]),
  score: z.number().int().min(0).max(100),
  explanation: z.string().min(1).max(400),
});

export const ResultSchema = z.object({
  bias_scores: z.array(BiasSchema).length(6),

  emotional_score: z.number().int().min(0).max(100),
  readiness_score: z.number().int().min(0).max(100),

  risk_level: z.enum(["low", "medium", "high"]),

  recommendation: z.enum([
    "proceed",
    "caution",
    "avoid",
  ]),

  summary: z.string().min(1).max(600),

  decision_report: z.object({
    reasoning_analysis: z.string().min(1).max(800),
    evidence_summary: z.string().min(1).max(800),
    bias_explanation: z.string().min(1).max(800),
    recommendation_rationale: z.string().min(1).max(800),
    key_questions: z
      .array(z.string().min(1).max(200))
      .min(3)
      .max(5),
  }),
});

const SYSTEM_PROMPT = `
You are the Behavioral Finance Agent.

You are NOT a stock prediction engine.

Your job is to detect emotional and cognitive biases in an investor's reasoning before they buy or sell.

Workflow:

1. Analyze reasoning quality.
2. Detect:
   - fomo
   - herd_mentality
   - overconfidence
   - confirmation_bias
   - panic_buying
   - panic_selling
3. Score each 0-100.
4. Calculate emotional_score.
5. Calculate readiness_score.
6. Determine risk_level.
7. Determine recommendation.
8. Generate decision_report.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.

recommendation MUST be:
- proceed
- caution
- avoid

risk_level MUST be:
- low
- medium
- high

bias_scores MUST contain ALL SIX bias types.
`;

function buildUserPrompt(input: AnalysisInput): string {
  return `
Investor input:

Stock: ${input.stock_name}

Reason:
${input.reason}

Investment horizon:
${input.horizon}

Risk tolerance:
${input.risk_tolerance}

Amount:
${input.amount}

Run the full behavioral finance workflow.
`;
}

export async function runBehavioralAgent(
  input: AnalysisInput,
): Promise<AnalysisResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY",
    );
  }

  // Change model for testing
  const model = google("gemini-2.0-flash");

  const result = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
  });

  console.log("RAW GEMINI RESPONSE:");
  console.log(result.text);

  throw new Error(result.text);
}
