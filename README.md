# Ecommerce Vibe Pulse

Aplicacion web de e-commerce con frontend en React/Vite y backend en Express/Prisma. El estado actual del repositorio ya incluye autenticacion, catalogo, categorias, carrito, checkout, ordenes y modulo administrativo.

## Estado del proyecto

- El codigo actual ya no corresponde solo a Sprint 1.
- El alcance operativo observable hoy incluye:
  - autenticacion y registro
  - catalogo y detalle de productos
  - carrito persistente para usuario autenticado
  - checkout con pago simulado
  - creacion y consulta de ordenes
  - panel administrativo para metricas, pedidos, productos y categorias

## Documentacion

Para la documentacion tecnica del Bloque 5 QA revisa:

- `docs/README.md`
- `docs/data-model.md`
- `docs/auth-session.md`
- `docs/business-rules-cart-order-payment.md`
- `docs/traceability-matrix.md`
- `docs/api-contracts-and-errors.md`
- `docs/permissions-and-env.md`
- `docs/architecture-diagrams.md`

Informe QA base usado para alinear esta documentacion:

- `docs/Informe_Consolidado_QA_VibePulse.docx.pdf`

Referencia historica de integracion de Sprint 3:

- `INTEGRACION-SPRINT3.md`

## Stack

- Frontend: React 18 + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Base de datos: PostgreSQL + Prisma ORM
- Seguridad: JWT + bcrypt
- Testing: Vitest, Supertest, Playwright

## Estructura principal

```text
client/
  src/
    components/
    context/
    layouts/
    modules/admin/
    pages/
    routes/
    services/
    types/
    utils/
server/
  prisma/
  src/
    config/
    controllers/
    middlewares/
    routes/
    services/
docs/
README.md
INTEGRACION-SPRINT3.md
```

## Requisitos previos

- Node.js 18 o superior
- npm
- PostgreSQL disponible localmente

## Configuracion rapida

### 1. Base de datos

Crea una base de datos local en PostgreSQL y configura `server/.env` a partir de `server/.env.example`.

Variables importantes observadas hoy:

- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRY`
- `CLIENT_ORIGIN`

### 2. Backend

```bash
cd server
npm install
```

Copia el archivo de ejemplo y ajusta tus valores:

```bash
cp .env.example .env
```

Comandos utiles:

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

Puerto observado en codigo y `.env.example`:

- `http://localhost:3000`

Health check observado en `server/src/app.ts`:

```json
{"status":"ok","message":"API is running"}
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Puerto de desarrollo esperado:

- `http://localhost:5173`

Backend usado por defecto desde frontend si no se define `VITE_API_URL`:

- `http://localhost:3000`

## Flujos principales observables

- Registro y login con JWT.
- Navegacion autenticada a `/home`, `/catalogo`, `/products/:id`, `/cart`, `/checkout`.
- Rutas administrativas protegidas bajo `/admin`.
- API con inventario contractual verificado en `server/tests/api/route-manifest.contract.test.ts`.

## Endpoints principales

### Publicos observados

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/categories/:slug`

### Protegidos observados

- `GET /api/auth/me`
- `GET /api/auth/profile`
- `GET /api/auth/admin-only`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `GET /api/admin/dashboard/metrics`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- mutaciones admin de productos y categorias

### Endpoints con decision pendiente

- `POST /api/orders`
- `GET /api/orders`

El codigo actual los expone sin `authenticateToken`, pero el informe QA consolidado los clasifica como autenticados. La documentacion detallada de esta contradiccion queda en `docs/business-rules-cart-order-payment.md` y `docs/api-contracts-and-errors.md`.

## Cuenta admin por seed

El proyecto incluye seed para crear cuenta administrativa. Revisa el valor actual en `server/prisma/seed.ts` y las variables relacionadas en `server/.env.example`.

## Notas importantes

- La documentacion del directorio `docs/` distingue entre estado actual observado, decisiones pendientes y propuestas futuras.
- Si encuentras diferencias entre documentos antiguos y el codigo real, toma como referencia principal el codigo y la documentacion nueva del Bloque 5.

## Licencia

Proyecto con fin educativo.
