// ======================================================
// INTELLIGENCE DATA (ported from Python intelligence/*)
// ======================================================

export interface Signal {
  category: string
  pattern: RegExp
  score: number
  reason: string
}

export const SIGNALS: Signal[] = [
  {
    category: "Psychological Pressure",
    pattern:
      /\b(urgent|immediately|act\s*now|limited\s*time|final\s*warning|hurry|expires?|deadline|time\s*sensitive|last\s*chance)\b/g,
    score: 15,
    reason: "Uses urgency to force quick action without thinking.",
  },
  {
    category: "Greed Manipulation",
    pattern:
      /\b(reward|lottery|prize|winner|bonus|free|gift|congratulations|selected|jackpot|cash|money|earn|profit)\b/g,
    score: 30,
    reason: "Uses rewards or gifts to lure the victim.",
  },
  {
    category: "Authority Impersonation",
    pattern:
      /\b(bank|support|admin|security\s*team|customer\s*care|meta|facebook|google|microsoft|apple|amazon|paypal|instagram|twitter|netflix|government|irs|tax|police|fbi|legal|court)\b/g,
    score: 25,
    reason: "Impersonates a trusted company or authority.",
  },
  {
    category: "Credential Harvesting",
    pattern:
      /\b(login|verify|password|otp|pin|account|access|confirm|authenticate|credentials|username|security\s*code|2fa|validation)\b/g,
    score: 25,
    reason: "Attempts to steal login or authentication details.",
  },
  {
    category: "Platform Abuse",
    pattern:
      /\b(t\.me\/|telegram|wa\.me\/|whatsapp|fb\.com|instagram|discord|signal|snapchat|tiktok|dm\s*me|contact\s*via)\b/g,
    score: 20,
    reason: "Uses social or messaging platforms to evade security.",
  },
  {
    category: "Scam / Threat Indicators",
    pattern:
      /\b(scam|phishing|fraud|hack|hacked|misuse|suspicious|threat|compromised|breach|leaked|exposed|malware|virus|ransomware)\b/g,
    score: 20,
    reason: "Contains direct scam or threat-related terminology.",
  },
  {
    category: "Account Fear Tactics",
    pattern:
      /\b(blocked|suspended|terminated|disabled|restricted|deactivated|closed|frozen|locked|violation|unauthorized)\b/g,
    score: 20,
    reason: "Uses fear of account loss to manipulate user action.",
  },
  {
    category: "Financial Manipulation",
    pattern:
      /\b(payment|transaction|transfer|credit\s*card|debit\s*card|cvv|billing|invoice|refund|charge|withdraw|deposit)\b/g,
    score: 22,
    reason: "Attempts to manipulate financial transactions or steal payment info.",
  },
  {
    category: "Malicious Attachments",
    pattern:
      /\b(download|attachment|file|document|pdf|zip|exe|apk|install|click\s*here|open\s*link)\b/g,
    score: 18,
    reason: "Encourages downloading potentially malicious files.",
  },
  {
    category: "Cryptocurrency Scams",
    pattern:
      /\b(bitcoin|btc|ethereum|eth|crypto|wallet|blockchain|nft|investment|trading|forex|binary|mining)\b/g,
    score: 28,
    reason: "Involves cryptocurrency-related scam tactics.",
  },
  {
    category: "Romance / Catfishing",
    pattern:
      /\b(love|lonely|relationship|dating|meet|romance|attracted|beautiful|handsome|marry|soulmate)\b/g,
    score: 24,
    reason: "Uses emotional manipulation typical of romance scams.",
  },
  {
    category: "Job / Employment Scams",
    pattern:
      /\b(job|work\s*from\s*home|hiring|employment|opportunity|salary|income|weekly\s*pay|easy\s*money|part\s*time)\b/g,
    score: 19,
    reason: "Characteristics of fraudulent job offers.",
  },
  {
    category: "Personal Info Harvesting",
    pattern:
      /\b(ssn|social\s*security|date\s*of\s*birth|dob|address|full\s*name|mother|maiden|passport|license|aadhar|pan)\b/g,
    score: 27,
    reason: "Requests sensitive personal identification information.",
  },
  {
    category: "Fake Delivery Scams",
    pattern:
      /\b(package|delivery|shipment|courier|parcel|tracking|customs|fedex|ups|dhl|usps|postal)\b/g,
    score: 21,
    reason: "Mimics delivery notifications to steal info or money.",
  },
  {
    category: "Tax / IRS Scams",
    pattern:
      /\b(tax|irs|refund|audit|penalty|fine|owe|outstanding|arrears|treasury)\b/g,
    score: 26,
    reason: "Impersonates tax authorities to create fear.",
  },
]

// ------------------------------------------------------
// BEHAVIORAL FLOWS
// ------------------------------------------------------
export interface BehavioralFlow {
  name: string
  sequence: string[][]
  score: number
  description: string
}

export const BEHAVIORAL_FLOWS: BehavioralFlow[] = [
  {
    name: "AUTHORITY_FEAR_URGENCY_ACTION",
    sequence: [
      ["bank", "irs", "police", "support", "admin", "security"],
      ["suspended", "blocked", "compromised", "unauthorized", "violation"],
      ["urgent", "immediately", "now", "today", "deadline"],
      ["verify", "click", "login", "confirm", "update", "call"],
    ],
    score: 35,
    description: "Classic authority-fear-urgency manipulation flow",
  },
  {
    name: "REFUND_LINK_VERIFY_PAYMENT",
    sequence: [
      ["refund", "prize", "reward", "bonus"],
      ["link", "website", "click", "visit"],
      ["verify", "confirm", "authenticate"],
      ["payment", "credit card", "bank", "account"],
    ],
    score: 38,
    description: "Refund bait to credential/payment harvesting",
  },
  {
    name: "ROMANCE_TRUST_INVESTMENT_CRYPTO",
    sequence: [
      ["love", "lonely", "relationship", "soulmate"],
      ["trust", "help", "support", "together"],
      ["investment", "opportunity", "business", "profit"],
      ["bitcoin", "crypto", "wallet", "transfer"],
    ],
    score: 40,
    description: "Romance scam escalation to financial fraud",
  },
]

// ------------------------------------------------------
// CONTEXT CHAINS
// ------------------------------------------------------
export interface ContextChain {
  keywords: string[]
  min_matches: number
  score: number
  region: string
}

export const CONTEXT_CHAINS: Record<string, ContextChain> = {
  INDIAN_BANKING_PHISHING: {
    keywords: ["kyc", "aadhaar", "pan", "link", "urgent", "verify", "account", "bank"],
    min_matches: 3,
    score: 45,
    region: "INDIA",
  },
  INDIAN_DIGITAL_ARREST: {
    keywords: ["digital arrest", "police", "cbi", "court", "legal action", "warrant", "case"],
    min_matches: 3,
    score: 50,
    region: "INDIA",
  },
  INDIAN_UPI_FRAUD: {
    keywords: ["upi", "refund", "verify", "otp", "payment", "paytm", "phonepe", "gpay"],
    min_matches: 3,
    score: 42,
    region: "INDIA",
  },
  INDIAN_UTILITY_SCAM: {
    keywords: ["electricity", "bill", "power cut", "disconnect", "urgent", "payment", "overdue"],
    min_matches: 3,
    score: 38,
    region: "INDIA",
  },
  US_IRS_PHISHING: {
    keywords: ["irs", "tax", "refund", "link", "verify", "payment", "owe", "audit"],
    min_matches: 3,
    score: 48,
    region: "USA",
  },
  US_SSA_SCAM: {
    keywords: ["social security", "ssn", "suspension", "suspended", "verify", "number", "compromised"],
    min_matches: 3,
    score: 47,
    region: "USA",
  },
  US_ECOMMERCE_SCAM: {
    keywords: ["amazon", "refund", "verify", "account", "suspended", "order", "payment"],
    min_matches: 3,
    score: 40,
    region: "USA",
  },
  US_P2P_PAYMENT_FRAUD: {
    keywords: ["zelle", "cashapp", "venmo", "payment", "issue", "verify", "refund", "cancel"],
    min_matches: 3,
    score: 44,
    region: "USA",
  },
  US_LEGAL_THREAT: {
    keywords: ["warrant", "court", "arrest", "legal", "lawsuit", "attorney", "comply"],
    min_matches: 3,
    score: 46,
    region: "USA",
  },
  ROMANCE_TO_CRYPTO: {
    keywords: ["love", "investment", "crypto", "bitcoin", "trust", "opportunity", "help"],
    min_matches: 4,
    score: 43,
    region: "GLOBAL",
  },
}

// ------------------------------------------------------
// LANGUAGE / PHRASE INTELLIGENCE
// ------------------------------------------------------
export const INDIAN_SCAM_PHRASES: RegExp[] = [
  /\b(aapka\s+account|tumhara\s+account)\b/,
  /\b(turant|abhi|immediately)\s+(action|verify|karo|update)\b/,
  /\b(link\s+(open|click)\s+kar[eo]?)\b/,
  /\b(otp\s+(share|bhej[eo]?|send))\b/,
  /\b(account\s+(block|band)\s+(ho\s+jayega|hoga))\b/,
  /\b(last\s+warning|antim\s+chetavani)\b/,
  /\b(kyc\s+(complete|update|pending|verify)\s+kar[eo]?)\b/,
  /\b(aadhaar\s+(link|update|verify))\b/,
  /\b(pan\s+card\s+(update|link))\b/,
  /\b(digital\s+arrest)\b/,
  /\b(police\s+(action|case|complaint))\b/,
  /\b(electricity\s+bill\s+(pending|overdue))\b/,
  /\b(power\s+cut|bijli\s+kat)\b/,
  /\b(dear\s+(customer|sir|madam|user))\b/,
  /\b(immediate\s+action\s+required)\b/,
  /\b(kindly\s+(verify|update|confirm))\b/,
  /\b(failure\s+to\s+comply)\b/,
  /\b(legal\s+action\s+will\s+be\s+taken)\b/,
]

export const US_SCAM_PHRASES: RegExp[] = [
  /\b(final\s+notice)\b/,
  /\b(immediate\s+action\s+required)\b/,
  /\b(failure\s+to\s+respond)\b/,
  /\b(this\s+call\s+is\s+being\s+recorded)\b/,
  /\b(you\s+have\s+been\s+selected)\b/,
  /\b(verify\s+your\s+identity)\b/,
  /\b(suspended|frozen|locked)\s+(account|card|ssn)\b/,
  /\b(zelle|cashapp|venmo|paypal)\s+(payment|transaction|required)\b/,
  /\b(gift\s+card|itunes|google\s+play)\b/,
  /\b(wire\s+transfer)\b/,
  /\b(bitcoin|cryptocurrency)\s+payment\b/,
]

export const HINGLISH_SCAM_INTELLIGENCE: Record<string, RegExp[]> = {
  BANK_KYC_ACCOUNT_BLOCK: [
    /aapka\s+account/,
    /aapke\s+bank\s+account/,
    /account\s+block/,
    /account\s+suspend/,
    /account\s+band/,
    /kyc\s+pending/,
    /kyc\s+update/,
    /kyc\s+complete/,
    /turant\s+(verify|update|karo|kare)/,
    /abhi\s+(verify|update|karo)/,
    /link\s+(open|karo|click)/,
    /last\s+warning/,
    /final\s+warning/,
  ],
  UPI_OTP_FRAUD: [
    /otp\s+(bata|bhej|share|do)/,
    /otp\s+chahiye/,
    /refund\s+(process|ke\s+liye)/,
    /refund\s+pending/,
    /upi\s+(verify|check|confirm|karo)/,
    /galat\s+transaction/,
    /amount\s+wapas/,
  ],
  DIGITAL_ARREST_POLICE: [
    /digital\s+arrest/,
    /police\s+case/,
    /cyber\s+crime/,
    /cbi\s+investigation/,
    /court\s+notice/,
    /warrant\s+issue/,
    /arrest\s+ho\s+jaoge/,
  ],
  UTILITY_SCAMS: [
    /bijli\s+kat/,
    /power\s+cut/,
    /electricity\s+bill/,
    /bill\s+pending/,
    /gas\s+connection\s+band/,
    /service\s+disconnect/,
  ],
  SIM_NETWORK_SCAMS: [
    /sim\s+block/,
    /number\s+band/,
    /mobile\s+verification/,
    /sim\s+upgrade/,
    /number\s+deactivate/,
  ],
}

export const ENGLISH_SCAM_INTELLIGENCE: Record<string, RegExp[]> = {
  AUTHORITY_FEAR: [
    /immediate\s+action/,
    /urgent\s+response/,
    /failure\s+to\s+comply/,
    /final\s+notice/,
    /legal\s+action/,
    /law\s+enforcement/,
    /court\s+order/,
    /arrest\s+warrant/,
    /do\s+not\s+ignore/,
  ],
  ACCOUNT_SECURITY: [
    /account\s+suspended/,
    /account\s+locked/,
    /account\s+restricted/,
    /unusual\s+activity/,
    /suspicious\s+login/,
    /security\s+alert/,
    /verify\s+your\s+identity/,
    /verify\s+your\s+account/,
    /confirm\s+your\s+details/,
  ],
  REFUND_GREED: [
    /you\s+have\s+been\s+selected/,
    /congratulations/,
    /claim\s+your\s+reward/,
    /claim\s+your\s+refund/,
    /limited\s+time\s+offer/,
    /free\s+gift/,
    /cash\s+reward/,
    /bonus\s+credited/,
  ],
  JOB_SCAMS: [
    /work\s+from\s+home/,
    /online\s+job/,
    /easy\s+income/,
    /earn\s+money\s+daily/,
    /no\s+experience\s+required/,
    /registration\s+fee/,
    /joining\s+fee/,
  ],
  CRYPTO_INVESTMENT: [
    /guaranteed\s+profit/,
    /high\s+return/,
    /risk\s+free\s+investment/,
    /crypto\s+investment/,
    /bitcoin\s+investment/,
    /double\s+your\s+money/,
    /daily\s+profit/,
  ],
  ROMANCE_TRUST: [
    /i\s+trust\s+you/,
    /i\s+love\s+you/,
    /i\s+feel\s+lonely/,
    /we\s+have\s+a\s+future/,
    /help\s+me\s+financially/,
  ],
  DELIVERY_SCAMS: [
    /package\s+on\s+hold/,
    /delivery\s+failed/,
    /customs\s+clearance/,
    /pay\s+delivery\s+fee/,
    /shipment\s+pending/,
  ],
}
