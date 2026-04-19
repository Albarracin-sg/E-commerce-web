import bcrypt from "bcrypt";
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { extractTokenFromHeader, verifyToken } from "../config/jwt";

type OrderItemPayload = {
  productId: number;
  quantity: number;
  price: number;
};

type CreateOrderPayload = {
  userId?: number;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  paymentMethod?: string;
  items?: OrderItemPayload[];
};

function parseAuthenticatedUserId(req: Request) {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const userId = Number(payload.id);
  return Number.isNaN(userId) ? null : userId;
}

async function resolveOrderUserId(payload: CreateOrderPayload, authenticatedUserId: number | null) {
  if (authenticatedUserId) {
    return authenticatedUserId;
  }

  if (payload.userId && Number.isInteger(payload.userId) && payload.userId > 0) {
    return payload.userId;
  }

  const email = payload.email?.trim().toLowerCase();
  const name = payload.name?.trim();

  if (!email || !name) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return existingUser.id;
  }

  const placeholderPassword = await bcrypt.hash(`checkout-${email}`, 10);
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: placeholderPassword,
      role: "CLIENT",
    },
  });

  return createdUser.id;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const payload = req.body as CreateOrderPayload;
    const { name, email, address, city, country, postalCode, phone, paymentMethod } = payload;
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!name || !email || !address || !city || !country || !postalCode || !phone || !paymentMethod) {
      res.status(400).json({ success: false, message: "Faltan datos obligatorios de la orden" });
      return;
    }

    if (items.length === 0) {
      res.status(400).json({ success: false, message: "La orden debe incluir productos" });
      return;
    }

    const normalizedItems = items.map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const hasInvalidItem = normalizedItems.some(
      (item) =>
        Number.isNaN(item.productId) ||
        item.productId <= 0 ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        Number.isNaN(item.price) ||
        item.price < 0
    );

    if (hasInvalidItem) {
      res.status(400).json({ success: false, message: "Los productos de la orden no son válidos" });
      return;
    }

    const authenticatedUserId = parseAuthenticatedUserId(req);
    const resolvedUserId = await resolveOrderUserId(payload, authenticatedUserId);

    if (!resolvedUserId) {
      res.status(400).json({ success: false, message: "No se pudo resolver el usuario de la orden" });
      return;
    }

    const uniqueProductIds = [...new Set(normalizedItems.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueProductIds } },
      select: { id: true },
    });

    if (products.length !== uniqueProductIds.length) {
      res.status(400).json({ success: false, message: "Uno o más productos ya no existen" });
      return;
    }

    const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: resolvedUserId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          address: address.trim(),
          city: city.trim(),
          country: country.trim(),
          postalCode: postalCode.trim(),
          phone: phone.trim(),
          paymentMethod: paymentMethod.trim(),
          total,
          status: "pendiente",
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (authenticatedUserId) {
        const cart = await tx.cart.findUnique({ where: { userId: authenticatedUserId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
          await tx.cart.update({ where: { id: cart.id }, data: { total: 0 } });
        }
      }

      return createdOrder;
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("[orders:create]", error);
    res.status(500).json({ success: false, message: "Error al crear la orden" });
  }
}

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("[orders:list]", error);
    res.status(500).json({ success: false, message: "Error al obtener órdenes" });
  }
}
