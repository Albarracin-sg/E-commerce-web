# Permisos y variables de entorno

## Alcance

Este documento cubre la parte de `QA-020` relacionada con configuracion, permisos por rol y contradicciones entre documentos y codigo.

## Estado actual observado en codigo

### Variables de entorno observadas

Fuente principal:

- `server/.env.example`

Variables observadas:

- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRY`
- `CLIENT_ORIGIN`
- `ADMIN_SEED_PASSWORD`
- `CLIENT_SEED_PASSWORD`
- `RATE_LIMIT_MAX_REQUESTS`
- `RATE_LIMIT_WINDOW_MS`
- `AUTH_RATE_LIMIT_MAX_REQUESTS`
- `AUTH_RATE_LIMIT_WINDOW_MS`
- `TRUST_PROXY_HOPS`

### Puertos y configuracion observada

Fuentes principales:

- `server/.env.example`
- `server/src/index.ts`
- `server/src/app.ts`
- `client/src/services/api.ts`

Observaciones:

- `server/.env.example` usa `PORT=3000`.
- `server/src/index.ts` arranca en `process.env.PORT || 3000`.
- `client/src/services/api.ts` usa `VITE_API_URL` o `http://localhost:3000` por defecto.
- `server/src/app.ts` permite origenes desde `CLIENT_ORIGIN` y patrones adicionales.

### CORS observado

Fuente principal:

- `server/src/app.ts`

Comportamiento observado:

- Se aceptan origenes desde `CLIENT_ORIGIN` y `ALLOWED_ORIGINS`.
- Se aceptan patrones desde `ALLOWED_ORIGIN_PATTERNS`.
- Si no hay configuracion explicita, el fallback es `http://localhost:5173`.
- `credentials: true` esta habilitado.

### Rate limit observado

Fuentes principales:

- `server/.env.example`
- `server/src/app.ts`
- `server/src/routes/auth.ts`
- `server/src/middlewares/rateLimiter.ts`

Comportamiento observado:

- Global:
  - `RATE_LIMIT_MAX_REQUESTS` default observable: `100`
  - `RATE_LIMIT_WINDOW_MS` default observable: `120000`
- Auth:
  - `AUTH_RATE_LIMIT_MAX_REQUESTS` default observable: `100`
  - `AUTH_RATE_LIMIT_WINDOW_MS` default observable: `120000`
- `rateLimiter.ts` implementa limitacion en memoria por IP.

### Matriz de permisos por rol observada

| Recurso o ruta | Sin autenticar | CLIENT | ADMIN | Evidencia |
| --- | --- | --- | --- | --- |
| `/login`, `/register` | si | redirigido fuera de guest routes | redirigido a `/admin` | `client/src/routes/AppRoutes.tsx` |
| `/home`, `/catalogo`, `/products/:id`, `/cart`, `/checkout` | no | si | si por estar autenticado | `client/src/routes/AppRoutes.tsx` |
| `/admin/*` en frontend | no | no, redirige a `/home` | si | `client/src/routes/AppRoutes.tsx` |
| `GET /api/auth/me` | no | si | si | `server/src/routes/auth.ts` |
| `GET /api/cart` y mutaciones de carrito | no | si | si | `server/src/app.ts`, `server/src/routes/cart.ts` |
| `POST/PUT/DELETE /api/products` | no | no | si | `server/src/routes/products.ts` |
| `POST/PUT/DELETE /api/categories` | no | no | si | `server/src/routes/categories.ts` |
| `/api/admin/*` | no | no | si | `server/src/routes/admin.ts` |
| `/api/orders` | si, segun codigo actual | si | si | `server/src/routes/orders.ts` |

Observacion:

- El ultimo caso no debe interpretarse como politica oficial cerrada; solo refleja el comportamiento actual observado.

### Contradicciones entre README, `.env.example` y codigo

- `README.md` anterior documentaba `PORT=4000`; el codigo y `.env.example` usan `3000`.
- `README.md` anterior describia health check y alcance funcional desactualizados.
- La documentacion previa de middlewares habla de limites como `5/15min` o `100/min`, pero los defaults actuales observables son `100/120000ms` tanto en global como en auth.

## Decisiones pendientes por confirmar con el equipo

- Si los valores actuales de rate limit son definitivos o solo configuracion provisional de desarrollo.
- Si `/api/orders` debe quedar accesible sin autenticacion.
- Si el proyecto seguira usando `localStorage` con `credentials: true` coexistiendo en CORS, o si se migrara a otro esquema de sesion.

## Propuesta de estandarizacion futura

- Mantener una sola tabla canonica de variables por entorno.
- Publicar una matriz oficial de permisos por rol como anexo estable del proyecto.
- Separar de forma explicita configuracion de desarrollo, test y produccion en documentacion y ejemplos `.env`.
