export type ThreatLevel =
  | "CRITICAL"
  | "HIGH"
  | "ELEVATED"
  | "MEDIUM"
  | "LOW-MEDIUM"
  | "LOW"

export interface Entities {
  domains: string[]
  emails: string[]
  phones: string[]
  ip_addresses: string[]
  bitcoin_addresses: string[]
  ethereum_addresses: string[]
  upi_ids: string[]
  payment_handles: string[]
}

export interface Reason {
  text: string
  weight: number
  group: ReasonGroup
}

export type ReasonGroup =
  | "signal"
  | "entity"
  | "language"
  | "context"
  | "behavioral"
  | "pattern"
  | "reputation"

export interface AnalysisReport {
  date: string
  verdict: string
  threat_level: ThreatLevel
  risk_score: number
  confidence: number
  attack_types: string[]
  region_detected: string[]
  language_style: string[]
  categories: string[]
  reasons: Reason[]
  entities: Entities
  message_length: number
}
