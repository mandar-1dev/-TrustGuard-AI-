-- ==========================================================
-- TRUSTGUARD AI - SUPABASE POSTGRESQL SCHEMA
-- Cybersecurity & Privacy Threat Analysis Platform
-- ==========================================================

-- Enable pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order for clean migrations
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS privacy_findings CASCADE;
DROP TABLE IF EXISTS threats CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS scans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCANS TABLE
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input_type VARCHAR(50) NOT NULL CHECK (input_type IN ('message', 'email', 'url', 'text')),
    input_content TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    threat_level VARCHAR(20) NOT NULL CHECK (threat_level IN ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    summary TEXT NOT NULL,
    ai_explanation JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. THREATS TABLE
CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    threat_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRIVACY FINDINGS TABLE
CREATE TABLE privacy_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('phone', 'email', 'address', 'government_id', 'financial', 'password', 'api_key', 'personal_name', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RECOMMENDATIONS TABLE
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SECURITY EVENTS TABLE
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL CHECK (event_type IN ('LOGIN', 'LOGOUT', 'SCAN_CREATED', 'HIGH_RISK_DETECTED', 'PRIVACY_RISK_DETECTED', 'PASSWORD_CHANGED', 'PROFILE_UPDATED')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- INDEXES FOR PERFORMANCE
-- ==========================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scans_threat_level ON scans(threat_level);
CREATE INDEX idx_threats_scan_id ON threats(scan_id);
CREATE INDEX idx_privacy_findings_scan_id ON privacy_findings(scan_id);
CREATE INDEX idx_recommendations_scan_id ON recommendations(scan_id);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Note: Since the backend uses SUPABASE_SERVICE_ROLE_KEY, it has administrative
-- bypass for multi-tenant isolation, but we ALSO enforce strict application-level
-- checks: scan.user_id === authenticatedUser.id on every Express route.
-- The RLS policies below additionally safeguard direct client access if enabled.

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Scans policies
CREATE POLICY "Users can only view their own scans"
    ON scans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own scans"
    ON scans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own scans"
    ON scans FOR DELETE
    USING (auth.uid() = user_id);

-- Threats policies
CREATE POLICY "Users can view threats for their own scans"
    ON threats FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM scans WHERE scans.id = threats.scan_id AND scans.user_id = auth.uid()
    ));

-- Privacy findings policies
CREATE POLICY "Users can view privacy findings for their own scans"
    ON privacy_findings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM scans WHERE scans.id = privacy_findings.scan_id AND scans.user_id = auth.uid()
    ));

-- Recommendations policies
CREATE POLICY "Users can view recommendations for their own scans"
    ON recommendations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM scans WHERE scans.id = recommendations.scan_id AND scans.user_id = auth.uid()
    ));

-- Security events policies
CREATE POLICY "Users can view their own security events"
    ON security_events FOR SELECT
    USING (auth.uid() = user_id);
