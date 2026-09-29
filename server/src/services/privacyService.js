/**
 * Privacy Protection Service
 * Identifies Personally Identifiable Information (PII) and applies security redactions.
 */

// Comprehensive regex patterns for PII detection
const PATTERNS = {
  email: {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    replacement: '[EMAIL REDACTED]',
    type: 'email',
    severity: 'MEDIUM',
    desc: 'Personal or corporate email address detected'
  },
  phone: {
    regex: /(?:(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?)|(?:\b\+?[1-9]\d{9,12}\b)/g,
    replacement: '[PHONE REDACTED]',
    type: 'phone',
    severity: 'MEDIUM',
    desc: 'Telephone or mobile phone number detected'
  },
  government_id: {
    // Matches US SSN (123-45-6789 or 123456789), Indian Aadhaar (1234 5678 9012), Passport patterns
    regex: /\b\d{3}-\d{2}-\d{4}\b|\b\d{4}\s\d{4}\s\d{4}\b|\b[A-Z]{1,2}[0-9]{7,8}\b/g,
    replacement: '[GOVERNMENT ID REDACTED]',
    type: 'government_id',
    severity: 'HIGH',
    desc: 'Government identification number (SSN/National ID/Passport) detected'
  },
  financial: {
    // Matches credit card numbers (13-19 digits, with spaces or hyphens), IBAN, CVV indicators
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b|\b(?:\d{4}[ -]?){3}\d{4}\b|\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g,
    replacement: '[FINANCIAL INFORMATION REDACTED]',
    type: 'financial',
    severity: 'HIGH',
    desc: 'Financial instrument (Credit card, IBAN, bank account number) detected'
  },
  api_key: {
    // Common API key patterns (Bearer tokens, AWS keys, generic high entropy keys, JWTs)
    regex: /\b(?:ghp_[a-zA-Z0-9]{36}|AKIA[0-9A-Z]{16}|sk_live_[0-9a-zA-Z]{24}|AIza[0-9A-Za-z-_]{35}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,})\b/g,
    replacement: '[API KEY REDACTED]',
    type: 'api_key',
    severity: 'CRITICAL',
    desc: 'Cryptographic API Key or Security Token detected'
  },
  password: {
    // Explicit password indicators like password: xyz or pwd=xyz
    regex: /(?:password|pwd|passcode|secret|api_secret)\s*[:=]\s*([^\s,;]+)/gi,
    replacement: (match, p1) => match.replace(p1, '[PASSWORD REDACTED]'),
    type: 'password',
    severity: 'CRITICAL',
    desc: 'Plaintext credential or password detected'
  },
  address: {
    // Street address pattern hints (e.g., 123 Main St, Apt 4B)
    regex: /\b\d{1,5}\s+(?:[A-Za-z0-9#\.\-]+\s+){1,4}(?:Street|St\.|Avenue|Ave\.|Boulevard|Blvd\.|Road|Rd\.|Lane|Ln\.|Drive|Dr\.|Court|Ct\.|Way|Way\.)\b/gi,
    replacement: '[ADDRESS REDACTED]',
    type: 'address',
    severity: 'MEDIUM',
    desc: 'Physical residential or business street address detected'
  }
};

/**
 * Scan text and identify all privacy-sensitive data
 */
export function detectPrivacyFindings(text) {
  if (!text || typeof text !== 'string') return [];

  const findings = [];
  const seenTypes = new Set();

  for (const [key, patternObj] of Object.entries(PATTERNS)) {
    const matches = text.match(patternObj.regex);
    if (matches && matches.length > 0) {
      if (!seenTypes.has(patternObj.type)) {
        seenTypes.add(patternObj.type);
        findings.push({
          type: patternObj.type,
          severity: patternObj.severity,
          description: `${patternObj.desc} (${matches.length} instance${matches.length > 1 ? 's' : ''})`,
          count: matches.length
        });
      }
    }
  }

  return findings;
}

/**
 * Redact sensitive PII from content
 */
export function redactSensitiveContent(text) {
  if (!text || typeof text !== 'string') {
    return {
      originalContent: '',
      redactedContent: '',
      itemsRedactedCount: 0,
      redactedTypes: []
    };
  }

  let redacted = text;
  let itemsCount = 0;
  const redactedTypes = [];

  for (const [key, patternObj] of Object.entries(PATTERNS)) {
    const matches = text.match(patternObj.regex);
    if (matches && matches.length > 0) {
      itemsCount += matches.length;
      redactedTypes.push(patternObj.type);

      if (typeof patternObj.replacement === 'function') {
        redacted = redacted.replace(patternObj.regex, patternObj.replacement);
      } else {
        redacted = redacted.replace(patternObj.regex, patternObj.replacement);
      }
    }
  }

  return {
    originalContent: text,
    redactedContent: redacted,
    itemsRedactedCount: itemsCount,
    redactedTypes: Array.from(new Set(redactedTypes))
  };
}
