'use client'

import { useEffect, useRef } from 'react'
import type { IChartApi, ISeriesApi, LineData } from 'lightweight-charts'

interface PriceChartProps {
  pair: string
  data: LineData[]
  color: string
}

export default function PriceChart({ pair, data, color }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let chart: IChartApi
    let handleResize: (() => void) | null = null

    // Dynamic import to avoid SSR issues
    import('lightweight-charts').then(({ createChart, ColorType }) => {
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#d1a836',
        },
        grid: {
          vertLines: { color: 'rgba(212, 160, 40, 0.08)' },
          horzLines: { color: 'rgba(212, 160, 40, 0.08)' },
        },
        crosshair: {
          vertLine: { color: 'rgba(212, 160, 40, 0.5)' },
          horzLine: { color: 'rgba(212, 160, 40, 0.5)' },
        },
        rightPriceScale: { borderColor: 'rgba(212, 160, 40, 0.2)' },
        timeScale: {
          borderColor: 'rgba(212, 160, 40, 0.2)',
          timeVisible: true,
          secondsVisible: false,
        },
        width: containerRef.current.clientWidth,
        height: 200,
      })

      const series = chart.addLineSeries({
        color,
        lineWidth: 2,
        priceLineVisible: true,
        lastValueVisible: true,
      })

      if (data.length > 0) {
        series.setData(data)
        chart.timeScale().fitContent()
      }

      chartRef.current = chart
      seriesRef.current = series

      handleResize = () => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: containerRef.current.clientWidth,
          })
        }
      }

      window.addEventListener('resize', handleResize)
    })

    return () => {
      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [color]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update data when it changes
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data)
      chartRef.current?.timeScale().fitContent()
    }
  }, [data])

  return (
    <div className="rounded-2xl border border-gold-700/30 bg-black/40 p-4 backdrop-blur-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-500">
        {pair} · Session Chart
      </p>
      <div ref={containerRef} />
    </div>
  )
}
