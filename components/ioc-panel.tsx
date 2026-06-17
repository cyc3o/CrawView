"use client"

import { Globe, Mail, Phone, Server, Bitcoin, Coins, CreditCard, Wallet } from "lucide-react"
import type { Entities } from "@/lib/engine/types"

interface IocPanelProps {
  entities: Entities
}

const IOC_CONFIG: Array<{
  key: keyof Entities
  label: string
  icon: typeof Globe
}> = [
  { key: "domains", label: "URLs / Domains", icon: Globe },
  { key: "emails", label: "Emails", icon: Mail },
  { key: "phones", label: "Phone Numbers", icon: Phone },
  { key: "ip_addresses", label: "IP Addresses", icon: Server },
  { key: "bitcoin_addresses", label: "Bitcoin Wallets", icon: Bitcoin },
  { key: "ethereum_addresses", label: "Ethereum Wallets", icon: Coins },
  { key: "upi_ids", label: "UPI IDs", icon: CreditCard },
  { key: "payment_handles", label: "Payment Handles", icon: Wallet },
]

export function IocPanel({ entities }: IocPanelProps) {
  const active = IOC_CONFIG.filter((c) => entities[c.key]?.length > 0)
  const total = active.reduce((sum, c) => sum + entities[c.key].length, 0)

  if (total === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No indicators of compromise (links, emails, phones, wallets, payment handles) were extracted from this message.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {active.map(({ key, label, icon: Icon }) => {
        const items = Array.from(new Set(entities[key]))
        return (
          <div key={key}>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
              {label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
                {items.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <code
                  key={i}
                  className="max-w-full truncate rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
                  title={item}
                >
                  {item}
                </code>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
