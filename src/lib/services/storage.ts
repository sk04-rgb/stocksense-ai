// Storage Service interface.
// Current impl: MongoDB Atlas. Keep this interface stable so swapping or
// extending the backend remains a one-file change.

import type { AnalysisInput, AnalysisResult, InvestmentReport, WatchlistItem } from "./types";

export interface StorageService {
  saveReport(
    sessionId: string,
    input: AnalysisInput,
    result: AnalysisResult,
  ): Promise<InvestmentReport>;
  listReports(sessionId: string): Promise<InvestmentReport[]>;
  getReport(sessionId: string, id: string): Promise<InvestmentReport | null>;
  listWatchlist(sessionId: string): Promise<WatchlistItem[]>;
  addWatchlist(sessionId: string, stock: string, note: string): Promise<WatchlistItem>;
  removeWatchlist(sessionId: string, id: string): Promise<void>;
}
