import axios from 'axios'

const isServer = typeof window === 'undefined'

function getTenantSlug(): string {
  return process.env.NEXT_PUBLIC_TENANT_SLUG || ''
}

const api = axios.create({
  baseURL: isServer
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    : '/api',
  // La store es pública; no necesita cookies de sesión del admin.
  withCredentials: false,
})

if (isServer) {
  api.interceptors.request.use((config) => {
    const slug = getTenantSlug()
    if (slug) {
      const headers = config.headers || {}
      ;(headers as Record<string, string>)['X-Tenant-Slug'] = slug
      config.headers = headers as typeof config.headers
    }
    return config
  })
}

export default api
