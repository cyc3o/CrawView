import type { Entities } from "./types"

// ======================================================
// ENTITY REGEX (ported from core/entities.py)
// ======================================================

export const ANY_WEBSITE_PATTERN = /(https?:\/\/\S+|\b[a-z0-9-]+\.[a-z]{2,}\b)/g

export const HIGH_RISK_DOMAIN_PATTERN =
  /\b[a-z0-9-]+\.(cc|tk|xyz|top|ru|cn|gq|ml|ga|cf|pw|icu|cyou|bond|buzz|cam|click|country|date|faith|fit|fun|host|info|kim|lat|loan|men|monster|online|party|pro|rest|racing|review|science|stream|support|trade|vip|work|zip|mov|quest|bar|surf|shop|site|live|cloud|digital|services|solutions|today|center|company|network|email|press|media|world|zone|link|space|website|systems|group|global|secure|update|verify|account|login|wallet|crypto|exchange|claim|bonus|reward|alert|promo|deal|offer|win|free|cash|money|pay|billing|invoice|refund|tax|gov|legal|court|police|help)\b/

export const SHORTENED_URL_PATTERN =
  /\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short\.io|rebrand\.ly|is\.gd|buff\.ly|adf\.ly|cutt\.ly|bitly\.com|tiny\.cc|bl\.ink|lnkd\.in|fb\.me|linktr\.ee|shorturl\.at|v\.gd|rb\.gy|t\.ly|gg\.gg|git\.io|forms\.gle|x\.co|kutt\.it|tiny\.one|bit\.do)\/\S+/

export const IP_ADDRESS_PATTERN =
  /\b(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\b/g

export const GLOBAL_PHONE_PATTERN =
  /\b(?:\+?[1-9]\d{0,2}[\s-]?)?(?:[6-9]\d{9}|\d{3}[\s-]?\d{3}[\s-]?\d{4}|\d{7,12})\b/g

export const LONG_NUMBER_PATTERN = /\b(?!19\d{6}\b|20\d{6}\b)\d{8,16}\b/

export const EMAIL_PATTERN =
  /\b[a-z0-9](?:[a-z0-9._%+-]{0,63})@(?:[a-z0-9-]{1,63}\.)+[a-z]{2,10}\b/g

export const BITCOIN_ADDRESS_PATTERN =
  /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[ac-hj-np-z02-9]{11,71})\b/g

export const ETHEREUM_ADDRESS_PATTERN = /\b0x[a-fA-F0-9]{40}\b/g

export const UPI_PATTERN =
  /\b[a-z0-9._-]{3,}@(upi|paytm|okaxis|okhdfc|oksbi|ybl|ibl|axl)\b/g

export const PAYMENT_HANDLE_PATTERN = /\$[a-z0-9_]+/gi

function findAll(pattern: RegExp, text: string): string[] {
  const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g")
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    out.push(m[0])
    if (m.index === re.lastIndex) re.lastIndex++
  }
  return out
}

export function extractEntities(message: string): Entities {
  const msg = message.toLowerCase()
  return {
    domains: findAll(ANY_WEBSITE_PATTERN, msg),
    emails: findAll(EMAIL_PATTERN, msg),
    phones: findAll(GLOBAL_PHONE_PATTERN, message),
    ip_addresses: findAll(IP_ADDRESS_PATTERN, msg),
    bitcoin_addresses: findAll(BITCOIN_ADDRESS_PATTERN, message),
    ethereum_addresses: findAll(ETHEREUM_ADDRESS_PATTERN, message),
    upi_ids: findAll(UPI_PATTERN, msg),
    payment_handles: findAll(PAYMENT_HANDLE_PATTERN, message),
  }
}
