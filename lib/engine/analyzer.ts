import type { AnalysisReport, Reason, ReasonGroup, ThreatLevel } from "./types"
import { extractEntities, HIGH_RISK_DOMAIN_PATTERN, SHORTENED_URL_PATTERN, LONG_NUMBER_PATTERN } from "./entities"
import {
  SIGNALS,
  BEHAVIORAL_FLOWS,
  CONTEXT_CHAINS,
  INDIAN_SCAM_PHRASES,
  US_SCAM_PHRASES,
  HINGLISH_SCAM_INTELLIGENCE,
  ENGLISH_SCAM_INTELLIGENCE,
} from "./intelligence"

function pushReason(reasons: Reason[], text: string, weight: number, group: ReasonGroup) {
  reasons.push({ text, weight, group })
}

// ======================================================
// MAIN ANALYSIS ENGINE — DETECT MANY -> DECIDE ONCE
// ======================================================
export function analyzeMessage(message: string): AnalysisReport {
  const msg = message.toLowerCase()
  let score = 0
  const reasons: Reason[] = []
  const categories = new Set<string>()
  const attackTypes: string[] = []
  const regions = new Set<string>()
  const languages = new Set<string>()

  // 1. SIGNAL-BASED DETECTION
  for (const signal of SIGNALS) {
    const matches = msg.match(signal.pattern)
    if (matches && matches.length > 0) {
      const matchCount = matches.length
      const signalScore = signal.score * Math.min(matchCount, 3)
      score += signalScore
      categories.add(signal.category)
      pushReason(
        reasons,
        matchCount > 1 ? `${signal.reason} (detected ${matchCount}x)` : signal.reason,
        signalScore,
        "signal",
      )
    }
  }

  // 2. ENTITY EXTRACTION
  const entities = extractEntities(message)

  // 4. LANGUAGE & PHRASE INTELLIGENCE
  let indianMatches = 0
  for (const pattern of INDIAN_SCAM_PHRASES) if (pattern.test(msg)) indianMatches++
  if (indianMatches >= 2) {
    languages.add("HINDI/HINGLISH")
    score += 20
    pushReason(reasons, "Indian scam language pattern detected (Hinglish/Hindi).", 20, "language")
  }

  let usMatches = 0
  for (const pattern of US_SCAM_PHRASES) if (pattern.test(msg)) usMatches++
  if (usMatches >= 2) {
    languages.add("ENGLISH-US")
    score += 18
    pushReason(reasons, "US authority-style scam language detected.", 18, "language")
  }

  for (const [category, patterns] of Object.entries(HINGLISH_SCAM_INTELLIGENCE)) {
    for (const pattern of patterns) {
      if (pattern.test(msg)) {
        languages.add("HINGLISH")
        score += 5
        pushReason(reasons, `Hinglish scam phrase detected (${category.replace(/_/g, " ")}).`, 5, "language")
        break
      }
    }
  }

  for (const [category, patterns] of Object.entries(ENGLISH_SCAM_INTELLIGENCE)) {
    for (const pattern of patterns) {
      if (pattern.test(msg)) {
        languages.add("ENGLISH-SCAM")
        score += 4
        pushReason(reasons, `English scam phrase detected (${category.replace(/_/g, " ")}).`, 4, "language")
        break
      }
    }
  }

  // 5. CONTEXT CHAIN DETECTION
  for (const [chainName, chainData] of Object.entries(CONTEXT_CHAINS)) {
    const matches = chainData.keywords.filter((kw) => msg.includes(kw)).length
    if (matches >= chainData.min_matches) {
      attackTypes.push(chainName.replace(/_/g, " "))
      score += chainData.score
      regions.add(chainData.region)
      pushReason(
        reasons,
        `Context chain detected: ${chainName.replace(/_/g, " ")} (${matches}/${chainData.keywords.length} keywords matched).`,
        chainData.score,
        "context",
      )
    }
  }

  // 6. BEHAVIORAL FLOW DETECTION
  for (const flow of BEHAVIORAL_FLOWS) {
    let matchedStages = 0
    const stagePositions: Array<[number, number]> = []
    flow.sequence.forEach((stageKeywords, stageIdx) => {
      for (const keyword of stageKeywords) {
        const pos = msg.indexOf(keyword)
        if (pos !== -1) {
          matchedStages++
          stagePositions.push([stageIdx, pos])
          break
        }
      }
    })
    if (matchedStages >= 3) {
      stagePositions.sort((a, b) => a[1] - b[1])
      const stageOrder = stagePositions.map((s) => s[0])
      const isOrdered = stageOrder.every((v, i) => i === stageOrder.length - 1 || v <= stageOrder[i + 1] + 1)
      if (isOrdered) {
        score += flow.score
        pushReason(reasons, `Behavioral flow: ${flow.name.replace(/_/g, " ")} — ${flow.description}.`, flow.score, "behavioral")
      }
    }
  }

  // 7. URL & DOMAIN ANALYSIS
  if (entities.domains.length > 0) {
    score += 20
    categories.add("Website Present")
    pushReason(reasons, `Message contains ${entities.domains.length} URL(s).`, 20, "entity")

    if (entities.domains.some((url) => HIGH_RISK_DOMAIN_PATTERN.test(url))) {
      score += 30
      categories.add("High-Risk Domain")
      pushReason(reasons, "Domain extension commonly used in scams.", 30, "entity")
    }
    if (entities.domains.some((url) => SHORTENED_URL_PATTERN.test(url))) {
      score += 22
      categories.add("Shortened URL")
      pushReason(reasons, "Shortened URL hides final destination.", 22, "entity")
    }
  }

  // 8. IP ADDRESS
  if (entities.ip_addresses.length > 0) {
    score += 28
    categories.add("Raw IP Address")
    pushReason(reasons, "Raw IP used to bypass domain filters.", 28, "entity")
  }

  // 9. PHONE / VISHING
  if (entities.phones.length > 0) {
    score += 25
    categories.add("Vishing Indicator")
    pushReason(reasons, "Phone number present — call-based scam risk.", 25, "entity")
  }

  // 10. EMAIL
  if (entities.emails.length > 0) {
    score += 15
    categories.add("Email Address Present")
    pushReason(reasons, "Email address used as scam contact.", 15, "entity")
  }

  // 11. CRYPTO
  if (entities.bitcoin_addresses.length > 0 || entities.ethereum_addresses.length > 0) {
    score += 32
    categories.add("Crypto Wallet Detected")
    pushReason(reasons, "Crypto wallet indicates payment scam.", 32, "entity")
  }

  // 12. UPI / PAYMENT HANDLE
  if (entities.upi_ids.length > 0) {
    score += 28
    categories.add("UPI ID Detected")
    pushReason(reasons, "UPI payment request — Indian fraud indicator.", 28, "entity")
    regions.add("INDIA")
  }
  if (entities.payment_handles.length > 0) {
    score += 26
    categories.add("Payment Handle Detected")
    pushReason(reasons, "P2P payment handle used in scams.", 26, "entity")
    regions.add("USA")
  }

  // 13. LONG NUMBER
  if (LONG_NUMBER_PATTERN.test(msg)) {
    score += 9
    categories.add("Suspicious Numeric Identifier")
    pushReason(reasons, "Long numeric identifier found.", 9, "entity")
  }

  // 14. ADVANCED SUSPICIOUS PATTERNS
  const { suspiciousScore, suspiciousReasons } = detectSuspiciousPatterns(message)
  score += suspiciousScore
  for (const r of suspiciousReasons) reasons.push(r)

  // 15. FALLBACKS
  if (regions.size === 0) regions.add("GLOBAL")
  if (languages.size === 0) languages.add("ENGLISH")
  const finalAttackTypes = attackTypes.length > 0 ? attackTypes : ["UNCLASSIFIED SOCIAL ENGINEERING"]

  const confidence = Math.round(Math.min(score / 120, 1.0) * 100) / 100

  // 16. VERDICT
  let threatLevel: ThreatLevel
  let verdict: string
  if (score >= 150) {
    threatLevel = "CRITICAL"
    verdict = "Critical Threat"
  } else if (score >= 100) {
    threatLevel = "HIGH"
    verdict = "High Risk Scam"
  } else if (score >= 70) {
    threatLevel = "ELEVATED"
    verdict = "Elevated Risk"
  } else if (score >= 50) {
    threatLevel = "MEDIUM"
    verdict = "Medium Risk"
  } else if (score >= 25) {
    threatLevel = "LOW-MEDIUM"
    verdict = "Low-Medium Risk"
  } else {
    threatLevel = "LOW"
    verdict = "Low Risk"
  }

  return {
    date: new Date().toISOString(),
    verdict,
    threat_level: threatLevel,
    risk_score: score,
    confidence,
    attack_types: finalAttackTypes,
    region_detected: Array.from(regions).sort(),
    language_style: Array.from(languages).sort(),
    categories: Array.from(categories).sort(),
    reasons,
    entities,
    message_length: message.length,
  }
}

// ======================================================
// SUSPICIOUS PATTERNS (ported from core/patterns.py)
// ======================================================
function detectSuspiciousPatterns(message: string): {
  suspiciousScore: number
  suspiciousReasons: Reason[]
} {
  let suspiciousScore = 0
  const suspiciousReasons: Reason[] = []
  const msg = message.toLowerCase()

  if (/[!?]{3,}/.test(message)) {
    suspiciousScore += 12
    suspiciousReasons.push({ text: "Excessive punctuation used to create urgency or excitement.", weight: 12, group: "pattern" })
  }

  const capsRatio = (message.match(/[A-Z]/g)?.length ?? 0) / Math.max(message.length, 1)
  if (capsRatio > 0.5 && message.length > 20) {
    suspiciousScore += 10
    suspiciousReasons.push({ text: "Excessive capitalization to grab attention or create alarm.", weight: 10, group: "pattern" })
  }

  const currencyCount = (message.match(/[$€£¥₹]/g) ?? []).length
  if (currencyCount >= 2) {
    suspiciousScore += 15
    suspiciousReasons.push({ text: "Multiple currency symbols suggesting financial scam.", weight: 15, group: "pattern" })
  }

  const emojiCount = (message.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) ?? []).length
  if (emojiCount > 5) {
    suspiciousScore += 8
    suspiciousReasons.push({ text: "Excessive emoji usage typical of social engineering.", weight: 8, group: "pattern" })
  }

  if (/\d{4}[-\s]\d{4}[-\s]\d{4}[-\s]\d{4}/.test(message)) {
    suspiciousScore += 35
    suspiciousReasons.push({ text: "Pattern resembles credit card number format.", weight: 35, group: "pattern" })
  }

  if (/\b[A-Za-z0-9+/]{20,}={0,2}\b/.test(message)) {
    suspiciousScore += 18
    suspiciousReasons.push({ text: "Contains Base64-like encoded string (potential malware).", weight: 18, group: "pattern" })
  }

  if (/\b\w*[0-9]\w*[0-9]\w*\b/.test(msg) && msg.length > 30) {
    suspiciousScore += 11
    suspiciousReasons.push({ text: "Text obfuscation detected (evading filters).", weight: 11, group: "pattern" })
  }

  return { suspiciousScore, suspiciousReasons }
}
