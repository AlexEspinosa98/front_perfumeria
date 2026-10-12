# front_perfumeria

Tienda de perfumería (Next.js 15 + Tailwind). Habla únicamente con el backend **back_perfumeria** (FastAPI): login, registro, catálogo, pedidos y panel admin. No usa Supabase directamente.

## Variables de entorno
Copia `.env.example` a `.env.local`:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend desplegado (sin `/` final) |

## Desarrollo
```bash
pnpm install
pnpm dev
```

## Despliegue en Vercel
1. Importar el repo en Vercel (framework: Next.js, detectado solo).
2. Cargar `NEXT_PUBLIC_API_URL`.
3. En el backend, poner `CORS_ORIGINS` y `FRONTEND_URL` con la URL de este sitio.
4. (Una vez, en Supabase del backend) Authentication → URL Configuration: *Site URL* = URL de este sitio y `https://TU-SITIO/**` en Redirect URLs, para que los enlaces de confirmar correo y recuperar contraseña (`/auth/callback`, `/restablecer`) funcionen.

## Rutas
- Público: `/`, `/colecciones`, `/colecciones/[id]`, `/carrito`, `/login`, `/registro`, `/privacidad`
- Cliente: `/cuenta` (datos y autorizaciones), `/cuenta/pedidos`, `/cuenta/pedidos/[id]` (seguimiento)
- Admin (rol `admin`): `/admin/pedidos`, `/admin/catalogo`, `/admin/clientes`, `/admin/plantillas`, `/admin/campanas`, `/admin/ajustes`
- `/inventario`: control interno de concentrados (datos en localStorage, acceso con 5 clics en el logo).
