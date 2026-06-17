import { SIGNALS } from "./intelligence"
import {
  ANY_WEBSITE_PATTERN,
  EMAIL_PATTERN,
  GLOBAL_PHONE_PATTERN,
  IP_ADDRESS_PATTERN,
  BITCOIN_ADDRESS_PATTERN,
  ETHEREUM_ADDRESS_PATTERN,
  UPI_PATTERN,
  PAYMENT_HANDLE_PATTERN,
} from "./entities"

export type HighlightKind = "signal" | "ioc"

export interface HighlightSpan {
  start: number
  end: number
  kind: HighlightKind
  label: string
}

export interface Token {
  text: string
  kind: HighlightKind | null
  label: string | null
}

interface RawMatch {
  start: number
  end: number
  kind: HighlightKind
  label: string
}

function collect(pattern: RegExp, text: string, kind: HighlightKind, label: string, out: RawMatch[]) {
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g")
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m[0].length === 0) {
      re.lastIndex++
      continue
    }
    out.push({ start: m.index, end: m.index + m[0].length, kind, label })
    if (m.index === re.lastIndex) re.lastIndex++
  }
}

// Tokenize the original message into highlighted / plain spans.
export function buildThreatLens(message: string): Token[] {
  const raw: RawMatch[] = []

  // IOCs (high confidence — take priority)
  collect(ANY_WEBSITE_PATTERN, message, "ioc", "URL", raw)
  collect(EMAIL_PATTERN, message, "ioc", "Email", raw)
  collect(GLOBAL_PHONE_PATTERN, message, "ioc", "Phone", raw)
  collect(IP_ADDRESS_PATTERN, message, "ioc", "IP", raw)
  collect(BITCOIN_ADDRESS_PATTERN, message, "ioc", "BTC Wallet", raw)
  collect(ETHEREUM_ADDRESS_PATTERN, message, "ioc", "ETH Wallet", raw)
  collect(UPI_PATTERN, message, "ioc", "UPI ID", raw)
  collect(PAYMENT_HANDLE_PATTERN, message, "ioc", "Payment Handle", raw)

  // Signal keywords
  for (const signal of SIGNALS) {
    collect(signal.pattern, message, "signal", signal.category, raw)
  }

  if (raw.length === 0) {
    return [{ text: message, kind: null, label: null }]
  }

  // Resolve overlaps: prefer IOC over signal, then longer match, then earliest.
  raw.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start
    if (a.kind !== b.kind) return a.kind === "ioc" ? -1 : 1
    return b.end - b.start - (a.end - a.start)
  })

  const chosen: RawMatch[] = []
  let lastEnd = -1
  for (const r of raw) {
    if (r.start >= lastEnd) {
      chosen.push(r)
      lastEnd = r.end
    }
  }

  const tokens: Token[] = []
  let cursor = 0
  for (const c of chosen) {
    if (c.start > cursor) {
      tokens.push({ text: message.slice(cursor, c.start), kind: null, label: null })
    }
    tokens.push({ text: message.slice(c.start, c.end), kind: c.kind, label: c.label })
    cursor = c.end
  }
  if (cursor < message.length) {
    tokens.push({ text: message.slice(cursor), kind: null, label: null })
  }
  return tokens
}
