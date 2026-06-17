"use client"

import { useMemo } from "react"
import { buildThreatLens } from "@/lib/engine/highlight"

interface ThreatLensProps {
  message: string
}

export function ThreatLens({ message }: ThreatLensProps) {
  const tokens = useMemo(() => buildThreatLens(message), [message])

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <p className="text-sm leading-7 whitespace-pre-wrap break-words font-mono text-foreground">
        {tokens.map((t, i) => {
          if (!t.kind) return <span key={i}>{t.text}</span>
          if (t.kind === "ioc") {
            return (
              <mark
                key={i}
                title={t.label ?? undefined}
                className="rounded bg-primary/15 px-0.5 text-primary underline decoration-primary/40 decoration-dotted underline-offset-2"
              >
                {t.text}
              </mark>
            )
          }
          return (
            <mark
              key={i}
              title={t.label ?? undefined}
              className="rounded bg-risk-elevated/20 px-0.5 text-foreground"
            >
              {t.text}
            </mark>
          )
        })}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-risk-elevated/40" /> Manipulation keyword
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/30" /> Indicator of compromise
        </span>
      </div>
    </div>
  )
}
