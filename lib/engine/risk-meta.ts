import type { ThreatLevel } from "./types"

export interface RiskMeta {
  color: string
  bg: string
  border: string
  ring: string
  label: string
  blurb: string
}

export function getRiskMeta(level: ThreatLevel): RiskMeta {
  switch (level) {
    case "CRITICAL":
      return {
        color: "text-risk-critical",
        bg: "bg-risk-critical/10",
        border: "border-risk-critical/30",
        ring: "var(--risk-critical)",
        label: "Critical Threat",
        blurb: "Strong, multi-layered scam signals. Do not respond, click, or pay.",
      }
    case "HIGH":
      return {
        color: "text-risk-high",
        bg: "bg-risk-high/10",
        border: "border-risk-high/30",
        ring: "var(--risk-high)",
        label: "High Risk Scam",
        blurb: "Highly likely a scam. Treat all links and requests as hostile.",
      }
    case "ELEVATED":
      return {
        color: "text-risk-elevated",
        bg: "bg-risk-elevated/10",
        border: "border-risk-elevated/30",
        ring: "var(--risk-elevated)",
        label: "Elevated Risk",
        blurb: "Several suspicious traits detected. Proceed with strong caution.",
      }
    case "MEDIUM":
      return {
        color: "text-risk-medium",
        bg: "bg-risk-medium/10",
        border: "border-risk-medium/30",
        ring: "var(--risk-medium)",
        label: "Medium Risk",
        blurb: "Some manipulative patterns present. Verify the sender independently.",
      }
    case "LOW-MEDIUM":
      return {
        color: "text-risk-elevated",
        bg: "bg-risk-elevated/10",
        border: "border-risk-elevated/30",
        ring: "var(--risk-elevated)",
        label: "Low-Medium Risk",
        blurb: "Minor red flags. Stay alert but not necessarily a scam.",
      }
    case "LOW":
    default:
      return {
        color: "text-risk-low",
        bg: "bg-risk-low/10",
        border: "border-risk-low/30",
        ring: "var(--risk-low)",
        label: "Low Risk",
        blurb: "No strong scam indicators found. Always stay vigilant.",
      }
  }
}
