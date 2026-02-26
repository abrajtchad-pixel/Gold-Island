'use client'

interface PriceCardProps {
  pair: string
  price: number | null
  currency: string
  previousPrice: number | null
  loading: boolean
  error?: string
}

function formatPrice(price: number, currency: string): string {
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'XAF' ? 0 : 2,
    maximumFractionDigits: currency === 'XAF' ? 0 : 2,
  }
  try {
    return new Intl.NumberFormat('en-US', opts).format(price)
  } catch {
    return `${currency} ${price.toFixed(currency === 'XAF' ? 0 : 2)}`
  }
}

export default function PriceCard({
  pair,
  price,
  currency,
  previousPrice,
  loading,
  error,
}: PriceCardProps) {
  const change =
    price !== null && previousPrice !== null ? price - previousPrice : null
  const changePct =
    change !== null && previousPrice !== null && previousPrice !== 0
      ? (change / previousPrice) * 100
      : null

  const isUp = change !== null && change > 0
  const isDown = change !== null && change < 0

  return (
    <div className="rounded-2xl border border-gold-700/40 bg-gradient-to-b from-yellow-950/60 to-black/60 p-5 shadow-lg shadow-yellow-900/20 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
          {pair}
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isUp
              ? 'bg-green-900/50 text-green-400'
              : isDown
              ? 'bg-red-900/50 text-red-400'
              : 'bg-gray-800 text-gray-400'
          }`}
        >
          {isUp ? '▲' : isDown ? '▼' : '—'}{' '}
          {changePct !== null ? `${Math.abs(changePct).toFixed(3)}%` : '–'}
        </span>
      </div>

      <div className="mt-3">
        {loading && price === null ? (
          <div className="h-9 w-48 animate-pulse rounded-md bg-gold-800/30" />
        ) : error && price === null ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <p
            className={`text-3xl font-bold tabular-nums transition-colors duration-500 ${
              isUp
                ? 'text-green-300'
                : isDown
                ? 'text-red-300'
                : 'text-gold-200'
            }`}
          >
            {price !== null ? formatPrice(price, currency) : '–'}
          </p>
        )}
      </div>

      {change !== null && (
        <p
          className={`mt-1 text-sm tabular-nums ${
            isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-gray-500'
          }`}
        >
          {isUp ? '+' : ''}
          {formatPrice(change, currency)} this session
        </p>
      )}
    </div>
  )
}
