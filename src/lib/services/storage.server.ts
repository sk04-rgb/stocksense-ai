import type { StorageService } from "./storage";
import { memoryStorage } from "./storage-memory.server";
import { mongoStorage } from "./storage-mongodb.server";

const useMemoryFallback =
  process.env.NODE_ENV !== "production" &&
  process.env.MONGODB_MEMORY_FALLBACK !== "false";

function isMongoConnectionError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.name.includes("Mongo") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("querySrv") ||
    error.message.includes("server selection")
  );
}

async function withMongoFallback<T>(
  action: keyof StorageService,
  run: () => Promise<T>,
  fallback: () => Promise<T>,
) {
  try {
    return await run();
  } catch (error) {
    if (!useMemoryFallback || !isMongoConnectionError(error)) {
      throw error;
    }

    console.warn(
      `[storage] MongoDB unavailable during ${action}; using in-memory storage for this local session.`,
      error,
    );
    return fallback();
  }
}

export const storage: StorageService = {
  saveReport(sessionId, input, result) {
    return withMongoFallback(
      "saveReport",
      () => mongoStorage.saveReport(sessionId, input, result),
      () => memoryStorage.saveReport(sessionId, input, result),
    );
  },

  listReports(sessionId) {
    return withMongoFallback(
      "listReports",
      () => mongoStorage.listReports(sessionId),
      () => memoryStorage.listReports(sessionId),
    );
  },

  getReport(sessionId, id) {
    return withMongoFallback(
      "getReport",
      () => mongoStorage.getReport(sessionId, id),
      () => memoryStorage.getReport(sessionId, id),
    );
  },

  listWatchlist(sessionId) {
    return withMongoFallback(
      "listWatchlist",
      () => mongoStorage.listWatchlist(sessionId),
      () => memoryStorage.listWatchlist(sessionId),
    );
  },

  addWatchlist(sessionId, stock, note) {
    return withMongoFallback(
      "addWatchlist",
      () => mongoStorage.addWatchlist(sessionId, stock, note),
      () => memoryStorage.addWatchlist(sessionId, stock, note),
    );
  },

  removeWatchlist(sessionId, id) {
    return withMongoFallback(
      "removeWatchlist",
      () => mongoStorage.removeWatchlist(sessionId, id),
      () => memoryStorage.removeWatchlist(sessionId, id),
    );
  },
};
