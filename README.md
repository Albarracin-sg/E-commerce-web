# Ecommerce Vibe Pulse

Aplicación web de e-commerce de ropa juvenil. Este repositorio contiene el Sprint 1: **Autenticación y Registro de Usuarios**.

## Tecnologías

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** PostgreSQL + Prisma ORM
- **Seguridad:** bcrypt para contraseñas

---

## Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) corriendo en tu máquina (puerto 5432 por defecto)
- npm (viene con Node.js)

---

## Configuración de la Base de Datos

1. Abre tu cliente de PostgreSQL (pgAdmin, DBeaver, o la terminal).
2. Crea una base de datos llamada `ecommerce`:
   ```sql
   CREATE DATABASE ecommerce;
   ```
3. Anota tu usuario y contraseña de PostgreSQL, los necesitarás en el siguiente paso.

---

## Backend

### 1. Instalar dependencias

```bash
cd server
npm install
```

### 2. Configurar variables de entorno

> **⚠️ IMPORTANTE DE SEGURIDAD:** A partir de Sprint 1, `JWT_SECRET` es **OBLIGATORIO** y debe estar en el archivo `.env`. El servidor no arrancará sin él.

Copia el archivo `server/.env.example` a `server/.env` y ajusta los valores según tu configuración:

```bash
cp server/.env.example server/.env
```

Luego edita `server/.env` con tus valores:

```env
# Base de datos
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/ecommerce"

# Servidor
PORT=4000

# JWT - CRÍTICO: genera una clave segura
# Nunca uses la clave por defecto en producción
JWT_SECRET="tu-clave-secreta-larga-y-segura-aqui"
Copia el resultado y pégalo como valor de `JWT_SECRET` en tu `.env`.

### 3. Crear las tablas en la base de datos

```bash
npx prisma db push
```

Esto lee el archivo `server/prisma/schema.prisma` y crea la tabla `User` en tu base de datos automáticamente.

### 4. Iniciar el servidor (Desarrollo)

```bash
npm run dev
```

El servidor arranca en `http://localhost:4000`.

### 5. Compilar y ejecutar para Producción

Para compilar el proyecto y ejecutar la versión optimizada:

```bash
npm run build
npm run start
```

Para verificar que esté corriendo, abre en el navegador:
```
http://localhost:4000/api/health
```

Deberías ver:
```json
{"status":"ok","message":"Authentication API is running"}
```

**Solución de problemas:**
- ❌ Error: `JWT_SECRET environment variable is not set` → Verifica que `JWT_SECRET` esté en `.env` con un valor válido
- ❌ Error de conexión a BD → Revisa `DATABASE_URL` y que PostgreSQL esté corriendo
- ❌ Token inválido o expirado → Inicia sesión nuevamente para obtener un token fresco

---

## Frontend

Abre una **nueva terminal** (sin cerrar la del backend).

### 1. Instalar dependencias

```bash
cd client
npm install
```

### 2. Iniciar la aplicación (Desarrollo)

```bash
npm run dev
```

La aplicación abre en `http://localhost:5173`.
*(Nota: Si el puerto 5173 está ocupado, Vite abrirá automáticamente en el `5174` u otro superior. El servidor Backend está configurado con CORS dinámico (`origin: true`) para permitir peticiones desde cualquier puerto local originado por Vite sin bloquearte).*

### 3. Compilar y previsualizar para Producción

Para compilar el proyecto optimizado y previsualizar el build:

```bash
npm run build
npm run preview
```

La aplicación de producción (preview) se abrirá generalmente en `http://localhost:4173`.

### 4. Ejecutar pruebas del frontend

```bash
npm run test
npm run test:component
npm run test:e2e
```

#### Estrategia de testing frontend

- **Vitest**: lógica unitaria y render simple.
- **Cypress Component Testing**: componentes con `React Router`, `CheckoutProvider`, `CartProvider` y páginas admin con `useOutletContext`.
- **Playwright**: flujos end-to-end.

#### Patrones de Component Testing

- Los specs viven en `client/cypress/component`.
- El helper compartido está en `client/cypress/support/mount.tsx`.
- Usa `cy.mount()` con opciones como:
  - `routerProps`
  - `withCheckoutProvider`
  - `withCartProvider`
  - `outletContext`
  - `auth`
- Las fixtures base viven en `client/cypress/fixtures`.

---

## Uso

Una vez que tanto el backend como el frontend están corriendo:

- Entra a `http://localhost:5173` — te redirige automáticamente a `/login`.
- **Registro:** Ve a `/register`, completa el formulario y crea tu cuenta.
  - Todos los usuarios registrados se crean con rol `CLIENT` por defecto.
  - Para crear cuentas `ADMIN`, usa la herramienta de migración o seed de Prisma (ver sección de Administración).
- **Login:** Ingresa con tu correo y contraseña.
  - Si el rol es `CLIENT` → redirige a `/home`.
  - Si el rol es `ADMIN` → redirige a `/admin`.

### Crear una cuenta de administrador (Paso a paso)

Los usuarios registrados desde la web (`/register`) se crean siempre con el rol `CLIENT`. Por seguridad, las cuentas con privilegios de **ADMIN** se gestionan exclusivamente desde el servidor.

> **Regla de Oro:** Las cuentas ADMIN deben crearse mediante una seed de Prisma o un proceso administrativo controlado.

#### Pasos para generar el administrador inicial:

1.  **Entra a la carpeta del servidor:**
    ```bash
    cd server
    ```

2.  **Ejecuta el comando de Seed:**
    Este comando activa el script automatizado que inserta el administrador en la base de datos.
    ```bash
    npx prisma db seed
    ```

3.  **Verificar el resultado:**
    Deberías ver un mensaje en consola confirmando: `Admin user creado/actualizado: admin@vibepulse.com`.

#### Credenciales por defecto (Generadas por el Seed):
Una vez ejecutado el comando, usa estos datos para entrar al panel de administración:
- **Email:** `admin@vibepulse.com`
- **Contraseña:** `AdminPassword123!`

*Nota: Para cambiar estas credenciales, edita el archivo `server/prisma/seed.ts` y vuelve a ejecutar el comando `npx prisma db seed`.*

---

#### ¿Por qué este método? (Mejores prácticas)
- **Cero registros públicos:** Evitamos que cualquier usuario se asigne el rol de ADMIN desde el navegador.
- **Contraseñas Seguras:** El script hashea la contraseña automáticamente usando `bcrypt` antes de guardarla.
- **Sin Lógica "Mágica":** No dependemos de que el sistema "detecte" emails que terminen en `@admin.com`, evitando vulnerabilidades.

---

## Endpoints de la API

### Públicos (sin autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/api/health` | Verifica que el servidor esté activo |
| `POST` | `/api/auth/register` | Registra un nuevo usuario (rol: CLIENT) |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve JWT token |

### Protegidos (requieren JWT Bearer token)

| Método | Ruta | Autorización | Descripción |
|--------|------|-------------|-------------|
| `GET`  | `/api/auth/me` | Cualquier usuario autenticado | Obtiene datos del usuario autenticado |
| `GET`  | `/api/auth/profile` | Cualquier usuario autenticado | Obtiene perfil detallado del usuario |
| `GET`  | `/api/auth/admin-only` | Solo ADMIN | Verifica acceso de administrador |

### Ejemplos de cuerpo (JSON)

**Registro:**
```json
{
  "name": "Alex Rivera",
  "email": "alex@ejemplo.com",
  "password": "Contraseña123!"
}
```

**Login:**
```json
{
  "email": "alex@ejemplo.com",
  "password": "Contraseña123!"
}
```

### Usando endpoints protegidos

Para acceder a endpoints protegidos, incluye el JWT en el header `Authorization`:

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta esperada:**
```json
{
  "message": "Datos del usuario autenticado",
  "user": {
    "id": "1",
    "email": "alex@ejemplo.com",
    "role": "CLIENT"
  }
}
```

### Códigos de error comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | Datos inválidos | Verifica que todos los campos requeridos estén presentes y válidos |
| 409 | Ya existe una cuenta con ese correo | Intenta con otro email o inicia sesión |
| 401 | Correo o contraseña incorrectos | Verifica tus credenciales |
| 401 | Token no proporcionado | Incluye el header `Authorization: Bearer <token>` |
| 401 | Token inválido o expirado | Inicia sesión nuevamente |
| 403 | Acceso denegado | Tu rol no tiene permisos para este recurso |
| 429 | Demasiadas solicitudes | Espera antes de reintentar (rate limit alcanzado) |

---

## Seguridad y Buenas Prácticas

### Cambios de seguridad en Sprint 1

✅ **JWT_SECRET obligatorio**
- El servidor ahora falla si no existe una variable de entorno `JWT_SECRET` válida
- Esto previene inicios accidentales con claves inseguras

✅ **Sin escalamiento de privilegios por email**
- Eliminada la asignación automática de rol ADMIN basada en email
- Los nuevos usuarios siempre se crean con rol `CLIENT`
- Los admins solo se pueden crear mediante procesos administrativos verificados

✅ **Validaciones consistentes**
- Contraseña mínima de **8 caracteres** en frontend y backend
- Validaciones duplicadas previenen inconsistencias

✅ **Endpoints protegidos**
- Nuevos endpoints (`/me`, `/profile`, `/admin-only`) demuestran protección real
- Middleware `authenticateToken` y `authorizeRole` implementados

✅ **Hashing de contraseñas**
- bcrypt con 10 rounds implementado en backend
- Las contraseñas nunca se almacenan en texto plano

✅ **Rate limiting**
- 5 intentos por 15 minutos en endpoints de auth
- 100 solicitudes por minuto globalmente

### Requisitos de contraseña

- **Mínimo 8 caracteres**
- Sin restricciones específicas de complejidad (educativo)
- Considera agregar: mayúsculas, minúsculas, números y símbolos en producción

### Para llevar a producción

- [ ] Cambiar `CLIENT_ORIGIN` a dominio real
- [ ] Usar HTTPS en lugar de HTTP
- [ ] Ampliar JWT_EXPIRY según necesidad (default: 7 días)
- [ ] Implementar refresh tokens
- [ ] Agregar 2FA (Two-Factor Authentication)
- [ ] Usar secrets management (AWS Secrets, Vault, etc.) en lugar de `.env`
- [ ] Agregar logging de intentos fallidos
- [ ] Implementar CAPTCHA en login/register si es público

```
ecommerce-vibe-pulse/
├── client/            # Frontend
│   ├── public/        # Recursos estáticos (ej. logo.png como favicon)
│   ├── src/
│   │   ├── assets/    # Imágenes y recursos internos
│   │   ├── pages/     # Login, Register, Home, Admin
│   │   ├── routes/    # Rutas protegidas
│   │   ├── services/  # Llamadas a la API
│   │   └── utils/     # Manejo de sesión (localStorage)
│   ├── tailwind.config.js # Configuración de Tailwind CSS
│   └── vite.config.ts   # Configuración de Vite (incluye setup de PostCSS para Tailwind)
├── server/            # Backend
│   ├── prisma/        # Schema de la base de datos
│   └── src/
│       ├── config/    # Conexión a Prisma
│       ├── controllers/
│       ├── routes/
│       └── services/  # Lógica con bcrypt y Prisma
└── README.md
```

---

## Contribuciones

Si encuentras un problema o tienes sugerencias, abre un issue o haz un pull request.

## Licencia

Este proyecto es educativo para el Sprint 1 del bootcamp.
