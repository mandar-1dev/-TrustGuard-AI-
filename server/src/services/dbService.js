import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getSupabase, isSupabaseReady } from '../config/supabase.js';

// Local resilient JSON store path for offline development or before Supabase credentials are input
const DATA_DIR = path.resolve('data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

// In-memory cache synced with store.json
let localStore = {
  users: [],
  scans: [],
  threats: [],
  privacy_findings: [],
  recommendations: [],
  security_events: []
};

// Initialize initial seed data in local store
function initLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(STORE_PATH)) {
    try {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      localStore = JSON.parse(raw);
      return;
    } catch (e) {
      console.warn('⚠️ Could not parse existing store.json, reinitializing default seed.');
    }
  }

  // Pre-seed demo user
  const demoUserId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const demoScan1Id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22';
  const demoScan2Id = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33';
  const demoScan3Id = 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380d44';
  const hashedPassword = bcrypt.hashSync('Password123!', 10);

  localStore = {
    users: [
      {
        id: demoUserId,
        name: 'Alex Vance (Security Demo)',
        email: 'demo@trustguard.ai',
        password_hash: hashedPassword,
        role: 'user',
        created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
      }
    ],
    scans: [
      {
        id: demoScan1Id,
        user_id: demoUserId,
        input_type: 'message',
        input_content: 'URGENT: Your Chase checking account has been temporarily restricted due to suspicious activity. Verify KYC identity immediately at https://chase-security-verify.net/login or funds will be frozen within 2 hours.',
        risk_score: 94,
        threat_level: 'HIGH',
        summary: 'Potential high-urgency banking phishing attempt seeking credential theft.',
        ai_explanation: [
          'The message creates an artificial sense of extreme urgency with a 2-hour deadline.',
          'The URL chase-security-verify.net mimics legitimate Chase branding on an unauthorized domain.',
          'Direct request for immediate credential or KYC verification without standard out-of-band prompts.'
        ],
        is_demo: true,
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: demoScan2Id,
        user_id: demoUserId,
        input_type: 'email',
        input_content: 'Hi team, here is the candidate application. Candidate Rahul Sharma, contact: rahul.sharma@example.com, phone: +1-415-555-0199, SSN: 123-45-6789. Please forward to hiring committee.',
        risk_score: 55,
        threat_level: 'MEDIUM',
        summary: 'Sensitive Personally Identifiable Information (PII) transmitted in plain text.',
        ai_explanation: [
          'Unencrypted personal identifiers (SSN, personal email, phone number) transmitted over open communication channels.',
          'Violation of minimal data exposure standards, exposing individual to identity theft risks.'
        ],
        is_demo: true,
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: demoScan3Id,
        user_id: demoUserId,
        input_type: 'message',
        input_content: 'Your package from Amazon is out for delivery today between 2:00 PM and 5:00 PM. No signature required.',
        risk_score: 12,
        threat_level: 'SAFE',
        summary: 'Informational automated package delivery notification with no threat indicators.',
        ai_explanation: [
          'No requests for sensitive credentials, payments, or personal information.',
          'Contains no suspicious external hyperlinks or aggressive urgency threats.'
        ],
        is_demo: true,
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      }
    ],
    threats: [
      {
        id: crypto.randomUUID(),
        scan_id: demoScan1Id,
        threat_type: 'Phishing & Impersonation',
        severity: 'HIGH',
        description: 'Impersonates Chase Bank security department using an unauthorized domain.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan1Id,
        threat_type: 'Urgency & Psychological Coercion',
        severity: 'HIGH',
        description: 'Applies artificial pressure (2-hour account suspension threat).'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan1Id,
        threat_type: 'Credential Harvesting',
        severity: 'HIGH',
        description: 'Targets online banking credentials and identity documents.'
      }
    ],
    privacy_findings: [
      {
        id: crypto.randomUUID(),
        scan_id: demoScan2Id,
        data_type: 'government_id',
        severity: 'HIGH',
        description: 'Full Social Security Number / National ID detected in plain text.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan2Id,
        data_type: 'phone',
        severity: 'MEDIUM',
        description: 'Direct personal mobile phone number exposed.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan2Id,
        data_type: 'email',
        severity: 'LOW',
        description: 'Individual personal contact email exposed.'
      }
    ],
    recommendations: [
      {
        id: crypto.randomUUID(),
        scan_id: demoScan1Id,
        recommendation: 'Do NOT click the provided link or submit any banking credentials.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan1Id,
        recommendation: 'Navigate directly to official chase.com or use the official mobile app to review account notices.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan2Id,
        recommendation: 'Redact government identification numbers and phone numbers before forwarding.'
      },
      {
        id: crypto.randomUUID(),
        scan_id: demoScan3Id,
        recommendation: 'No immediate security action required. Keep tracking directly in your official carrier app.'
      }
    ],
    security_events: [
      {
        id: crypto.randomUUID(),
        user_id: demoUserId,
        event_type: 'LOGIN',
        description: 'Successful user authentication from web client',
        created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: demoUserId,
        event_type: 'SCAN_CREATED',
        description: 'Scanned package delivery notification (SAFE)',
        created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: demoUserId,
        event_type: 'PRIVACY_RISK_DETECTED',
        description: 'Detected Government ID and PII exposure in candidate email',
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        user_id: demoUserId,
        event_type: 'HIGH_RISK_DETECTED',
        description: 'Urgent Chase Phishing Attempt identified and blocked',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ]
  };

  saveLocalStore();
}

function saveLocalStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(localStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('⚠️ Failed to save store.json:', e.message);
  }
}

// Initialize on startup
initLocalStore();

export const dbService = {
  // USER METHODS
  async createUser({ name, email, password_hash }) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email: email.toLowerCase().trim(), password_hash }])
        .select('id, name, email, role, created_at')
        .single();
      if (error) throw error;
      return data;
    }

    // Local fallback
    const existing = localStore.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.code = '23505';
      throw err;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase().trim(),
      password_hash,
      role: 'user',
      created_at: new Date().toISOString()
    };

    localStore.users.push(newUser);
    saveLocalStore();

    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async findUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    return localStore.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, created_at')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const user = localStore.users.find(u => u.id === id);
    if (!user) return null;
    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  },

  async updateUserProfile(userId, { name }) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('users')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('id, name, email, role, created_at')
        .single();
      if (error) throw error;
      return data;
    }

    const user = localStore.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (name) user.name = name;
    saveLocalStore();
    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  },

  // SCAN METHODS
  async createScan({ userId, inputType, inputContent, analysis }) {
    const scanId = crypto.randomUUID();
    const now = new Date().toISOString();

    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data: scanData, error: scanError } = await supabase
        .from('scans')
        .insert([{
          id: scanId,
          user_id: userId,
          input_type: inputType,
          input_content: inputContent,
          risk_score: analysis.riskScore,
          threat_level: analysis.threatLevel,
          summary: analysis.summary,
          ai_explanation: analysis.explanation,
          created_at: now
        }])
        .select()
        .single();
      if (scanError) throw scanError;

      // Insert Threats
      if (analysis.threats && analysis.threats.length > 0) {
        const threatsToInsert = analysis.threats.map(t => ({
          scan_id: scanId,
          threat_type: t.type,
          severity: t.severity,
          description: t.description,
          created_at: now
        }));
        await supabase.from('threats').insert(threatsToInsert);
      }

      // Insert Privacy Findings
      if (analysis.privacyFindings && analysis.privacyFindings.length > 0) {
        const privacyToInsert = analysis.privacyFindings.map(p => ({
          scan_id: scanId,
          data_type: p.type,
          severity: p.severity,
          description: p.description,
          created_at: now
        }));
        await supabase.from('privacy_findings').insert(privacyToInsert);
      }

      // Insert Recommendations
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        const recsToInsert = analysis.recommendations.map((r, i) => ({
          scan_id: scanId,
          recommendation: r,
          priority: i + 1,
          created_at: now
        }));
        await supabase.from('recommendations').insert(recsToInsert);
      }

      return this.getScanByIdAndUserId(scanId, userId);
    }

    // Local fallback
    const scanRecord = {
      id: scanId,
      user_id: userId,
      input_type: inputType,
      input_content: inputContent,
      risk_score: analysis.riskScore,
      threat_level: analysis.threatLevel,
      summary: analysis.summary,
      ai_explanation: analysis.explanation,
      is_demo: false,
      created_at: now
    };

    localStore.scans.unshift(scanRecord);

    if (analysis.threats) {
      for (const t of analysis.threats) {
        localStore.threats.push({
          id: crypto.randomUUID(),
          scan_id: scanId,
          threat_type: t.type,
          severity: t.severity,
          description: t.description,
          created_at: now
        });
      }
    }

    if (analysis.privacyFindings) {
      for (const p of analysis.privacyFindings) {
        localStore.privacy_findings.push({
          id: crypto.randomUUID(),
          scan_id: scanId,
          data_type: p.type,
          severity: p.severity,
          description: p.description,
          created_at: now
        });
      }
    }

    if (analysis.recommendations) {
      for (const r of analysis.recommendations) {
        localStore.recommendations.push({
          id: crypto.randomUUID(),
          scan_id: scanId,
          recommendation: r,
          created_at: now
        });
      }
    }

    saveLocalStore();
    return this.getScanByIdAndUserId(scanId, userId);
  },

  async getScansByUserId(userId, { filter = 'all', search = '' } = {}) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      let query = supabase
        .from('scans')
        .select(`
          id,
          user_id,
          input_type,
          input_content,
          risk_score,
          threat_level,
          summary,
          ai_explanation,
          is_demo,
          created_at,
          threats (id, threat_type, severity, description),
          privacy_findings (id, data_type, severity, description),
          recommendations (id, recommendation)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filter && filter !== 'all') {
        query = query.eq('threat_level', filter.toUpperCase());
      }

      if (search && search.trim()) {
        const s = `%${search.trim()}%`;
        query = query.or(`summary.ilike.${s},input_content.ilike.${s},input_type.ilike.${s}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Local fallback
    let scans = localStore.scans.filter(s => s.user_id === userId);

    if (filter && filter !== 'all') {
      const f = filter.toUpperCase();
      scans = scans.filter(s => s.threat_level === f);
    }

    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      scans = scans.filter(s => 
        (s.summary && s.summary.toLowerCase().includes(term)) ||
        (s.input_content && s.input_content.toLowerCase().includes(term)) ||
        (s.input_type && s.input_type.toLowerCase().includes(term))
      );
    }

    scans.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return scans.map(s => ({
      ...s,
      threats: localStore.threats.filter(t => t.scan_id === s.id),
      privacy_findings: localStore.privacy_findings.filter(p => p.scan_id === s.id),
      recommendations: localStore.recommendations.filter(r => r.scan_id === s.id)
    }));
  },

  async getScanByIdAndUserId(scanId, userId) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('scans')
        .select(`
          id,
          user_id,
          input_type,
          input_content,
          risk_score,
          threat_level,
          summary,
          ai_explanation,
          is_demo,
          created_at,
          threats (id, threat_type, severity, description),
          privacy_findings (id, data_type, severity, description),
          recommendations (id, recommendation)
        `)
        .eq('id', scanId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }

    const scan = localStore.scans.find(s => s.id === scanId && s.user_id === userId);
    if (!scan) return null;

    return {
      ...scan,
      threats: localStore.threats.filter(t => t.scan_id === scan.id),
      privacy_findings: localStore.privacy_findings.filter(p => p.scan_id === scan.id),
      recommendations: localStore.recommendations.filter(r => r.scan_id === scan.id)
    };
  },

  async deleteScan(scanId, userId) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId)
        .eq('user_id', userId)
        .select();
      if (error) throw error;
      return data && data.length > 0;
    }

    const idx = localStore.scans.findIndex(s => s.id === scanId && s.user_id === userId);
    if (idx === -1) return false;

    localStore.scans.splice(idx, 1);
    localStore.threats = localStore.threats.filter(t => t.scan_id !== scanId);
    localStore.privacy_findings = localStore.privacy_findings.filter(p => p.scan_id !== scanId);
    localStore.recommendations = localStore.recommendations.filter(r => r.scan_id !== scanId);

    saveLocalStore();
    return true;
  },

  // SECURITY EVENTS
  async logSecurityEvent({ userId, eventType, description, metadata = {} }) {
    const event = {
      id: crypto.randomUUID(),
      user_id: userId,
      event_type: eventType,
      description,
      metadata,
      created_at: new Date().toISOString()
    };

    if (isSupabaseReady()) {
      const supabase = getSupabase();
      await supabase.from('security_events').insert([event]);
      return event;
    }

    localStore.security_events.unshift(event);
    saveLocalStore();
    return event;
  },

  async getSecurityEvents(userId, limit = 10) {
    if (isSupabaseReady()) {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    }

    return localStore.security_events
      .filter(e => e.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },

  // DASHBOARD AGGREGATES
  async getDashboardStats(userId) {
    const scans = await this.getScansByUserId(userId);
    const totalScans = scans.length;
    const highRiskScans = scans.filter(s => s.threat_level === 'HIGH' || s.threat_level === 'CRITICAL').length;
    const mediumRiskScans = scans.filter(s => s.threat_level === 'MEDIUM').length;
    const safeScans = scans.filter(s => s.threat_level === 'SAFE' || s.threat_level === 'LOW').length;

    let threatsDetectedCount = 0;
    let privacyRisksCount = 0;

    for (const scan of scans) {
      threatsDetectedCount += (scan.threats || []).length;
      privacyRisksCount += (scan.privacy_findings || []).length;
    }

    // TrustGuard Security Score Calculation:
    // Scale: 0 to 100 (Higher is safer)
    // If no scans: default baseline 85 (neutral safe)
    // Formula: 100 - average risk score of recent scans, weighted towards recency
    let securityScore = 85;
    if (totalScans > 0) {
      const recent = scans.slice(0, 10);
      const avgRisk = recent.reduce((sum, s) => sum + s.risk_score, 0) / recent.length;
      securityScore = Math.max(10, Math.min(99, Math.round(100 - avgRisk)));
    }

    // Risk trend for chart: chronologically ordered recent 10 scans
    const trendScans = [...scans].slice(0, 10).reverse();
    const riskTrend = trendScans.map((s, idx) => ({
      scanIndex: `#${idx + 1}`,
      name: s.summary ? (s.summary.length > 20 ? s.summary.substring(0, 20) + '...' : s.summary) : `Scan ${idx + 1}`,
      riskScore: s.risk_score,
      threatLevel: s.threat_level,
      date: new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }));

    return {
      securityScore,
      totalScans,
      threatsDetected: threatsDetectedCount,
      highRiskScans,
      mediumRiskScans,
      safeScans,
      privacyRisks: privacyRisksCount,
      riskTrend
    };
  }
};
