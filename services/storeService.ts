import api from "./api-client"

export const productsService = {
  list(params = {}) {
    return api.get("/api/store/products", { params }).then((r) => r.data)
  },
  getBySlug(slug: string) {
    return api.get(`/api/store/products/${slug}`).then((r) => r.data)
  },
}

export const categoriesService = {
  list() {
    return api.get("/api/store/categories").then((r) => r.data)
  },
}

export const settingsService = {
  get() {
    return api.get("/api/store/settings").then((r) => r.data)
  },
}

export const discountsService = {
  get() {
    return api.get("/api/store/discounts").then((r) => r.data)
  },
}

export const ordersService = {
  create(data: unknown) {
    return api.post("/api/store/orders", data).then((r) => r.data)
  },
}

export const tagsService = {
  list(params = {}) {
    return api.get("/api/store/tags", { params }).then((r) => r.data)
  },
}

export const servicesService = {
  list(params = {}) {
    return api.get("/api/store/services", { params }).then((r) => r.data)
  },
  getBySlug(slug: string) {
    return api.get(`/api/store/services/${slug}`).then((r) => r.data)
  },
}
