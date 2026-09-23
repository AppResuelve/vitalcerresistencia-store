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

  if (!slug) {
    return new NextResponse('Tenant slug no configurado', { status: 400 })
  }

  if (!apiUrl) {
    return new NextResponse('NEXT_PUBLIC_API_URL no configurado', { status: 500 })
  }

  const headers = new Headers(req.headers)
  headers.delete('content-length')
  headers.set('X-Tenant-Slug', slug)

  const hasBody = !['GET', 'HEAD'].includes(req.method)

  try {
    const res = await fetch(`${apiUrl}${pathname}${search}`, {
      method: req.method,
      headers,
      body: hasBody ? req.body : undefined,
      // No enviamos cookies al API de misitioapp; la store es pública.
      credentials: 'omit',
    })

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    })
  } catch (err) {
    console.error('[proxy] Error proxying to misitioapp API:', err)
    return new NextResponse('Error conectando con el API de la tienda', { status: 502 })
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
