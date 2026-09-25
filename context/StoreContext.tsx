'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { settingsService, categoriesService, productsService, discountsService } from '@/services/storeService'

const StoreContext = createContext<any>(null)

export function StoreProvider({ children }) {
  const [store, setStore] = useState(null)
  const [categories, setCategories] = useState([])
  const [productsMap, setProductsMap] = useState({})
  const [cartTotals, setCartTotals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const settings = await settingsService.get()
        setStore(settings)

        const discounts = await discountsService.get().catch(() => ({ cartTotals: [] }))
        setCartTotals(discounts.cartTotals || [])

        const status = settings.store_status || 'active'
        if (status !== 'active') {
          setCategories([])
          setProductsMap({})
          return
        }

        const [cats, prods] = await Promise.all([
          categoriesService.list(),
          productsService.list({ limit: 1000 }),
        ])

        setCategories(cats)

        const map = {}
        prods.products.forEach((p) => {
          map[p.id] = p
        })
        setProductsMap(map)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <StoreContext.Provider value={{ store, categories, productsMap, cartTotals, loading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
