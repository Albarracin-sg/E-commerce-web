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
 * Map para almacenar datos de rate limiting por IP
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

export const clearRateLimitStore = () => {
  rateLimitStore.clear();
};

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
      // Limpiar entradas expiradas cada cierto tiempo
      if (Math.random() > 0.99) {
        cleanupExpiredEntries();
      }

      const ip = req.ip || req.socket.remoteAddress || "unknown";
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
