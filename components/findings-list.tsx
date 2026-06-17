"use client"

import {
  AlertTriangle,
  Languages,
  Link2,
  Workflow,
  Network,
  ScanText,
  History,
} from "lucide-react"
import type { Reason, ReasonGroup } from "@/lib/engine/types"

interface FindingsListProps {
  reasons: Reason[]
}

const GROUP_META: Record<ReasonGroup, { label: string; icon: typeof AlertTriangle }> = {
  signal: { label: "Signal", icon: AlertTriangle },
  entity: { label: "Indicator", icon: Link2 },
  language: { label: "Language", icon: Languages },
  context: { label: "Context Chain", icon: Network },
  behavioral: { label: "Behavioral", icon: Workflow },
  pattern: { label: "Pattern", icon: ScanText },
  reputation: { label: "Reputation", icon: History },
}

export function FindingsList({ reasons }: FindingsListProps) {
  if (reasons.length === 0) {
    return <p className="text-sm text-muted-foreground">No notable findings.</p>
  }

  const sorted = [...reasons].sort((a, b) => b.weight - a.weight)

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((reason, i) => {
        const meta = GROUP_META[reason.group]
        const Icon = meta.icon
        return (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
          >
            <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {meta.label}
                </span>
                <span className="rounded bg-muted px-1.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                  +{reason.weight}
                </span>
              </div>
              <p className="text-sm leading-snug text-foreground text-pretty">{reason.text}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
