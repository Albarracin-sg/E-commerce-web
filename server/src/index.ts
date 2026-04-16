import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import {
  logger,
  errorHandler,
  rateLimiter,
} from "./middlewares";

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ==================== MIDDLEWARES GLOBALES ====================

// Permitimos cualquier puerto de localhost (5173, 5174, etc.) en desarrollo
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Middleware de logging de todas las solicitudes
app.use(logger);

// Middleware de rate limiting global (100 solicitudes por minuto)
app.use(rateLimiter(100, 60000));

// ==================== RUTAS ====================

app.use("/api/auth", authRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Authentication API is running" });
});

// ==================== ERROR HANDLER ====================

// Debe estar al final, después de todas las rutas
app.use(errorHandler);

// ==================== SERVIDOR ====================

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
