'use client'

import { formatPrice } from '@/utils/formatPrice'
import { getDiscountLevel } from '@/utils/discountLevel'

export function CartDiscountProgressBar({ cartDiscount }) {
  if (!cartDiscount || !cartDiscount.enabled || cartDiscount.minAmount <= 0 || cartDiscount.percentage <= 0) {
    return null
  }

  const { progress, eligible, percentage } = cartDiscount
  const remaining = progress.remaining
  const { color } = getDiscountLevel(progress.pct)

  return (
    <div className="w-full">
      <p
        className="text-xs mb-1.5"
        style={{ color: eligible ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
      >
        {eligible
          ? `¡Descuento del ${percentage}% aplicado!`
          : `Te faltan ${formatPrice(remaining)} para obtener ${percentage}% de descuento`}
      </p>
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress.pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
