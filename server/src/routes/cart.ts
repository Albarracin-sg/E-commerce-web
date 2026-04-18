import { Router } from "express";
import prisma from "../config/prisma";
import type { AuthenticatedRequest } from "../middlewares";

const router = Router();

function parseUserId(req: AuthenticatedRequest): number | null {
  const raw = req.userId ?? req.user?.id;
  if (!raw) return null;
  const userId = Number(raw);
  return Number.isNaN(userId) ? null : userId;
}

async function ensureUserCart(userId: number) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId, total: 0 },
  });
}

function buildLineKey(params: {
  productId: number;
  variantId?: number | null;
  color?: string | null;
  size?: string | null;
}) {
  return [
    params.productId,
    params.variantId ?? "no-variant",
    (params.color ?? "").trim().toLowerCase() || "no-color",
    (params.size ?? "").trim().toLowerCase() || "no-size",
  ].join("::");
}

async function recalculateCartTotal(cartId: number) {
  const aggregate = await prisma.cartItem.aggregate({
    where: { cartId },
    _sum: { subtotal: true },
  });

  const total = aggregate._sum.subtotal ?? 0;
  await prisma.cart.update({ where: { id: cartId }, data: { total } });
  return total;
}

async function getCartResponse(cartId: number) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        orderBy: { createdAt: "desc" },
        include: {
          product: { include: { category: true } },
          variant: true,
        },
      },
    },
  });

  return cart;
}

router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = parseUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Usuario no autenticado" });
      return;
    }

    const cart = await ensureUserCart(userId);
    const response = await getCartResponse(cart.id);

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("[cart:get]", error);
    res.status(500).json({ success: false, error: "Error al obtener carrito" });
  }
});

router.post("/items", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = parseUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Usuario no autenticado" });
      return;
    }

    const productId = Number(req.body?.productId);
    const quantity = Number(req.body?.quantity ?? 1);
    const variantId = req.body?.variantId !== undefined ? Number(req.body.variantId) : null;
    const color = req.body?.color ? String(req.body.color).trim() : null;
    const size = req.body?.size ? String(req.body.size).trim() : null;

    if (Number.isNaN(productId) || productId <= 0) {
      res.status(400).json({ success: false, error: "productId inválido" });
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400).json({ success: false, error: "quantity debe ser un entero mayor a 0" });
      return;
    }

    const cart = await ensureUserCart(userId);

    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("PRODUCT_NOT_FOUND");

      let unitPrice = product.price;

      if (variantId) {
        const variant = await tx.productVariant.findFirst({
          where: { id: variantId, productId },
        });

        if (!variant) throw new Error("VARIANT_NOT_FOUND");
        if (variant.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

        unitPrice = variant.price;

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: quantity } },
        });
      } else {
        if (product.stock < quantity) throw new Error("INSUFFICIENT_STOCK");

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        });
      }

      const lineKey = buildLineKey({ productId, variantId, color, size });
      const existing = await tx.cartItem.findUnique({
        where: { cartId_lineKey: { cartId: cart.id, lineKey } },
      });

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: newQuantity,
            unitPrice,
            subtotal: newQuantity * unitPrice,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId,
            lineKey,
            color,
            size,
            quantity,
            unitPrice,
            subtotal: quantity * unitPrice,
          },
        });
      }
    });

    await recalculateCartTotal(cart.id);
    const response = await getCartResponse(cart.id);
    res.status(201).json({ success: true, data: response });
  } catch (error: any) {
    if (error?.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ success: false, error: "Producto no encontrado" });
      return;
    }

    if (error?.message === "VARIANT_NOT_FOUND") {
      res.status(404).json({ success: false, error: "Variante no encontrada" });
      return;
    }

    if (error?.message === "INSUFFICIENT_STOCK") {
      res.status(400).json({ success: false, error: "Stock insuficiente" });
      return;
    }

    console.error("[cart:add-item]", error);
    res.status(500).json({ success: false, error: "Error al agregar ítem al carrito" });
  }
});

router.patch("/items/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = parseUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Usuario no autenticado" });
      return;
    }

    const itemId = Number(req.params.id);
    const quantity = Number(req.body?.quantity);

    if (Number.isNaN(itemId) || itemId <= 0) {
      res.status(400).json({ success: false, error: "itemId inválido" });
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400).json({ success: false, error: "quantity debe ser un entero mayor a 0" });
      return;
    }

    const cart = await ensureUserCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true, variant: true },
    });

    if (!existingItem) {
      res.status(404).json({ success: false, error: "Ítem no encontrado" });
      return;
    }

    const delta = quantity - existingItem.quantity;

    await prisma.$transaction(async (tx) => {
      if (delta > 0) {
        if (existingItem.variantId) {
          const variant = await tx.productVariant.findUnique({ where: { id: existingItem.variantId } });
          if (!variant || variant.stock < delta) throw new Error("INSUFFICIENT_STOCK");

          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: delta } },
          });
        } else {
          const product = await tx.product.findUnique({ where: { id: existingItem.productId } });
          if (!product || product.stock < delta) throw new Error("INSUFFICIENT_STOCK");

          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: delta } },
          });
        }
      }

      if (delta < 0) {
        const toRestore = Math.abs(delta);

        if (existingItem.variantId) {
          await tx.productVariant.update({
            where: { id: existingItem.variantId },
            data: { stock: { increment: toRestore } },
          });
        } else {
          await tx.product.update({
            where: { id: existingItem.productId },
            data: { stock: { increment: toRestore } },
          });
        }
      }

      await tx.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity,
          subtotal: quantity * existingItem.unitPrice,
        },
      });
    });

    await recalculateCartTotal(cart.id);
    const response = await getCartResponse(cart.id);
    res.json({ success: true, data: response });
  } catch (error: any) {
    if (error?.message === "INSUFFICIENT_STOCK") {
      res.status(400).json({ success: false, error: "Stock insuficiente" });
      return;
    }

    console.error("[cart:update-item]", error);
    res.status(500).json({ success: false, error: "Error al actualizar ítem" });
  }
});

router.delete("/items/:id", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = parseUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Usuario no autenticado" });
      return;
    }

    const itemId = Number(req.params.id);
    if (Number.isNaN(itemId) || itemId <= 0) {
      res.status(400).json({ success: false, error: "itemId inválido" });
      return;
    }

    const cart = await ensureUserCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!existingItem) {
      res.status(404).json({ success: false, error: "Ítem no encontrado" });
      return;
    }

    await prisma.$transaction(async (tx) => {
      if (existingItem.variantId) {
        await tx.productVariant.update({
          where: { id: existingItem.variantId },
          data: { stock: { increment: existingItem.quantity } },
        });
      } else {
        await tx.product.update({
          where: { id: existingItem.productId },
          data: { stock: { increment: existingItem.quantity } },
        });
      }

      await tx.cartItem.delete({ where: { id: existingItem.id } });
    });

    await recalculateCartTotal(cart.id);
    const response = await getCartResponse(cart.id);
    res.json({ success: true, data: response });
  } catch (error) {
    console.error("[cart:delete-item]", error);
    res.status(500).json({ success: false, error: "Error al eliminar ítem" });
  }
});

export default router;
