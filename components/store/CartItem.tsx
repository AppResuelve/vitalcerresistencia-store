'use client'
import { X } from 'lucide-react'
import Link from 'next/link'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import { optimizeImageUrl } from '@/utils/imageUrl'

export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  if (item.type === 'service') {
    const mods = item.selectedModifiers || []
    return (
      <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="shrink-0 w-24 h-24 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--color-primary-light)" }}>
          <span className="text-3xl">🌺</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <Link href={`/servicios/${item.serviceSlug}`} className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">{item.serviceName}</Link>
            <button onClick={() => removeItem(item.id)} className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{item.variantName}</p>
          {mods.length > 0 && <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{mods.map(m => m.name).join(', ')}</p>}
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{formatPrice(item.unitPrice)} c/u</p>
          <div className="flex items-center justify-between mt-4">
            <QuantitySelector quantity={item.quantity} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} />
            <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>{formatPrice(item.subtotal)}</span>
          </div>
        </div>
      </div>
    )
  }

  const hasWholesale = item.wholesalePrice && item.wholesaleMinQty
  const usesWholesale = hasWholesale && item.quantity >= item.wholesaleMinQty

  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <Link href={`/productos/${item.slug}`} className="shrink-0">
        <img
          src={optimizeImageUrl(item.images[0])}
          alt={item.name}
          className="w-24 h-24 object-cover rounded-xl"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            href={`/productos/${item.slug}`}
            className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          {item.variantLabel && (
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
              {item.variantLabel}
            </p>
          )}
          <button
            onClick={() => removeItem(item.id)}
            className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {item.comparePrice && item.comparePrice > item.unitPrice && (
            <span className="text-xs line-through text-[var(--color-text-muted)]">
              {formatPrice(item.comparePrice)}
            </span>
          )}
          {item.discountPercentage > 0 && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--color-primary)", color: "#ffffff" }}
            >
              {item.discountPercentage}% OFF
            </span>
          )}
          {usesWholesale && (
            <span className="text-xs text-[var(--color-primary)] font-medium">(mayorista)</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {formatPrice(item.unitPrice)} c/u
          </span>
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {formatPrice(item.subtotal)}
          </span>
        </div>

        <div className="mt-3">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
          />
        </div>
      </div>
    </div>
  )
}
