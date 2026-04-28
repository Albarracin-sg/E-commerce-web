# Reglas de carrito, checkout, orden y pago

## Alcance

Este documento cubre `QA-018` con base en el comportamiento observable en frontend y backend. Cuando el codigo no alcanza para fijar una politica oficial, el punto se marca como pendiente.

## Estado actual observado en codigo

### Carrito: reglas observadas

Fuentes principales:

- `server/src/routes/cart.ts`
- `client/src/context/CartContext.tsx`
- `client/src/pages/Cart.tsx`

Reglas observadas:

- Cada usuario autenticado usa un carrito persistente por `userId`.
- Si el carrito no existe, el backend lo crea mediante `upsert`.
- Agregar dos veces el mismo producto/variante no crea necesariamente dos lineas distintas:
  - el backend construye `lineKey`
  - si encuentra el mismo `lineKey`, aumenta cantidad y recalcula subtotal
- `quantity` debe ser entero mayor a `0`.
- `productId` e `itemId` deben ser numericos positivos.
- El total del carrito se recalcula desde la suma de subtotales de `CartItem`.

### Stock: comportamiento actual observado

Fuente principal:

- `server/src/routes/cart.ts`

Comportamiento observado:

- Al agregar al carrito:
  - si hay variante, se verifica y decrementa `ProductVariant.stock`
  - si no hay variante, se verifica y decrementa `Product.stock`
- Al aumentar cantidad de un item existente:
  - se decrementa solo el delta adicional
- Al disminuir cantidad:
  - se repone stock segun el delta
- Al eliminar item del carrito:
  - se repone toda la cantidad al stock correspondiente

Observacion importante:

- Este comportamiento existe hoy en codigo, pero no debe leerse automaticamente como politica oficial cerrada del dominio hasta confirmacion del equipo.

### Checkout: comportamiento actual observado

Fuentes principales:

- `client/src/pages/Checkout.tsx`
- `client/src/components/checkout/OrderForm.tsx`
- `client/src/types/checkout.ts`
- `client/src/schemas/checkoutSchema.ts`

Comportamiento observado:

- El checkout requiere items en carrito para continuar en frontend.
- El formulario recoge datos personales, direccion y metodo de pago.
- Metodos de pago visibles en frontend:
  - `tarjeta`
  - `paypal`
- El flujo de PayPal es simulado; el propio formulario lo indica.
- Existe cupon simulado `VIBRA10` que aplica `10%` de descuento en frontend.

### Totales: formulas observadas y contradicciones internas

Fuentes principales:

- `client/src/pages/Cart.tsx`
- `client/src/pages/Checkout.tsx`
- `server/src/controllers/orderController.ts`

Formulas observadas:

- En `Cart.tsx`:
  - `shipping = 0` si subtotal >= `200000`
  - si no, `shipping = 15900`
  - `taxes = subtotal * 0.05`
  - `grandTotal = subtotal + shipping + taxes`
- En `Checkout.tsx`:
  - `shipping = 0`
  - no se calculan impuestos
  - `discount = subtotal * 0.1` si cupon aplicado
  - `total = subtotal + shipping - discount`
- En backend, `createOrder`:
  - calcula `total` con `sum(item.price * item.quantity)`
  - no recalcula impuestos, envio ni descuento

### Creacion de orden: comportamiento actual observado

Fuentes principales:

- `server/src/routes/orders.ts`
- `server/src/controllers/orderController.ts`
- `client/src/services/api.ts`

Comportamiento observado:

- `POST /api/orders` no esta protegido por `authenticateToken` en `server/src/routes/orders.ts`.
- El cliente usa request autenticada para crear orden, porque `createOrderRequest` llama `requestAuth(...)`.
- El backend intenta resolver usuario asi:
  - si hay token valido, usa el `userId` autenticado
  - si no hay token pero viene `userId` valido, lo usa
  - si no, intenta resolver por `email`
  - si el email no existe, crea usuario placeholder con password hasheada
- Si la orden se crea con usuario autenticado, el backend limpia el carrito y pone total `0`.

### Estados actuales de orden

Fuentes principales:

- `server/src/controllers/orderController.ts`
- `server/src/controllers/adminController.ts`
- `client/src/modules/admin/types.ts`
- `client/src/modules/admin/pages/AdminOrdersPage.tsx`

Estado actual observado:

- La orden se crea con `status = "pendiente"`.
- El admin permite estos valores:
  - `pendiente`
  - `pagado`
  - `enviado`
  - `entregado`
  - `cancelado`

Observacion importante:

- Estos estados existen hoy en codigo, pero no deben tratarse como politica oficial cerrada sin confirmacion del equipo, porque el PDF propone otro vocabulario de referencia.

### Inconsistencias detectadas entre carrito, checkout y backend

- `Cart.tsx` y `Checkout.tsx` no usan la misma formula de total.
- El backend no recalcula ni valida la misma formula visual del frontend.
- El cliente envia orden autenticada, pero el backend permite creacion sin token.
- El stock se reserva en carrito hoy, no al confirmar orden o pago.
- El backend acepta `price` enviado por cliente y lo usa para total de orden.

## Decisiones pendientes por confirmar con el equipo

- Si el guest checkout en `/api/orders` debe mantenerse como contrato valido.
- Si la reserva de stock al agregar al carrito es la regla oficial del dominio o solo una implementacion actual.
- Cual debe ser la formula oficial de `subtotal`, `shipping`, `taxes`, `discount` y `total`.
- Si el cupon `VIBRA10` es solo demo de interfaz o parte del comportamiento funcional esperado.
- Si los estados de orden en espanol seran el contrato canonico o si debe adoptarse otro vocabulario.

## Propuesta de estandarizacion futura

- Definir una sola formula oficial de total y reutilizarla en frontend, backend y QA.
- Formalizar el punto exacto de reserva y liberacion de stock.
- Definir si el checkout es autenticado, invitado o mixto, y documentarlo como contrato unico.
- Formalizar estados de orden y transiciones permitidas en un contrato unico de negocio.
