# Bloque 5 QA - Requisitos, diseno, trazabilidad y documentacion tecnica

## Proposito

Este directorio concentra la documentacion creada para cerrar la issue `#12` del repositorio `Albarracin-sg/E-commerce-web`:

- `Bloque 5 QA - Requisitos, diseno, trazabilidad y documentacion tecnica`

El objetivo del bloque es cubrir los hallazgos `QA-016` a `QA-020` del informe consolidado QA y dejar una base documental util para desarrollo, QA y revision academica.

## Relacion con QA-016 a QA-020

- `QA-016`: modelos Prisma incompletos en requisitos -> `docs/data-model.md`
- `QA-017`: estrategia de sesion/token no documentada -> `docs/auth-session.md`
- `QA-018`: reglas de carrito, stock, orden y pago no definidas -> `docs/business-rules-cart-order-payment.md`
- `QA-019`: falta de trazabilidad requisito-diseno-prueba -> `docs/traceability-matrix.md`
- `QA-020`: falta de diagramas, contratos de datos y criterios de error -> `docs/api-contracts-and-errors.md`, `docs/permissions-and-env.md`, `docs/architecture-diagrams.md`

## Fuentes de verdad usadas

Estas fuentes se usaron de forma prioritaria y cruzada:

- Issue `#12` y su comentario de asignacion en GitHub.
- Informe QA consolidado en `docs/Informe_Consolidado_QA_VibePulse.docx.pdf`.
- Codigo real de frontend y backend.
- Tests existentes, especialmente `server/tests/api/route-manifest.contract.test.ts` y `server/tests/api/route-protections.api.test.ts`.
- Documentacion previa del repositorio: `README.md`, `INTEGRACION-SPRINT3.md`, `server/MIDDLEWARES.md`, `server/ARQUITECTURA_MIDDLEWARES.md`, `server/EJEMPLOS_PRACTICOS.md`.

## Guia de lectura

Orden recomendado:

1. `docs/data-model.md`
2. `docs/auth-session.md`
3. `docs/business-rules-cart-order-payment.md`
4. `docs/traceability-matrix.md`
5. `docs/api-contracts-and-errors.md`
6. `docs/permissions-and-env.md`
7. `docs/architecture-diagrams.md`

El `README.md` del repositorio queda como portada operativa y esta carpeta funciona como referencia canonica del Bloque 5.

## Convencion editorial obligatoria

Cada documento de este directorio separa de forma explicita tres capas:

### 1. Estado actual observado en codigo

Describe solamente lo que hoy puede verificarse en:

- archivos fuente del repositorio,
- configuracion real,
- contratos visibles en rutas y controladores,
- tests existentes.

### 2. Decisiones pendientes por confirmar con el equipo

Marca puntos donde el codigo, el PDF, el README o los documentos previos no alcanzan para fijar una politica oficial unica.

### 3. Propuesta de estandarizacion futura

Resume mejoras o normalizaciones recomendables, pero sin presentarlas como decisiones ya aprobadas.

## Regla de cautela documental

No se documenta como politica oficial cerrada ninguno de estos puntos sin marcarlo como pendiente:

- guest checkout en `/api/orders`
- reserva de stock al agregar al carrito
- uso de `localStorage` para JWT
- estados de orden actuales en espanol

## Alcance y limites

- Esta documentacion no cambia logica de aplicacion.
- Si hay contradicciones entre fuentes, se dejan explicitas.
- Se prioriza fidelidad al codigo real por encima de una version idealizada del sistema.
