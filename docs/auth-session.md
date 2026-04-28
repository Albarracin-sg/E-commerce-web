# Autenticacion y sesion

## Alcance

Este documento cubre `QA-017` con base en el flujo real observado entre backend, frontend y tests.

## Estado actual observado en codigo

### Generacion del JWT

Fuentes principales:

- `server/src/config/jwt.ts`
- `server/src/controllers/authControllerLogin.ts`
- `server/src/controllers/authControllerRegister.ts`

Comportamiento observado:

- El backend genera JWT mediante `generateToken`.
- El payload actual contiene:
  - `id`
  - `email`
  - `role`
- La expiracion actual toma `process.env.JWT_EXPIRY` o usa `7d` por defecto.
- Si `JWT_SECRET` no existe, el backend falla al iniciar, excepto que en `NODE_ENV=test` se usa `test-secret-key` como fallback.

### Extraccion y verificacion del token

Fuentes principales:

- `server/src/config/jwt.ts`
- `server/src/middlewares/auth.ts`

Comportamiento observado:

- El backend espera el header `Authorization: Bearer <token>`.
- `extractTokenFromHeader` rechaza encabezados ausentes o mal formados.
- `authenticateToken` responde con error `401` cuando:
  - no hay token
  - el token es invalido o expiro
- `authorizeRole` responde con `403` cuando el rol no esta permitido.

### Almacenamiento actual en frontend

Fuentes principales:

- `client/src/utils/auth.ts`
- `client/src/services/api.ts`

Comportamiento observado:

- El frontend almacena usuario serializado en `localStorage` bajo `vibe-pulse-auth`.
- El frontend almacena token en `localStorage` bajo `vibe-pulse-token`.
- Axios agrega automaticamente `Authorization: Bearer <token>` desde `localStorage` en requests autenticados.

### Rutas protegidas observadas en frontend

Fuente principal:

- `client/src/routes/AppRoutes.tsx`

Rutas observadas:

- Invitado solamente:
  - `/login`
  - `/register`
- Usuario autenticado:
  - `/home`
  - `/catalogo`
  - `/products/:id`
  - `/cart`
  - `/checkout`
  - `/processing-payment`
  - `/purchase-alert`
  - `/confirmation`
- Administrador autenticado:
  - `/admin`
  - `/admin/products`
  - `/admin/orders`
  - `/admin/users`
  - `/admin/settings`

### Rutas protegidas observadas en backend

Fuentes principales:

- `server/src/routes/auth.ts`
- `server/src/routes/admin.ts`
- `server/src/app.ts`
- `server/tests/api/route-protections.api.test.ts`

Proteccion observada:

- `/api/auth/me` requiere token.
- `/api/auth/profile` requiere token.
- `/api/auth/admin-only` requiere token y rol `ADMIN`.
- `/api/cart/*` requiere token por montaje en `app.ts`.
- `/api/admin/*` requiere token y rol `ADMIN` por `router.use(...)`.
- Operaciones de mutacion en `/api/products` y `/api/categories` requieren token y rol `ADMIN`.

### Comportamiento actual ante token invalido o expirado

Observado en codigo:

- El backend devuelve `401` con mensajes como `Token invalido o expirado` o `Token no proporcionado`.
- El frontend no implementa un flujo centralizado de refresh token.
- El cliente tampoco define una rutina global de logout automatico por `401`; el manejo depende del componente o del error devuelto por `mapApiError`.
- Las guards del frontend validan presencia de usuario/token almacenado, no validez criptografica del JWT en tiempo real.

### Contradicciones relevantes

- El PDF pide documentar sesion/token porque los sprints asumen usuario autenticado, pero `server/src/controllers/orderController.ts` tambien soporta creacion de orden sin token.
- La documentacion previa del repo no cubre con claridad almacenamiento, expiracion ni tratamiento de sesion expirada.

## Decisiones pendientes por confirmar con el equipo

- Si el uso actual de `localStorage` para JWT se mantiene como decision oficial o solo como implementacion vigente.
- Si el sistema seguira sin refresh token o si se definira estrategia de renovacion.
- Si debe existir logout forzado y redireccion automatica al detectar `401` por expiracion.
- Si el checkout sin token debe seguir coexistiendo con el resto del sistema autenticado.

## Propuesta de estandarizacion futura

- Definir una politica unica de sesion que cubra almacenamiento, expiracion, renovacion y UX ante `401`.
- Evaluar mover el token a una estrategia mas robusta si el proyecto evoluciona a entorno productivo.
- Documentar una tabla unica de rutas publicas, autenticadas y administrativas para que QA y desarrollo usen el mismo criterio.
