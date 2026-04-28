import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

const LOCAL_WHITELIST_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

const getNodeEnv = () => process.env.NODE_ENV || "development";

const shouldBypassRateLimit = (ip: string) => {
  const env = getNodeEnv();

  if (env === "test") {
    return true;
  }

  if (env === "development" && LOCAL_WHITELIST_IPS.has(ip)) {
    return true;
  }

  return false;
};

const getEffectiveLimits = (maxRequests: number, windowMs: number) => {
  const env = getNodeEnv();

  if (env === "development") {
    return {
      maxRequests: Math.max(maxRequests, 1000),
      windowMs,
    };
  }

  return { maxRequests, windowMs };
};

/**
 * Interfaz para almacenar información de rate limiting
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Map para almacenar datos de rate limiting por IP
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Limpia las entradas expiradas del store
 */
const cleanupExpiredEntries = () => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
};

/**
 * Middleware de rate limiting
 * Limita el número de solicitudes por IP en un período de tiempo
 * @param maxRequests Número máximo de solicitudes permitidas
 * @param windowMs Ventana de tiempo en milisegundos
 * @returns Middleware de Express
 */
export const rateLimiter = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";

      if (shouldBypassRateLimit(ip)) {
        next();
        return;
      }

      const effectiveLimits = getEffectiveLimits(maxRequests, windowMs);

      // Limpiar entradas expiradas cada cierto tiempo
      if (Math.random() > 0.99) {
        cleanupExpiredEntries();
      }

      const key = `${ip}:${effectiveLimits.maxRequests}:${effectiveLimits.windowMs}`;
      const now = Date.now();
      let entry = rateLimitStore.get(key);

      // Si no existe entrada o ha expirado, crear nueva
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 0,
          resetTime: now + effectiveLimits.windowMs,
        };
        rateLimitStore.set(key, entry);
      }

      // Incrementar contador
      entry.count++;

      // Agregar información al response header
      res.set("X-RateLimit-Limit", String(effectiveLimits.maxRequests));
      res.set(
        "X-RateLimit-Remaining",
        String(Math.max(effectiveLimits.maxRequests - entry.count, 0))
      );
      res.set("X-RateLimit-Reset", String(entry.resetTime));

      // Verificar si excedió el límite
      if (entry.count > effectiveLimits.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        res.set("Retry-After", String(retryAfter));

        throw createError(
          `Demasiadas solicitudes desde esta IP. Intenta más tarde.`,
          429,
          {
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter,
            limit: effectiveLimits.maxRequests,
            windowMs: effectiveLimits.windowMs,
          }
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * Middleware de rate limiting específico para endpoints de autenticación (más restrictivo)
 * @param maxRequests Número máximo de solicitudes
 * @param windowMs Ventana de tiempo
 */
export const authRateLimiter = (maxRequests: number = 5, windowMs: number = 900000) => {
  return rateLimiter(maxRequests, windowMs);
};
