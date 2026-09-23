# vitalcerresistencia-store

Frontend de la tienda pública de Vitalcer Resistencia.

Esta es una store desacoplada que se conecta al API multitenant de `misitioapp` para obtener productos, categorías, settings y pedidos.

## Estructura

- `app/(store)/` — páginas públicas de la tienda.
- `components/store/` — componentes de la store.
- `services/storeService.ts` — llamadas al API de `misitioapp`.
- `middleware.ts` — proxy de `/api/*` al API de `misitioapp` agregando el header `X-Tenant-Slug`.

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_TENANT_SLUG=vitalcerresistencia
NEXT_PUBLIC_STORE_URL=http://localhost:3000
```

## Desarrollo

```bash
pnpm install
pnpm dev
```

La store corre por defecto en el puerto 3000. El API de `misitioapp` debe estar corriendo en el puerto 3001 (o la URL configurada).

## Conexión con misitioapp

- El admin del tenant se gestiona desde `misitioapp/codigo/client` (panel multitenant).
- Los productos, categorías, settings y pedidos se leen/escriben a través del API de `misitioapp`.
- El tenant se identifica mediante el header `X-Tenant-Slug` (resuelto por hostname o por `NEXT_PUBLIC_TENANT_SLUG` en desarrollo).
