# Ecommerce Vibe Pulse

Aplicación web de e-commerce de ropa juvenil. Este repositorio contiene el Sprint 1: **Autenticación y Registro de Usuarios**.

## Tecnologías

- **Frontend:** React 18 + Vite + TypeScript
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

El archivo `server/.env` ya existe en el repositorio. Ábrelo y ajusta los valores según tu configuración local:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/ecommerce"
PORT=4000
ADMIN_EMAIL=admin@vibepulse.com
```

> Reemplaza `postgres` con tu usuario de PostgreSQL y `TU_CONTRASEÑA` con tu contraseña.

### 3. Crear las tablas en la base de datos

```bash
npx prisma db push
```

Esto lee el archivo `server/prisma/schema.prisma` y crea la tabla `User` en tu base de datos automáticamente.

### 4. Iniciar el servidor

```bash
npm run dev
```

El servidor arranca en `http://localhost:4000`.

Para verificar que esté corriendo, abre en el navegador:
```
http://localhost:4000/api/health
```
Deberías ver: `{"status":"ok","message":"Authentication API is running"}`

---

## Frontend

Abre una **nueva terminal** (sin cerrar la del backend).

### 1. Instalar dependencias

```bash
cd client
npm install
```

### 2. Iniciar la aplicación

```bash
npm run dev
```

La aplicación abre en `http://localhost:5173`.

---

## Uso

Una vez que tanto el backend como el frontend están corriendo:

- Entra a `http://localhost:5173` — te redirige automáticamente a `/login`.
- **Registro:** Ve a `/register`, completa el formulario y crea tu cuenta.
- **Login:** Ingresa con tu correo y contraseña.
  - Si el rol es `CLIENT` → redirige a `/home`.
  - Si el rol es `ADMIN` → redirige a `/admin`.

El correo que se define como `ADMIN_EMAIL` en el `.env` del servidor se registra automáticamente con rol administrador.

---

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`  | `/api/health` | Verifica que el servidor esté activo |
| `POST` | `/api/auth/register` | Registra un nuevo usuario |
| `POST` | `/api/auth/login` | Inicia sesión y devuelve el usuario con su rol |

### Ejemplos de cuerpo (JSON)

**Registro:**
```json
{
  "name": "Alex Rivera",
  "email": "alex@ejemplo.com",
  "password": "mipassword"
}
```

**Login:**
```json
{
  "email": "alex@ejemplo.com",
  "password": "mipassword"
}
```

---

## Estructura del proyecto

```
ecommerce-vibe-pulse/
├── client/            # Frontend
│   └── src/
│       ├── assets/    # Imágenes
│       ├── pages/     # Login, Register, Home, Admin
│       ├── routes/    # Rutas protegidas
│       ├── services/  # Llamadas a la API
│       └── utils/     # Manejo de sesión (localStorage)
├── server/            # Backend
│   ├── prisma/        # Schema de la base de datos
│   └── src/
│       ├── config/    # Conexión a Prisma
│       ├── controllers/
│       ├── routes/
│       └── services/  # Lógica con bcrypt y Prisma
└── README.md
```
