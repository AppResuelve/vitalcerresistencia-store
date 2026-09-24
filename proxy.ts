import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function resolveTenantSlug(req: NextRequest): string | null {
  const override = process.env.NEXT_PUBLIC_TENANT_SLUG
  if (override) return override

  const host = req.headers.get('host') || ''
  return host.replace(/^www\./, '').replace(/^store\./, '') || null
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '')
  const slug = resolveTenantSlug(req)

  console.log('[store-proxy]', req.method, pathname, '→', apiUrl, 'tenant:', slug)

  if (!slug) {
    return new NextResponse('Tenant slug no configurado', { status: 400 })
  }

  if (!apiUrl) {
    return new NextResponse('NEXT_PUBLIC_API_URL no configurado', { status: 500 })
  }

  const headers = new Headers(req.headers)
  headers.delete('content-length')
  headers.delete('origin') // Evita falsos positivos de CORS en el backend
  headers.set('X-Tenant-Slug', slug)

  const hasBody = !['GET', 'HEAD'].includes(req.method)
  let body: ArrayBuffer | undefined = undefined
  if (hasBody) {
    try {
      body = await req.arrayBuffer()
      console.log('[store-proxy] body size:', body.byteLength)
    } catch (err) {
      console.error('[store-proxy] Error reading body:', (err as Error).message)
    }
  }

  try {
    const res = await fetch(`${apiUrl}${pathname}${search}`, {
      method: req.method,
      headers,
      body,
      // No enviamos cookies al API de misitioapp; la store es pública.
      credentials: 'omit',
    })

    console.log('[store-proxy] response:', res.status, res.statusText)

    // Limpiar headers de transferencia/compresión porque fetch ya decodificó el body.
    const responseHeaders = new Headers(res.headers)
    responseHeaders.delete('content-encoding')
    responseHeaders.delete('content-length')
    responseHeaders.delete('transfer-encoding')

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    })
  } catch (err) {
    console.error('[store-proxy] Error forwarding request:', (err as Error).message, (err as Error).stack)
    return new NextResponse('Error conectando con el API de la tienda', { status: 502 })
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
