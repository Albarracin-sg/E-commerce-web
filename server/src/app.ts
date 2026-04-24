import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import adminRoutes from "./routes/admin";
import {
  logger,
  errorHandler,
  rateLimiter,
  authenticateToken,
} from "./middlewares";

export function createApp() {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS) || 1;
  const globalRateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
  const globalRateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 120000;

  app.set("trust proxy", trustProxyHops);
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json());
  app.use(logger);
  app.use(rateLimiter(globalRateLimitMaxRequests, globalRateLimitWindowMs));

  app.use("/api/auth", authRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/cart", authenticateToken, cartRoutes);
  app.use("/api/admin", adminRoutes);

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "API is running" });
  });

  app.use(errorHandler);

  return app;
}

export const app = createApp();
