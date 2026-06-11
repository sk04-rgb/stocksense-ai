import type { StorageService } from "./storage";
import type {
  AnalysisInput,
  AnalysisResult,
  InvestmentReport,
  WatchlistItem,
} from "./types";

const reports: InvestmentReport[] = [];
const watchlist: WatchlistItem[] = [];

export const memoryStorage: StorageService = {
  async saveReport(sessionId, input, result) {
    const report: InvestmentReport = {
      id: crypto.randomUUID(),
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

    reports.unshift(report);
    return report;
  },

  async listReports(sessionId) {
    return reports.filter((r) => r.session_id === sessionId);
  },

  async getReport(sessionId, id) {
    return (
      reports.find(
        (r) => r.session_id === sessionId && r.id === id,
      ) ?? null
    );
  },

  async listWatchlist(sessionId) {
    return watchlist.filter((w) => w.session_id === sessionId);
  },

  async addWatchlist(sessionId, stock, note) {
    const item: WatchlistItem = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      stock_name: stock,
      note,
      created_at: new Date().toISOString(),
    };

    watchlist.unshift(item);
    return item;
  },

  async removeWatchlist(sessionId, id) {
    const index = watchlist.findIndex(
      (w) => w.session_id === sessionId && w.id === id,
    );

    if (index >= 0) {
      watchlist.splice(index, 1);
    }
  },
};

export const storage = memoryStorage;