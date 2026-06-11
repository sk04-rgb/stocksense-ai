import { randomUUID } from "crypto";
import type { StorageService } from "./storage";
import type { InvestmentReport, WatchlistItem } from "./types";

import { getDb } from "./mongodb.server";

export const mongoStorage: StorageService = {
  async saveReport(sessionId, input, result) {
    const db = await getDb();

    const report: InvestmentReport = {
      id: randomUUID(),
      session_id: sessionId,
      stock_name: input.stock_name,
      reason: input.reason,
      horizon: input.horizon,
      risk_tolerance: input.risk_tolerance,
      amount: input.amount,
      readiness_score: result.readiness_score,
      emotional_score: result.emotional_score,
      risk_level: result.risk_level,
      recommendation: result.recommendation,
      summary: result.summary,
      decision_report: result.decision_report,
      bias_scores: result.bias_scores,
      created_at: new Date().toISOString(),
    };

    await db.collection("investment_reports").insertOne(report);
    await db.collection("bias_history").insertMany(
      result.bias_scores.map((bias) => ({
        id: randomUUID(),
        report_id: report.id,
        session_id: sessionId,
        bias_type: bias.bias_type,
        score: bias.score,
        explanation: bias.explanation,
        created_at: report.created_at,
      })),
    );

    return report;
  },

  async listReports(sessionId) {
    const db = await getDb();

    return (await db
      .collection("investment_reports")
      .find({ session_id: sessionId })
      .sort({ created_at: -1 })
      .toArray()) as unknown as InvestmentReport[];
  },

  async getReport(sessionId, id) {
    const db = await getDb();

    return (await db.collection("investment_reports").findOne({
      session_id: sessionId,
      id,
    })) as InvestmentReport | null;
  },

  async listWatchlist(sessionId) {
    const db = await getDb();

    return (await db
      .collection("watchlists")
      .find({ session_id: sessionId })
      .sort({ created_at: -1 })
      .toArray()) as unknown as WatchlistItem[];
  },

  async addWatchlist(sessionId, stock, note) {
    const db = await getDb();

    const item: WatchlistItem = {
      id: randomUUID(),
      session_id: sessionId,
      stock_name: stock,
      note,
      created_at: new Date().toISOString(),
    };

    await db.collection("watchlists").insertOne(item);

    return item;
  },

  async removeWatchlist(sessionId, id) {
    const db = await getDb();

    await db.collection("watchlists").deleteOne({
      session_id: sessionId,
      id,
    });
  },
};

export const storage = mongoStorage;
