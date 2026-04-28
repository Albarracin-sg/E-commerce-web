# Contratos API y errores

## Alcance

Este documento cubre `QA-020` desde dos frentes:

- inventario y contratos observables de la API real
- formatos de error y sus inconsistencias actuales

## Estado actual observado en codigo

### Inventario real de endpoints

Fuente principal:

- `server/tests/api/route-manifest.contract.test.ts`

#### Endpoints publicos observados

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products/`
- `GET /api/products/featured`
- `GET /api/products/:id`
- `GET /api/categories/`
- `GET /api/categories/:slug`

#### Endpoints protegidos observados

- `GET /api/auth/me`
- `GET /api/auth/profile`
- `GET /api/auth/admin-only`
- `GET /api/cart/`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `GET /api/admin/dashboard/metrics`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `POST /api/products/`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/categories/`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

#### Endpoints con observacion especial

- `POST /api/orders/`
- `GET /api/orders/`

Observacion:

- El PDF los clasifica como autenticados.
- El codigo actual en `server/src/routes/orders.ts` no aplica `authenticateToken`.
- Por eso aqui se documentan como endpoints existentes con politica de acceso pendiente de confirmacion.

### Contratos request/response observables

#### `POST /api/auth/login`

Fuentes:

- `server/src/routes/auth.ts`
- `server/src/controllers/authControllerLogin.ts`
- `client/src/services/api.ts`

Request observado:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Response exitosa observada:

```json
{
  "message": "Inicio de sesion exitoso.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com",
    "role": "CLIENT"
  }
}
```

#### `POST /api/auth/register`

Request observado:

```json
{
  "name": "Usuario",
  "email": "user@example.com",
  "password": "Password123"
}
```

Response exitosa observada:

```json
{
  "message": "¡Registro exitoso! Ahora puedes iniciar sesión.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com",
    "role": "CLIENT"
  }
}
```

Nota:

- El texto exacto del mensaje tiene signos y estilo propio del controlador; el contrato funcional importante es que responde token y usuario.

#### `GET /api/auth/me`

Response observada:

```json
{
  "message": "Datos del usuario autenticado",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "role": "CLIENT"
  }
}
```

#### `GET /api/cart`

Fuentes:

- `server/src/routes/cart.ts`
- `client/src/types/cart.ts`

Response observada:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "total": 0,
    "items": []
  }
}
```

#### `POST /api/orders`

Fuentes:

- `server/src/controllers/orderController.ts`
- `client/src/services/api.ts`

Request observada:

```json
{
  "name": "Cliente",
  "email": "cliente@example.com",
  "address": "Calle 123",
  "city": "Bogota",
  "country": "Colombia",
  "postalCode": "110111",
  "phone": "3001234567",
  "paymentMethod": "tarjeta",
  "items": [
    {
      "productId": 10,
      "quantity": 1,
      "price": 120000
    }
  ]
}
```

Response exitosa observada:

```json
{
  "success": true,
  "order": {
    "id": 1,
    "total": 120000,
    "status": "pendiente",
    "createdAt": "2026-04-27T00:00:00.000Z"
  }
}
```

#### `GET /api/admin/orders`

Response observada de alto nivel:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Formatos de error observados

#### Formato centralizado via `errorHandler`

Fuente:

- `server/src/middlewares/errorHandler.ts`

Formato observado:

```json
{
  "success": false,
  "error": {
    "message": "Mensaje",
    "statusCode": 400
  }
}
```

#### Formatos alternos observados en controladores/rutas

- `authControllerLogin.ts` devuelve `{"error": "..."}`
- `authControllerRegister.ts` devuelve `{"error": "..."}`
- `orderController.ts` usa `{"success": false, "message": "..."}`
- `cart.ts` mezcla `{"success": false, "error": "..."}`
- `adminController.ts` suele usar `{"success": false, "error": "..."}`

### Contradicciones entre controladores y middlewares

- La API no expone hoy una politica unica de errores.
- `validation.ts` y `rateLimiter.ts` delegan en `errorHandler`, pero varios controladores responden manualmente con formas distintas.
- La documentacion previa de middlewares presenta respuestas mas uniformes que las realmente observadas en todos los modulos.

## Decisiones pendientes por confirmar con el equipo

- Si `/api/orders` debe documentarse formalmente como endpoint autenticado, invitado o mixto.
- Si la API debe consolidar un formato unico de errores o solo documentar heterogeneidad actual por modulo.
- Si el estado de orden actual en espanol sera contrato estable o transitorio.

## Propuesta de estandarizacion futura

- Definir un contrato unico de error para toda la API, idealmente alineado con `errorHandler`.
- Publicar ejemplos por endpoint con versionado documental minimo.
- Si el equipo confirma el flujo de orden, reclasificar `POST /api/orders` y `GET /api/orders` en la categoria correcta.
