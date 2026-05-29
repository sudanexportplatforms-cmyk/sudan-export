import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";
import { HealthCheckResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { getEmailWorkerStartedAt } from "../lib/workerState";

const router: IRouter = Router();

// GET /api/healthz — basic liveness probe (used by load balancers / deploy health checks)
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// GET /api/health/detailed — extended health check with subsystem status
router.get("/health/detailed", async (_req, res) => {
  const start = Date.now();

  // Database check
  let dbStatus: "ok" | "error" = "ok";
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;

  try {
    const t0 = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - t0;
  } catch (err: unknown) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : String(err);
    logger.error({ err: dbError }, "Health check: DB connection failed");
  }

  const overallStatus = dbStatus === "ok" ? "ok" : "degraded";

  res.status(overallStatus === "ok" ? 200 : 503).json({
    status: overallStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "unknown",
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      ...(dbError ? { error: dbError } : {}),
    },
    emailWorker: {
      status: getEmailWorkerStartedAt() ? "running" : "not_started",
      startedAt: getEmailWorkerStartedAt()?.toISOString() ?? null,
    },
  });
});

export default router;
