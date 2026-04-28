# Diagramas de arquitectura

## Alcance

Este documento cubre la parte de `QA-020` asociada a diagramas minimos del sistema.

## Convencion

- Los diagramas describen el estado actual observado en codigo.
- Si una decision de negocio o arquitectura no esta cerrada, se anota debajo del diagrama como pendiente.
- Las propuestas futuras se separan al final.

## Estado actual observado en codigo

### Diagrama de casos de uso

```mermaid
flowchart LR
    Guest[Invitado]
    Client[Cliente autenticado]
    Admin[Administrador]

    Register[Registrarse]
    Login[Iniciar sesion]
    Browse[Ver catalogo y detalle]
    Cart[Gestionar carrito]
    Checkout[Completar checkout]
    Orders[Crear orden]
    AdminMetrics[Ver metricas admin]
    AdminOrders[Gestionar pedidos]
    AdminProducts[Gestionar productos]
    AdminCategories[Gestionar categorias]

    Guest --> Register
    Guest --> Login
    Client --> Browse
    Client --> Cart
    Client --> Checkout
    Client --> Orders
    Admin --> Browse
    Admin --> Cart
    Admin --> Checkout
    Admin --> Orders
    Admin --> AdminMetrics
    Admin --> AdminOrders
    Admin --> AdminProducts
    Admin --> AdminCategories
```

Nota de estado actual:

- El diagrama refleja que el frontend opera principalmente sobre usuario autenticado.
- El backend actual permite creacion de orden sin token, pero ese punto queda como decision pendiente, no como politica cerrada.

### Diagrama de secuencia del flujo de compra

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant API as Backend API
    participant DB as PostgreSQL/Prisma

    U->>F: Inicia sesion
    F->>API: POST /api/auth/login
    API->>DB: Busca usuario y valida password
    DB-->>API: Usuario valido
    API-->>F: JWT + user

    U->>F: Agrega producto al carrito
    F->>API: POST /api/cart/items
    API->>DB: Valida producto/variante y stock
    API->>DB: Ajusta stock y carrito
    DB-->>API: Carrito actualizado
    API-->>F: Cart actualizado

    U->>F: Completa checkout
    F->>API: POST /api/orders
    API->>DB: Resuelve userId y crea Order + OrderItem
    API->>DB: Limpia carrito si habia token valido
    DB-->>API: Orden creada
    API-->>F: Confirmacion de orden
```

Notas de estado actual:

- Hoy el backend calcula el total con `items.price * quantity`.
- Hoy la reserva/liberacion de stock ocurre en operaciones de carrito.
- El punto exacto donde debe reservarse stock sigue pendiente de confirmacion como regla oficial.

### Diagrama de componentes frontend/backend

```mermaid
flowchart TB
    subgraph Frontend
        Routes[AppRoutes.tsx]
        AuthUtil[utils/auth.ts]
        ApiClient[services/api.ts]
        CartPage[pages/Cart.tsx]
        CheckoutPage[pages/Checkout.tsx]
        OrderForm[components/checkout/OrderForm.tsx]
        AdminPages[modules/admin/pages/*]
    end

    subgraph Backend
        App[server/src/app.ts]
        AuthRoutes[routes/auth.ts]
        CartRoutes[routes/cart.ts]
        OrderRoutes[routes/orders.ts]
        AdminRoutes[routes/admin.ts]
        AuthMw[middlewares/auth.ts]
        JwtConfig[config/jwt.ts]
        OrderCtrl[controllers/orderController.ts]
        AdminCtrl[controllers/adminController.ts]
    end

    subgraph Data
        PrismaSchema[prisma/schema.prisma]
        DB[(PostgreSQL)]
    end

    Routes --> CartPage
    Routes --> CheckoutPage
    Routes --> AdminPages
    CheckoutPage --> OrderForm
    Routes --> AuthUtil
    CartPage --> ApiClient
    CheckoutPage --> ApiClient
    AdminPages --> ApiClient

    ApiClient --> App
    App --> AuthRoutes
    App --> CartRoutes
    App --> OrderRoutes
    App --> AdminRoutes
    AuthRoutes --> AuthMw
    AdminRoutes --> AuthMw
    AuthMw --> JwtConfig
    OrderRoutes --> OrderCtrl
    AdminRoutes --> AdminCtrl
    CartRoutes --> PrismaSchema
    OrderCtrl --> PrismaSchema
    AdminCtrl --> PrismaSchema
    PrismaSchema --> DB
```

## Decisiones pendientes por confirmar con el equipo

- Si el flujo de compra canonico debe exigir autenticacion completa o permitir invitado.
- Si los estados de orden del admin representan la taxonomia oficial del dominio.
- Si el manejo actual de JWT en `localStorage` se mantendra como diseno vigente.

## Propuesta de estandarizacion futura

- Convertir estos diagramas en anexos permanentes de arquitectura y mantenerlos versionados junto con cambios de rutas, modelos y contratos.
- Si el equipo define decisiones oficiales sobre sesion, stock y ordenes, reflejarlas en una segunda iteracion de diagramas con mayor nivel de detalle.
