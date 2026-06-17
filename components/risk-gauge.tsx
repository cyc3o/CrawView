"use client"

import { useEffect, useState } from "react"
import type { AnalysisReport } from "@/lib/engine/types"
import { getRiskMeta } from "@/lib/engine/risk-meta"

interface RiskGaugeProps {
  report: AnalysisReport
}

export function RiskGauge({ report }: RiskGaugeProps) {
  const meta = getRiskMeta(report.threat_level)
  // Cap visual at 200 for the arc; clamp 0-1
  const pct = Math.min(report.risk_score / 200, 1)
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    setAnimated(0)
    const id = requestAnimationFrame(() => setAnimated(pct))
    return () => cancelAnimationFrame(id)
  }, [pct, report.date])

  const radius = 80
  const circumference = Math.PI * radius // half circle
  const dash = circumference * animated

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[112px]">
        <svg viewBox="0 0 200 112" className="w-full h-full">
          {/* Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Value */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={meta.ring}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className={`text-4xl font-semibold tabular-nums ${meta.color}`}>
            {report.risk_score}
          </span>
          <span className="text-xs text-muted-foreground">risk score</span>
        </div>
      </div>
      <div className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${meta.bg} ${meta.border} ${meta.color}`}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: meta.ring }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: meta.ring }} />
        </span>
        {meta.label}
      </div>
      <p className="mt-2 max-w-[260px] text-center text-xs leading-relaxed text-muted-foreground text-pretty">
        {meta.blurb}
      </p>
      <div className="mt-1 text-xs text-muted-foreground">
        Confidence: <span className="font-medium text-foreground">{Math.round(report.confidence * 100)}%</span>
      </div>
    </div>
  )
}
