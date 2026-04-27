import bcrypt from "bcrypt";
import type { CartItem, Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { extractTokenFromHeader, verifyToken } from "../config/jwt";
import type { AuthenticatedRequest } from "../middlewares/auth";
import { decrementProductStock, incrementProductStock, incrementVariantStock } from "../services/inventoryService";

type OrderItemPayload = {
  productId: number;
  quantity: number;
  price?: number;
};

type CreateOrderPayload = {
  userId?: number;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  paymentMethod: string;
  items: OrderItemPayload[];
};

type NormalizedOrderItem = {
  productId: number;
  quantity: number;
};

const ORDER_ERROR = {
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  USER_RESOLUTION_FAILED: "USER_RESOLUTION_FAILED",
} as const;

class OrderError extends Error {
  constructor(public readonly code: (typeof ORDER_ERROR)[keyof typeof ORDER_ERROR]) {
    super(code);
  }
}

function isOrderError(error: unknown, code: (typeof ORDER_ERROR)[keyof typeof ORDER_ERROR]) {
  return error instanceof OrderError && error.code === code;
}

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

  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    return existingUser.id;
  }

  const placeholderPassword = await bcrypt.hash(`checkout-${payload.email}`, 10);
  const createdUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: placeholderPassword,
      role: "CLIENT",
    },
  });

  return createdUser.id;
}

function normalizeItems(items: OrderItemPayload[]): NormalizedOrderItem[] {
  const aggregated = new Map<number, number>();

  for (const item of items) {
    aggregated.set(item.productId, (aggregated.get(item.productId) ?? 0) + item.quantity);
  }

  return [...aggregated.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

async function restoreReservedCartStock(tx: Prisma.TransactionClient, cartItems: CartItem[]) {
  for (const item of cartItems) {
    if (item.variantId) {
      await incrementVariantStock(tx, item.variantId, item.quantity);
      continue;
    }

    await incrementProductStock(tx, item.productId, item.quantity);
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const payload = req.body as CreateOrderPayload;
    const authenticatedUserId = parseAuthenticatedUserId(req);
    const resolvedUserId = await resolveOrderUserId(payload, authenticatedUserId);

    if (!resolvedUserId) {
      throw new OrderError(ORDER_ERROR.USER_RESOLUTION_FAILED);
    }

    const normalizedItems = normalizeItems(payload.items);

    const order = await prisma.$transaction(async (tx) => {
      const cart = authenticatedUserId
        ? await tx.cart.findUnique({
            where: { userId: authenticatedUserId },
            include: { items: true },
          })
        : null;

      if (cart?.items.length) {
        await restoreReservedCartStock(tx, cart.items);
      }

      const uniqueProductIds = [...new Set(normalizedItems.map((item) => item.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: uniqueProductIds } },
        select: { id: true, price: true },
      });

      if (products.length !== uniqueProductIds.length) {
        throw new OrderError(ORDER_ERROR.PRODUCT_NOT_FOUND);
      }

      const productsById = new Map(products.map((product) => [product.id, product]));
      const authoritativeItems = [] as Array<NormalizedOrderItem & { price: number }>;

      for (const item of normalizedItems) {
        const product = productsById.get(item.productId);
        if (!product) {
          throw new OrderError(ORDER_ERROR.PRODUCT_NOT_FOUND);
        }

        const decremented = await decrementProductStock(tx, item.productId, item.quantity);
        if (!decremented) {
          throw new OrderError(ORDER_ERROR.INSUFFICIENT_STOCK);
        }

        authoritativeItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const total = authoritativeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const createdOrder = await tx.order.create({
        data: {
          userId: resolvedUserId,
          name: payload.name,
          email: payload.email,
          address: payload.address,
          city: payload.city,
          country: payload.country,
          postalCode: payload.postalCode,
          phone: payload.phone,
          paymentMethod: payload.paymentMethod,
          total,
          status: "pendiente",
          items: {
            create: authoritativeItems.map((item) => ({
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

      if (authenticatedUserId && cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        await tx.cart.update({ where: { id: cart.id }, data: { total: 0 } });
      }

      return createdOrder;
    });

    res.status(201).json({ success: true, order });
  } catch (error: unknown) {
    if (isOrderError(error, ORDER_ERROR.USER_RESOLUTION_FAILED)) {
      res.status(400).json({ success: false, message: "No se pudo resolver el usuario de la orden" });
      return;
    }

    if (isOrderError(error, ORDER_ERROR.PRODUCT_NOT_FOUND)) {
      res.status(400).json({ success: false, message: "Uno o más productos ya no existen" });
      return;
    }

    if (isOrderError(error, ORDER_ERROR.INSUFFICIENT_STOCK)) {
      res.status(400).json({ success: false, message: "Stock insuficiente para completar la orden" });
      return;
    }

    console.error("[orders:create]", error);
    res.status(500).json({ success: false, message: "Error al crear la orden" });
  }
}

export async function getOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const authenticatedUserId = Number(req.userId);
    if (!Number.isInteger(authenticatedUserId) || authenticatedUserId <= 0) {
      res.status(401).json({ success: false, message: "Usuario no autenticado" });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: authenticatedUserId },
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
  } catch (error: unknown) {
    console.error("[orders:list]", error);
    res.status(500).json({ success: false, message: "Error al obtener órdenes" });
  }
}
