import { Request, Response } from "express";
import { createUser, findUserByEmail, validatePassword } from "../services/userService";
import { Role } from "@prisma/client";
import { Prisma } from "@prisma/client";

const PASSWORD_MIN_LENGTH = 6;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase().trim() || "admin@vibepulse.com";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return emailPattern.test(email);
}

export async function register(req: Request, res: Response): Promise<Response> {
  const { name, email, password } = req.body;

  // Required fields
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "El nombre completo es obligatorio." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo es obligatorio." });
  }
  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria." });
  }

  // Email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "El correo no tiene un formato válido." });
  }

  // Password minimum length
  if (password.length < PASSWORD_MIN_LENGTH) {
    return res
      .status(400)
      .json({ error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.` });
  }

  // Duplicate email check
  const existing = await findUserByEmail(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({
      error: "Ya existe una cuenta registrada con ese correo. Intenta iniciar sesión.",
    });
  }

  try {
    const role =
      email.toLowerCase().trim() === ADMIN_EMAIL ? Role.ADMIN : Role.CLIENT;

    const user = await createUser(name.trim(), email.toLowerCase().trim(), password, role);

    return res.status(201).json({
      message: "¡Registro exitoso! Ahora puedes iniciar sesión.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Prisma unique constraint fallback (race condition safety)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        error: "Ya existe una cuenta registrada con ese correo. Intenta iniciar sesión.",
      });
    }
    console.error("[register] Unexpected error:", err);
    return res.status(500).json({ error: "Error interno del servidor. Intenta más tarde." });
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "El correo es obligatorio." });
  }
  if (!password) {
    return res.status(400).json({ error: "La contraseña es obligatoria." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "El correo no tiene un formato válido." });
  }

  try {
    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return res.status(500).json({ error: "Error interno del servidor. Intenta más tarde." });
  }
}
