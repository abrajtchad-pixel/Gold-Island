'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { LineData } from 'lightweight-charts'
import PriceCard from '@/components/PriceCard'
import PriceChart from '@/components/PriceChart'

const REFRESH_INTERVAL_MS = 60_000
const CHART_COLORS: Record<string, string> = {
  'XAU/USD': '#f59e0b',
  'XAU/EUR': '#60a5fa',
  'XAU/XAF': '#34d399',
}

interface Quote {
  pair: string
  price: number
  currency: string
  timestamp: number
}

interface ChartHistory {
  [pair: string]: LineData[]
}

export default function HomePage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [prevQuotes, setPrevQuotes] = useState<Quote[]>([])
  const quotesRef = useRef<Quote[]>([])
  const [history, setHistory] = useState<ChartHistory>({})
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_MS / 1000)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/quotes', { cache: 'no-store' })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`)
      }

      const newQuotes: Quote[] = json.quotes

      if (quotesRef.current.length > 0) {
        setPrevQuotes(quotesRef.current)
      }
      quotesRef.current = newQuotes
      setQuotes(newQuotes)

      // Append to history
      setHistory((prev) => {
        const updated: ChartHistory = { ...prev }
        for (const q of newQuotes) {
          const existing = updated[q.pair] ?? []
          const point: LineData = {
            time: Math.floor(q.timestamp / 1000) as LineData['time'],
            value: q.price,
          }
          // Avoid duplicate timestamps
          const last = existing[existing.length - 1]
          if (!last || last.time !== point.time) {
            updated[q.pair] = [...existing, point]
          }
        }
        return updated
      })

      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quotes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuotes()

    const interval = setInterval(() => {
      fetchQuotes()
      setCountdown(REFRESH_INTERVAL_MS / 1000)
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [fetchQuotes])

  // Countdown timer
  useEffect(() => {
    setCountdown(REFRESH_INTERVAL_MS / 1000)
    if (countdownRef.current) clearInterval(countdownRef.current)
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : REFRESH_INTERVAL_MS / 1000))
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [lastUpdated])

  const pairs = ['XAU/USD', 'XAU/EUR', 'XAU/XAF']

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-2">
          <span className="text-4xl">🏝️</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-gold-300">
            Gold Island
          </h1>
        </div>
        <p className="mt-2 text-sm text-gold-600">
          Live gold market data · XAU/USD · XAU/EUR · XAU/XAF
        </p>

        {/* Status bar */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
          {lastUpdated ? (
            <>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Live
              </span>
              <span>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
              <span>Next refresh in {countdown}s</span>
            </>
          ) : loading ? (
            <span>Loading…</span>
          ) : null}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-700/50 bg-red-950/40 p-4 text-sm text-red-300">
          <strong>Error:</strong> {error}
          {error.includes('METALS_DEV_API_KEY') && (
            <p className="mt-2 text-xs text-red-400">
              Set <code className="rounded bg-red-900/40 px-1">METALS_DEV_API_KEY</code> in your{' '}
              <code className="rounded bg-red-900/40 px-1">.env.local</code> file (see{' '}
              <code>.env.local.example</code>).
            </p>
          )}
        </div>
      )}

      {/* Price Cards */}
      <section className="mx-auto mb-8 grid max-w-4xl gap-4 sm:grid-cols-3">
        {pairs.map((pair) => {
          const q = quotes.find((x) => x.pair === pair)
          const prev = prevQuotes.find((x) => x.pair === pair)
          return (
            <PriceCard
              key={pair}
              pair={pair}
              price={q?.price ?? null}
              currency={q?.currency ?? pair.split('/')[1]}
              previousPrice={prev?.price ?? null}
              loading={loading}
              error={error ?? undefined}
            />
          )
        })}
      </section>

      {/* Charts */}
      <section className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-1 md:grid-cols-1">
        {pairs.map((pair) => (
          <PriceChart
            key={pair}
            pair={pair}
            data={history[pair] ?? []}
            color={CHART_COLORS[pair] ?? '#f59e0b'}
          />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-600">
        <p>
          Data provided by{' '}
          <a
            href="https://metals.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-700 hover:text-gold-500 underline"
          >
            metals.dev
          </a>
          {' · '}XAU/XAF computed from XAU/USD × USD/XAF exchange rate
        </p>
        <p className="mt-1">
          Prices refresh every {REFRESH_INTERVAL_MS / 1000}s · For informational purposes only
        </p>
      </footer>
    </main>
  )
}
