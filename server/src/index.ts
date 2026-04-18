import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import {
  logger,
  errorHandler,
  rateLimiter,
  authenticateToken,
} from "./middlewares";

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ==================== MIDDLEWARES GLOBALES ====================
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(logger);
app.use(rateLimiter(100, 60000));

// ==================== RUTAS ====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", authenticateToken, cartRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "API is running" });
});

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

// ==================== SERVIDOR ====================
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
