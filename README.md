# front_perfumeria

Tienda de perfumería (Next.js 15 + Tailwind). Se conecta a **Supabase Auth** (login/registro) y al backend **back_perfumeria** (FastAPI) para catálogo, pedidos y panel admin.

## Variables de entorno
Copia `.env.example` a `.env.local`:

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon public |
| `NEXT_PUBLIC_API_URL` | URL del backend desplegado (sin `/` final) |

## Desarrollo
```bash
pnpm install
pnpm dev
```

## Despliegue en Vercel
1. Importar el repo en Vercel (framework: Next.js, detectado solo).
2. Cargar las 3 variables de arriba.
3. En el backend, poner `CORS_ORIGINS` y `FRONTEND_URL` con la URL de este sitio.
4. En Supabase → Authentication → URL Configuration: *Site URL* = URL del sitio y agregar `https://TU-SITIO/**` en Redirect URLs.

## Rutas
- Público: `/`, `/colecciones`, `/colecciones/[id]`, `/carrito`, `/login`, `/registro`, `/privacidad`
- Cliente: `/cuenta` (datos y autorizaciones), `/cuenta/pedidos`, `/cuenta/pedidos/[id]` (seguimiento)
- Admin (rol `admin`): `/admin/pedidos`, `/admin/catalogo`, `/admin/clientes`, `/admin/plantillas`, `/admin/campanas`, `/admin/ajustes`
- `/inventario`: control interno de concentrados (datos en localStorage, acceso con 5 clics en el logo).
