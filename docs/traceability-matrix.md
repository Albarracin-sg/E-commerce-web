# Matriz de trazabilidad

## Alcance

Este documento cubre `QA-019`. La matriz usa solo:

- requisitos observables en el producto o en el codigo,
- inferencias razonables explicitamente marcadas,
- evidencias reales de frontend, backend y tests.

No se inventan requisitos arbitrarios.

Fuentes de contexto del bloque:

- Issue `#12` del repositorio `Albarracin-sg/E-commerce-web`
- Informe QA consolidado en `docs/Informe_Consolidado_QA_VibePulse.docx.pdf`

## Convencion

- `observado`: el requisito puede verificarse directamente en codigo, rutas o tests.
- `inferencia razonable`: el requisito no aparece como texto formal de negocio, pero se desprende de un flujo implementado y verificable.

## Estado actual observado en codigo

La siguiente matriz se construye a partir de rutas, pantallas, servicios y tests realmente presentes en el repositorio.

## Matriz

| ID | Tipo | Requisito | Evidencia frontend | Evidencia backend | Evidencia en tests | Estado | Observaciones |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RF-AUTH-001 | observado | Un usuario puede registrarse con nombre, email y password | `client/src/services/api.ts` | `server/src/routes/auth.ts`, `server/src/controllers/authControllerRegister.ts` | `server/tests/api/route-manifest.contract.test.ts` | implementado | README anterior lo limitaba a Sprint 1; el sistema actual lo mantiene como flujo base |
| RF-AUTH-002 | observado | Un usuario autenticado puede consultar `/api/auth/me` | `client/src/services/api.ts` | `server/src/routes/auth.ts`, `server/src/middlewares/auth.ts` | `server/tests/api/route-protections.api.test.ts` | implementado | Requiere `Authorization: Bearer <token>` |
| RF-AUTH-003 | observado | Solo un admin puede acceder a rutas administrativas | `client/src/routes/AppRoutes.tsx` | `server/src/routes/admin.ts`, `server/src/middlewares/auth.ts` | `server/tests/api/route-protections.api.test.ts` | implementado | El control existe tanto en frontend como en backend |
| RF-CATALOG-001 | observado | Un usuario autenticado puede navegar al catalogo y ver detalle de producto | `client/src/routes/AppRoutes.tsx` | `server/src/routes/products.ts` | `server/tests/api/route-manifest.contract.test.ts` | implementado | Rutas legacy `/producto/:id` y ruta nueva `/products/:id` conviven |
| RF-CART-001 | observado | Un usuario autenticado puede consultar su carrito | `client/src/context/CartContext.tsx`, `client/src/pages/Cart.tsx` | `server/src/app.ts`, `server/src/routes/cart.ts` | `server/tests/api/route-protections.api.test.ts`, `server/tests/api/route-manifest.contract.test.ts` | implementado | El montaje protegido ocurre en `app.ts` |
| RF-CART-002 | observado | Un usuario autenticado puede agregar items al carrito | `client/src/services/api.ts` | `server/src/routes/cart.ts` | `server/tests/api/route-protections.api.test.ts`, `server/tests/api/route-manifest.contract.test.ts` | implementado | Consolidacion por `lineKey` observada en backend |
| RF-CART-003 | observado | Un usuario autenticado puede modificar cantidad o eliminar items del carrito | `client/src/context/CartContext.tsx`, `client/src/pages/Cart.tsx` | `server/src/routes/cart.ts` | `server/tests/api/route-protections.api.test.ts`, `server/tests/api/route-manifest.contract.test.ts` | implementado | El stock se ajusta segun delta observado |
| RF-CHECKOUT-001 | inferencia razonable | El checkout requiere items en carrito para continuar desde la interfaz | `client/src/pages/Checkout.tsx` | sin validacion equivalente especifica | sin prueba dedicada localizada en archivos obligatorios | implementado parcial | Es una regla visible en frontend, no formalizada en contrato backend |
| RF-ORDER-001 | observado | El sistema permite crear orden desde checkout | `client/src/pages/Checkout.tsx`, `client/src/services/api.ts` | `server/src/routes/orders.ts`, `server/src/controllers/orderController.ts` | `server/tests/api/route-manifest.contract.test.ts` | implementado | Persisten dudas sobre si el flujo debe ser autenticado o tambien invitado |
| RF-ORDER-002 | observado | El sistema lista ordenes por API | sin pantalla cliente dedicada fuera de admin | `server/src/routes/orders.ts`, `server/src/controllers/orderController.ts` | `server/tests/api/route-manifest.contract.test.ts` | implementado | El PDF lo clasifica como autenticado; el codigo actual no |
| RF-ADMIN-001 | observado | El admin puede consultar metricas de dashboard | `client/src/modules/admin/pages/AdminOrdersPage.tsx` usa ecosistema admin; dashboard existe en rutas lazy | `server/src/routes/admin.ts`, `server/src/controllers/adminController.ts` | `server/tests/api/route-manifest.contract.test.ts`, `server/tests/api/route-protections.api.test.ts` | implementado | El endpoint existe y esta protegido |
| RF-ADMIN-002 | observado | El admin puede consultar pedidos y actualizar su estado | `client/src/modules/admin/pages/AdminOrdersPage.tsx` | `server/src/routes/admin.ts`, `server/src/controllers/adminController.ts` | `server/tests/api/route-manifest.contract.test.ts`, `server/tests/api/route-protections.api.test.ts` | implementado | Los estados actuales estan en espanol, pero siguen pendientes de confirmacion formal |
| RF-ADMIN-003 | observado | El admin puede crear, editar y eliminar productos | `client/src/modules/admin/pages/AdminProductsPage.tsx` | `server/src/routes/products.ts` | `server/tests/api/route-manifest.contract.test.ts`, `server/tests/api/route-protections.api.test.ts` | implementado | La validacion funcional detallada no esta cubierta aqui |
| RF-ADMIN-004 | observado | El admin puede crear, editar y eliminar categorias | interfaces admin relacionadas y servicios compartidos | `server/src/routes/categories.ts` | `server/tests/api/route-manifest.contract.test.ts`, `server/tests/api/route-protections.api.test.ts` | implementado | No se relevo una pantalla admin especifica en los archivos obligatorios |

## Cobertura del Bloque 5

- `QA-019` queda cubierto por la matriz y su cruce con archivos fuente.
- `QA-020` se apoya en esta matriz para enlazar contratos y errores con componentes y rutas.

## Limitaciones observadas

- No todos los flujos tienen casos de prueba nombrados por requisito; en varios casos la evidencia de test es contractual por endpoint o proteccion de ruta.
- La ausencia de una especificacion formal previa obliga a usar varios requisitos como `inferencia razonable`, especialmente en checkout y reglas visuales del flujo de compra.

## Decisiones pendientes por confirmar con el equipo

- Si el equipo quiere asignar IDs oficiales de requisitos por modulo para reemplazar estos identificadores operativos.
- Si el listado de ordenes fuera de admin debe ser tratado como requisito funcional publico, autenticado o solo operativo.

## Propuesta de estandarizacion futura

- Convertir esta matriz en anexo vivo del proceso de QA.
- Asociar cada requisito a pruebas unitarias, integracion, E2E y casos manuales con nomenclatura consistente.
