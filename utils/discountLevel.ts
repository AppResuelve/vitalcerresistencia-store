export function getDiscountLevel(pct: number): { color: string } {
  if (pct >= 100) return { color: 'var(--color-primary)' }
  if (pct <= 33) return { color: '#facc15' }
  if (pct <= 66) return { color: '#f97316' }
  return { color: '#ef4444' }
}
