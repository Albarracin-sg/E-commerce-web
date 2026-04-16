import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

/**
 * Interfaz para reglas de validación
 */
interface ValidationRule {
  required?: boolean;
  type?: "string" | "email" | "number" | "boolean";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | Promise<boolean>;
  message?: string;
}

/**
 * Interfaz para esquema de validación
 */
interface ValidationSchema {
  [key: string]: ValidationRule;
}

/**
 * Valida un email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un campo contra una regla de validación
 */
const validateField = (
  value: any,
  fieldName: string,
  rule: ValidationRule
): { valid: boolean; error?: string } => {
  // Validar requerimiento
  if (rule.required && (value === undefined || value === null || value === "")) {
    return {
      valid: false,
      error: rule.message || `${fieldName} es requerido`,
    };
  }

  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }

  // Validar tipo
  if (rule.type) {
    if (rule.type === "email") {
      if (!isValidEmail(String(value))) {
        return {
          valid: false,
          error: rule.message || `${fieldName} debe ser un email válido`,
        };
      }
    } else if (typeof value !== rule.type) {
      return {
        valid: false,
        error:
          rule.message ||
          `${fieldName} debe ser de tipo ${rule.type}, recibido ${typeof value}`,
      };
    }
  }

  // Validar longitud mínima
  if (rule.minLength !== undefined && String(value).length < rule.minLength) {
    return {
      valid: false,
      error:
        rule.message ||
        `${fieldName} debe tener mínimo ${rule.minLength} caracteres`,
    };
  }

  // Validar longitud máxima
  if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
    return {
      valid: false,
      error:
        rule.message ||
        `${fieldName} debe tener máximo ${rule.maxLength} caracteres`,
    };
  }

  // Validar patrón regex
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return {
      valid: false,
      error:
        rule.message || `${fieldName} tiene un formato inválido`,
    };
  }

  return { valid: true };
};

/**
 * Middleware genérico para validar datos del request body
 * @param schema Esquema de validación
 * @returns Middleware de Express
 */
export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Record<string, string> = {};

      // Validar cada campo del esquema
      for (const [fieldName, rule] of Object.entries(schema)) {
        const value = req.body[fieldName];
        const validation = validateField(value, fieldName, rule);

        if (!validation.valid) {
          errors[fieldName] = validation.error!;
        }
      }

      // Si hay errores, retornar respuesta de error
      if (Object.keys(errors).length > 0) {
        throw createError("Datos inválidos", 400, {
          code: "VALIDATION_ERROR",
          errors,
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * Middleware para validar solo la presencia de un campo
 */
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: Record<string, string> = {};

      fields.forEach((field) => {
        if (!req.body[field]) {
          errors[field] = `${field} es requerido`;
        }
      });

      if (Object.keys(errors).length > 0) {
        throw createError("Campos requeridos faltantes", 400, {
          code: "MISSING_REQUIRED_FIELDS",
          errors,
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

/**
 * Esquemas de validación predefinidos para casos comunes
 */
export const validationSchemas = {
  login: {
    email: {
      required: true,
      type: "email" as const,
      message: "Email válido requerido",
    },
    password: {
      required: true,
      type: "string" as const,
      minLength: 8,
      message: "Contraseña requerida (mínimo 8 caracteres)",
    },
  },

  register: {
    email: {
      required: true,
      type: "email" as const,
      message: "Email válido requerido",
    },
    password: {
      required: true,
      type: "string" as const,
      minLength: 8,
      message: "Contraseña requerida (mínimo 8 caracteres)",
    },
    name: {
      required: true,
      type: "string" as const,
      minLength: 2,
      maxLength: 100,
      message: "Nombre válido requerido (2-100 caracteres)",
    },
  },
};
