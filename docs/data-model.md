# Modelo de datos

## Alcance

Este documento cubre `QA-016` usando como fuente principal el modelo real en `server/prisma/schema.prisma` y su uso observable en rutas, controladores y tipos del frontend.

## Estado actual observado en codigo

### Fuente principal

- `server/prisma/schema.prisma`

### Enumeraciones observadas

#### `Role`

- Valores actuales: `CLIENT`, `ADMIN`
- Uso observado en `server/prisma/schema.prisma`, `server/src/config/jwt.ts`, `client/src/utils/auth.ts`

No existe un enum Prisma para estado de orden. El estado actual de `Order` se persiste como `String`.

### Modelos observados

#### `User`

- Campos: `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`
- Relaciones:
  - `cart` opcional uno a uno con `Cart`
  - `orders` uno a muchos con `Order`
- Restricciones:
  - `id` autoincremental
  - `email` unico
  - `role` default `CLIENT`

#### `Category`

- Campos: `id`, `name`, `slug`, `imageUrl`, `description`, `createdAt`
- Relaciones:
  - `products` uno a muchos con `Product`
- Restricciones:
  - `name` unico
  - `slug` unico

#### `Product`

- Campos: `id`, `name`, `description`, `price`, `comparePrice`, `imageUrl`, `stock`, `featured`, `badge`, `categoryId`, `createdAt`, `updatedAt`
- Relaciones:
  - pertenece a `Category`
  - tiene `variants`
  - tiene `cartItems`
  - tiene `orderItems`
- Indices observados:
  - `categoryId`
  - `name`

#### `ProductVariant`

- Campos: `id`, `name`, `color`, `size`, `price`, `stock`, `productId`
- Relaciones:
  - pertenece a `Product`
  - puede aparecer en `CartItem`
- Indices observados:
  - `productId`

#### `Cart`

- Campos: `id`, `userId`, `total`, `createdAt`, `updatedAt`
- Relaciones:
  - pertenece a `User`
  - contiene `items`
- Restricciones:
  - `userId` unico

#### `CartItem`

- Campos: `id`, `cartId`, `productId`, `variantId`, `lineKey`, `color`, `size`, `quantity`, `unitPrice`, `subtotal`, `createdAt`, `updatedAt`
- Relaciones:
  - pertenece a `Cart`
  - referencia `Product`
  - referencia opcionalmente `ProductVariant`
- Restricciones e indices:
  - clave unica compuesta `cartId + lineKey`
  - indices en `cartId`, `productId`, `variantId`

#### `Order`

- Campos: `id`, `userId`, `email`, `total`, `status`, `name`, `address`, `city`, `country`, `postalCode`, `phone`, `paymentMethod`, `createdAt`
- Relaciones:
  - pertenece a `User`
  - contiene `items`
- Restricciones e indices:
  - indice en `userId`
- Observacion:
  - `status` es `String` con default `"pendiente"`; no hay enum Prisma para estados.

#### `OrderItem`

- Campos: `id`, `orderId`, `productId`, `quantity`, `price`
- Relaciones:
  - pertenece a `Order`
  - referencia `Product`
- Restricciones e indices:
  - indices en `orderId`, `productId`

### Relaciones de alto nivel observadas

```text
User 1 --- 0..1 Cart
User 1 --- N Order
Category 1 --- N Product
Product 1 --- N ProductVariant
Cart 1 --- N CartItem
Order 1 --- N OrderItem
Product 1 --- N CartItem
Product 1 --- N OrderItem
ProductVariant 1 --- N CartItem (opcional)
```

### Restricciones funcionales inferibles desde el modelo y el codigo

- Un usuario puede tener un solo carrito persistente por `userId` unico en `Cart`.
- Un `CartItem` puede consolidar multiples agregados del mismo producto/variante usando `lineKey`.
- Una orden siempre queda asociada a un `User`, incluso cuando `createOrder` resuelve o crea un usuario a partir del email.

### Observaciones relevantes para QA

- El modelo Prisma ya incluye entidades de catalogo, carrito y orden; no corresponde seguir documentando el sistema como si solo tuviera autenticacion.
- El uso de `String` para `Order.status` hace que el lenguaje de estados dependa del codigo de aplicacion y no del schema como contrato fuerte.
- El PDF pide enums de rol y estado; hoy solo `Role` esta formalizado en Prisma.

## Decisiones pendientes por confirmar con el equipo

- Si `Order.status` debe mantenerse como `String` o migrar a enum Prisma.
- Si los estados en espanol (`pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`) seran el vocabulario canonico o solo el estado actual implementado.
- Si el modelo de orden debe registrar mas datos de pago o seguir con `paymentMethod` como string libre.
- Si el flujo de checkout invitado debe seguir creando usuarios placeholder para poder asociar la orden a `User`.

## Propuesta de estandarizacion futura

- Formalizar un enum Prisma para estado de orden si el equipo define un vocabulario estable.
- Definir contratos de datos complementarios por entidad para frontend y QA, especialmente en `Order`, `CartItem` y `ProductVariant`.
- Acompanhar el schema con una tabla de reglas de negocio por entidad para diferenciar restricciones de base de datos y restricciones de aplicacion.
