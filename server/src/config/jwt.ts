import jwt, { SignOptions, Secret } from 'jsonwebtoken';

/**
 * Interfaz para el payload del JWT
 */
export interface JwtPayload {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

const JWT_SECRET: Secret =
  (process.env.JWT_SECRET as Secret) ||
  ((process.env.NODE_ENV === 'test' ? 'test-secret-key' : undefined) as Secret);
if (!JWT_SECRET) {
  throw new Error(
    'CRITICAL: JWT_SECRET environment variable is not set. Authentication cannot start without it.'
  );
}
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Generar un JWT para un usuario
 */
export function generateToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRY as any,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verificar y decodificar un JWT
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('[JWT] Verificación fallida:', error);
    return null;
  }
}

/**
 * Extraer el token del header Authorization
 * Formato esperado: "Bearer <token>"
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
