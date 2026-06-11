// Server functions exposed to the client (TanStack typed RPC).
// These are the "API endpoints" — equivalent to POST /analyze, GET /history, etc.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runBehavioralAgent } from "./services/agent.server";
import { storage } from "./services/storage.server";

const SessionInput = z.object({ session_id: z.string().min(8).max(64) });

const AnalyzeInput = SessionInput.extend({
  stock_name: z.string().trim().min(1).max(80),
  reason: z.string().trim().min(10).max(2000),
  horizon: z.enum(["short", "medium", "long"]),
  risk_tolerance: z.enum(["low", "medium", "high"]),
  amount: z.number().nonnegative().max(1_000_000_000),
});

export const analyzeInvestment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const { session_id, ...rest } = data;
    const result = await runBehavioralAgent(rest);
    const report = await storage.saveReport(session_id, rest, result);
    return report;
  });

export const listReports = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SessionInput.parse(input))
  .handler(async ({ data }) => storage.listReports(data.session_id));

export const getReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    SessionInput.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => storage.getReport(data.session_id, data.id));

export const listWatchlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SessionInput.parse(input))
  .handler(async ({ data }) => storage.listWatchlist(data.session_id));

export const addWatchlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    SessionInput.extend({
      stock_name: z.string().trim().min(1).max(80),
      note: z.string().trim().max(500).default(""),
    }).parse(input),
  )
  .handler(async ({ data }) =>
    storage.addWatchlist(data.session_id, data.stock_name, data.note),
  );

export const removeWatchlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    SessionInput.extend({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    await storage.removeWatchlist(data.session_id, data.id);
    return { ok: true };
  });