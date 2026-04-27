import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

/**
 * Interfaz para almacenar información de rate limiting
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Colección de stores para cada limitador independiente
 */
const rateLimitStores = new Set<Map<string, RateLimitEntry>>();

export const clearRateLimitStore = () => {
  for (const store of rateLimitStores) {
    store.clear();
  }
};

/**
 * Limpia las entradas expiradas del store
 */
const cleanupExpiredEntries = (store: Map<string, RateLimitEntry>) => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key);
    }
  }
};

const getClientIp = (req: Request) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim().length > 0) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim().length > 0) {
    return realIp.trim();
  }

  const cfConnectingIp = req.headers["cf-connecting-ip"];
  if (typeof cfConnectingIp === "string" && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
};

/**
 * Middleware de rate limiting
 * Limita el número de solicitudes por IP en un período de tiempo
 * @param maxRequests Número máximo de solicitudes permitidas
 * @param windowMs Ventana de tiempo en milisegundos
 * @returns Middleware de Express
 */
export const rateLimiter = (maxRequests: number = 100, windowMs: number = 60000) => {
  const rateLimitStore = new Map<string, RateLimitEntry>();
  rateLimitStores.add(rateLimitStore);

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Limpiar entradas expiradas cada cierto tiempo
      if (Math.random() > 0.99) {
        cleanupExpiredEntries(rateLimitStore);
      }

      const ip = getClientIp(req);
      const now = Date.now();
      let entry = rateLimitStore.get(ip);

      // Si no existe entrada o ha expirado, crear nueva
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 1,
          resetTime: now + windowMs,
        };
        rateLimitStore.set(ip, entry);
        next();
        return;
      }

      // Incrementar contador
      entry.count++;

      // Verificar si excedió el límite
      if (entry.count > maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        res.set("Retry-After", String(retryAfter));

        throw createError(
          `Demasiadas solicitudes desde esta IP. Intenta más tarde.`,
          429,
          {
            code: "RATE_LIMIT_EXCEEDED",
            retryAfter,
            limit: maxRequests,
            windowMs,
          }
        );
      }

      // Agregar información al response header
      res.set("X-RateLimit-Limit", String(maxRequests));
      res.set("X-RateLimit-Remaining", String(maxRequests - entry.count));
      res.set("X-RateLimit-Reset", String(entry.resetTime));

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};

/**
 * Middleware de rate limiting específico para endpoints de autenticación (más restrictivo)
 * @param maxRequests Número máximo de solicitudes
 * @param windowMs Ventana de tiempo
 */
export const authRateLimiter = (maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) => {
  return rateLimiter(maxRequests, windowMs);
};
