import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export interface QuoteData {
  pair: string
  price: number
  currency: string
  timestamp: number
}

export interface QuotesResponse {
  quotes: QuoteData[]
  updatedAt: number
}

export async function GET() {
  const apiKey = process.env.METALS_DEV_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'METALS_DEV_API_KEY environment variable is not set.' },
      { status: 500 }
    )
  }

  try {
    const url = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`
    const res = await fetch(url, { next: { revalidate: 0 } })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: `metals.dev API error ${res.status}: ${text}` },
        { status: 502 }
      )
    }

    const data = await res.json()

    // metals.dev response shape:
    // { status, currency, unit, metals: { gold, silver, ... }, currencies: { EUR, XAF, ... } }
    const goldUsd: number = data.metals?.gold ?? 0
    const usdToEur: number = data.currencies?.EUR ?? 0
    const usdToXaf: number = data.currencies?.XAF ?? 0

    const goldEur = goldUsd * usdToEur
    const goldXaf = goldUsd * usdToXaf

    const now = Date.now()

    const quotes: QuoteData[] = [
      { pair: 'XAU/USD', price: goldUsd, currency: 'USD', timestamp: now },
      { pair: 'XAU/EUR', price: goldEur, currency: 'EUR', timestamp: now },
      { pair: 'XAU/XAF', price: goldXaf, currency: 'XAF', timestamp: now },
    ]

    return NextResponse.json({ quotes, updatedAt: now } satisfies QuotesResponse)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
